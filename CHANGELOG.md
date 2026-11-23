# Changelog

## 0.1.2 (2026-11-23)

- Fix: the type declarations now resolve under `moduleResolution: "node16"` / `"nodenext"` (relative imports carry `.js`; before, every import from the package was TS2834/TS2835). The declaration build runs with NodeNext so this cannot regress. Use with `@watchtowerobservability/activity-web` 0.1.3 or later.

## 0.1.1

- Sync with the monorepo: Hermetica write-up follow-ups.
