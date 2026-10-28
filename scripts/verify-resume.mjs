import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { isResumeRecord } from "../lib/resume.ts";
export function verifyResume(record, publicDirectory = new URL("../public/", import.meta.url)) {
  if (record === null) return "Resume pending owner-approved PDF; no download advertised.";
  if (!isResumeRecord(record)) throw new Error("Invalid resume approval record.");
  const file = readFileSync(new URL(record.href.slice(2), publicDirectory));
  if (file.subarray(0, 5).toString() !== "%PDF-" || !file.subarray(-1024).toString().includes("%%EOF"))
    throw new Error("Approved resume must be a complete PDF.");
  if (file.length !== record.bytes || createHash("sha256").update(file).digest("hex") !== record.sha256)
    throw new Error("Resume differs from the approved PDF (size/SHA-256 mismatch).");
  return `Approved resume verified: ${record.href}`;
}
