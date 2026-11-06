import { useEffect, useRef, useState } from 'react';
import { sourceUrl, updatesUrl } from './lib/civic';
import { localAnswers, makeDeck, readPosition, storageKey, verifiedOn, type Mode } from './lib/study';

const modes: { id: Mode; label: string }[] = [
  { id: 'all', label: 'All questions' },
  { id: 'random', label: 'Random 20' },
  { id: 'texas', label: 'Texas & officials' },
];

function Arrow({ back = false }: { back?: boolean }) {
  return <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d={back ? 'M19 12H5m7-7-7 7 7 7' : 'M5 12h14m-7-7 7 7-7 7'} /></svg>;
}

export default function App() {
  const [mode, setMode] = useState<Mode>('all');
  const [deck, setDeck] = useState(() => makeDeck('all'));
  const [index, setIndex] = useState(readPosition);
  const [revealed, setRevealed] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const questionHeading = useRef<HTMLHeadingElement>(null);
  const answerHeading = useRef<HTMLHeadingElement>(null);
  const hasNavigated = useRef(false);
  const question = deck[index];
  const local = localAnswers[question.id];
  const last = index === deck.length - 1;

  function chooseMode(next: Mode) {
    hasNavigated.current = true;
    setMode(next);
    setDeck(makeDeck(next));
    setIndex(next === 'all' ? readPosition() : 0);
    setRevealed(false);
  }

  function move(direction: number) {
    const next = index + direction;
    if (next < 0 || next >= deck.length) return;
    hasNavigated.current = true;
    setIndex(next);
    setRevealed(false);
    if (mode === 'all') {
      try { localStorage.setItem(storageKey, JSON.stringify(next)); setStorageError(false); }
      catch { setStorageError(true); }
    }
  }

  function restart() {
    hasNavigated.current = true;
    setIndex(0);
    setRevealed(false);
    if (mode === 'random') setDeck(makeDeck('random'));
    if (mode === 'all') {
      try { localStorage.setItem(storageKey, '0'); setStorageError(false); }
      catch { setStorageError(true); }
    }
  }

  useEffect(() => {
    if (hasNavigated.current) questionHeading.current?.focus();
  }, [index, deck]);

  useEffect(() => {
    if (revealed) answerHeading.current?.focus();
  }, [revealed]);

  return (
    <div className="app">
      <a className="skip-link" href="#study">Skip to question</a>
      <header className="site-header">
        <a className="wordmark" href="/" aria-label="Civics home">civics<span className="wordmark-dot">.</span></a>
        <span className="location">Richardson, Texas</span>
      </header>

      <main id="study">
        <div className="page-heading">
          <div><p className="test-edition">U.S. citizenship · 2025 test</p><h1>Study the questions.</h1></div>
          <p className="page-note">128 questions. Answer aloud,<br />then check your answer.</p>
        </div>

        <div className="study-toolbar">
          <nav className="modes" aria-label="Question sets">{modes.map(item => <button key={item.id} aria-pressed={mode === item.id} onClick={() => chooseMode(item.id)}>{item.label}</button>)}</nav>
          <span className="deck-count">{String(index + 1).padStart(2, '0')} <span>/ {deck.length}</span></span>
        </div>

        <article className="question-sheet" aria-label="Study question">
          <div className="sheet-header"><span>{question.category}</span><span>USCIS {String(question.id).padStart(3, '0')}</span></div>
          <div className="question-content">
            <p className="section-label">{question.section}</p>
            <h2 ref={questionHeading} tabIndex={-1}>{question.question}</h2>
            <div className={`answer ${revealed ? 'is-revealed' : ''}`}>
              {!revealed ? <button className="reveal-button" onClick={() => setRevealed(true)} aria-expanded={false}>Show answer <span aria-hidden="true">↵</span></button> : <>
                <h3 ref={answerHeading} tabIndex={-1}>{local ? 'Your answer' : question.answers.length === 1 ? 'Answer' : 'Accepted answers'}</h3>
                <ul className="answer-list">{(local?.answers ?? question.answers).map((answer, i) => <li key={i}>{answer}</li>)}</ul>
                {local ? <p className="answer-note">{local.note} <a href={local.source} target="_blank" rel="noreferrer">Official source<span className="sr-only"> (opens a new tab)</span> ↗</a></p> : <p className="answer-note">{question.note || 'Give the number of answers the question asks for.'}</p>}
                {local && <p className="verification-note">Checked {new Date(`${local.verifiedOn ?? verifiedOn}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}.{question.id !== 62 && ' Confirm who is serving before your interview.'}</p>}
              </>}
            </div>
          </div>
          <div className="sheet-footer">
            <button className="previous" disabled={index === 0} onClick={() => move(-1)}><Arrow back /><span>Previous</span></button>
            <span className="position-note">{last ? 'Last question' : `${index + 1} of ${deck.length}`}</span>
            {last ? <button className="next" onClick={restart}>{mode === 'random' ? 'New 20' : 'Start again'}<Arrow /></button> : <button className="next" onClick={() => move(1)}>Next<Arrow /></button>}
          </div>
          <progress value={index + 1} max={deck.length} aria-label="Position in question set" />
        </article>

        <div className="below-sheet"><p>{mode === 'texas' ? 'Texas answers and current national officeholders.' : 'Texas answers are filled in where the official list says “answers will vary.”'}</p><span>{mode === 'all' && !storageError ? 'Place saved on this device' : 'Practice at your own pace'}</span></div>
        {storageError && <p className="storage-message" role="status">This browser couldn’t save your place. You can keep studying.</p>}
        <details className="test-details"><summary>About this test <span aria-hidden="true">+</span></summary><p>For N-400 applications filed on or after October 20, 2025. The officer asks up to 20 questions; 12 correct answers pass. This page uses all 128 questions from the official 2025 list.</p><p>Eligible 65/20 applicants have a smaller study set. <a href={sourceUrl}>See USCIS instructions</a>.</p></details>
      </main>
      <footer><span>Richardson, TX</span><div><a href={sourceUrl}>USCIS question list ↗</a><a href={updatesUrl}>Answer updates ↗</a></div></footer>
    </div>
  );
}
