import css from "../styles/quixComponent.module.css";
import ClickableOption from "./ClickableOption";

interface QuizComponentProps {
  prompt: string;
  answers: string[];
}

const QuizComponent: React.FC<QuizComponentProps> = ({ prompt, answers }) => {
  return (
    <div className={css.main}>
      <div className={css.prompt}>{prompt}</div>
      <div className={css.answer}>
        <div className={css.text}>
          <ClickableOption name={"a"} /> {answers[0]}
        </div>
      </div>
      <div className={css.answer}>
        <div className={css.text}>
          <ClickableOption name={"b"} /> {answers[1]}
        </div>
      </div>

      <div className={css.answer}>
        <div className={css.text}>
          <ClickableOption name={"c"} /> {answers[2]}
        </div>
      </div>

      <div className={css.answer}>
        <div className={css.text}>
          <ClickableOption name={"d"} /> {answers[3]}
        </div>
      </div>

      <div></div>
    </div>
  );
};

export default QuizComponent;
