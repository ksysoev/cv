# Resume site (Hugo + GitHub Pages)

Fork this repo to publish your own resume website and downloadable PDF from one source file: `resume.yaml`.

## Quick start (publish your own resume)

1. **Fork** this repository.
2. **Edit resume content** in `resume.yaml`.
3. (Optional) Replace profile image at `static/images/profile.jpeg` and update `basics.image` in `resume.yaml`.
4. In GitHub: **Settings → Pages → Build and deployment → Source = GitHub Actions**.
5. Push changes to `main`.
6. Wait for the Actions workflow to finish.

Your site will be available at:
- `https://<username>.github.io/<repo>/`

## What to edit

- `resume.yaml` — all resume content (name, summary, work, projects, skills, links)
- `layouts/index.html` — page layout and styling
- `config.yaml` — Hugo site config

## Local preview

```bash
mkdir -p data
cp resume.yaml data/resume.yaml
hugo server
```

Production-style local build:

```bash
hugo --minify
```

## How PDF naming works

PDF filename is derived from `resume.yaml` `basics.name`:
- lowercase the name
- replace non-`[a-z0-9]` runs with `-`
- trim leading/trailing `-`
- fallback: `resume.pdf` when `basics.name` is missing/empty
The download button on the page and the CI-generated PDF artifact use the same filename.

## How deployment works

Workflow file: `.github/workflows/deploy.yml`

On push to `main`, CI will:
1. copy `resume.yaml` → `data/resume.yaml`
2. build Hugo site
3. generate PDF from `public/index.html`
4. deploy `public/` to GitHub Pages

## Optional after fork

- Update `LICENSE` owner name/year
- Remove analytics snippet from `layouts/index.html` if you do not want tracking
