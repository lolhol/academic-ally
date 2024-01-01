import { useState, useEffect } from "react";
import DropdownMenu from "../components/DropdownMenu";
import css from "../styles/genStyle.module.css";
import Test from "./test";
import "bootstrap/dist/css/bootstrap.min.css";
import type PromptGPTRequest from "@/interfaces/PromptGPTRequest";
import { delay } from "../internal/util/TimeUtil";

export default function Gen() {
  const [isGenerated, setGen] = useState(false);
  const [lessonName, setLessonName] = useState("NONE");
  const [chapter, setChapter] = useState("NONE");
  const [question, setQ] = useState("NONE");
  const [answers, setA] = useState<string[]>([]);
  const [isDone, setIsDone] = useState(false); // Manage isDone as a state
  const [isRan, setIsRan] = useState(false);
  const [prevToken, setToken] = useState("0000");

  const [test, setTest] = useState(false);
  const [cleanerTest, setCleanerTestState] = useState(false);

  const turnOnOffTestClean = () => {
    setCleanerTestState(!cleanerTest);
  };

  const turnOnOffTestMain = () => {
    setTest(!test);
  };

  const handleTestExec = async (lessonName: string, chapter: string) => {
    console.log("TESTING!");

    const tokenRes = await fetch("./api/gpt/startGenMultiChoice", {
      method: "POST",
      body: JSON.stringify({
        textbook: "The-Book-Thief",
        chapter: "2",
        token: prevToken,
      } satisfies PromptGPTRequest),
    });

    const tokenJson = await tokenRes.json();
    //console.log(tokenJson);
    if (!tokenJson.success) {
      console.error("ERR!");
    } else {
      if (tokenJson.generating) {
        console.log("ALREADY GENERATING!");
      }

      const token = tokenJson.token.toString();

      const q = JSON.stringify({
        token: token,
      });

      let curAmtReqd = 0;

      while (true) {
        const tokenRes = await fetch("./api/gpt/requestUpdate", {
          method: "POST",
          body: q,
        });

        curAmtReqd++;

        const json = await tokenRes.json();
        //console.log(json);

        if (!json.responded && curAmtReqd < 20) {
          await delay(1000);
          continue;
        }

        if (json.error || curAmtReqd >= 20) {
          console.error("Error when generating!");
          break;
        }

        console.log("Success!");
        console.log("Question: " + json.question);
        console.log("Answers: " + json.answers);
        break;
      }

      setToken(token);
    }
  };

  const handleCleanerTestExec = async (lessonName: string, chapter: string) => {
    console.log("TESTING CLEAN!");

    const tokenRes = await fetch("./api/gpt/testCleaners", {
      method: "POST",
      body: JSON.stringify({
        textbook: "The-Book-Thief",
        chapter: "2",
        token: prevToken,
      } satisfies PromptGPTRequest),
    });
  };

  useEffect(() => {
    if (test) {
      handleTestExec("124", "1234");
      turnOnOffTestMain();
    }

    if (cleanerTest) {
      handleCleanerTestExec("124", "1234");
      turnOnOffTestClean();
    }
  }, [test, cleanerTest]);

  return (
    <main>
      <div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={turnOnOffTestClean}
        >
          TEST CLEAN
        </button>
      </div>

      <div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={turnOnOffTestMain}
        >
          TEST MAIN
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
