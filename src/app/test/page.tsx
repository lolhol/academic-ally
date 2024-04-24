"use client";

import DropDownMenu from "../components/DropDownMenu";
import css from "./page.module.css";
import "../globals.css";
import DeleteIcon from "@mui/icons-material/Delete";
import { Icon, IconButton } from "@mui/material";
import { DeleteForever } from "@mui/icons-material";

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
      <DeleteIcon />
      <DeleteForever />
    </main>
  );
}
//<DropDownMenu options={options} defaultText={"123"} />
