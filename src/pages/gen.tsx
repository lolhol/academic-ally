import { useState } from "react";
import DropdownMenu from "../components/DropdownMenu";

import css from "../styles/genStyle.module.css";
import Test from "./test";

let prompt: string;
let results: string[];

let isDone = false;
let c = 0;

export default function Gen() {
  const [isGenerated, setGen] = useState(false);

  const [lessonName, setLessonName] = useState("NONE");

  const [chapter, setChapter] = useState("NONE");

  return (
    <main>
      {!isGenerated && (
        <>
          <div>
              <DropdownMenu propsClass={function (buttonName: string): void {
                setLessonName(buttonName);
              } } propsLesson={function (buttonName: string): void {
                setChapter(buttonName);
              } } />

              <button onClick={() => { 
                setGen(true);
                handleExecute(lessonName, chapter); 
              } }>GENERATE</button>
          </div>
        </>
      )}

      {isGenerated && isDone && (
        <>
          <script>
            console.log(
              "!!!!"
            )
          </script>
          <div>
            <Test p={prompt} a={results} callback={function (): void {
              setGen(false);
            } } />
          </div>
        </>
      )}
    </main>
  );
}

const handleExecute = async (lessonName: string, chapter: string) => {
  if (c >= 1) {
    return;
  }

  console.log(lessonName)
  console.log(chapter)

  let a = JSON.stringify({
    textbook: lessonName,
    instructions: "You are a multiple choice test creator.",
    prompt: "Provide a challenging question from chapter " + chapter + " of The Book Theif, do not provide any anwers just simply the question. Only provide the raw question with nothing else."
  });

  const question = await fetch("./api/getRes", {
    method: "POST",
    body: a
  })


  const jsonQuestion = await question.json();
  console.log(jsonQuestion.val);

  let b = JSON.stringify({
    textbook: lessonName,
    instructions: "You are a multiple choice test creator.",
    prompt: "There are 4 people providing answers to the following question in the context of a multiple choise quiz:" + jsonQuestion.val +" You are responsible for providing the correct answer to this question. Only provide the raw answer with nothing else.",
  })

  const correctanswer = await fetch("./api/getRes", {
    method: "POST",
    body: b
  })

  let answerchoices = [];
  const jsonCorrectAnswer = await correctanswer.json();
  answerchoices.push(jsonCorrectAnswer.val);
  
  console.log(jsonCorrectAnswer.val);

  for (let i = 0; i < 3; i++){
    let c = JSON.stringify({
      textbook: lessonName,
      instructions: "You are a multiple choice test creator.",
      prompt: "There are 4 people providing answers to the following question in the context of a multiple choise quiz:" + jsonQuestion.val +" You are responsible for providing one of the incorrect answers to this question. Only provide the raw answer with nothing else.",
    })

    const Incorrectanswer = await fetch("./api/getRes", {
      method: "POST",
      body: c
    })

    const jsonIncorrectAnswer = await Incorrectanswer.json();
    answerchoices.push(jsonIncorrectAnswer.val);
    console.log(jsonIncorrectAnswer.val);
  }
  
  results = answerchoices;
  prompt = jsonQuestion.val;
  isDone = true;
};
