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
function shuffle(array){
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}
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
    shuffle(answerchoices);
    console.log(answerchoices);
  };
