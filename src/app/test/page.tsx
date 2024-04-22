"use client";

import DropDownMenu from "../components/DropDownMenu";
import css from "./page.module.css";

export default function Tests() {
  const handleOptionClick = (option: string) => {
    console.log("!!!");
  };

  const options = [
    {
      text: "Option 1",
      onClick: handleOptionClick,
    },
    { text: "Option 2", onClick: handleOptionClick },
  ];

  return (
    <main className={css["main-div"]}>
      <div className={css["width-div"]}></div>
    </main>
  );
}
//<DropDownMenu options={options} defaultText={"123"} />
