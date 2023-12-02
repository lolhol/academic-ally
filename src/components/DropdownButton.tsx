import React, { useState } from "react";
import css from "../styles/dropdown.module.css";

interface DropdownButtonProps {
  name: string;
  onClick: (buttonName: string) => void;
}

const DropdownButton: React.FC<DropdownButtonProps> = ({ name, onClick }) => {
  return (
    <ul className={css.option}>
      <button className={css.optionButton} onClick={() => onClick(name)}>
        {name}
      </button>
    </ul>
  );
};

export default DropdownButton;
