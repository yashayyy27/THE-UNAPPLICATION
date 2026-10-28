import { memo } from "react";
import { candidate, edition, evidence, selectedWork, proofRepo, artifact, officialRole } from "../content/edition";
import { Chapter, External, Arrow } from "./Presentation";
import ResumeDownload from "./ResumeDownload";
// Proof and contact never depend on investigation state.
function StaticEvidence() { return <>
        <Chapter id="proof" number="06" title="THE PROOF">
          <div className="section-heading">
            <h2 id="proof-heading">
              Don’t take my word.
              <br />
              <span className="muted">Follow the evidence.</span>
            </h2>
            <div className="section-intro">
              <p>
                Exclamation AI stays the technical source. Every card links to a
                specific artifact at an audited commit.
              </p>
              <External className="subtle-link" href={proofRepo}>
                Open Exclamation AI
              </External>
            </div>
          </div>
          <div className="evidence-grid">
            {evidence.map((e) => (
              <article key={e.id} className="evidence-card">
                <div className="evidence-top">
                  <span className="mono">{e.id}</span>
                  <span className="evidence-status">{e.category}</span>
                </div>
                <h3>{e.title}</h3>
                <p>{e.description}</p>
                <div className="evidence-links">
                  <External href={artifact(e.path)}>View evidence</External>
                  <External href={artifact(e.secondary)}>
                    {e.secondaryLabel}
                  </External>
                </div>
                <p className="evidence-limit">{e.limitation}</p>
              </article>
            ))}
          </div>
          <details className="evidence-details">
            <summary>
              What is verified—and what isn’t? <span aria-hidden="true">+</span>
            </summary>
            <div>
              <p>
                These links substantiate source implementation and historical
                observations recorded in the upstream project. This application
                does not independently reauthenticate those Google runs. The
                synthetic challenge above is a separate demonstration of
                reasoning.
              </p>
              <p>
                The upstream verification log records 72 Python, 50 frontend and
                16 browser tests. These are historical upstream counts, not
                fresh test results for THE UNAPPLICATION. Live model evaluation,
                BigQuery SDK transport, causal uplift and production
                daily-export arrival remain unverified.
              </p>
              <p>
                R/GA’s official Data Analyst listing asks for working Python and
                SQL, tested tracking, reproducible AI workflows and clear
                recommendations. Tool familiarity spans at least two listed groups;
                GA4/GTM is one group and BigQuery is another. These are verified
                requirements, not an employer assessment of my fit. The source
                header says Japan; its body lists Tokyo or Melbourne/Sydney.
                Availability and location need confirmation with R/GA.
              </p>
              <p>
                Listing checked on 29 October 2026. My project-to-role mapping is
                my interpretation. Employment and education are candidate-supplied
                in the resume; project verification does not certify credentials.
              </p>
              <External href={officialRole.url}>
                Read the official Data Analyst listing
              </External>
              <External href={artifact("docs/verification.md")}>
                Read the full verification report
              </External>
              <a href="./evidence-manifest.json" download>
                Download the evidence manifest ↗
              </a>
            </div>
          </details>
          <div id="resume" className="resume-note">
            <div>
              <p className="eyebrow">THE PERSON BEHIND THE QUESTIONS</p>
              <h3>Yash Hurdale.</h3>
              <p>
                {candidate.introduction}
              </p>
            </div>
            <div>
              <ResumeDownload />
            </div>
          </div>
          <div className="selected-work" aria-label="More selected work">
            {selectedWork.map((work, i) => (
              <article key={work.name}>
                <span className="mono">
                  0{i + 1} / {work.name}
                </span>
                <h3>{work.focus}</h3>
                <p>{work.description}</p>
                <External href={work.url}>Inspect {work.name}</External>
                <p className="work-limit">{work.limit}</p>
              </article>
            ))}
          </div>
          <div className="more-work">
            <span className="mono">BEYOND THIS CHALLENGE</span>
            <p>
              Explore PULSE, RESTOPS and Apex Insights in my existing portfolio.
              The project descriptions above come from inspected READMEs; their
              full implementations were not rerun for this edition.
            </p>
            <External href={candidate.portfolio}>Explore more work</External>
          </div>
        </Chapter>
        <section
          className="contact-section"
          id="contact"
          aria-labelledby="contact-heading"
        >
          <div>
            <p className="eyebrow">
              {candidate.name.toUpperCase()} / THE UNAPPLICATION
            </p>
            <h2 id="contact-heading">
              You’ve seen the thinking.
              <br />
              <span className="accent">Let’s talk about the role.</span>
            </h2>
            <p>Interview me about the analysis, the trade-offs and what I would test next.</p>
            <a
              className="button primary"
              href={`mailto:${candidate.email}?subject=Interview%20Yash%20Hurdale%20%E2%80%94%20Data%20Analyst`}
            >
              Interview Yash <Arrow diagonal />
            </a>
            <div className="contact-resume"><ResumeDownload compact /></div>
            <div className="contact-links">
              <External href={candidate.github}>GitHub</External>
              <External href={candidate.linkedin}>LinkedIn</External>
              <External href={candidate.portfolio}>Portfolio</External>
            </div>
          </div>
          <span className="contact-mark" aria-hidden="true">
            U↗
          </span>
        </section>

</>; }

export default memo(StaticEvidence);
