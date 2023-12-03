import DropdownMenu from "../components/DropdownMenu";
import Link from "../../node_modules/next/link";

import css from "../styles/genStyle.module.css";
import QuizComponent from "@/components/QuizComponent";

export default function Test() {
  return (
    <main>
      <div className={css.box}>
        <QuizComponent
          prompt={"idfnj"}
          answers={[
            "jndjnfndfjnjijsdnfjdsjfnhdsbfhjdbsjhdbfhjsdbfjbsjbfjbhsdhjfbsdjbdfsjhbfjhdsbjhdfbjsdbfhjsdbiljsdbfhjlksbdklfhskdhoidfiohfgdsjdfsgiougfdhoadgojhgdfsjhsdfg;sdfglkjhsdfgkjlhsdfgklhjfgsdjkhlfdgshkjldfshkjlsdfgklhjdfgskhjldsfgkjlhdfgkhjlsgdfkhjlgfsdkjlhgdfskljsdkjhfdsgkhjldsfgkhjlsdfgjklhsfgdkjlhgdsfkj",
            "jdnjsjnf",
            "dnjnfdjnjdnf",
            "sjdnfjndfn",
          ]}
        />
      </div>
    </main>
  );
}
