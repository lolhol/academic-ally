import React, { useState } from 'react';
import css from "../styles/dropdown.module.css"

const DropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={css.dropDownDiv}>
        <button className={css.dropdownToggle}>
            <div className={css.innerCss}>
                🔽
            </div>
            <div className={css.innerCss}>
                Class
            </div>
        </button>
    </div>
  );
};

export default DropdownMenu;