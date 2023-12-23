import * as fs from "fs";

export default class QAStorage {
  private fileLoc: string = "./public/qadata/data.json";

  public addToFile(
    question: string,
    answers: string[],
    book: string,
    chapter: number
  ) {
    const filePath = "./public/qadata/" + book + "_" + chapter + ".json";
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, "{'end': ['0']}", "utf-8");
    }

    const readData: Buffer = fs.readFileSync(filePath);
    let json: { [key: string]: string[] } = JSON.parse(readData.toString());
    const lastElemSpot = json["end"][1] + 1;
    let arr = [];
    arr.push(question);
    arr.concat(answers);
    json[lastElemSpot] = arr;

    const stringVers = JSON.stringify(json);
    fs.writeFileSync(filePath, stringVers);
  }
}
