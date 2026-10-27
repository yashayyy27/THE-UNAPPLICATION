export const candidate = {
  name: "Yash Hurdale",
  introduction:
    "I turn ambiguous business questions into analysis you can inspect—and decisions you can challenge.",
  email: "yash.h2700@gmail.com",
  github: "https://github.com/yashayyy27",
  linkedin: "https://www.linkedin.com/in/yash-hurdale-ba47a4178/",
  portfolio: "https://yashayyy27.github.io/",
  resume: null,
};
export const edition = {
  company: "R/GA",
  role: "Data Analyst",
  number: "001",
  disclaimer:
    "An independent candidate project. Not affiliated with or endorsed by R/GA.",
  roleStatus:
    "Target role supplied by the candidate. The original listing could not be verified.",
  accent: "#d9ff43",
};
export const sourceCommit = "35f1aff81c166215496b0f0b2b041db7a4c0360e";
export const proofRepo = "https://github.com/yashayyy27/exclamation-ai";
export const artifact = (path: string) =>
  `${proofRepo}/blob/${sourceCommit}/${path}`;
export const evidence = [
  {
    id: "E01",
    title: "SQL you can trace.",
    category: "REPRODUCIBLE SOURCE",
    description:
      "An ordered, session-grain funnel. Deduplication and transaction revenue have separate definitions.",
    path: "data/sql/sessions.sql",
    secondary: "services/api/analytics.py",
    secondaryLabel: "Python pipeline",
    limitation:
      "The public dashboard uses invented events; it is not client performance.",
  },
  {
    id: "E02",
    title: "A real Google reconciliation.",
    category: "DOCUMENTED HISTORICAL RUN",
    description:
      "22,096 public historical events. Nine reconciled checks. One bounded day, 1 January 2021 UTC.",
    path: "docs/bigquery-analysis-2026-10-25.md",
    secondary: "docs/evidence/bigquery-console-20261025-reconciliation.json",
    secondaryLabel: "Reconciliation receipt",
    limitation:
      "Console execution is documented upstream. SDK authentication remains unverified.",
  },
  {
    id: "E03",
    title: "Measurement, with receipts.",
    category: "DOCUMENTED TEST DELIVERY",
    description:
      "Eight event types and two distinct demo purchases received through unpublished GTM Preview → GA4 DebugView.",
    path: "docs/google-tracking-2026-10-26.md",
    secondary: "apps/web/src/measurement.ts",
    secondaryLabel: "Event contracts",
    limitation:
      "Owner test property. Public tracking is disabled; daily export arrival is unverified.",
  },
  {
    id: "E04",
    title: "A failure worth showing.",
    category: "DETERMINISTIC ADVERSARIAL TEST",
    description:
      "An evidence validator accepted a duplicate metric substitution. The recorded replay shows the repaired gate rejecting it.",
    path: "docs/failure-analysis.md",
    secondary: "docs/evidence/validator-replay.json",
    secondaryLabel: "Inspect the replay",
    limitation:
      "Fixture and mocked-provider results. No live model quality or client uplift is claimed.",
  },
] as const;
export const paths = [
  {
    id: "measurement",
    letter: "A",
    title: "Measurement integrity",
    question: "Can we trust the signal?",
    deck: "Count the business event, not every event firing.",
    finding: "120 purchase events. Only 100 distinct orders.",
    interpretation:
      "Twenty duplicate firings inflate the raw purchase count by 20% relative to unique orders. That explains a counting discrepancy; it does not explain flat revenue.",
    recommendation:
      "Reconcile transaction IDs and values against the order ledger before changing the campaign.",
    limitation:
      "This fixture labels duplicates explicitly. In real data, refunds, currencies, consent and missing IDs need separate checks.",
    evidenceId: "E03",
    sourcePath: "data/sql/transactions.sql",
  },
  {
    id: "effectiveness",
    letter: "B",
    title: "Marketing effectiveness",
    question: "Did attention become value?",
    deck: "More engagement is a signal. Incrementality is a different question.",
    finding: "More attention. The same 100 purchases.",
    interpretation:
      "Engaged sessions rose 65%, while purchases and revenue stayed flat. Credit rules can move revenue between channels without changing total revenue.",
    recommendation:
      "Keep allocation unchanged until matched spend, a defined attribution window and an incrementality test are available.",
    limitation:
      "Observed conversion is descriptive. Source labels and overlapping intervals cannot establish causal channel performance.",
    evidenceId: "E02",
    sourcePath: "services/api/marketing.py",
  },
  {
    id: "behaviour",
    letter: "C",
    title: "Customer behaviour",
    question: "Where did intent get lost?",
    deck: "Look beneath the average before blaming the experience.",
    finding: "The audience mix changed. Purchases did not.",
    interpretation:
      "Returning sessions stay at 2,000 and 80 purchases. New sessions grow from 3,000 to 5,500, with 20 purchases in each period. The aggregate rate hides that mix change.",
    recommendation:
      "Separate acquisition intent from product friction; inspect new-visitor landing cohorts before designing an experiment.",
    limitation:
      "Two aggregate periods cannot distinguish traffic quality, device effects, seasonality or measurement drift.",
    evidenceId: "E01",
    sourcePath: "data/sql/sessions.sql",
  },
] as const;
export type PathId = (typeof paths)[number]["id"];
export const challenges = [
  {
    id: "tracking",
    title: "What if tracking is broken?",
    short: "Broken tracking",
    matters:
      "Missing purchases can create an apparent conversion decline without a commercial decline.",
    supported:
      "The recorded counts and the order of checks remain inspectable.",
    revised:
      "Pause conversion and channel conclusions. The sensitivity estimate is a model, not recovered revenue.",
    needed:
      "Server order ledger, unique transaction IDs, currency/refund reconciliation and consent-aware event QA.",
    action:
      "Fix and reconcile measurement first. Rebaseline before testing creative or changing spend.",
  },
  {
    id: "sample",
    title: "Is the sample large enough?",
    short: "Small sample",
    matters:
      "The conversion estimate varies with the number and independence of observations.",
    supported:
      "The observed difference between the two fixture periods is descriptive.",
    revised:
      "A confidence interval is not proof of causality. Returning visitors and repeat sessions can violate independence.",
    needed:
      "A preregistered minimum effect, independent randomisation unit, baseline, power calculation and guardrails.",
    action:
      "Plan the experiment around a meaningful business effect. Do not declare a winner from this comparison.",
  },
  {
    id: "attribution",
    title: "What if attribution misleads?",
    short: "Attribution bias",
    matters:
      "First and last touch can assign the same sale to different channels.",
    supported:
      "The three invented journeys always total USD 150, regardless of the credit rule.",
    revised:
      "Remove channel superiority and budget-shift claims. Allocated revenue is not incremental revenue.",
    needed:
      "Complete matched touchpoints, declared lookback window, spend and a credible holdout design.",
    action:
      "Treat attribution as a reporting convention. Validate incrementality before reallocating budget.",
  },
  {
    id: "missing",
    title: "What if values are missing?",
    short: "Missing values",
    matters:
      "Eight of the 100 unique orders in the fixture lack campaign labels. That missingness may be systematic.",
    supported:
      "The all-channel order total remains 100; missing labels do not erase observed orders.",
    revised:
      "Channel rankings are incomplete. Assigning unknown orders proportionally would add an unsupported assumption.",
    needed:
      "Missingness by device, consent state and landing source; linkage to the order ledger where permitted.",
    action:
      "Keep an explicit unknown bucket. Repair collection and test whether missingness is biased.",
  },
  {
    id: "causality",
    title: "Does this establish causality?",
    short: "Causality",
    matters: "Before/after periods have no randomised counterfactual.",
    supported:
      "Engagement and purchase counts describe what was recorded in this invented scenario.",
    revised:
      "Withdraw any claim that the campaign caused the conversion-rate change or that a fix will produce uplift.",
    needed:
      "Randomised or defensible quasi-experimental design, predeclared primary metric and purchase guardrails.",
    action:
      "Use the analysis to prioritise a hypothesis, then test it. Do not sell a correlation as a result.",
  },
  {
    id: "cost",
    title: "What if the fix costs too much?",
    short: "Cost of the fix",
    matters:
      "A plausible improvement can still destroy value when delivery cost exceeds contribution.",
    supported:
      "A break-even calculation can make the commercial hurdle explicit.",
    revised:
      "Revenue is not profit. The model assumes USD 40 contribution per incremental order, before fixed costs.",
    needed:
      "An owner-approved delivery estimate, measured contribution, expected eligible volume and realistic test duration.",
    action:
      "Start with a bounded diagnosis. Fund an experiment only if plausible incremental contribution can cover its cost.",
  },
] as const;
export type ChallengeId = (typeof challenges)[number]["id"];
export const selectedWork = [
  {
    name: "PULSE",
    focus: "From warning signal to decision brief.",
    description:
      "A synthetic business early-warning workflow with scoped investigation, conditional scenarios and business analysis artifacts.",
    url: "https://github.com/yashayyy27/PULSE/blob/e2f3176a7be0723749c94b258ed8e5fa5681b4ad/README.md",
    limit:
      "README inspected. Hosted deployment and real stakeholder approvals are not claimed.",
  },
  {
    name: "RESTOPS",
    focus: "Operational trade-offs, made inspectable.",
    description:
      "A restaurant-operations portfolio connecting profit reconciliation, costed scenarios and proposed interventions.",
    url: "https://github.com/yashayyy27/RESTOPS/blob/45aa830a67e89838e91b49d46d16d5f2b219c6fd/README.md",
    limit:
      "Synthetic restaurant data. Proposed actions are not achieved savings or client results.",
  },
  {
    name: "APEX INSIGHTS",
    focus: "Commercial questions. Explicit data boundaries.",
    description:
      "Power BI model/report source with Python, SQL and Excel evidence across synthetic commerce and public F1 data.",
    url: "https://github.com/yashayyy27/apex-insights/blob/9a78ae328ea06be72a06380893e75712b1b2e345/README.md",
    limit:
      "README inspected. Native Windows Power BI rendering and interaction acceptance remain pending.",
  },
] as const;
