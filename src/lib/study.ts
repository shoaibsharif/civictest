import { quiz } from './civic';
import local from './local-answers.json';

export type Mode = 'all' | 'random' | 'texas';
export const localAnswers: Record<number, { answers: string[]; source: string; note: string; verifiedOn?: string }> = local.answers;
export const verifiedOn = local.verifiedOn;
export const storageKey = 'civictest:richardson:v1';

export function makeDeck(mode: Mode) {
  if (mode === 'texas') return quiz.filter(q => q.variableAnswer);
  if (mode === 'all') return [...quiz];
  const shuffled = [...quiz];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, 20);
}

export function readPosition() {
  try {
    const position: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '0');
    return typeof position === 'number' && Number.isInteger(position) && position >= 0 && position < quiz.length ? position : 0;
  } catch { return 0; }
}
