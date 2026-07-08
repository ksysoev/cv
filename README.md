# CV — Hugo + JSON Resume (YAML source)

This repository builds a modern, minimal resume site with **Hugo** and deploys it to **GitHub Pages**.

## Source of truth
- `resume.yaml` is the only resume source file.
- During build, CI converts it to `data/resume.json` for Hugo templates.

## Local run
1. Install dependencies:
   - Hugo (extended)
   - Python 3
2. Install Python package:
   - `pip install pyyaml`
3. Convert resume data:
   - `python scripts/convert_resume.py`
4. Build site:
   - `hugo --minify`
5. Serve locally:
   - `hugo server`

## GitHub Pages deployment
Workflow: `.github/workflows/deploy.yml`

It will:
1. Trigger on pushes to `main`
2. Convert `resume.yaml` -> `data/resume.json`
3. Build Hugo site
4. Deploy `public/` using GitHub Pages Actions

### One-time GitHub setup
In your repository settings:
- **Settings → Pages → Build and deployment**
- Set **Source = GitHub Actions**

After that, each push to `main` publishes the site to:
`https://<username>.github.io/<repo>/`
