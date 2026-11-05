# nihalsulaiman.com: site structure map

Read this first whenever nihal mentions the portfolio, website, blog, GitHub Pages or nihalsulaiman.com. It says what lives where and how to add, edit or replace each kind of thing, so a session doesn't have to explore the repo from scratch.

- Live copy: https://nihalsulaiman.com/site-structure.md
- Source: `public/site-structure.md` in https://github.com/nihalunfc/nihalunfc.github.io (public repo, default branch `main`)
- Companion rule book: [`public/update-log-rules.md`](https://nihalsulaiman.com/update-log-rules.md) (what to do on #UpdateLog)
- Backup copies: nihal's local folder `C:\Users\nidha\Downloads\nihalsulaiman-site-rules\` and, in the Claude project, `/mnt/project-files/site-rules/`. GitHub is the source of truth; if copies differ, GitHub wins.

## The one URL scheme

Everything is one site, one repo, one header. Every page is a folder with an `index.html`, so URLs end in `/` and never in `.html`. A `#fragment` only ever points to a heading inside the same page, never to a different view.

```
/                                   home (the only home)
/<section>/                         section index
/<section>/<item>/                  one item
/<section>/<item>/<page>/           a page of that item (an edition, a demo, a sub-page)
/tools/<tool>/<edition>/<view>/     a view inside a tool app
```

| Section | Index | Items | Pages inside an item |
|---|---|---|---|
| Swarm (flagship) | `/swarm/` | `/swarm/<application>/` (the live demo), `/swarm/explorer/` | |
| Fields | `/fields/` | `/fields/<field>/` (hospitality, retail, logistics, energy, crisis, science, health, finance) | kinds are headings on the page |
| Projects | `/projects/` | `/projects/<project>/`, `/projects/kaggle/` | `/projects/hospitality-bi/overview/`, `/projects/hospitality-bi/proposals/` |
| Tools | `/tools/` | `/tools/<tool>/` (about page) | `/tools/<tool>/<edition>/` (the app: `hotels`, `ontario`, `personal`), `/tools/<tool>/<edition>/<view>/` |
| Learn | `/learn/` | `/learn/<course>/` | `/learn/<course>/days/day-01/`, `/learn/<course>/weeks/week-1/`, `/learn/<course>/pages/setup/` |
| Blog | `/blog/` | `/blog/<post>/` | `/blog/tags/<tag>/` |
| About | `/about/` | `/about/cv/`, and the PDF at `/nihal-sulaiman-cv.pdf` | |
| Single pages | `/now/`, `/log/`, `/contact/`, `/search/`, `/sitemap/`, `/disclaimer/` | | |

Shared files: `/assets/` (site CSS and JS; `/assets/hospitality/` for the hotel apps), `/data/<field>/` (JSON the apps read), `/downloads/<field>/` (Excel files).

**Rules for new URLs:** lower-case words joined by hyphens. Name tools after the job, not the sector (`/tools/shift-scheduler/`), and put the sector in the edition (`/tools/shift-scheduler/hotels/`). Never add a second home page, a separate header, a `.html` address or a `#/` route. Use absolute links (`/tools/...`) inside apps so deep pages work.

**Old addresses:** `/hotel-business/...` pages are redirect stubs in the hotel-business repo (`docs/`). Moved addresses on this site are in `redirects` in `astro.config.mjs`. When something moves, add a redirect there; never leave the old copy live.

## Hosting and deploy

| Thing | Where |
|---|---|
| Framework | Astro 5 static site (`astro.config.mjs`: `trailingSlash: 'always'`, `redirects`, `STATIC_PAGES` for the XML sitemap) |
| Build | `npm ci && npm run build` (Astro, then Pagefind search into `dist/`) |
| Deploy | `.github/workflows/deploy.yml` ("Deploy site") on every push to `main`, about 1 minute, free (public repo). Pages source is "GitHub Actions". |
| Domain | `public/CNAME` = nihalsulaiman.com. DNS on Cloudflare, DNS-only (grey cloud): four A records to 185.199.108-111.153 and `www` CNAME to nihalunfc.github.io |
| hotel-business repo | Python warehouse, SQL, tests and proposals behind the hospitality edition. `analytics/hbi/site_export.py` writes JSON and Excel into this repo's `public/data/hospitality/` and `public/downloads/hospitality/` (set `SITE_REPO` to the local clone). Its `docs/` holds redirects only. |
| Workflow | Site changes: nihal reviews previews, then one PR that nihal merges. #UpdateLog runs: pushed straight to `main`. |

## Content: add or edit by writing Markdown

Each folder in `src/content/` is a collection, with its schema in `src/content.config.ts`. A new file becomes a page on the next build.

| What | File | Shows on |
|---|---|---|
| Activity log entry | `src/content/log/YYYY-MM-DD-HHMM-slug.md` | `/log/` (numbered, one colour per project, filter by project), the home card, and the Updates list of the page named in `ref` |
| Swarm application | `src/content/swarm/<id>.md` + demo at `public/swarm/<id>/index.html` | `/swarm/` and its field page |
| Tool | `src/content/tools/<id>.md` (+ apps in `public/tools/<id>/<edition>/`) | `/tools/<id>/`, `/tools/`, its field page |
| Project | `src/content/projects/<id>.md` (+ sub-pages in `public/projects/<id>/<page>/` or `src/pages/projects/<id>/<page>.astro`) | `/projects/<id>/`, `/projects/`, its field page |
| Course | `src/content/courses/<id>.md`, plus either lessons in `src/content/lessons/<id>/` (built by Astro) or a static course in `public/learn/<id>/` | `/learn/` (one card per course) and the course at `/learn/<id>/` |
| Blog post | `src/content/blog/<slug>.md` | `/blog/<slug>/`, RSS, tag pages |
| Fields and kinds | `src/data/fields.ts` | `/fields/`, `/fields/<field>/`, filters |

### Field and kind (every tool, project and swarm item)

- `field`: one of `hospitality`, `retail`, `logistics`, `energy`, `crisis` (Crisis management), `science`, `health`, `finance`.
- `kind` (tools and projects): one of `bi` (BI and dashboards), `optimisation`, `tools`, `pipelines` (pipelines and ETL), `ml` (machine learning).
- Restaurants count as hospitality. Small business and everyday users are not fields: list them under `sectors` ("Also useful for").
- **If the field or kind isn't obvious, ask nihal.** Example: an ambulance-rerouting algorithm could be logistics or health; nihal chose health.
- Swarm work goes in `src/content/swarm/` with its own `field`, not in projects.
- A project meant for every sector (such as Self-healing pipelines) may leave out `field`; it then shows as "Any sector" and appears on no field page.

### Progress ticker (`parts`)

Tools, projects, swarm items and courses can list `parts`:

```yaml
parts:
  - { name: "Hospitality edition", done: true }
  - { name: "Restaurant edition", done: false }
  - { name: "Azure SQL pipeline", done: false, added: 2026-11-20 }   # added after the original plan
```

The ticker shows one segment per part: done parts filled, and parts with `added` after a gap with a dashed outline. Its label gives the original plan's percentage and, once extended, how many parts were added and the overall percentage. Without `parts`, it is derived from `editions` (Live = done) and `roadmap` (open). When work is finished, set `done: true`. When the plan grows, add parts with `added:` set to today. Never delete a part to raise the percentage.

### Tool fields

`field`, `kind`, `parts`, `title`, `summary`, `group`, `status` (Live, Beta, In progress, Planned), `order`, `date`, `updated`, `sectors`, `editions` ({sector, href, status}), `open`, `code`, `who`, `where`, `howto`, `limitations`, `roadmap`, `selfhost`, `method`. Body = "What it does". The page adds "Run it on your own data", a usage counter, the ticker and an Updates list. Quote YAML strings that contain `: `, and use block lists (`- "item"`) when items contain commas.

### Project fields

`field`, `kind`, `parts`, `title`, `summary`, `category`, `status` (Live, Ongoing, Complete), `date`, `updated`, `order`, `featured`, `stats`, `links`, `tags`, `sectors`, `editions`, `limitations`, `roadmap`. Body = the write-up.

### Tool apps with several views

An app with several views (the workforce and operations suites) gives every view its own path: `/tools/<tool>/<edition>/<view>/`. Each view folder holds a copy of the app's `index.html`. The app reads `location.pathname` and uses `history.pushState`. Deeper paths (such as one person's page) are handed to the app by `src/pages/404.astro`. When adding a view, add its folder too.

