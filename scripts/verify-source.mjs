import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
const files = execFileSync("git", ["ls-files", "-z"])
  .toString()
  .split("\0")
  .filter(Boolean);
const suspicious = [];
for (const file of files) {
  if (/(^|\/)(\.env($|\.)|id_rsa|credentials\.json)/.test(file))
    suspicious.push(file);
  if (/\.(png|jpg|jpeg|pdf)$/.test(file)) continue;
  const text = readFileSync(file, "utf8");
  if (
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|gh[pousr]_[A-Za-z0-9]{30,}|sk-(?:proj-)?[A-Za-z0-9_-]{35,}/.test(
      text,
    )
  )
    suspicious.push(file);
}
if (suspicious.length) {
  console.error("Review possible secrets in:", [...new Set(suspicious)]);
  process.exit(1);
}
console.log(
  `Checked ${files.length} tracked files for common secret patterns and credential filenames. No matches. This is not a complete security audit.`,
);
