# nihalunfc.github.io

Nihal Sulaiman's portfolio and blog, built with [Astro](https://astro.build) and published to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main` (about 1 minute; free because this repo is public).

## Write a blog post

Add a Markdown file to `src/content/blog/`:

```md
---
title: "Post title"
description: "One or two sentences for the list, search results and link previews."
date: 2026-11-10
tags: [Kaggle, SQL]
draft: false   # true keeps it off the live site
---

Post body in Markdown.
```

The file name becomes the address: `my-post.md` → `/blog/my-post/`.

## Add a project

Add a Markdown file to `src/content/projects/` with `title`, `summary`, `category` (Business intelligence, Applied AI, Kaggle or Tools), `status` (Live, Ongoing, Complete), `date`, and optional `stats`, `links`, `tags`, `order` and `featured` (featured projects show on the home page).

## Other pages

- `src/pages/` holds Home, About, CV, Now, Kaggle, Tools and the blog and project templates.
- `public/` is copied as is: the shared header and styles (`assets/`), the Swarm demos (`swarm/`), the expense calendar (`tools/expense-calendar/`) and the disclaimer. `/hotel-business/` is served from the separate hotel-business repo.

## Run it locally

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # writes dist/
```

## Custom domain

1. Put the bare domain in `public/CNAME` (for example `example.com`).
2. Change `SITE_URL` in `src/site.ts`, `site` in `astro.config.mjs` and the sitemap line in `public/robots.txt`.
3. In DNS, add four `A` records for the apex (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`) and a `CNAME` for `www` pointing to `nihalunfc.github.io`. On Cloudflare, set them to "DNS only" (grey cloud) until GitHub has issued the HTTPS certificate.
4. In the repo's Settings → Pages, enter the domain and tick "Enforce HTTPS" once it is offered.

## Activity log (#UpdateLog)

Each activity is one Markdown file in `src/content/log/`, named `YYYY-MM-DD-HHMM-slug.md`:

```md
---
time: 2026-11-03T15:45:00-05:00   # when the work happened (Eastern time)
title: What I did, in one line
project: Project name
status: done                      # started | progress | done | blocked | idea
link: /projects/some-page/        # optional: page or demo to look at
repo: https://github.com/nihalunfc/some-repo   # optional: the code
commit: https://github.com/nihalunfc/some-repo/commit/abc123   # optional: the work itself
---
Optional details.
```

Each entry is committed on its own, with `GIT_AUTHOR_DATE` and `GIT_COMMITTER_DATE` set to `time`, so GitHub shows when the work happened. Entries show on `/log/`, in the Live diary card on `/now/` and on the home page.
