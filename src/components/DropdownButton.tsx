import React, { useState } from 'react';
import css from "../styles/dropdown.module.css"

const DropdownButton = (name: string) => {
  return (
    <ul className={css.option}>
        <button className={css.optionButton}>
            name
        </button>
    </ul>
  )
};

export default DropdownButton;