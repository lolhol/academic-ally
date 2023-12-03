import { useState } from "react";
import DropdownMenu from "../components/DropdownMenu";

import css from "../styles/genStyle.module.css";

let prompt: string;
let results: string[];

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
                console.log(chapter);
              } } />

              <button onClick={() => { 
                setGen(true);
                handleExecute(lessonName, chapter); 
              } }>GENERATE</button>
          </div>
        </>
      )}

      {isGenerated && (
        <>
          <div>
            
          </div>
        </>
      )}
    </main>
  );
}

//<button onClick={() => {handleExecute();}}>GENERATE</button> 
// </div><div className={css.genButton}>

const handleExecute = async (lesson: string, chapter: string) => {
    let a = JSON.stringify({
      textbook: lesson,
      instructions: "given the textbook generate a random problem based on the question. Only include the question",
      prompt: "write a multiple choice problem on chapter " + chapter + " in the Book Thief. Do not provide answer choices, however, or A B C and D. Just provide the question."
    });

    const question = await fetch("./api/getRes", {
      method: "POST",
      body: a
    })

  
    const jsonQuestion = await question.json();
    console.log(jsonQuestion.val);

    let b = JSON.stringify({
      textbook: lesson,
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
        textbook: lesson,
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

    prompt = jsonQuestion.val;
    results = answerchoices;

    //console.log(answerchoices);
};
