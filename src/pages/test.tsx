import DropdownMenu from "../components/DropdownMenu";
import Link from "../../node_modules/next/link";

import css from "../styles/genStyle.module.css";
import QuizComponent from "@/components/QuizComponent";

interface TestProps {
  p: string;
  a: string[];
  callback: () => void;
}

const Test: React.FC<TestProps> = (props) => {
  const { p, a, callback } = props;

  return (
    <main>
      <div className={css.box}>
        <QuizComponent
          prompt={p}
          answers={[a[0], a[1], a[2], a[3]]}
          callback={callback}
        />
      </div>
    </main>
  );
};

export default Test;
