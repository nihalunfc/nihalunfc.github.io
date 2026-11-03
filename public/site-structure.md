# nihalsulaiman.com: site structure map

Read this first whenever nihal mentions the portfolio, website, blog, GitHub Pages or nihalsulaiman.com. It says what lives where and how to add, edit or replace each kind of thing, so a session doesn't have to explore the repo from scratch.

- Live copy: https://nihalsulaiman.com/site-structure.md
- Source: `public/site-structure.md` in https://github.com/nihalunfc/nihalunfc.github.io (public repo, default branch `main`)
- Companion rule book: [`public/update-log-rules.md`](https://nihalsulaiman.com/update-log-rules.md) (what to do on #UpdateLog)
- Backup copies: nihal's local folder (`C:\Users\nidha\Downloads\nihalsulaiman-site-rules\`) and, in the Claude project, `/mnt/project-files/site-rules/`. GitHub is the source of truth; if copies differ, GitHub wins.

## Hosting and deploy

| Thing | Where |
|---|---|
| Framework | Astro 5 static site (`astro.config.mjs`, `trailingSlash: 'always'`) |
| Build | `npm ci && npm run build` (runs `astro build` then Pagefind search indexing into `dist/`) |
| Deploy | `.github/workflows/deploy.yml` on every push to `main`, about 1 minute, free (public repo). Pages source is "GitHub Actions". |
| Domain | `public/CNAME` = nihalsulaiman.com. DNS on Cloudflare, DNS-only (grey cloud): four A records to 185.199.108-111.153 and `www` CNAME to nihalunfc.github.io |
| Related site | `/hotel-business/` is a separate repo (nihalunfc/hotel-business) served under the same domain: the hospitality edition's live tools and dashboards |
| Workflow | nihal reviews previews, then changes go in one PR that nihal merges. #UpdateLog log entries are the exception: pushed straight to `main`. |

## Content: add or edit by writing Markdown

Each folder in `src/content/` is a collection, with its schema in `src/content.config.ts`. A new file becomes a page on the next build. No page code changes needed.

| What | File | Page | Notes |
|---|---|---|---|
| Activity log entry | `src/content/log/YYYY-MM-DD-HHMM-slug.md` | `/log/`, Live diary on `/now/`, home card, and the page named in `ref` | Rules: `public/update-log-rules.md` |
| Tool | `src/content/tools/<id>.md` | `/tools/<id>/`, listed on `/tools/`, `/sectors/` | Written for any sector; sector versions go in `editions` |
| Project | `src/content/projects/<id>.md` | `/projects/<id>/`, listed on `/projects/` | `category`: Business intelligence, Applied AI, Kaggle or Tools |
| Course | `src/content/courses/<id>.md` + the course site in `public/learn/<id>/` | Card on `/learn/`; the course at `/learn/<id>/` | See "Courses" below |
| Blog post | `src/content/blog/<slug>.md` | `/blog/<slug>/`, RSS, tag pages | `draft: true` hides it |
| Sector | `src/data/sectors.ts` | `/sectors/`, filter chips on `/tools/` | `match` words pick tools and projects by their `sectors`; `ideas` show as Planned |

### Tool fields (`src/content/tools/<id>.md`)

`title`, `summary`, `group` (Pricing and revenue, Forecasting and planning, People and scheduling, Operations, Reporting, Energy and cost, Personal), `status` (Live, Beta, In progress, Planned), `order`, `date`, `updated`, `sectors`, `editions` ({sector, href, status}), `open` (link to use it), `code`, `who`, `where`, `howto`, `limitations`, `roadmap`, `selfhost`, `method`. Body = "What it does". The page adds "Run it on your own data" (`src/components/RunYourOwn.astro`), a usage counter and an Updates list automatically. Quote any YAML string that contains `: `, and use block lists (`- "item"`) when items contain commas.

### Project fields (`src/content/projects/<id>.md`)

`title`, `summary`, `category`, `status` (Live, Ongoing, Complete), `date`, `updated`, `order`, `featured`, `stats` ({value, label}), `links` ({label, href}), `tags`, `sectors`, `editions`, `limitations`, `roadmap`. Body = the write-up.

### Courses

1. Put the course's static files in `public/learn/<id>/` with an `index.html`. Use relative links inside the course, and add `<script src="/assets/counter.js" defer></script>` before `</body>` on each page.
2. Progress must be saved in the learner's browser only (no server). Reuse the backup/restore notice from `public/learn/etl-course/assets/app.js`: it explains when progress is lost and how to download and load a backup.
3. Add `src/content/courses/<id>.md` with `title`, `summary`, `status`, `order`, `date`, `href: /learn/<id>/`, `length`, `level`, `topics`, `who`, `links`. Body = a short outline (one line per week or module).
4. Add `/learn/<id>/` to `STATIC_PAGES` in `astro.config.mjs` so the XML sitemap lists it.
5. The first course, Pipeline to Dashboard, has its Markdown source and `build.py` in the Claude project at `/mnt/project-files/etl-course/`. Rebuild there, then copy the output into `public/learn/etl-course/` and re-apply the counter script and backup code if the build overwrote them.

## Pages with hand-written content

| Page | File |
|---|---|
| Home (card hub) | `src/pages/index.astro` (cards: About, What I build, Who it's for, Learn, Looking for, Now, BI toolkit, Swarm, Kaggle, Writing, Activity log, News, More projects, Free tools, Education, Skills) |
| Now | `src/pages/now.astro` (update "Last updated" when editing) |
| About | `src/pages/about.astro` |
| CV | `src/pages/cv.astro` (no phone number; source CV is nihal's Word file) |
| Kaggle | `src/pages/kaggle.astro` (only nihal's own scores) |
| Who it's for | `src/pages/sectors.astro` (data from `src/data/sectors.ts`) |
| Learn | `src/pages/learn/index.astro` (cards from the courses collection) |
| Tools index | `src/pages/tools/index.astro` |
| Contact | `src/pages/contact/index.astro` (Web3Forms; key in `src/site.ts` `web3formsKey`, empty = mailto fallback to nihalunfc@gmail.com) |
| Search | `src/pages/search.astro` (Pagefind) |
| HTML site map | `src/pages/sitemap.astro` (add a link group when adding a new section) |
| Static demos | `public/swarm/`, `public/tools/expense-calendar/`, `public/disclaimer/` (plain HTML, also listed in `STATIC_PAGES`) |

## Shared look

| Thing | File |
|---|---|
| Layout, head, SEO, JSON-LD | `src/layouts/Base.astro` (cache-busts CSS and JS with `?v=`) |
| Header and footer | `public/assets/header.js` (`<site-header>`, `<site-footer>`, plain links, no drop-downs). A copy also lives in the hotel-business repo with its own menus. |
| Theme | `public/assets/site.css` (monochrome tokens at the end), `blog.css` (pages, tools, log), `home.css` (home cards). Light and dark, stored in localStorage `nihal.theme`. |
| Layout rule | Two columns of cards on desktop, one on phones (`.now-grid`, `.hub-grid`, min 380px per column). Keep it simple: no drop-down menus. |
| Visit counter | `public/assets/counter.js` (Abacus API, no cookies). Hooks: `[data-views]`, `[data-count-path]`, `a[data-open-count]`, `[data-opens]`. Privacy note in `public/disclaimer/index.html`. |
| Site settings | `src/site.ts` (`SITE_URL`, name, links, email, Web3Forms key) |
| Helpers | `src/lib.ts` (`getPosts`, `getProjects`, `getTools`, `getCourses`, `getLog`, `getUpdates(ref)`, Toronto time formatting) |

## How to change things

- **Add** a tool, project, course, post or log entry: add one Markdown file as above. Add it to a home card only if it's significant.
- **Edit**: change the Markdown file and set `updated:` to today.
- **Replace** a tool or project: ask nihal first (replace, keep both, or add as an edition). If replacing, keep the same `<id>` so links keep working, or keep the old file with `status: Complete` and link to the new one.
- **Remove**: delete the file and remove its links from `index.astro`, `sitemap.astro` and other pages (`grep -rn "<id>" src public`).
- **New section** (a new kind of content): add a collection in `src/content.config.ts`, a helper in `src/lib.ts`, an index page in `src/pages/`, a nav link in `public/assets/header.js`, a group in `src/pages/sitemap.astro`, and a row in this file.
- **Before pushing**: `npm run build` must pass. Check a phone-width screenshot for anything new.
- **After changing structure**: update this file in the same PR, and refresh the backup copies.

## Rules that always apply

- Never name nihal's former employer from the one-week BI job (November 2026) or use its data. Mask anything sensitive.
- Kaggle: only nihal's own scores and ranks.
- Tools read as general first, with sectors as editions. Sample data is called sample data. No invented figures.
- Commits that count for nihal use author `nihal <256238846+nihalunfc@users.noreply.github.com>`.
