interface Option {
  onClick: (buttonName: string) => void;
  name: string;
}

interface Dropdown {
  options: Option[];
  sizePx: number;
}

export default function DropDownMenu(options: Dropdown) {
  return <div>eeeeeez</div>;
}
