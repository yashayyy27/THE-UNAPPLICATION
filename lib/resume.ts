export type ApprovedResume = {
  href: string;
  sha256: string;
  bytes: number;
  approvedBy: "Yash Hurdale";
  approvedOn: string;
};
// Approval records bind the visible download to one specific owner-supplied PDF.
export function isResumeRecord(value: unknown): value is ApprovedResume {
  if (!value || typeof value !== "object") return false;
  const r = value as Record<string, unknown>;
  return typeof r.href === "string" &&
    /^\.\/resume\/[a-z0-9-]+\.pdf$/.test(r.href) &&
    typeof r.sha256 === "string" && /^[a-f0-9]{64}$/.test(r.sha256) &&
    typeof r.bytes === "number" && Number.isSafeInteger(r.bytes) && r.bytes > 5 &&
    r.approvedBy === "Yash Hurdale" && typeof r.approvedOn === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(r.approvedOn) &&
    !Number.isNaN(Date.parse(r.approvedOn)) &&
    new Date(r.approvedOn).toISOString().slice(0, 10) === r.approvedOn;
}
