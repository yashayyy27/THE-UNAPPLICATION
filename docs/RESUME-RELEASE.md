# Approved resume integration

No resume or credentials have been supplied or invented. The current site shows an honest pending state with a direct contact link.

When Yash supplies and approves the final PDF:

1. Add that exact file to `public/resume/yash-hurdale.pdf`.
2. Replace `approved: null` in `content/resume.json` with an object containing `href: "./resume/yash-hurdale.pdf"`, its SHA-256 as `sha256`, integer file size as `bytes`, `approvedBy: "Yash Hurdale"`, and `approvedOn: "YYYY-MM-DD"`.
3. Run `npm run check` and browser tests. The prebuild gate verifies the local path, approval record, PDF header/end marker, byte count and SHA-256. Missing or altered files fail the build. This checks file identity, not the truth of credentials or PDF accessibility.
4. Review the real PDF for text extraction, reading order, links, spelling and owner approval. Check the native download on desktop/mobile, then review the PR before any separately authorised publication.

The UI automatically switches to a native, keyboard-accessible PDF download once the verified record is configured. The contact path remains available in the main navigation. Do not configure the record before owner approval.
