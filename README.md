# Civic Study

A small, mobile-first civics study app by Shoaib Sharif. Built with **Vite + React + TypeScript + Tailwind CSS**, deployed to **Cloudflare Pages** with Wrangler. No framework migration or server is required.

## Run and verify

Use Node 24 LTS and pnpm 10.22.0 (the version pinned in `package.json`).

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm test
pnpm lint
pnpm build
pnpm preview
```

`preview` builds the app and serves `dist` through Wrangler's local Pages runtime. `pnpm deploy` builds and deploys to the existing `civictest` Pages project; authenticate with `pnpm exec wrangler login` first. For Cloudflare's Git integration, use build command `pnpm build`, output directory `dist`, and Node 24. `wrangler.jsonc` remains the Pages configuration. No deployment is performed as part of this PR.

Dependencies were updated to stable registry releases on November 5, 2026: Vite 8, React 19, Tailwind 4, TypeScript 7, ESLint 10, and Wrangler 4. Unused Headless UI, Heroicons, and Immer dependencies were removed. pnpm is the single package manager; the obsolete npm lockfile (which still described an older Next.js app) was removed.

TypeScript 7 does not expose the compiler API needed by the current typescript-eslint release. Following [Microsoft's supported side-by-side setup](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-6.0), `@typescript/native` aliases stable TypeScript 7 for `tsc`, while `typescript` aliases the stable `@typescript/typescript6` compatibility API for ESLint. Neither is a prerelease.

## Official question source

The bank contains **128 questions** from [USCIS: 128 Civics Questions and Answers (2025 version), M-1778 (09/25)](https://www.uscis.gov/sites/default/files/document/questions-and-answers/2025-Civics-Test-128-Questions-and-Answers.pdf), retrieved November 5, 2026. No third-party question bank is used.

The [USCIS 2025 test page](https://www.uscis.gov/citizenship-resource-center/naturalization-test-and-study-resources/2025-civics-test) confirms this test applies to N-400 applications filed on or after October 20, 2025. Earlier applicants use the 2008 test. The regular oral test asks up to 20 questions and requires 12 correct answers (stopping at 12 correct or 9 incorrect). Eligible applicants age 65+ with at least 20 years as permanent residents study the 20 starred questions and must answer 6 of 10 correctly. This app offers practice, not an official test simulation or eligibility determination.

Question and answer wording, acceptable alternatives, parenthetical qualifications, and territorial exceptions are retained. Only PDF whitespace and page furniture are removed. The asterisks are stored as `specialConsideration`; USCIS categories and subsections are preserved. The bank has 72 American Government, 46 American History, and 10 Symbols and Holidays questions.

Questions 23, 29, 30, 38, 39, 57, 61, and 62 have location-dependent or changing answers. We retain USCIS's instructions and link directly to [USCIS answer updates](https://www.uscis.gov/citizenship/testupdates) rather than hardcoding potentially stale officeholders or assuming Texas residence. Verify the person serving at the time of the interview before self-assessing these answers.

### Updating the source

`sources/uscis-2025.txt` preserves the full PDF text extraction. To refresh it, download the official PDF, extract each page with Python `pypdf.PdfReader(...).pages[i].extract_text()`, and join pages with newlines. Inspect the updated official document, then run:

```sh
python3 scripts/import-questions.py
pnpm test
```

The import script asserts sequential IDs 1–128 and 20 starred questions. The independent Node tests compare **every question and answer** against the source snapshot and verify category boundaries and variable-answer metadata. If USCIS revises the count or structure, review the importer and tests rather than silently dropping content.

## Study experience

- Random 20, all 128, USCIS categories, saved hard questions, and the 65/20 starred set.
- Speak aloud, reveal all acceptable answers, then choose “I knew it” or “Practice again.” Give the number of answers requested by the question.
- Visible session progress and a self-assessed summary with a retry of missed questions. Random practice continues through all 20 for learning; it does not apply official test stopping rules.
- Mark questions as hard; “Practice again” saves them automatically. Saved questions remain until unmarked, even if later answered correctly.
- Native keyboard-operable controls, visible focus, focus moved to each new question and revealed answer, and layouts for phone and desktop.

Only hard-question IDs are stored locally in this browser. No account, microphone, analytics, or server-side storage. Scores and active sessions reset on reload. Invalid saved data is ignored; blocked storage shows a message while allowing practice to continue.

## Validation

Automated checks: frozen-lockfile installation, production build/typecheck, lint, and the source-fidelity tests above.

Browser smoke checklist: start with the keyboard; reveal and inspect focus; mark and unmark hard questions; self-assess and advance; finish a session and retry missed questions; reload to verify saved questions; check random uniqueness, category boundaries, and starred count; inspect at 320px, 390px, and desktop widths. Also serve the production build with `pnpm preview` to verify the Cloudflare Pages path.
