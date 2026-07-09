# CV Resume Site

A personal resume/CV repository built with **Hugo**.

This repo keeps resume content in one YAML source file and generates:
- a web CV (GitHub Pages), and
- a downloadable PDF CV

So the editing workflow is: **update content once → publish to web + PDF**.

## What this repository is about

- **Purpose:** maintain and publish a single-source CV/resume site
- **Primary content source:** `resume.yaml`
- **Output:** static site in `public/` and PDF at `public/cv.pdf`
- **Deployment:** GitHub Actions to GitHub Pages

## How to work with this repo

### 1) Prerequisites
- Hugo (extended)
- Node.js (for local PDF smoke test)

### 2) Build local data from source YAML
```bash
mkdir -p data
yq -o=json '.' resume.yaml > data/resume.json
```

### 3) Run locally
```bash
hugo server
```

### 4) Production-style build
```bash
hugo --minify
```

## Typical editing workflow

1. Edit resume content in `resume.yaml`
2. Regenerate `data/resume.json`
3. Preview with `hugo server`
4. Validate final build with `hugo --minify`
5. Commit and push to `main` to trigger deployment

## Repository map

- `resume.yaml` — source of truth for resume content
- `data/resume.json` — generated JSON used by templates
- `layouts/index.html` — CV page template/layout
- `config.yaml` — Hugo site configuration
- `.github/workflows/deploy.yml` — CI build + GitHub Pages deployment
- `public/` — generated output (site + PDF artifacts)

## Deployment (GitHub Pages)

Workflow: `.github/workflows/deploy.yml`

On push to `main` (and on PRs for build-only validation), CI will:
1. Copy `resume.yaml` → `data/resume.yaml`
2. Build Hugo site with a computed `--baseURL`
3. Render PDF from `public/index.html`
4. Publish `public/` to GitHub Pages (pushes only)

### One-time GitHub setup
In repository settings:
- **Settings → Pages → Build and deployment**
- Set **Source = GitHub Actions**

Published URL pattern:
- `https://<username>.github.io/<repo>/`

## PDF contract

- Published artifact: `public/cv.pdf`
- Served URL: `.../cv.pdf` (`/cv.pdf` on user/org pages, `/<repo>/cv.pdf` on project pages)
- PDF source page: `public/index.html`
- CV page control: top-right icon-only download button
- Download filename: `Kirill-Sysoev-cv.pdf`

## Local PDF smoke test

Use this before merging visual/style changes to keep web and PDF output aligned.

1. Build:
```bash
hugo --minify
```

2. Generate PDF from built HTML:
```bash
npm install --no-save --no-package-lock --no-audit puppeteer
node -e 'const path=require("node:path");const puppeteer=require("puppeteer");(async()=>{const browser=await puppeteer.launch({headless:true});const page=await browser.newPage();await page.goto("file://"+path.resolve("public/index.html"),{waitUntil:"networkidle0"});await page.emulateMediaType("print");await page.pdf({path:"public/cv.pdf",format:"A4",printBackground:true,preferCSSPageSize:true});await browser.close();})();'
```

3. Compare `public/index.html` and `public/cv.pdf` visually.
