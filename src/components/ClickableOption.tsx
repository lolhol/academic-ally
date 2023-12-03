import { useState } from "react";
import css from "../styles/clickableComponent.module.css";

interface ClickableOptionProps {
  name: string;
}

const ClickableOption: React.FC<ClickableOptionProps> = ({ name }) => {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(!clicked);
  };
  return (
    <button
      className={
        !clicked ? css.buttonComponent : css.buttonComponentColorChange
      }
      onClick={handleClick}
    >
      {name}
    </button>
  );
};

export default ClickableOption;
