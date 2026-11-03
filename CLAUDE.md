# Notes for Claude sessions in this repo

- This is nihal's portfolio site (Astro 5, deployed to nihalsulaiman.com by `.github/workflows/deploy.yml`). Build with `npm run build`.
- Start with `public/site-structure.md`: what lives where and how to add, edit or replace it.
- When nihal writes #UpdateLog in any capitalisation, follow `public/update-log-rules.md` exactly.
- One URL scheme: /<section>/<item>/<page>/ (see the structure map). Swarm items in `src/content/swarm/`, courses in `src/content/courses/` + `public/learn/<id>/`. Tools live in `src/content/tools/` and are written for any sector, with sector versions as `editions`. Every tool and project has a `field` and `kind`; ask nihal when unclear. Projects live in `src/content/projects/`. The activity log lives in `src/content/log/`.
- Never name nihal's former employer from the one-week BI job in November 2026, or any company nihal is applying to (describe it generically, such as "a national retail chain").
