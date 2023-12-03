import { useState } from "react";
import css from "../styles/clickableComponent.module.css";

interface ClickableOptionProps {
  name: string;
  onClick: (state: boolean, callBack: CallbackFunction) => void;
}

type CallbackFunction = (state: boolean) => void;

const ClickableOption: React.FC<ClickableOptionProps> = ({ name, onClick }) => {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(!clicked);
  };

  const callback = (state: boolean) => {
    setClicked(state);
  };

  const getClickState = () => {
    return clicked;
  };

  return (
    <button
      className={
        !clicked ? css.buttonComponentSame : css.buttonComponentColorChange
      }
      onClick={() => {
        handleClick();

        setTimeout(() => {
          onClick(clicked, callback);
        }, 100);
      }}
    >
      {name}
    </button>
  );
};

export default ClickableOption;
