import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Unapplication from "../app/page";
describe("recruiter journey", () => {
  it("identifies purpose, ownership and provenance immediately", () => {
    render(<Unapplication />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "MY THINKING",
    );
    expect(
      screen.getByText(/An independent application for/),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/SYNTHETIC SCENARIO/).length).toBeGreaterThan(0);
  });
  it("switches inquiry content and performs a new attribution calculation", () => {
    render(<Unapplication />);
    fireEvent.click(
      screen.getByRole("button", { name: /Marketing effectiveness/ }),
    );
    expect(
      screen.getByRole("heading", {
        name: "More attention. The same 100 purchases.",
      }),
    ).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Attribution rule"), {
      target: { value: "linear" },
    });
    expect(screen.getByText("$75")).toBeInTheDocument();
    expect(screen.getByText("$25")).toBeInTheDocument();
  });
  it("changes funnel counts with cohort selection", () => {
    render(<Unapplication />);
    fireEvent.click(screen.getByRole("button", { name: /Customer behaviour/ }));
    fireEvent.change(screen.getByLabelText("Visitor cohort"), {
      target: { value: "returning" },
    });
    expect(
      screen.getByRole("img", { name: /Returning visitors/ }),
    ).toHaveTextContent("2,000");
    expect(screen.getByText("4.00% → 4.00%")).toBeInTheDocument();
  });
  it("changes sensitivity using deterministic arithmetic", () => {
    render(<Unapplication />);
    fireEvent.change(
      screen.getByRole("slider", { name: /What if purchases are missing/ }),
      { target: { value: "20" } },
    );
    expect(screen.getByText("125.0")).toBeInTheDocument();
    expect(screen.getByText("1.67%")).toBeInTheDocument();
  });
  it("revises executive recommendation when causality is challenged", () => {
    render(<Unapplication />);
    fireEvent.click(
      screen.getByRole("button", { name: /Does this establish causality/ }),
    );
    const decision = document.querySelector("#decision") as HTMLElement;
    expect(
      within(decision).getByRole("heading", { level: 3 }),
    ).toHaveTextContent("Use the analysis to prioritise a hypothesis");
  });
  it("models a commercial hurdle rather than presenting a forecast", () => {
    render(<Unapplication />);
    fireEvent.click(
      screen.getByRole("button", { name: /What if the fix costs too much/ }),
    );
    fireEvent.change(
      screen.getByRole("slider", { name: /Illustrative delivery cost/ }),
      { target: { value: "2000" } },
    );
    expect(screen.getByText("50")).toBeInTheDocument();
    expect(screen.getByText(/Not a forecast/)).toBeInTheDocument();
  });
});

describe("finished public application", () => {
  it("offers four pinned evidence entry points in the opening experience", async () => {
    const { artifact, openingEvidence } = await import("../content/edition");
    render(<Unapplication />);
    const entry = screen.getByRole("group", { name: "Inspect technical evidence" });
    for (const item of openingEvidence) {
      const link = within(entry).getByRole("link", { name: item.label });
      expect(link).toHaveAttribute("href", artifact(item.path));
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });
  it("introduces the candidate factually and keeps interview and resume actions together", () => {
    render(<Unapplication />);
    const resume = within(document.querySelector("#resume") as HTMLElement);
    expect(resume.getByText(/Master of Business Analytics graduate/)).toHaveTextContent("Assistant Product Manager and Business & Data Analyst Intern");
    const contact = within(document.querySelector("#contact") as HTMLElement);
    expect(contact.getByRole("link", { name: "Interview Yash" })).toHaveAttribute("href", expect.stringContaining("mailto:yash.h2700@gmail.com?subject=Interview%20Yash"));
    expect(contact.getByRole("link", { name: /Resume \(PDF/ })).toHaveAttribute("download");
    expect(document.body.textContent).not.toMatch(/REVIEW DRAFT|AWAITING APPROVED FILE|Applicant review is still required/);
    expect(screen.getByText(/Employment and education are candidate-supplied/)).toBeInTheDocument();
  });
});
