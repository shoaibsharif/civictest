import Head from "next/head";
import { Fragment, useEffect, useState } from "react";
import { quiz } from "../lib/civic";
import produce from "immer";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";

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
  const people = [
    { name: "Random 10" },
    { name: "Show All" },
    { name: "1-25" },
    { name: "26-50" },
    { name: "51-75" },
    { name: "76-100" },
  ];
  const [selected, setSelected] = useState(people[0]);
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
  const changeQuestion = (value) => {
    setSelected(value);
    if (value.name === "Show All") {
      setRandomQuiz(quiz.map((el) => ({ ...el, revealed: false })));
    } else if (value.name === "Random 10") {
      setRandomQuiz(
        randomArray(10, quiz.length).map((index) => ({
          ...quiz[index],
          revealed: false,
        }))
      );
    } else if (value.name === "1-25") {
      setRandomQuiz(
        quiz.slice(0, 24).map((el) => ({
          ...el,
          revealed: false,
        }))
      );
    } else if (value.name === "26-50") {
      setRandomQuiz(
        quiz.slice(25, 49).map((el) => ({
          ...el,
          revealed: false,
        }))
      );
    } else if (value.name === "51-75") {
      setRandomQuiz(
        quiz.slice(50, 74).map((el) => ({
          ...el,
          revealed: false,
        }))
      );
    } else if (value.name === "76-100") {
      setRandomQuiz(
        quiz.slice(75).map((el) => ({
          ...el,
          revealed: false,
        }))
      );
    }
  };
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
      <main className="max-w-3xl px-5 mx-auto mt-10">
        <div className="w-72 ml-auto">
          <Listbox value={selected} onChange={changeQuestion}>
            <div className="relative mt-1">
              <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-gray-600 rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
                <span className="block truncate">{selected.name}</span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <SelectorIcon
                    className="w-5 h-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-gray-800 rounded-md shadow-lg ring-1 ring-indigo-600 ring-opacity-5 focus:outline-none sm:text-sm">
                  {people.map((person, personIdx) => (
                    <Listbox.Option
                      key={personIdx}
                      className={({ active }) =>
                        `${
                          active
                            ? "text-amber-900 bg-amber-100"
                            : "text-gray-300"
                        }
                          cursor-default select-none relative py-2 pl-10 pr-4`
                      }
                      value={person}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={`${
                              selected ? "font-medium" : "font-normal"
                            } block truncate`}
                          >
                            {person.name}
                          </span>
                          {selected ? (
                            <span
                              className={`${
                                active ? "text-amber-600" : "text-amber-600"
                              }
                                absolute inset-y-0 left-0 flex items-center pl-3`}
                            >
                              <CheckIcon
                                className="w-5 h-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>

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
