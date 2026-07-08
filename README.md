# CV — Hugo + JSON Resume (YAML source)

This repository builds a modern, minimal resume site with **Hugo** and deploys it to **GitHub Pages**.

## Source of truth
- `resume.yaml` is the only resume source file.
- During build, CI converts it to `data/resume.json` for Hugo templates.

## Local run
1. Install dependencies:
   - Hugo (extended)
   - `yq` (mikefarah/yq v4+)
2. Convert resume data:
   - `mkdir -p data && yq -o=json '.' resume.yaml > data/resume.json`
3. Build site:
   - `hugo --minify`
4. Serve locally:
   - `hugo server`

## GitHub Pages deployment
Workflow: `.github/workflows/deploy.yml`

It will:
1. Trigger on pushes to `main`
2. Convert `resume.yaml` -> `data/resume.json`
3. Build Hugo site (`public/index.html` is the single source for screen + print styling)
4. Generate a downloadable PDF artifact at `public/cv.pdf` from `public/index.html` with Puppeteer print mode
5. Deploy `public/` using GitHub Pages Actions

PDF contract:
- Published filename/location: `public/cv.pdf` (served at `…/cv.pdf` — `/cv.pdf` on user/org pages, `/<repo>/cv.pdf` on project pages)
- Source HTML for PDF rendering: `public/index.html` (Hugo output)
- CV page link label: `Download PDF`
- Link behavior: direct download via `download` attribute (no forced new tab)

## Local PDF smoke test (consistency check)
Use this quick check before merging style changes to ensure web and PDF stay aligned.

1. Build Hugo output:
   - `hugo --minify`
2. Generate PDF from the same built page:
   - `npm install --no-save --no-package-lock --no-audit puppeteer`
   - `node -e 'const path=require("node:path");const puppeteer=require("puppeteer");(async()=>{const browser=await puppeteer.launch({headless:true});const page=await browser.newPage();await page.goto("file://"+path.resolve("public/index.html"),{waitUntil:"networkidle0"});await page.emulateMediaType("print");await page.pdf({path:"public/cv.pdf",format:"A4",printBackground:true,preferCSSPageSize:true});await browser.close();})();'`
3. Compare `public/index.html` in browser and `public/cv.pdf` visually (header, experience rows, chips, spacing).

### One-time GitHub setup
In your repository settings:
- **Settings → Pages → Build and deployment**
- Set **Source = GitHub Actions**

After that, each push to `main` publishes the site to:
`https://<username>.github.io/<repo>/`

Notes:
- `config.yaml` uses a neutral `baseURL` for local/dev portability.
- CI sets the production `--baseURL` dynamically from repository owner/name.
