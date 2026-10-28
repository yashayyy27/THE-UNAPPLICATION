import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  MotionSystem,
  MotionControl,
  useMotionSystem,
} from "../components/MotionSystem";
import {
  MeasurementVisual,
  AttributionVisual,
  ChallengeSignal,
} from "../components/AnalyticalVisuals";
import { credit } from "../lib/analytics";
function Probe() {
  const m = useMotionSystem();
  return (
    <>
      <output data-testid="phase">{m.phase}</output>
      <button onClick={m.skip}>Skip test introduction</button>
      <MotionControl />
    </>
  );
}
function media(reduced = false) {
  vi.stubGlobal("matchMedia", () => ({
    matches: reduced,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
}
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  delete (navigator as Navigator & { connection?: unknown }).connection;
});
describe("motion lifecycle and truthful visual models", () => {
  it("provides a static fallback when motion preference APIs are unavailable", () => {
    render(
      <MotionSystem>
        <Probe />
      </MotionSystem>,
    );
    expect(screen.getByTestId("phase")).toHaveTextContent("complete");
    expect(
      screen.getByRole("button", { name: "Motion disabled by preference" }),
    ).toBeDisabled();
  });
  it("honours reduced motion without starting an introduction", () => {
    media(true);
    render(
      <MotionSystem>
        <Probe />
      </MotionSystem>,
    );
    expect(document.querySelector(".experience")).toHaveAttribute(
      "data-motion",
      "static",
    );
    expect(screen.getByTestId("phase")).toHaveTextContent("complete");
  });
  it("respects Save-Data before enabling procedural motion", () => {
    media();
    Object.defineProperty(navigator, "connection", {
      value: { saveData: true },
      configurable: true,
    });
    render(
      <MotionSystem>
        <Probe />
      </MotionSystem>,
    );
    expect(document.querySelector(".experience")).toHaveAttribute(
      "data-motion",
      "static",
    );
  });
  it("pauses the actual narrative timer, resumes it and settles without looping", () => {
    vi.useFakeTimers();
    media();
    render(
      <MotionSystem>
        <Probe />
      </MotionSystem>,
    );
    expect(screen.getByTestId("phase")).toHaveTextContent("complete");
    expect(document.querySelector(".experience")).toHaveAttribute("data-motion", "static");
    act(() => vi.advanceTimersByTime(200));
    act(() => vi.advanceTimersByTime(200));
    expect(screen.getByTestId("phase")).toHaveTextContent("noise");
    act(() => vi.advanceTimersByTime(3000));
    expect(screen.getByTestId("phase")).toHaveTextContent("sorting");
    fireEvent.click(screen.getByRole("button", { name: "Pause motion" }));
    act(() => vi.advanceTimersByTime(6000));
    expect(screen.getByTestId("phase")).toHaveTextContent("sorting");
    fireEvent.click(screen.getByRole("button", { name: "Resume motion" }));
    act(() => vi.advanceTimersByTime(9000));
    expect(screen.getByTestId("phase")).toHaveTextContent("complete");
    act(() => vi.advanceTimersByTime(20000));
    expect(screen.getByTestId("phase")).toHaveTextContent("complete");
  });
  it("offers the complete touch introduction on demand while keeping the first frame static", () => {
    vi.useFakeTimers();
    vi.stubGlobal("matchMedia", (query: string) => ({ matches: query.includes("pointer: coarse"), addEventListener: vi.fn(), removeEventListener: vi.fn() }));
    render(<MotionSystem><Probe /></MotionSystem>);
    act(() => vi.advanceTimersByTime(5000));
    expect(document.querySelector(".experience")).toHaveAttribute("data-motion", "static");
    expect(screen.getByTestId("phase")).toHaveTextContent("complete");
    fireEvent.click(screen.getByRole("button", { name: "Play introduction" }));
    act(() => vi.advanceTimersByTime(200));
    act(() => vi.advanceTimersByTime(200));
    expect(screen.getByTestId("phase")).toHaveTextContent("noise");
    act(() => vi.advanceTimersByTime(12000));
    expect(screen.getByTestId("phase")).toHaveTextContent("complete");
  });
  it("allows immediate skip regardless of visual phase", () => {
    media();
    render(
      <MotionSystem>
        <Probe />
      </MotionSystem>,
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Skip test introduction" }),
    );
    expect(screen.getByTestId("phase")).toHaveTextContent("complete");
  });
  it("draws 100 observed unique orders and 20 duplicates; sensitivity never changes observed tokens", () => {
    const { container, rerender } = render(<MeasurementVisual missing={0} />);
    expect(
      container
        .querySelector('[data-event-kind="unique"]')
        ?.getAttribute("data-count"),
    ).toBe("100");
    expect(
      container
        .querySelector('[data-event-kind="duplicate"]')
        ?.getAttribute("data-count"),
    ).toBe("20");
    expect(
      container
        .querySelector('[data-event-kind="unique"]')
        ?.getAttribute("d")
        ?.split("M").length,
    ).toBe(101);
    rerender(<MeasurementVisual missing={20} />);
    expect(
      [...container.querySelectorAll("[data-event-kind]")].reduce(
        (sum, e) => sum + Number(e.getAttribute("data-count")),
        0,
      ),
    ).toBe(120);
    expect(screen.getByText("20%")).toBeInTheDocument();
  });
  it("uses the analytical attribution allocation and conserves total credit in the diagram", () => {
    for (const model of ["first", "last", "linear"] as const) {
      const { container, unmount } = render(
        <AttributionVisual allocations={credit(model)} />,
      );
      expect(
        [...container.querySelectorAll("[data-credit]")].reduce(
          (sum, n) => sum + Number(n.getAttribute("data-credit")),
          0,
        ),
      ).toBe(150);
      unmount();
    }
  });
  it("shows eight missing labels among 100 observed orders", () => {
    const { container } = render(<ChallengeSignal id="missing" cost={1000} />);
    expect(
      container.querySelectorAll('[data-label-state="unknown"]'),
    ).toHaveLength(8);
    expect(
      container.querySelectorAll('[data-label-state="known"]'),
    ).toHaveLength(92);
  });
});
