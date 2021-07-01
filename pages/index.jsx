import Head from "next/head";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { quiz } from "../lib/civic";
import produce from "immer";

export default function Home() {
  /**
   * Return a random value between 0 to max
   * @param {number} max
   * @returns {number}
   */
  const randomInt = (max) => Math.floor(Math.random() * max);

  /**
   * Get a random array with unique value
   * @param {number} length array length
   * @param {number} max between 0 and max number
   * @returns {number[]} an array
   */
  const randomArray = (length, max = 10) => {
    const arr = [];
    while (arr.length < length) {
      const randomNumber = randomInt(max);
      if (arr.indexOf(randomNumber) == -1) arr.push(randomNumber);
    }
    return arr;
  };
  const [randomQuiz, setRandomQuiz] = useState([
    { question: "", answer: [], revealed: false },
  ]);
  useEffect(() => {
    setRandomQuiz(
      randomArray(10, quiz.length).map((index) => ({
        ...quiz[index],
        revealed: false,
      }))
    );
  }, []);
  const changeRevelState = (index) =>
    setRandomQuiz(
      produce(randomQuiz, (draftState) => {
        draftState[index].revealed = true;
      })
    );

  return (
    <>
      <Head>
        <title>USCIS Civic Test</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Belleza&family=Open+Sans:ital,wght@0,300;0,400;0,600;1,300&family=Roboto:wght@300;400&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      <header className="max-w-3xl mx-auto mt-9">
        <h1 className="text-5xl text-center">Civic test 2021 (California)</h1>
      </header>
      <main className="max-w-3xl px-5 mx-auto">
        <ul>
          {randomQuiz.map((quz, i) => (
            <li
              className="p-10 mt-6 border-2 border-gray-400 rounded-md ring ring-opacity-30"
              key={`question-${i}`}
            >
              <h2 className="text-2xl md:text-3xl">{quz.question}</h2>
              {quz.revealed ? (
                <ul>
                  {quz.answer.map((ans) => (
                    <li
                      className="mt-5 text-xl list-disc font-belleza"
                      key={`answer-${ans}`}
                    >
                      {ans}
                    </li>
                  ))}
                </ul>
              ) : (
                <button
                  className="px-3 py-3 mt-3 bg-indigo-600 rounded "
                  onClick={() => changeRevelState(i)}
                >
                  Reveal the answer
                </button>
              )}
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
