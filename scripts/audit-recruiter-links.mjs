import { readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
const html = readFileSync('out/index.html', 'utf8');
const hrefs = [...new Set([...html.matchAll(/href="([^"]+)"/g)].map(match => match[1].replaceAll('&amp;', '&')))];
const urls = hrefs.filter(href => href.startsWith('https://'));
const results = [];
let index = 0;
await Promise.all(Array.from({ length: 3 }, async () => {
  while (index < urls.length) {
    const url = urls[index++];
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(30000), headers: { 'User-Agent': 'THE-UNAPPLICATION-link-audit/1.0' } });
      results.push({ url, status: response.status, finalURL: response.url, contentType: response.headers.get('content-type') });
      await response.body?.cancel();
    } catch (error) { results.push({ url, error: error.message }); }
  }
}));
const local = hrefs.filter(href => href.startsWith('./')).map(href => ({ href, exists: existsSync(`out/${href.slice(2)}`), bytes: existsSync(`out/${href.slice(2)}`) ? statSync(`out/${href.slice(2)}`).size : 0 }));
const config = JSON.parse(readFileSync('content/resume.json', 'utf8')).approved;
const resumeBytes = readFileSync(`out/${config.href.slice(2)}`);
const report = {
  checkedOn: '2026-10-29', source: 'Production export; GET with redirect following; three concurrent requests; no sign-in.',
  external: results.sort((a,b) => a.url.localeCompare(b.url)), local,
  contact: hrefs.filter(href => href.startsWith('mailto:')),
  approvedResume: { bytes: resumeBytes.length, sha256: createHash('sha256').update(resumeBytes).digest('hex'), matchesApproval: resumeBytes.length === config.bytes && createHash('sha256').update(resumeBytes).digest('hex') === config.sha256 },
};
writeFileSync('docs/recruiter-audit/link-audit.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
if (local.some(item => !item.exists) || !report.approvedResume.matchesApproval) process.exitCode = 1;
