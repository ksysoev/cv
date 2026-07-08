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
3. Build Hugo site
4. Generate a downloadable PDF artifact at `public/cv.pdf` using `rvdwegen/action-jsonresume-convert`
5. Deploy `public/` using GitHub Pages Actions

PDF contract:
- Published filename/location: `public/cv.pdf` (served as `/cv.pdf`)
- CV page link label: `Download PDF`
- Link behavior: direct download via `download` attribute (no forced new tab)

### One-time GitHub setup
In your repository settings:
- **Settings → Pages → Build and deployment**
- Set **Source = GitHub Actions**

After that, each push to `main` publishes the site to:
`https://<username>.github.io/<repo>/`

Notes:
- `config.yaml` uses a neutral `baseURL` for local/dev portability.
- CI sets the production `--baseURL` dynamically from repository owner/name.
