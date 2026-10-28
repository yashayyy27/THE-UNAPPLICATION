import config from "../content/resume.json";
import { isResumeRecord } from "../lib/resume";
export default function ResumeDownload({ resume = config.approved, compact = false }: { resume?: unknown; compact?: boolean }) {
  if (isResumeRecord(resume) && compact) return (
    <a className="subtle-link" href={resume.href} download>
      Resume (PDF · {Math.ceil(resume.bytes / 1024)} KB) <span aria-hidden="true">↓</span>
    </a>
  );
  if (isResumeRecord(resume)) return (
    <>
      <span className="badge">RESUME / DATA ANALYST</span>
      <p>Yash Hurdale. PDF · {Math.ceil(resume.bytes / 1024)} KB.</p>
      <a className="subtle-link" href={resume.href} download>
        Download resume (PDF) <span aria-hidden="true">↓</span>
      </a>
    </>
  );
  return (
    <>
      <span className="badge">RESUME</span>
      <p>For a current resume, contact Yash directly.</p>
      <a href="#contact" className="subtle-link">Start a conversation <span aria-hidden="true">↗</span></a>
    </>
  );
}
