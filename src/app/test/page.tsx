"use client";

import DropDownMenu from "../components/DropDownMenu";

export default function Tests() {
  const handleOptionClick = (option: string) => {
    console.log("!!!");
  };

  const options = [
    { text: "Option 1", onClick: handleOptionClick },
    { text: "Option 2", onClick: handleOptionClick },
  ];

  return (
    <main>
      <DropDownMenu options={options} />
    </main>
  );
}
