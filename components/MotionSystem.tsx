"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
export type IntroPhase =
  "noise" | "sorting" | "signal" | "decision" | "complete";
type Connection = EventTarget & { saveData?: boolean };
type MotionValue = {
  enabled: boolean;
  paused: boolean;
  phase: IntroPhase;
  playing: boolean;
  pending: boolean;
  start: () => void;
  toggle: () => void;
  skip: () => void;
  reason: string;
};
const MotionContext = createContext<MotionValue>({
  enabled: false,
  paused: false,
  phase: "complete",
  playing: false,
  pending: false,
  start: () => {},
  toggle: () => {},
  skip: () => {},
  reason: "Static presentation",
});
export function useMotionSystem() {
  return useContext(MotionContext);
}
export function MotionSystem({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false),
    [paused, setPaused] = useState(false),
    [phase, setPhase] = useState<IntroPhase>("complete");
  const [reason, setReason] = useState("Static presentation"),
    [visible, setVisible] = useState(true),
    [heroVisible, setHeroVisible] = useState(true);
  const [idleReady, setIdleReady] = useState(false);
  const [manualStart, setManualStart] = useState(false);
  const [requested, setRequested] = useState(false);
  const elapsed = useRef(0),
    finished = useRef(false);
  useEffect(() => {
    const reduced =
      typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : null;
    const connection = (navigator as Navigator & { connection?: Connection })
      .connection;
    // Touch navigation favours a stable first frame and an explicit play choice.
    let preferenceFrame1 = 0, preferenceFrame2 = 0;
    const initializePreferences = () => {
      preferenceFrame1 = window.requestAnimationFrame(() => {
        preferenceFrame2 = window.requestAnimationFrame(() => {
          setManualStart(typeof window.matchMedia === "function" && window.matchMedia("(hover: none) and (pointer: coarse)").matches);
          preferences();
        });
      });
    };
    const preferences = () => {
      const limited = !reduced || !!reduced.matches || !!connection?.saveData;
      setEnabled(!limited);
      setReason(
        !reduced
          ? "Static presentation"
          : reduced.matches
            ? "Reduced motion respected"
            : connection?.saveData
              ? "Data-saving mode respected"
              : "Original procedural motion",
      );
      if (limited) {
        finished.current = true;
        setPhase("complete");
      }
    };
    // Preference-driven labels/context must also leave the first paint alone.
    if (document.readyState === "complete") initializePreferences();
    else window.addEventListener("load", initializePreferences, { once: true });
    reduced?.addEventListener?.("change", preferences);
    connection?.addEventListener?.("change", preferences);
    const visibility = () => setVisible(!document.hidden);
    visibility();
    document.addEventListener("visibilitychange", visibility);
    const hero = document.getElementById("hero-scene");
    const observer =
      typeof IntersectionObserver === "function"
        ? new IntersectionObserver(
            (entries) => {
              for (const e of entries)
                if (e.target === hero) setHeroVisible(e.isIntersecting);
            },
            { threshold: 0 },
          )
        : null;
    if (hero) observer?.observe(hero);
    return () => {
      window.removeEventListener("load", initializePreferences);
      window.cancelAnimationFrame(preferenceFrame1);
      window.cancelAnimationFrame(preferenceFrame2);
      reduced?.removeEventListener?.("change", preferences);
      connection?.removeEventListener?.("change", preferences);
      document.removeEventListener("visibilitychange", visibility);
      observer?.disconnect();
    };
  }, []);
  // Paint the complete static composition first. Enhance only after native
  // load, two frames and idle time; controls and analysis never wait for this.
  useEffect(() => {
    if (!enabled || (manualStart && !requested)) {
      setIdleReady(false);
      return;
    }
    let disposed = false;
    let frame1 = 0, frame2 = 0, idle = 0, fallback = 0;
    const begin = () => {
      if (disposed) return;
      setIdleReady(true);
      if (!finished.current) setPhase("noise");
    };
    const afterPaint = () => {
      frame1 = window.requestAnimationFrame(() => {
        frame2 = window.requestAnimationFrame(() => {
          if (typeof window.requestIdleCallback === "function") {
            idle = window.requestIdleCallback(begin, { timeout: 1500 });
          } else fallback = window.setTimeout(begin, 100);
        });
      });
    };
    if (document.readyState === "complete") afterPaint();
    else window.addEventListener("load", afterPaint, { once: true });
    return () => {
      disposed = true;
      window.removeEventListener("load", afterPaint);
      window.cancelAnimationFrame(frame1);
      window.cancelAnimationFrame(frame2);
      if (idle) window.cancelIdleCallback(idle);
      window.clearTimeout(fallback);
    };
  }, [enabled, manualStart, requested]);
  const playing =
    enabled &&
    idleReady &&
    !paused &&
    visible &&
    heroVisible &&
    phase !== "complete";
  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      elapsed.current += Math.max(0, now - last);
      last = now;
      if (elapsed.current >= 12000) {
        finished.current = true;
        setPhase("complete");
      } else
        setPhase(
          elapsed.current < 3000
            ? "noise"
            : elapsed.current < 6000
              ? "sorting"
              : elapsed.current < 9000
                ? "signal"
                : "decision",
        );
    }, 250);
    return () => window.clearInterval(timer);
  }, [playing]);
  const skip = () => {
    finished.current = true;
    elapsed.current = 12000;
    setPhase("complete");
    setRequested(true);
  };
  const mode = !enabled || !idleReady ? "static" : paused || !visible ? "paused" : "running";
  return (
    <MotionContext.Provider
      value={{
        enabled,
        paused,
        phase,
        playing,
        pending: enabled && manualStart && !requested && !finished.current,
        start: () => {
          setRequested(true);
          document.getElementById("hero-scene")?.scrollIntoView({ block: "start" });
        },
        toggle: () => setPaused((p) => !p),
        skip,
        reason,
      }}
    >
      <div
        className="experience"
        data-motion={mode}
        data-phase={phase}
        data-intro-playing={playing ? "true" : "false"}
      >
        {children}
      </div>
    </MotionContext.Provider>
  );
}
export function MotionControl() {
  const m = useMotionSystem();
  return (
    <button
      className="motion-control"
      onClick={m.pending ? m.start : m.toggle}
      disabled={!m.enabled}
      aria-pressed={m.paused}
      aria-label={
        m.pending ? "Play introduction" : m.enabled
          ? m.paused
            ? "Resume motion"
            : "Pause motion"
          : "Motion disabled by preference"
      }
    >
      <span aria-hidden="true" className="motion-icon" data-icon={!m.enabled ? "off" : m.pending || m.paused ? "play" : "pause"} />
      <span>{!m.enabled ? "Motion off" : m.pending ? "Play intro" : m.paused ? "Resume" : "Pause"}</span>
    </button>
  );
}
export function Scene({
  children,
  className = "",
  id,
  label,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  label?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const m = useMotionSystem();
  useEffect(() => {
    const el = ref.current;
    if (
      !el ||
      !m.enabled ||
      m.paused ||
      typeof IntersectionObserver !== "function"
    )
      return;
    const ob = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.dataset.entered = "true";
            ob.unobserve(el);
          }
        }
      },
      { threshold: 0.12 },
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, [m.enabled, m.paused]);
  return (
    <div ref={ref} className={`scene ${className}`} id={id} aria-label={label}>
      {children}
    </div>
  );
}
