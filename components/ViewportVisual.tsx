"use client";
import { Suspense, Component, useEffect, useRef, useState } from "react";
class VisualBoundary extends Component<{ children: React.ReactNode; fallback: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <div className="visual-fallback">{this.props.fallback}<span role="status">Diagram unavailable. Values and controls still work.</span></div> : this.props.children; }
}
function VisualPoster({kind}: { kind: string }) { return (        <svg className="visual-poster" viewBox="0 0 480 160" aria-hidden="true">
          <path d="M20 80H170L240 40L310 80H460" />
          <circle cx="240" cy="40" r="5" />
          <text x="20" y="130">
            {kind === "measurement"
              ? "EVENTS → DISTINCT ORDERS"
              : kind === "attribution"
                ? "CREDIT CHANGES. TOTAL REVENUE DOES NOT."
                : kind === "cohort" ? "VISITOR MIX → ORDERED PURCHASES" : "CHALLENGE → REVISED DECISION"}
          </text>
        </svg>); }
// Optional graphics activate near the viewport; the exact analytical readouts
// and controls always render independently, including in static HTML.
export function ViewportVisual({
  kind,
  children,
}: {
  kind: "measurement" | "attribution" | "cohort" | "challenge";
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (typeof IntersectionObserver !== "function") {
      setReady(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setReady(true);
          observer.disconnect();
        }
      },
      { rootMargin: "180px" },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`viewport-visual viewport-${kind}`}
      data-visual-ready={ready ? "true" : "false"}
    >
      {ready ? (
        <VisualBoundary fallback={<VisualPoster kind={kind} />}><Suspense fallback={<VisualPoster kind={kind} />}>{children}</Suspense></VisualBoundary>
      ) : (
        <VisualPoster kind={kind} />
      )}
    </div>
  );
}
