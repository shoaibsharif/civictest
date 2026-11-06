# Civics — Richardson, Texas

A personal study page for the USCIS 2025 civics test. Opens directly on a question. No login, account, backend, or analytics.

- All 128 questions, a random 20, or the eight Texas/current-official questions.
- Reveal answers and move backward or forward. Your place in the full list stays in this browser.
- Texas and national officeholder answers are filled in. The U.S. representative requires an address-specific lookup; the page links to the House's official finder and provides an optional note for the current visit.

## Run

Node 24 LTS and pnpm 10.22.0:

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm test
pnpm lint
pnpm build
pnpm preview
```

Vite + React + TypeScript + Tailwind CSS. `preview` builds and serves `dist` through Wrangler's local Cloudflare Pages runtime. `pnpm deploy` builds and deploys to the existing `civictest` Pages project (authenticate with `pnpm exec wrangler login`). For Cloudflare Git integration: build `pnpm build`, output `dist`, Node 24. No deployment is performed by this change.

Stable dependencies were upgraded November 5, 2026. TypeScript 7 builds run alongside the TypeScript 6 API compatibility package required by typescript-eslint, following [Microsoft's documented setup](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-6.0). pnpm is the only lockfile.

## Question and answer sources

The unchanged base bank is [USCIS M-1778 (09/25): 128 Civics Questions and Answers](https://www.uscis.gov/sites/default/files/document/questions-and-answers/2025-Civics-Test-128-Questions-and-Answers.pdf). Wording, acceptable alternatives, territorial exceptions, categories, and 65/20 asterisks are preserved in `src/lib/questions.json`; PDF whitespace is normalized. `sources/uscis-2025.txt` contains the full source extraction.

[USCIS's 2025 test guidance](https://www.uscis.gov/citizenship-resource-center/naturalization-test-and-study-resources/2025-civics-test) applies this version to N-400 filings on or after October 20, 2025, including November 2025 filings. The officer asks up to 20 questions; 12 correct answers pass. Eligible 65/20 applicants use a smaller starred set described in the official PDF. This page is a study aid, not an exam simulator.

`src/lib/local-answers.json` overlays these answers for Richardson, verified **November 5, 2026**, without editing the official bank:

| Question | Answer | Official source |
| --- | --- | --- |
| 23 · U.S. senator | John Cornyn **or** Ted Cruz | [U.S. Senate, Texas](https://www.senate.gov/states/TX/intro.htm) |
| 30 · Speaker | Mike Johnson | [USCIS test updates](https://www.uscis.gov/citizenship/testupdates) |
| 38 · President | Donald Trump | [USCIS test updates](https://www.uscis.gov/citizenship/testupdates) |
| 39 · Vice President | JD Vance | [USCIS test updates](https://www.uscis.gov/citizenship/testupdates) |
| 57 · Chief Justice | John Roberts | [USCIS test updates](https://www.uscis.gov/citizenship/testupdates) |
| 61 · Governor | Greg Abbott | [Office of the Texas Governor](https://gov.texas.gov/governor-abbott) |
| 62 · State capital | Austin | [Texas Historical Commission](https://atlas.thc.texas.gov/Details?atlasnumber=5507014150&fn=print) |

Question 29 must be answered using the representative for your **home address**, not a city-wide assumption. [Find your representative](https://www.house.gov/representatives/find-your-representative). The House cautions that 2026 election district changes and winners do not take effect until the new Congress begins in January 2027. Use the official currently serving at your interview. Recheck dated officeholder answers before the interview; there is no automatic live update.

## Maintaining the bank

To refresh, download the official PDF and extract its pages with `pypdf`, joining `page.extract_text()` with newlines into the source text file. Review the document, then run:

```sh
python3 scripts/import-questions.py
pnpm test
```

Tests compare every question and answer against the snapshot and verify the local overlay. CI runs tests, lint, build, and a reproducibility check. Browser checks cover reveal/navigation, the three question sets, saved position, phone reflow, and keyboard focus.
