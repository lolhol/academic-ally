import { useEffect, useState } from "react";
import css from "../styles/quixComponent.module.css";
import ClickableOption from "./ClickableOption";

let isDone = false;

interface QuizComponentProps {
  prompt: string;
  answers: string[];
  callback: () => void;
}

const QuizComponent: React.FC<QuizComponentProps> = ({
  prompt,
  answers,
  callback,
}) => {
  const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);

  useEffect(() => {
    const shuffled = [...answers].sort(() => Math.random() - 0.5);
    setShuffledAnswers(shuffled);
  }, [answers]);

  const handleDone = (selectedAnswer: string) => {
    setTimeout(() => {
      if (selectedAnswer === answers[0]) {
        alert("Correct!");
      } else {
        alert("Incorect!");
      }

      callback();
    }, 100);
  };

  return (
    <div className={css.main}>
      <div className={css.prompt}>{prompt}</div>
      {shuffledAnswers.map((answer, index) => (
        <div className={css.answer} key={index}>
          <div className={css.text}>
            <ClickableOption
              name={String.fromCharCode(97 + index)}
              onClick={(state: boolean, callback) => {
                if (!state) {
                  if (answer == answers[0]) {
                    callback("GREEN");
                    handleDone(answer);
                  } else {
                    callback("RED");
                  }
                }
              }}
            />{" "}
            {answer}
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuizComponent;
