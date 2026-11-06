import questions from './questions.json';

// Verbatim USCIS M-1778 (09/25), apart from PDF whitespace and asterisk metadata.
export const sourceUrl = 'https://www.uscis.gov/sites/default/files/document/questions-and-answers/2025-Civics-Test-128-Questions-and-Answers.pdf';
export const updatesUrl = 'https://www.uscis.gov/citizenship/testupdates';
export const quiz = questions;
export type Question = (typeof quiz)[number];
export const categories = [...new Set(quiz.map((q) => q.category))];