### Courses

Every course has `src/content/courses/<id>.md`. It feeds the card on `/learn/`: title, summary, status, level, `duration` (calendar length), `hours`, `lessons`, `modules` (name, summary, optional `size`; shown in the card's Modules drop-down), `topics`, `who`, `links`, and `progressKey` (the localStorage key the course saves ticks under, so the card can show the learner's progress and switch Start to Continue).

**Courses built by Astro (preferred for new courses, e.g. Data at Scale, `/learn/big-data-cloud/`):**

1. One Markdown file per lesson in `src/content/lessons/<id>/NN-slug.md` with `title`, `summary`, `module` (1-based, matching `modules` in the course file), `minutes`, `outcomes` and `quiz` (`q`, `options`, `answer` as a 0-based index, `why`). The lesson is served at `/learn/<id>/lessons/<slug>/` (the number sets the order and is dropped from the URL).
2. Course pages (projects, setup, glossary) are files with `page: true`, served at `/learn/<id>/pages/<slug>/` and listed in the course's top bar. Number them 90 and up.
3. The course-file body is the course home intro. Pages come from `src/pages/learn/[course]/` and `src/components/CourseShell.astro`; look and progress are `public/assets/course.css` and `public/assets/course.js` (ticks, notes, quiz grading, backup and load). Lesson and module counts and times are worked out from the lessons.
4. Boxes inside lessons are HTML blocks with a blank line inside so Markdown still renders: `<div class="callout analogy">`, `exercise`, `project`, `senior`, `warn`, and `<details class="answer">` for hidden answers. No LaTeX: write maths with `<sub>`, ×, ÷ and √.

