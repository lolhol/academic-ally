import { useState } from "react";
import css from "../styles/clickableComponent.module.css";

interface ClickableOptionProps {
  name: string;
  onClick: (state: boolean, callBack: CallbackFunction) => void;
}

type CallbackFunction = (state: string) => void;

const ClickableOption: React.FC<ClickableOptionProps> = ({ name, onClick }) => {
  const [clicked, setClicked] = useState("NONE");

  const callback = (state: string) => {
    setClicked(state);
  };

  const getClickState = () => {
    return clicked;
  };

  return (
    <button
      className={
        clicked == "RED"
          ? css.buttonComponentRED
          : clicked == "GREEN"
          ? css.buttonComponentColorGREEN
          : css.buttonComponentColorDEFAULT
      }
      onClick={() => {
        onClick(true, callback);
      }}
    >
      {name}
    </button>
  );
};

export default ClickableOption;
