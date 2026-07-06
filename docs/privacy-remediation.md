# Privacy Remediation — Record & Owner Checklist

**Date:** 2026-07-06

## What was rewritten and why

1. `public/assets/images/nui-coc-lake-2024.jpg` contained EXIF GPS coordinates,
   minute-level capture timestamp, device identifiers (iPhone 11), and Apple
   face-detection regions. The clean (stripped) file replaced it in the working
   tree, and the original blob was purged from all git history.
2. Commits `71e5b27`, `dfa5100`, `d0483e1` were authored as
   `letmedownslowly090@gmail.com` — a private address never published on the
   site. History was rewritten to the GitHub noreply identity.

History was rewritten with `git filter-repo` and force-pushed on 2026-07-06.
Old commit objects may remain in GitHub's caches until support purges them.

## Owner actions (do these once)

- [ ] Delete the stale remote branch that still points at pre-rewrite history:
      `git push origin --delete vercel/react-server-components-cve-vu-lu1ajb`
      (or delete it in the GitHub UI under Branches).
- [ ] File a GitHub support request at https://support.github.com/contact
      (subject: "Purge cached commits after history rewrite"), message:

      > I force-pushed a rewritten history to my public repository
      > loiht2/loiht2.github.io to remove personal data (EXIF GPS metadata in
      > an image blob, and a private email address in commit author metadata).
      > Please remove the old, now-unreachable commits from cached views, the
      > API, and any forks/PR references so the previous objects are no longer
      > accessible. Thank you.

- [ ] GitHub → Settings → Emails: enable **"Block command line pushes that
      expose my email"** and **"Keep my email addresses private"**.
- [ ] On every machine you commit from:
      `git config --global user.email "126635820+loiht2@users.noreply.github.com"`
- [ ] Treat `letmedownslowly090@gmail.com` as publicly known: enable 2FA,
      don't reuse its password anywhere.
- [ ] When adding a CV PDF to the site later: confirm it contains **no phone
      number, home address, date of birth, or ID numbers** before committing.
