import fs from "node:fs";
import path from "node:path";

const resumePath = process.argv[2] || "resume.json";
const outputPath = process.argv[3] || "public/cv-print.html";

const resume = JSON.parse(fs.readFileSync(resumePath, "utf8"));

const esc = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const monthYear = (value) => {
  if (!value) return "Present";
  const [y, m] = String(value).split("-");
  if (!y || !m) return esc(value);
  const d = new Date(Number(y), Number(m) - 1, 1);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

const dateRange = (start, end) => `${monthYear(start)} — ${monthYear(end)}`;

const basics = resume.basics || {};
const work = Array.isArray(resume.work) ? resume.work : [];
const skills = Array.isArray(resume.skills) ? resume.skills : [];
const languages = Array.isArray(resume.languages) ? resume.languages : [];
const certificates = Array.isArray(resume.certificates) ? resume.certificates : [];

const profileLinks = (basics.profiles || [])
  .filter((p) => p?.url)
  .map((p) => `<span>${esc(p.network)}: ${esc(p.url.replace(/^https?:\/\//, ""))}</span>`)
  .join("\n");

const skillsMarkup = skills
  .map((s) => {
    const chips = (s.keywords || []).map((k) => `<span class=\"chip\">${esc(k)}</span>`).join("");
    return `<article class=\"aside-block\"><h3>${esc(s.name)}</h3><div class=\"chips\">${chips}</div></article>`;
  })
  .join("\n");

const languagesMarkup = languages
  .map((l) => `<li><span>${esc(l.language)}</span><em>${esc(l.fluency)}</em></li>`)
  .join("");

const certMarkup = certificates.map((c) => `<li>${esc(c.name)}</li>`).join("");

const workMarkup = work
  .map((job) => {
    const highlights = (job.highlights || []).map((h) => `<li>${esc(h)}</li>`).join("\n");
    const companyLine = [job.name, job.location].filter(Boolean).map(esc).join(" · ");
    return `<article class=\"entry\">
      <div class=\"entry-header\">
        <h3>${esc(job.position || "")}</h3>
        <div class=\"date\">${dateRange(job.startDate, job.endDate)}</div>
      </div>
      <div class=\"company\">${companyLine}</div>
      ${job.summary ? `<p class=\"summary\">${esc(job.summary)}</p>` : ""}
      ${highlights ? `<ul class=\"highlights\">${highlights}</ul>` : ""}
    </article>`;
  })
  .join("\n");

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(basics.name)} — CV</title>
  <style>
    :root {
      --text: #111827;
      --muted: #4b5563;
      --line: #d1d5db;
      --soft: #6b7280;
    }
    @page {
      size: A4;
      margin: 12mm;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "Inter", "Segoe UI", Roboto, Arial, sans-serif;
      color: var(--text);
      font-size: 10.4pt;
      line-height: 1.35;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .cv { width: 100%; }
    header {
      border-bottom: 1px solid var(--line);
      padding-bottom: 5mm;
      margin-bottom: 5mm;
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 5mm;
      align-items: end;
    }
    h1 {
      margin: 0;
      font-size: 25pt;
      letter-spacing: -0.02em;
      line-height: 1.05;
    }
    .headline {
      margin-top: 1.6mm;
      color: var(--muted);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-size: 8.7pt;
    }
    .contacts {
      font-size: 8.4pt;
      color: var(--muted);
      text-align: right;
      display: flex;
      flex-direction: column;
      gap: 0.8mm;
      white-space: nowrap;
    }
    .layout {
      display: grid;
      grid-template-columns: 39mm 1fr;
      gap: 7mm;
    }
    .section-title {
      margin: 0 0 2.2mm;
      font-size: 8pt;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      color: var(--soft);
      font-weight: 700;
    }
    aside {
      border-right: 1px solid var(--line);
      padding-right: 5mm;
    }
    .aside-block { margin: 0 0 5mm; }
    .aside-block h3 {
      margin: 0 0 1.4mm;
      font-size: 9.1pt;
      line-height: 1.25;
    }
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 1.2mm;
    }
    .chip {
      border: 1px solid var(--line);
      border-radius: 999px;
      padding: 0.35mm 1.9mm;
      font-size: 7.8pt;
      color: #374151;
    }
    .list {
      margin: 0;
      padding-left: 0;
      list-style: none;
      color: #374151;
      font-size: 8.5pt;
    }
    .list li {
      margin-bottom: 1.2mm;
      display: flex;
      flex-direction: column;
      gap: 0.4mm;
    }
    .list em {
      font-style: normal;
      color: var(--soft);
      font-size: 8pt;
    }
    .entry {
      padding: 0 0 4mm;
      margin: 0 0 4mm;
      border-bottom: 1px solid #e5e7eb;
      break-inside: avoid;
      page-break-inside: avoid;
    }
    .entry:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }
    .entry-header {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 4mm;
      align-items: baseline;
    }
    .entry-header h3 {
      margin: 0;
      font-size: 11pt;
      line-height: 1.2;
    }
    .date {
      color: var(--soft);
      font-size: 8.3pt;
      letter-spacing: 0.01em;
      text-align: right;
      white-space: nowrap;
    }
    .company {
      margin-top: 0.9mm;
      color: #374151;
      font-size: 8.8pt;
    }
    .summary {
      margin: 1.6mm 0 0;
      color: #1f2937;
      font-size: 9.1pt;
      line-height: 1.35;
    }
    .highlights {
      margin: 1.6mm 0 0;
      padding: 0 0 0 3.8mm;
    }
    .highlights li {
      margin: 0 0 1.1mm;
      line-height: 1.33;
      font-size: 8.8pt;
      color: #1f2937;
    }
    .highlights li:last-child { margin-bottom: 0; }
  </style>
</head>
<body>
  <main class="cv">
    <header>
      <div>
        <h1>${esc(basics.name || "")}</h1>
        <div class="headline">${esc(basics.label || "")}</div>
      </div>
      <div class="contacts">
        ${basics.email ? `<span>${esc(basics.email)}</span>` : ""}
        ${basics.phone ? `<span>${esc(basics.phone)}</span>` : ""}
        ${profileLinks}
      </div>
    </header>

    <div class="layout">
      <aside>
        <section>
          <h2 class="section-title">Summary</h2>
          <p class="summary">${esc(basics.summary || "")}</p>
        </section>

        <section style="margin-top:5mm;">
          <h2 class="section-title">Skills</h2>
          ${skillsMarkup}
        </section>

        <section>
          <h2 class="section-title">Languages</h2>
          <ul class="list">${languagesMarkup}</ul>
        </section>

        <section style="margin-top:4mm;">
          <h2 class="section-title">Certificates</h2>
          <ul class="list">${certMarkup}</ul>
        </section>
      </aside>

      <section>
        <h2 class="section-title">Experience</h2>
        ${workMarkup}
      </section>
    </div>
  </main>
</body>
</html>`;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, html);
console.log(`Generated ${outputPath} from ${resumePath}`);
