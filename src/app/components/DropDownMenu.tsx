"use client";

import { useState } from "react";
import css from "./DropDownMenu.module.css";

interface Option {
  onClick: (buttonName: string) => void;
  text: string;
}

interface OptionsCollection {
  options: Option[];
  defaultText: string;
}

export default function DropDownMenu(options: OptionsCollection) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isHoveringOverDiv, setHoveringOverDiv] = useState(false);
  const [buttonText, setButtonText] = useState(options.defaultText);

  const handleOptionClick = (option: string) => {
    // TODO: this will need to be re-coded
    for (let i = 0; i < option.length; i++) {
      if (options.options[i].text == option) {
        options.options[i].onClick(option);
        break;
      }
    }
  };

  return (
    <div
      className={css["dropdown-main"]}
      onMouseEnter={() => setHoveringOverDiv(true)}
      onMouseLeave={() => {
        if (isDropdownOpen) {
          setDropdownOpen(false);
        }

        setHoveringOverDiv(false);
      }}
    >
      <button
        className={css["dropdown-main-button"]}
        onMouseEnter={() => setDropdownOpen(true)}
      >
        {buttonText}
      </button>

      {isDropdownOpen && (
        <div
          onMouseLeave={() => {
            setDropdownOpen(false);
          }}
          className={css["dropdown-options-div"]}
        >
          <div
            className={
              !isDropdownOpen
                ? css["dropdown-main-button-border-default"]
                : css["dropdown-main-button-border-open"]
            }
          ></div>

          {options.options.map((option) => (
            <>
              {option.text != buttonText && (
                <div className={css["inner-div"]}>
                  <button
                    className={css["dropdown-option-button"]}
                    onClick={() => {
                      handleOptionClick(option.text);
                      setButtonText(option.text);
                      setDropdownOpen(false);
                    }}
                  >
                    {option.text}
                  </button>
                </div>
              )}
            </>
          ))}
        </div>
      )}
    </div>
  );
}
