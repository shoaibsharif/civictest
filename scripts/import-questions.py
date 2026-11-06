"""Import the pypdf text extraction of USCIS M-1778 (09/25); no paraphrasing."""
import json
import re
from pathlib import Path

lines = Path('sources/uscis-2025.txt').read_text().splitlines()
questions = []
category = section = ''
for line in lines:
    line = line.strip()
    if line in ['AMERICAN GOVERNMENT', 'AMERICAN HISTORY', 'SYMBOLS AND HOLIDAYS']:
        category = line.title()
        continue
    if re.match(r'^[A-C]: ', line):
        section = line[3:]
        continue
    if not category or not line or re.match(r'^\d+ of 19$', line) or line == 'uscis.gov/citizenship':
        continue
    match = re.match(r'^(\d+)\.\s+(.*)', line)
    if match:
        questions.append(dict(id=int(match[1]), category=category, section=section,
                              question=match[2], answers=[], note=''))
    elif line.startswith('• '):
        questions[-1]['answers'].append(line[2:])
    elif line.startswith('For a complete list'):
        questions[-1]['note'] = line
    elif questions:
        q = questions[-1]
        if q['answers']:
            q['answers'][-1] += ' ' + line
        else:
            q['question'] += ' ' + line
for q in questions:
    q['specialConsideration'] = q['question'].endswith('*')
    q['question'] = q['question'].rstrip('*').strip()
    q['variableAnswer'] = q['id'] in [23, 29, 30, 38, 39, 57, 61, 62]
assert [q['id'] for q in questions] == list(range(1,129))
assert sum(q['specialConsideration'] for q in questions) == 20
Path('src/lib/questions.json').write_text(json.dumps(questions, ensure_ascii=False, indent=2) + '\n')
