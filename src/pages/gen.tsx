import DropdownMenu from "../components/DropdownMenu";

import css from "../styles/genStyle.module.css";

export default function Gen() {
  return (
    <main>
      <div>
        <DropdownMenu />
      </div>

      <div className={css.genButton}>
        <button>GENERATE</button>
      </div>
    </main>
  );
}

const handleExecute = async () => {
    console.log("!!!!")
    const responseFromCall = await fetch("../api/getRes", {
      method: "POST",
      body: "geometry",
    });
  
    const jsonResponce = await responseFromCall.json();
  };
