import DropdownMenu from "../components/DropdownMenu";

import css from "../styles/genStyle.module.css";

export default function Gen() {
  return (
    <main>
      <div>
        <DropdownMenu />
      </div>

      <div className={css.genButton}>
        <button onClick={() => {handleExecute();}}>GENERATE</button>
      </div>
    </main>
  );
}

const handleExecute = async () => {
    let a = JSON.stringify({
      textbook: "Book Thief",
      instructions: "You are a multiple choise test creator.",
      prompt: "Provide a challenging question from chapter 6 of The Book Theif, do not provide any anwers just simply the question. Only provide the raw question with nothing else."
    });

    const question = await fetch("./api/getRes", {
      method: "POST",
      body: a
    })

  
    const jsonQuestion = await question.json();
    console.log(jsonQuestion.val);

    let b = JSON.stringify({
      textbook: "Book Thief",
      instructions: "You are a multiple choise test creator.",
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
        textbook: "Book Thief",
        instructions: "You are a multiple choise test creator.",
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
    
    console.log(answerchoices);
  };
