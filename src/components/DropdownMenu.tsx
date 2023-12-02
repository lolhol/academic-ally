import React, { useState } from "react";
import css from "../styles/dropdown.module.css";
import DropdownButton from "./DropdownButton";

const DropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    if (!isLessonMenuOpen) setIsOpen(!isOpen);
  };

  const [name, setName] = useState("Select Class");
  const handleButtonClick = (buttonName: string) => {
    setName(buttonName);
    setIsOpen(false);
  };

  const [isLessonMenuOpen, setLessonOpen] = useState(false);
  const toggleLessonMenuOpen = () => {
    if (!isOpen) setLessonOpen(!isLessonMenuOpen);
  };

  const [lessonSelected, setLessonSelected] = useState("?");

  const handleLessonButtonClick = (lesson: string) => {
    setLessonSelected(lesson);
    setLessonOpen(false);
  };

  return (
    <div className={css.dropDownDiv}>
      <div className={css.dropdownToggle}>
        <div className={css.mainDiv}>
          <button className={css.dropdownToggleButton} onClick={toggleMenu}>
            {!isOpen && <div className={css.innerCssText}>🔽 {name} 🔽</div>}

            {isOpen && <div className={css.innerCssText}>🔼 {name} 🔼</div>}
          </button>

          <div className={css.buttonInnerI}>
            {name != "Select Class" && (
              <>
                <button
                  className={css.lessonDropDown}
                  onClick={toggleLessonMenuOpen}
                >
                  {lessonSelected}
                </button>

                {isLessonMenuOpen && !isOpen && (
                  <>
                    <DropdownButton
                      name={"1"}
                      onClick={handleLessonButtonClick}
                    />

                    <DropdownButton
                      name={"2"}
                      onClick={handleLessonButtonClick}
                    />

                    <DropdownButton
                      name={"3"}
                      onClick={handleLessonButtonClick}
                    />
                  </>
                )}
              </>
            )}
          </div>

          <div className={css.dropdownToggleButton1}>
            <div>
              {isOpen && (
                <>
                  <DropdownButton name={"Chem"} onClick={handleButtonClick} />
                  <DropdownButton
                    name={"Geometry"}
                    onClick={handleButtonClick}
                  />
                  <DropdownButton
                    name={"AP World History"}
                    onClick={handleButtonClick}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DropdownMenu;
