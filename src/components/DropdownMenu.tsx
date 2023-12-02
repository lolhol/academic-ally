import React, { useState } from 'react';
import css from "../styles/dropdown.module.css"

const DropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const button = (type: string) => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={css.dropDownDiv}>
        <button className={css.dropdownToggle} onClick={toggleMenu}>
            {!isOpen && (
                <div className={css.innerCssText}>
                    🔽 Class 🔽
                </div>
            )}

            {isOpen && (
                <div className={css.innerCssText}>
                    🔼 Class 🔼
                </div>
            )}
        </button>

        {isOpen && (

        )}
    </div>
  );
};

export default DropdownMenu;