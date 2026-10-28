export function ContradictionTrace() {
  return (
    <div className="contradiction-trace" aria-hidden="true">
      <span>ATTENTION</span>
      <svg viewBox="0 0 1000 80" preserveAspectRatio="none">
        <path className="trace-attention" d="M0 66H290L470 14H1000" />
        <path className="trace-revenue" d="M0 66H1000" />
      </svg>
      <span>VALUE</span>
    </div>
  );
}
