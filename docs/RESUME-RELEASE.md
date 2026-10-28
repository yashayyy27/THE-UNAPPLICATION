# Approved resume integration

The owner requested publication of the existing final R/GA resume on 29 October 2026. `public/resume/yash-hurdale.pdf` is an unchanged copy of the canonical `output/rga/RGA_Data_Analyst_Resume_FINAL.pdf` from the owner’s workspace. The download is enabled through `content/resume.json`; the build checks file identity, not the truth of candidate-supplied credentials.

Current approval: 97,795 bytes; SHA-256 `fbbb4f87199b84eff9ccb023e16ab358f70941ce803212d279719818923e052f`. Both PDF pages were rendered and visually checked, with selectable text and native hyperlinks inspected. No resume content was rewritten or substituted.

For a future owner-approved replacement:

1. Add that exact file to `public/resume/yash-hurdale.pdf`.
2. Replace `approved: null` in `content/resume.json` with an object containing `href: "./resume/yash-hurdale.pdf"`, its SHA-256 as `sha256`, integer file size as `bytes`, `approvedBy: "Yash Hurdale"`, and `approvedOn: "YYYY-MM-DD"`.
3. Run `npm run check` and browser tests. The prebuild gate verifies the local path, approval record, PDF header/end marker, byte count and SHA-256. Missing or altered files fail the build. This checks file identity, not the truth of credentials or PDF accessibility.
4. Review the real PDF for text extraction, reading order, links, spelling and owner approval. Check the native download on desktop/mobile, then review the PR before any separately authorised publication.

The UI now offers a native, keyboard-accessible PDF download from the verified record. The contact path remains available in the main navigation. Do not configure the record before owner approval.
