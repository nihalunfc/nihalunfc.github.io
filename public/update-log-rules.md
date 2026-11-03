# #UpdateLog rules

These are the rules any Claude session (claude.ai chat, project thread, Cowork or Claude Code, in any project) follows when nihal writes **#UpdateLog**. Live copy: https://nihalsulaiman.com/update-log-rules.md (source: `public/update-log-rules.md` in github.com/nihalunfc/nihalunfc.github.io). Backup copies sit in nihal's local folder (`C:\Users\nidha\Downloads\nihalsulaiman-site-rules\`) and in the Claude project at `/mnt/project-files/site-rules/`. GitHub wins if they differ.

**Read the structure map first:** https://nihalsulaiman.com/site-structure.md (source `public/site-structure.md`). It says where every kind of content lives and how to add, edit or replace it.

To work on the site, a session needs the repo nihalunfc/nihalunfc.github.io: in Claude Code, clone or attach it; in claude.ai, use the GitHub connector. If neither is possible, see section 7.

## 1. Trigger

The trigger is case-insensitive and forgiving about spacing. `#UpdateLog`, `#updatelog`, `#UPDATELOG`, `#updatelOG`, `#update-log`, `#update_log` and `#update log` all count. In code terms: `/#\s*update[\s_-]*log/i`.

It means: log everything done in this conversation since the last #UpdateLog (or since the start), and update the portfolio site to match.

## 2. The log diary is always written

Every run writes the log, whatever else it does.

- One file per distinct activity: `src/content/log/YYYY-MM-DD-HHMM-slug.md`, with the time in Eastern time (America/Toronto) when the activity actually happened, not when the log is written.
- Frontmatter:

```md
---
time: 2026-11-03T15:45:00-05:00
title: What was done, in one plain line
project: Human-readable project or tool name
status: done            # started | progress | done | blocked | idea
ref: tools/shift-scheduler   # optional: the page this updates, projects/<id> or tools/<id>
link: /tools/shift-scheduler/                 # optional: page or demo to look at
repo: https://github.com/nihalunfc/some-repo  # optional: the code
commit: https://github.com/nihalunfc/some-repo/commit/<sha>   # optional: the work itself
tags: [ETL, Azure]
---
One to three sentences of detail, if useful.
```

- Give every entry at least one link (`link`, `repo` or `commit`) when one exists, so anyone can check the work.
- Work that isn't a project (study, job search, admin) is still logged, with `project: Learning`, `project: Job search` and so on, and no page update.

## 3. Then update the right page

Decide what the activity touched:

| The activity is about... | Do this |
|---|---|
| An existing project in `src/content/projects/` | Update that file: `updated` date, `status`, `stats`, `links`, `roadmap`, `limitations`, and the body if something real changed. Set `ref: projects/<id>` on the log entry. |
| An existing tool in `src/content/tools/` | Update that file: `updated`, `status`, `editions`, `howto`, `limitations`, `roadmap`, `selfhost`. A new sector version is a new entry in `editions`, not a new tool. Set `ref: tools/<id>`. |
| A new tool | First check for a similar tool (see section 4). If none, create `src/content/tools/<slug>.md` with every field filled. |
| A new project | Create `src/content/projects/<slug>.md`, and add it to the home page "More projects" card if it's significant. |
| A course (new or changed) | Follow "Courses" in the structure map: course files in `public/learn/<id>/`, a card file `src/content/courses/<id>.md`, and `/learn/<id>/` in `STATIC_PAGES`. Progress stays in the learner's browser with the backup notice. Set `ref: courses/<id>`. |
| A new field or sector | Add it to `src/data/sectors.ts` (`match` words and planned `ideas`), and tag the tools that fit with that sector. |
| Anything that changes the site's structure | Update `public/site-structure.md` in the same commit. |

The log entry and its page change go in the same commit.

## 4. Similar tools: ask before replacing

A new tool is "similar" when it solves the same problem as an existing tool (same `group` and the same question answered), even for a different sector.

When it is similar, **ask nihal** before touching the existing page, with three choices:

1. **Replace** the existing tool page with the new one.
2. **Keep both** as separate tools.
3. **Add as a new edition** of the existing tool (often the right answer for a sector version).

Until nihal answers, write the log entry only, and leave the tool pages unchanged. If nihal can't be asked in this session, keep both and say so in the log entry and the reply.

## 5. How tools are written

The site is a portfolio for employers and recruiters in any sector, so every tool reads as general first:

- The title and summary name the business problem, not one industry ("Shift schedule builder", not "Housekeeping scheduler").
- `sectors` lists who it suits. Sector-specific versions go in `editions` (`Live`, `In progress` or `Planned`).
- Fill every section honestly: `who` can use it, `where` it fits, `howto` steps, `limitations`, `roadmap` (how it will be updated), `selfhost` (what a dedicated server, database or warehouse adds for this tool) and `method`.
- The shared "Run it on your own data" section is added to every tool page automatically. Don't repeat it in the body.
- No invented numbers. Sample data is called sample data.

## 6. Commits and push

- One commit per log entry (plus its page change), with `GIT_AUTHOR_DATE` and `GIT_COMMITTER_DATE` set to the entry's `time`, so GitHub shows when the work happened.
- Author: `nihal <256238846+nihalunfc@users.noreply.github.com>`, so the commits count on nihal's contribution graph. Message: `log: <title>`.
- Run `npm run build` before pushing. If it fails, fix the entry rather than skipping it. Check that each new or changed page exists in `dist/` (for example `dist/tools/<id>/index.html`, `dist/learn/<id>/index.html`) and that `dist/log/index.html` contains the new entry's title.
- Push once at the end of the run, to `main`. The site deploys itself in about a minute.

## 7. When the session can't push

- In a Claude project with `/mnt/project-files/`: write the files to `/mnt/project-files/update-log/inbox/` (same names and contents) and say so. The next session that can push commits them in time order and empties the inbox.
- Anywhere else: reply with each file as a ready-to-paste block, with its path, and the commit command for it.

## 8. Privacy

- Never name nihal's former employer from the one-week BI job in November 2026, or use any of its data.
- Mask anything sensitive: client names, private data, credentials, phone numbers.
- Kaggle: only claim scores and ranks that come from nihal's own work.

## 9. Keep the rule book safe

If these rules or the structure map change, update `public/update-log-rules.md` and `public/site-structure.md` on GitHub first, then refresh the backup copies in nihal's local folder and `/mnt/project-files/site-rules/` when the session can reach them.

## 10. Reply

End with a short list of what was logged and changed, each with its link on nihalsulaiman.com/log/ or the page it updated, and any question from section 4.
