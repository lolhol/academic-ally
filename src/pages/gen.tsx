import { useState, useEffect } from "react";
import DropdownMenu from "../components/DropdownMenu";
import css from "../styles/genStyle.module.css";
import Test from "./test";
import "bootstrap/dist/css/bootstrap.min.css";
import type PromptGPTRequest from "@/interfaces/PromptGPTRequest";
import { delay } from "./api/internal/util/TimeUtil";

export default function Gen() {
  const [isGenerated, setGen] = useState(false);
  const [lessonName, setLessonName] = useState("NONE");
  const [chapter, setChapter] = useState("NONE");
  const [question, setQ] = useState("NONE");
  const [answers, setA] = useState<string[]>([]);
  const [isDone, setIsDone] = useState(false); // Manage isDone as a state
  const [isRan, setIsRan] = useState(false);

  const [test, setTest] = useState(false);

  const turnOnOffTest = () => {
    setTest(!test);
  };

  const handleExecute = async (lessonName: string, chapter: string) => {
    console.log(lessonName);
    console.log(chapter);

    if (isRan) {
      return;
    }

    setIsRan(true);

    try {
      const a = JSON.stringify({
        textbook: lessonName,
        instructions: "You are a multiple choice test creator.",
        prompt:
          "Provide a challenging question from chapter " +
          chapter +
          " of The Book Theif, do not provide any anwers just simply the question. Only provide the raw question with nothing else.",
      });

      const questionResponse = await fetch("./api/getRes", {
        method: "POST",
        body: a,
      });

      const jsonQuestion = await questionResponse.json();
      console.log(jsonQuestion.val);

      const b = JSON.stringify({
        textbook: lessonName,
        instructions: "You are a multiple choice test creator.",
        prompt:
          "There are 4 people providing answers to the following question in the context of a multiple choise quiz:" +
          jsonQuestion.val +
          " You are responsible for providing the correct answer to this question. Only provide the raw answer with nothing else.",
      });

      const correctAnswerResponse = await fetch("./api/getRes", {
        method: "POST",
        body: b,
      });

      let answerchoices: string[] = [];
      const jsonCorrectAnswer = await correctAnswerResponse.json();
      answerchoices.push(jsonCorrectAnswer.val);

      console.log(jsonCorrectAnswer.val);

      for (let i = 0; i < 3; i++) {
        const c = JSON.stringify({
          textbook: lessonName,
          instructions: "You are a multiple choice test creator.",
          prompt:
            "There are 4 people providing answers to the following question in the context of a multiple choise quiz:" +
            jsonQuestion.val +
            " You are responsible for providing one of the incorrect answers to this question. Only provide the raw answer with nothing else. These are the current answers:" +
            answerchoices,
        });

        const incorrectAnswerResponse = await fetch("./api/getRes", {
          method: "POST",
          body: c,
        });

        const jsonIncorrectAnswer = await incorrectAnswerResponse.json();
        answerchoices.push(jsonIncorrectAnswer.val);
        console.log(jsonIncorrectAnswer.val);
      }

      setQ(jsonQuestion.val);
      setA(answerchoices);
      setIsDone(true); // Set isDone to true when everything is completed
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleTestExec = async (lessonName: string, chapter: string) => {
    console.log("TESTING!");

    const tokenRes = await fetch("./api/promptGPT", {
      method: "POST",
      body: JSON.stringify({
        textbook: "The-Book-Thief",
        prompt:
          "Make me a question and 4 possible answers for this. Make the question and answers separated with --- where --- is on a separate line. Remove the A, B, C, D from the answers and instead separate them with --- as well. Do not put an empty line in between question and answers.",
        chapter: "2",
      } satisfies PromptGPTRequest),
    });

    const tokenJson = await tokenRes.json();
    console.log(tokenJson);
    if (!tokenJson.success) {
      console.error("ERR!");
    } else {
      const token = tokenJson.token.toString();

      const q = JSON.stringify({
        token: token,
      });

      let curAmtReqd = 0;

      while (true) {
        const tokenRes = await fetch("./api/requestUpdate", {
          method: "POST",
          body: q,
        });

        curAmtReqd++;

        const json = await tokenRes.json();

        if (!json.responded && curAmtReqd < 20) {
          await delay(1000);
          continue;
        }

        console.log(json);

        if (json.error || curAmtReqd >= 20) {
          console.error("Error when generating!");
          break;
        }

        console.log("Success!");
        console.log("Question: " + json.question);
        console.log("Answers: " + json.answers);
        break;
      }
    }
  };

  useEffect(() => {
    if (test) {
      handleTestExec("124", "1234");
    }
  }, [test]);

  useEffect(() => {
    if (isGenerated) {
      handleExecute(lessonName, chapter);
    }
  }, [isGenerated]);

  return (
    <main>
      <div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={turnOnOffTest}
        >
          Primary
        </button>
      </div>

      {!isGenerated && (
        <div>
          <DropdownMenu
            propsClass={(buttonName: string) => {
              setLessonName(buttonName);
            }}
            propsLesson={(buttonName: string) => {
              setChapter(buttonName);
            }}
          />
          <div className={css.genButtonDiv}>
            <button className={css.genButton} onClick={() => setGen(true)}>
              GENERATE
            </button>
          </div>
        </div>
      )}

      {!isDone && isGenerated && (
        <div className={css.h1Div}>
          <h1 className={css.h1Loading}>Generating...</h1>
        </div>
      )}

      {isDone && (
        <div>
          <Test
            p={question}
            a={answers}
            callback={() => {
              setGen(false);
              setIsDone(false);
              setIsRan(false);
            }}
          />
        </div>
      )}
    </main>
  );
}