**Static courses (Pipeline to Dashboard):**

1. Course files go in `public/learn/<id>/`, with folder URLs (`days/day-01/index.html`) and absolute links. Add `<script src="/assets/counter.js" defer></script>` before `</body>`.
2. Progress stays in the learner's browser. Reuse the backup notice and buttons from `public/learn/etl-course/assets/app.js`.
3. Add `src/content/courses/<id>.md`, and add `/learn/<id>/` to `STATIC_PAGES`.
4. Pipeline to Dashboard's Markdown source and `build.py` are in the Claude project at `/mnt/project-files/etl-course/`. Its build writes `.html` files, so after a rebuild convert them to folders and absolute links and re-apply the counter, back link and backup code. Editing the published copy directly is simpler.

## Pages with hand-written content

| Page | File |
|---|---|
| Home (card hub) | `src/pages/index.astro` |
| Swarm | `src/pages/swarm/index.astro` (intro text in `src/content-pages/swarm-intro.md`) |
| Fields | `src/pages/fields/index.astro`, `src/pages/fields/[id].astro` |
| Now | `src/pages/now.astro` (current status; update "Last updated") |
| Activity log | `src/pages/log/index.astro`, `src/components/LogList.astro` |
| About, CV | `src/pages/about/index.astro`, `src/pages/about/cv.astro` (no phone number). The PDF `public/nihal-sulaiman-cv.pdf` is printed from that page: after any CV change run `npm run build && npm run cv:pdf`, build again and commit the PDF. Every CV link (header, home intro, About, Now, Contact) points straight at the PDF, never at a redirect. |
| Kaggle | `src/pages/projects/kaggle.astro` (only nihal's own scores) |
| Hospitality proposals | `src/pages/projects/hospitality-bi/proposals.astro` (reads `public/data/hospitality/proposals.json`) |
| Self-healing pipelines | Write-up `src/content/projects/self-healing-pipelines.md`; setup guide `src/pages/projects/self-healing-pipelines/setup-guide.astro` (text in `src/content-pages/self-healing-setup-guide.md`); comparison, command centre and `simulate.py` in `public/projects/self-healing-pipelines/`. These are generated by `build_site.py` in the Claude project (`/mnt/project-files/self-healing-pipeline/site-build/`): edit the sources there and rebuild rather than editing the output. |
| Private review | `public/projects/self-healing-pipelines/review/` is password-locked: everything but the site header and footer is AES-encrypted in the browser, `noindex`, and left out of the sitemap and search. Only the encrypted file is ever committed; the readable sources and the password stay in the Claude project. To change it, rebuild with `build_site.py`. |
| Learn | `src/pages/learn/index.astro` (course cards with a Modules drop-down; the one drop-down on the site, asked for by nihal) |
| Tools index | `src/pages/tools/index.astro` |
| Contact | `src/pages/contact/index.astro` (Web3Forms key in `src/site.ts`; empty = mailto) |
| Search | `src/pages/search.astro` (Pagefind) |
| HTML site map | `src/pages/sitemap.astro` (built from the collections; add a group for a new section) |

## Shared look

| Thing | File |
|---|---|
| Layout, head, SEO | `src/layouts/Base.astro` (cache-busts CSS and JS with `?v=`) |
| Header and footer | `public/assets/header.js`: one header for every page, with plain links (Home, Swarm, Fields, Projects, Tools, Learn, Blog, Now, About) and two buttons: CV (PDF), which stays visible on phones, and Contact. The expense calendar app has an inline copy for offline use: refresh it when the header changes. Never write a literal closing script tag inside this file's comments. |
| Theme | Monochrome. `public/assets/site.css` (tokens at the end), `blog.css`, `home.css`. The hotel apps also load `/assets/hospitality/site.css`. Light and dark, saved in localStorage `nihal.theme`. |
| Layout rule | Two columns of cards on desktop, one on phones (`.now-grid`, `.hub-grid`). No drop-down menus (the Modules drop-down on course cards is the agreed exception). |
| View and download counter | `public/assets/counter.js` (Abacus API, no cookies, one view per page per browser session). Every page shows its views automatically: blog posts in the meta line under the title, every other page in the site footer (`header.js` adds the slot and loads the counter on pages that don't include it), else in the page's own `<footer>`, else in a small line at the end of the page. The blog list shows each post's views (`data-count-path`). Every link to a file on the site (`.zip`, `.csv`, `.xlsx`, `.pdf`, `.py`, ...) or with a `download` attribute is counted on click and gets an "N downloads" note after it (not in the header or footer; opt a link out with `data-no-count`). Typing a file's address directly isn't counted. |
| Progress ticker | `src/components/Progress.astro`, `partsFor()` in `src/lib.ts` |
| Helpers | `src/lib.ts`, `src/data/fields.ts`, `src/site.ts` |
| Live demo buttons | Projects take `demo:` and `repo:`, swarm items `demo:` and `code:`, tools `open:` and `code:`. Each shows as an "Open the live demo" button and a "Code" button under the title, so no card or page is a dead end. Home cards for the flagship and the BI toolkit link to the demos directly. |
| Fonts | Self-hosted, no Google Fonts: `public/assets/fonts/` (Inter variable and JetBrains Mono 500, woff2, OFL licence). Pages link `/assets/fonts/fonts.css` and preload `inter-latin-wght-normal.woff2`. Never add a Google Fonts link back. |
| Images in posts and lessons | `src/plugins/rehype-figures.mjs` (set in `astro.config.mjs`) turns each Markdown image into a figure with width, height, lazy loading and a "Download PNG" button (a plain `download` link, counted by the counter). Put figure files under `public/` and link them with absolute paths. The first image in a blog post becomes its social preview (`og:image`) and its search image. |
| Speed | `astro.config.mjs`: `prefetch` (loads a page when a link is hovered or tapped) and `inlineStylesheets`. Blog posts show a byline (By Nihal Sulaiman) under the title. |
| Libraries | Chart.js, PapaParse and SheetJS are served from `public/assets/vendor/`, not a CDN, so dashboards load from the site itself. D3 is `public/assets/d3.min.js`. Add new libraries the same way. |

## How to change things

- **Add** a tool, project, swarm item, course, post or log entry: add one Markdown file as above, with `field` and `kind`. Ask nihal if either is unclear.
- **Edit**: change the Markdown file, set `updated:` to today and update `parts`.
- **Replace** a tool or project: ask nihal first (replace, keep both, or add as an edition). Keep the same `<id>` so links keep working, or add a redirect.
- **Move** a page: move it, rewrite links (`grep -rn "<old path>" src public`), and add a redirect in `astro.config.mjs`.
- **New section**: add a collection in `src/content.config.ts`, a helper in `src/lib.ts`, an index page in `src/pages/<section>/`, a nav link in `public/assets/header.js`, a group in `src/pages/sitemap.astro`, and a row in this file.
- **Before pushing**: `npm run build` must pass with no broken internal links. Check a phone-width screenshot of anything new.
- **After changing structure**: update this file in the same PR, and refresh the backup copies.

## Rules that always apply

- Never name nihal's former employer from the one-week BI job (November 2026) or use its data. Mask anything sensitive.
- Never name companies nihal is applying to; describe them generically ("a national retail chain", "a supermarket").
- Kaggle: only nihal's own scores and ranks.
- Tools read as general first, with sectors as editions. Sample data is called sample data. No invented figures.
- Commits that count for nihal use the author `nihal <256238846+nihalunfc@users.noreply.github.com>`.
