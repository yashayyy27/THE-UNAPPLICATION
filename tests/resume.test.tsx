import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createHash } from "node:crypto";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import ResumeDownload from "../components/ResumeDownload";
import { isResumeRecord } from "../lib/resume";
import { verifyResume } from "../scripts/verify-resume.mjs";
import resumeConfig from "../content/resume.json";
const pdf = Buffer.from("%PDF-1.7\nOwner-supplied test fixture\n%%EOF\n");
const record = { href: "./resume/yash-hurdale.pdf", bytes: pdf.length, sha256: createHash("sha256").update(pdf).digest("hex"), approvedBy: "Yash Hurdale", approvedOn: "2026-10-28" };
describe("approved resume release gate", () => {
  it("offers contact without advertising a missing resume", () => {
    render(<ResumeDownload resume={null} />);
    expect(screen.getByRole("link", { name: /Start a conversation/ })).toHaveAttribute("href", "#contact");
    expect(screen.queryByRole("link", { name: /Download resume/ })).toBeNull();
    expect(verifyResume(null)).toContain("pending");
  });
  it("makes the configured final resume downloadable only when its file identity verifies", () => {
    expect(verifyResume(resumeConfig.approved, pathToFileURL(join(process.cwd(), "public") + "/"))).toContain("verified");
    render(<ResumeDownload />);
    expect(screen.getByRole("link", { name: /Download resume/ })).toHaveAttribute("href", resumeConfig.approved.href);
    expect(screen.getByRole("link", { name: /Download resume/ })).toHaveAttribute("download");
  });
  it("renders a native PDF download only for a complete approval record", () => {
    render(<ResumeDownload resume={record} />);
    expect(screen.getByRole("link", { name: /Download resume/ })).toHaveAttribute("href", record.href);
    expect(screen.getByRole("link", { name: /Download resume/ })).toHaveAttribute("download");
    expect(isResumeRecord({ ...record, href: "https://example.com/unverified.pdf" })).toBe(false);
    expect(isResumeRecord({ ...record, href: "./resume/../../secret.pdf" })).toBe(false);
    expect(isResumeRecord({ ...record, sha256: "unverified" })).toBe(false);
    expect(isResumeRecord({ ...record, approvedOn: "2026-02-31" })).toBe(false);
  });
  it("fails the build gate for missing, altered or non-PDF files", () => {
    const directory = mkdtempSync(join(tmpdir(), "unapplication-resume-"));
    // Flat fixture location via a public-directory URL pointing at its parent.
    const publicURL = pathToFileURL(directory + "/");
    const localRecord = { ...record, href: "./resume-test.pdf" };
    expect(() => verifyResume(localRecord, publicURL)).toThrow("Invalid resume");
    mkdirSync(join(directory, "resume"));
    try {
      expect(() => verifyResume(record, publicURL)).toThrow();
      writeFileSync(join(directory, "resume/yash-hurdale.pdf"), pdf);
      expect(verifyResume(record, publicURL)).toContain("verified");
      writeFileSync(join(directory, "resume/yash-hurdale.pdf"), Buffer.from("%PDF-1.7\nchanged\n%%EOF\n"));
      expect(() => verifyResume(record, publicURL)).toThrow("mismatch");
      writeFileSync(join(directory, "resume/yash-hurdale.pdf"), "not a PDF");
      expect(() => verifyResume(record, publicURL)).toThrow("complete PDF");
    } finally { rmSync(directory, { recursive: true, force: true }); }
  });
});

it("does not expose an unapproved file through the final compact CTA", () => {
  render(<ResumeDownload compact resume={null} />);
  expect(screen.queryByRole("link", { name: /Resume \(PDF/ })).toBeNull();
});
