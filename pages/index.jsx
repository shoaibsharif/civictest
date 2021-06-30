import Head from "next/head";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { quiz } from "../lib/civic";
import produce from "immer";

export default function Home() {
  const randomInt = (max) => Math.floor(Math.random() * max);
  const randomArray = useCallback((length, max = 10) => {
    const arr = [];
    while (arr.length < length) {
      const randomNumber = randomInt(max);
      if (arr.indexOf(randomNumber) == -1) arr.push(randomNumber);
    }
    return arr;
  }, []);
  const [randomQuiz, setRandomQuiz] = useState([
    { question: "", answer: [], revealed: false },
  ]);
  useEffect(() => {
    setRandomQuiz(
      randomArray(6, 10).map((index) => ({
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
        <h1 className="text-5xl text-center">Civic test</h1>
      </header>
      <main className="max-w-3xl mx-auto px-5">
        <ul>
          {randomQuiz.map((quz, i) => (
            <li
              className="border-2 border-gray-400 mt-6 p-10 rounded-md ring ring-opacity-30"
              key={`question-${i}`}
            >
              <h2 className="text-2xl md:text-3xl">{quz.question}</h2>
              {quz.revealed ? (
                <ul>
                  {quz.answer.map((ans) => (
                    <li
                      className="mt-5 font-belleza text-xl list-disc"
                      key={`answer-${ans}`}
                    >
                      {ans}
                    </li>
                  ))}
                </ul>
              ) : (
                <button
                  className=" bg-indigo-600 px-3 py-3 rounded mt-3"
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
