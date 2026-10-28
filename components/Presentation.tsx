import { Scene } from "./MotionSystem";
export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true">{diagonal ? "↗" : "→"}</span>;
}
export function External({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      className={className}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children} <Arrow diagonal />
    </a>
  );
}
export function Chapter({
  number,
  title,
  children,
  className = "",
  id,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
  className?: string;
  id: string;
}) {
  return (
    <section
      className={`chapter ${className}`}
      id={id}
      aria-labelledby={`${id}-heading`}
    >
      <Scene>
        <div className="chapter-label">
          <span>{number}</span>
          <span>{title}</span>
          <span className="label-line" />
        </div>
        {children}
      </Scene>
    </section>
  );
}
