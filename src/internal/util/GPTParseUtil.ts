// TODO: may need to fix up some stuff here

export function parseGPTResponce(res: string): string[] {
  let res_split = res.split("\n");

  console.log(res_split);

  let i = 0;
  while (i < res_split.length) {
    if (!isApplicable(res_split[i])) {
      res_split.splice(i, 1);
    } else {
      res_split[i] = cleanUpString(res_split[i]);
      i++;
    }
  }

  return res_split;
}

function isApplicable(str: string): boolean {
  if (str == " " || str == "" || str == "\n") return false;
  return true;
}

function cleanUpString(str: string): string {
  while (!isAlphabetLetter(str[0].toLowerCase())) {
    str = removeCharacterAtPosition(str, 0);
  }

  return str;
}

function removeCharacterAtPosition(
  inputString: string,
  position: number
): string {
  if (position < 0 || position >= inputString.length) {
    console.error("Invalid position");
    return inputString;
  }

  const modifiedString =
    inputString.slice(0, position) + inputString.slice(position + 1);

  return modifiedString;
}

function isAlphabetLetter(character: string): boolean {
  const alphabetPattern: RegExp = /^[a-zA-Z]$/;
  return alphabetPattern.test(character);
}

export function parseAssistentName(name: string): string[] {
  return name.split("_");
}
