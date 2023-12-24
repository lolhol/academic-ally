import * as fs from "fs";
import { random } from "lodash";

export default class QAStorage {
  public addToFile(
    question: string,
    answers: string[],
    book: string,
    chapter: string
  ) {
    const filePath = "./public/qadata/" + book + "_" + chapter + ".json";
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, '{"iter": []}', "utf-8");
    }

    const readData: Buffer = fs.readFileSync(filePath);
    let json: { [key: string]: string[] } = JSON.parse(readData.toString());
    if (json[question] === undefined) {
      json[question] = answers;
    }

    json["iter"].push(question);

    fs.writeFileSync(filePath, JSON.stringify(json));
  }

  public getRandomQA(book: string, chapter: number): string[] {
    const filePath = "./public/qadata/" + book + "_" + chapter + ".json";
    if (!fs.existsSync(filePath)) {
      return [""];
    }

    const readData: Buffer = fs.readFileSync(filePath);
    let json: { [key: string]: string[] } = JSON.parse(readData.toString());
    let jsonLen = json["iter"].length;
    return json[json["iter"][random(jsonLen)]];
  }
}
