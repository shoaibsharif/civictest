# Official source snapshot

`uscis-2025.txt` is the complete text extracted with pypdf from the official
[USCIS M-1778 (09/25) PDF](https://www.uscis.gov/sites/default/files/document/questions-and-answers/2025-Civics-Test-128-Questions-and-Answers.pdf), retrieved November 5, 2026.

Run `python3 scripts/import-questions.py` to regenerate `src/lib/questions.json`.
Only PDF line wrapping, page furniture, and asterisk placement are normalized.
All answer alternatives, parenthetical qualifications, territorial exceptions,
and the tribe-list note are preserved. Asterisks become `specialConsideration`.
The eight location/officeholder questions are flagged `variableAnswer`; the app
applies a separately sourced, dated Richardson/Texas overlay from
`src/lib/local-answers.json`. The official bank stays unchanged.
