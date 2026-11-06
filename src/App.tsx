import { useEffect, useRef, useState } from 'react';
import { categories, quiz, sourceUrl, updatesUrl, type Question } from './lib/civic';

const storageKey = 'civictest:hard:2025:v1';
function readHard(): number[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
    return Array.isArray(saved) ? [...new Set(saved.filter((id): id is number => Number.isInteger(id) && id >= 1 && id <= 128))] : [];
  } catch { return []; }
}
function shuffled(items: Question[]) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export default function App() {
  const [hard, setHard] = useState(readHard);
  const [storageError, setStorageError] = useState(false);
  const [mode, setMode] = useState('random');
  const [category, setCategory] = useState(categories[0]);
  const [session, setSession] = useState<Question[]>([]);
  const [results, setResults] = useState<boolean[]>([]);
  const [revealed, setRevealed] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const answerHeading = useRef<HTMLHeadingElement>(null);
  const index = results.length;
  const current = session[index];
  const complete = session.length > 0 && !current;
  const known = results.filter(Boolean).length;

  useEffect(() => {
    if (session.length) heading.current?.focus();
  }, [index, session]);
  useEffect(() => {
    if (revealed) answerHeading.current?.focus();
  }, [revealed]);

  function saveHard(next: number[]) {
    setHard(next);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); setStorageError(false); }
    catch { setStorageError(true); }
  }
  function start(items?: Question[]) {
    const pool = items ?? (mode === 'hard' ? quiz.filter(q => hard.includes(q.id))
      : mode === 'category' ? quiz.filter(q => q.category === category)
      : mode === 'special' ? quiz.filter(q => q.specialConsideration) : quiz);
    setSession(mode === 'random' && !items ? shuffled(pool).slice(0, 20) : [...pool]);
    setResults([]);
    setRevealed(false);
  }
  function rate(knew: boolean) {
    if (!current || !revealed) return;
    if (!knew && !hard.includes(current.id)) saveHard([...hard, current.id]);
    setResults([...results, knew]);
    setRevealed(false);
  }
  const missed = session.filter((_, i) => results[i] === false);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">Skip to study</a>
      <header className="site-header">
        <a className="brand" href="/" aria-label="Civic Study home"><span aria-hidden="true" className="brand-icon">✦</span> Civic Study</a>
        <span className="edition">2025 USCIS edition</span>
      </header>
      <main id="main">
        <div className="intro">
          <p className="eyebrow">A little practice. A step closer.</p>
          <h1>Make yourself<br /><em>at home with civics.</em></h1>
          <p>Build confidence, one question at a time. Say your answer aloud, then check it against the official USCIS list.</p>
        </div>
        <div className="study-layout">
          <aside className="setup" aria-label="Study settings">
            <p className="eyebrow">Your study space</p>
            <h2>Find your focus</h2>
            <label htmlFor="mode">Practice mode</label>
            <select id="mode" value={mode} onChange={e => setMode(e.target.value)}>
              <option value="random">Random 20</option>
              <option value="category">By category</option>
              <option value="all">All 128 questions</option>
              <option value="hard">Hard questions ({hard.length})</option>
              <option value="special">65/20 starred questions</option>
            </select>
            {mode === 'category' && <><label htmlFor="category">USCIS category</label><select id="category" value={category} onChange={e => setCategory(e.target.value)}>{categories.map(c => <option key={c}>{c}</option>)}</select></>}
            <p className="hint">{mode === 'random' ? 'A fresh mix of 20 questions. Take your time; this is self-assessed practice.' : mode === 'hard' ? 'Return to questions you saved or want to practice again.' : mode === 'special' ? 'The 20 starred questions for applicants age 65+ with at least 20 years as a permanent resident.' : 'Work through the official questions in order, at your own pace.'}</p>
            <button className="primary full" disabled={mode === 'hard' && !hard.length} onClick={() => start()}>{session.length ? 'Start new session' : 'Start studying'} <span aria-hidden="true">→</span></button>
            {session.length > 0 && <p className="hint">Starting a new session resets this session’s progress.</p>}
            {mode === 'hard' && !hard.length && <p role="status" className="hint">No hard questions yet. Save one during practice to revisit it here.</p>}
            <div className="study-tip"><span className="eyebrow">A good habit</span><p>Speak before you peek.</p><span>The interview is an oral test. Practicing out loud helps you get comfortable with your answers.</span></div>
          </aside>
          <section className="study-panel" aria-label="Practice session">
            {!session.length ? <div className="welcome">
              <span className="welcome-mark" aria-hidden="true">✦</span><p className="eyebrow">Ready when you are</p>
              <h2>A small session.<br />A little more confidence.</h2>
              <p>Choose a mode and start studying. No timer, no account—just room to learn.</p>
              <div className="facts"><div><strong>128</strong><span>official questions</span></div><div><strong>3</strong><span>core categories</span></div><div><strong>Your pace</strong><span>always</span></div></div>
            </div> : complete ? <div className="summary">
              <p className="eyebrow">Session complete</p><h2 ref={heading} tabIndex={-1}>You made time to learn.</h2>
              <p className="score">{known}<span> / {session.length}</span></p><p>answers you marked “I knew it”</p>
              <p>{missed.length ? `${missed.length} ${missed.length === 1 ? "question" : "questions"} to revisit. They’re saved in your hard questions.` : 'Great practice. Try another mix to keep building confidence.'}</p>
              <div className="actions">{missed.length > 0 && <button className="primary" onClick={() => start(missed)}>Practice these again</button>}<button onClick={() => start()}>New session</button></div>
              <p className="hint">A reflection of your own assessment, not an official test result.</p>
            </div> : <>
              <div className="progress-label"><span>Question {index + 1} of {session.length}</span><span>{index} completed</span></div>
              <progress aria-label="Session progress" value={index} max={session.length} />
              <div className="question-body">
                <div className="question-meta"><span>{current.category} · #{current.id}</span><button className="save-button" aria-pressed={hard.includes(current.id)} onClick={() => saveHard(hard.includes(current.id) ? hard.filter(id => id !== current.id) : [...hard, current.id])}>{hard.includes(current.id) ? '★ Saved as hard' : '☆ Mark as hard'}</button></div>
                <p className="section-label">{current.section}{current.specialConsideration ? ' · 65/20 ★' : ''}</p>
                <h2 ref={heading} tabIndex={-1}>{current.question}</h2>
                {!revealed ? <><p className="hint">Say your answer out loud. Give the number of answers the question asks for.</p><button className="primary reveal" onClick={() => setRevealed(true)} aria-expanded={false}>Reveal answer <span aria-hidden="true">↓</span></button></> : <div className="answer-area">
                  <h3 ref={answerHeading} tabIndex={-1}>{current.variableAnswer ? 'Check your current answer' : 'Accepted answers'}</h3>
                  {current.variableAnswer && <p className="variable-note">This answer depends on where you live or who serves at the time of your interview. <a href={updatesUrl} target="_blank" rel="noreferrer">Check USCIS guidance (new tab)</a> before assessing your answer.</p>}
                  <ul>{current.answers.map((a, i) => <li key={i}>{a}</li>)}</ul>
                  {current.note && <p>{current.note}</p>}
                  {!current.variableAnswer && <p className="hint">These are acceptable alternatives. You only need the number requested; if no number is specified, give one listed answer.</p>}
                  <div className="assessment"><p>How did you do?</p><div className="actions"><button onClick={() => rate(false)}>Practice again</button><button className="primary" onClick={() => rate(true)}>I knew it <span aria-hidden="true">→</span></button></div></div>
                </div>}
              </div>
            </>}
            {storageError && <p role="status" className="storage-warning">Your browser couldn’t save hard questions. They’ll stay available until you leave this page.</p>}
          </section>
        </div>
        <details className="test-info"><summary>Which test am I studying for?</summary><p>This app covers the 2025 test: 128 questions, up to 20 asked, and 12 correct answers required. It applies to Form N-400 applications filed on or after October 20, 2025. Earlier applicants use the 2008 test. Eligible 65/20 applicants study the 20 starred questions and answer 6 of 10 correctly.</p><p><a href="https://www.uscis.gov/citizenship-resource-center/naturalization-test-and-study-resources/2025-civics-test">Check your test version with USCIS</a>. This practice tool is independent of USCIS.</p></details>
      </main>
      <footer><p>Made for the next chapter. By <a href="https://shoaibsharif.dev">Shoaib Sharif</a>.</p><p><a href={sourceUrl}>Official question source</a> <span aria-hidden="true">·</span> <a href={updatesUrl}>USCIS answer updates</a></p><p className="hint">Hard questions are saved only in this browser. Session scores reset when you leave.</p></footer>
    </div>
  );
}
