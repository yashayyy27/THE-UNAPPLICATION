import config from "../content/resume.json";
import { isResumeRecord } from "../lib/resume";
export default function ResumeDownload({ resume = config.approved }: { resume?: unknown }) {
  if (isResumeRecord(resume)) return (
    <>
      <span className="badge">RESUME / OWNER-APPROVED PDF</span>
      <p>Yash’s approved resume. PDF · {Math.ceil(resume.bytes / 1024)} KB.</p>
      <a className="subtle-link" href={resume.href} download>
        Download approved resume <span aria-hidden="true">↓</span>
      </a>
    </>
  );
  return (
    <>
      <span className="badge">RESUME / AWAITING APPROVED FILE</span>
      <p>Approved PDF coming soon. Explore the evidence or contact Yash directly.</p>
      <a href="#contact" className="subtle-link">Start a conversation <span aria-hidden="true">↗</span></a>
    </>
  );
}
