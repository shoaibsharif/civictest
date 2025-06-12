import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { produce } from "immer";
import {
  Fragment,
  useEffect,
  useMemo,
  useState,
  type SetStateAction,
} from "react";
import { quiz } from "./lib/civic";

/**
 * Return a random value between 0 to max
 */
const randomInt = (max: number) => Math.floor(Math.random() * max);

/**
 * Get a random array with unique values
 * @param {number} length array length
 * @param {number} max between 0 and max number
 * @returns {number[]} an array
 */
const randomArray = (length: number, max: number = 10): number[] => {
  const arr = [];
  while (arr.length < length) {
    const randomNumber = randomInt(max);
    if (arr.indexOf(randomNumber) == -1) arr.push(randomNumber);
  }
  return arr;
};

type Quiz = (typeof quiz)[number] & { revealed: boolean };
export default function Home() {
  const [randomQuiz, setRandomQuiz] = useState<Quiz[]>([
    { question: "", answer: [], revealed: false },
  ]);
  const selections = useMemo(
    () => [
      { name: "Random 10" },
      { name: "Show All" },
      { name: "1-25" },
      { name: "26-50" },
      { name: "51-75" },
      { name: "76-100" },
    ],
    []
  );
  const [selected, setSelected] = useState(selections[0]);
  useEffect(() => {
    setRandomQuiz(
      randomArray(10, quiz.length).map((index) => ({
        ...quiz[index],
        revealed: false,
      }))
    );
  }, []);

  // show specific question's answer
  const changeRevelState = (index: number) =>
    setRandomQuiz(
      produce(
        randomQuiz,
        (draftState: { [x: string]: { revealed: boolean } }) => {
          draftState[index].revealed = true;
        }
      )
    );

  // Change display questions patter
  const changeQuestion = (value: SetStateAction<{ name: string }>) => {
    setSelected(value);
    if (value.name === "Show All") {
      setRandomQuiz(quiz.map((el: any) => ({ ...el, revealed: false })));
    } else if (value.name === "Random 10") {
      setRandomQuiz(
        randomArray(10, quiz.length).map((index) => ({
          ...quiz[index],
          revealed: false,
        }))
      );
    } else if (value.name === "1-25") {
      setRandomQuiz(
        quiz.slice(0, 24).map((el: any) => ({
          ...el,
          revealed: false,
        }))
      );
    } else if (value.name === "26-50") {
      setRandomQuiz(
        quiz.slice(25, 49).map((el: any) => ({
          ...el,
          revealed: false,
        }))
      );
    } else if (value.name === "51-75") {
      setRandomQuiz(
        quiz.slice(50, 74).map((el: any) => ({
          ...el,
          revealed: false,
        }))
      );
    } else if (value.name === "76-100") {
      setRandomQuiz(
        quiz.slice(75).map((el: any) => ({
          ...el,
          revealed: false,
        }))
      );
    }
  };
  return (
    <>
      <header className="max-w-3xl mx-auto mt-9">
        <h1 className="text-5xl text-center">Civic test 2025 (Texas)</h1>
      </header>
      <main className="max-w-3xl px-5 mx-auto my-10">
        <div className="ml-auto w-72">
          <Listbox value={selected} onChange={changeQuestion}>
            <div className="relative mt-1">
              <ListboxButton className="relative w-full py-2 pl-3 pr-10 text-left bg-gray-600 rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
                <span className="block truncate">{selected.name}</span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronUpDownIcon
                    className="w-5 h-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </ListboxButton>
              <Transition
                as={Fragment}
                enter="transition ease-in-out duration-200"
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <ListboxOptions className="absolute w-full py-1 mt-1 overflow-auto text-base bg-gray-800 rounded-md shadow-lg ring-1 ring-indigo-600 ring-opacity-5 focus:outline-none sm:text-sm">
                  {selections.map((person, personIdx) => (
                    <ListboxOption
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
                      {({ selected }) => (
                        <>
                          <span
                            className={`${
                              selected ? "font-medium" : "font-normal"
                            } block truncate`}
                          >
                            {person.name}
                          </span>
                          {selected && (
                            <span
                              className={`absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600`}
                            >
                              <CheckIcon
                                className="w-5 h-5"
                                aria-hidden="true"
                              />
                            </span>
                          )}
                        </>
                      )}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
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
      <footer className="max-w-3xl px-5 mx-auto my-10 text-center">
        <p>
          The questions are preparation for USCIS citizenship 100 civic test.
          You can find these questions from{" "}
          <a
            href="https://www.uscis.gov/citizenship/find-study-materials-and-resources/study-for-the-test/100-civics-questions-and-answers-with-mp3-audio-english-version"
            className="text-yellow-700 transition duration-300 hover:shadow-underline"
          >
            USCIS website
          </a>
        </p>
        <p>
          Website has been built by &nbsp;
          <a
            href="https://shoaibsharif.dev"
            className="text-yellow-700 transition duration-300 hover:shadow-underline"
          >
            Shoaib Sharif
          </a>
        </p>
      </footer>
    </>
  );
}
