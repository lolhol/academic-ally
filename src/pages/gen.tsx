import { useState } from "react";
import DropdownMenu from "../components/DropdownMenu";

import css from "../styles/genStyle.module.css";

export default function Gen() {
  const [lessonName, setLessonName] = useState("NONE");

  const [chapter, setChapter] = useState("NONE");

  return (
    <main>
      <div>
        <DropdownMenu propsClass={function (buttonName: string): void {
          setLessonName(buttonName);
        } } propsLesson={function (buttonName: string): void {
          setChapter(buttonName)
          console.log(chapter);
        } } />
      </div>

      <div className={css.genButton}>
        
      </div>
    </main>
  );
}

//<button onClick={() => {handleExecute();}}>GENERATE</button>

const handleExecute = async () => {
    let a = JSON.stringify({
      textbook: "Book Thief",
      instructions: "given the textbook generate a random problem based on the question. Only include the question",
      prompt: "write a multiple choice problem on chapter 6 in the Book Thief. Do not provide answer choices, however, or A B C and D. Just provide the question."
    });

    const question = await fetch("./api/getRes", {
      method: "POST",
      body: a
    })

  
    const jsonQuestion = await question.json();
    console.log(jsonQuestion.val);

    let b = JSON.stringify({
      textbook: "Book Thief",
      instructions: "only include the answer to the question in your response. Do not include anything else",
      prompt: "generate the correct answer to the question " + jsonQuestion.val,
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
        textbook: "Book Thief",
        instructions: "only include the answer to the question in your response. Do not include anything else",
        prompt: "generate an incorrect but reasonable answer to the question " + jsonQuestion.val,
      })
  
      const Incorrectanswer = await fetch("./api/getRes", {
        method: "POST",
        body: c
      })
  
      const jsonIncorrectAnswer = await Incorrectanswer.json();
      answerchoices.push(jsonIncorrectAnswer.val);
      console.log(jsonIncorrectAnswer.val);
    }

    console.log(answerchoices);
  };
