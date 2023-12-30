import * as fs from "fs";
import { random } from "lodash";
import Assistant from "../Assistant";

export default class QAStorage {
  private cleanerMap: Map<string, Assistant> = new Map();

  public addToFile(
    question: string,
    answers: string[],
    book: string,
    chapter: number
  ) {
    const filePath = "./public/qadata/" + book + "_" + chapter + ".json";
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, '{"iter": []}', "utf-8");
    }

    const readData: Buffer = fs.readFileSync(filePath);
    let json: { [key: string]: string[] } = JSON.parse(readData.toString());
    if (json[question] === undefined) {
      json[question] = answers;
      json["iter"].push(question);
    }

    fs.writeFileSync(filePath, JSON.stringify(json));
  }

  private getFileContents(book: string, chapter: number): string {
    const filePath = "./public/qadata/" + book + "_" + chapter + ".json";
    if (!fs.existsSync(filePath)) {
      return "";
    }
    const readData: Buffer = fs.readFileSync(filePath);

    return readData.toString();
  }

  public getRandomQA(book: string, chapter: number): string[] {
    const readData = this.getFileContents(book, chapter);
    let json: { [key: string]: string[] } = JSON.parse(readData.toString());
    let jsonLen = json["iter"].length;
    return json[json["iter"][random(jsonLen)]];
  }

  public initQAStorageCleaners(cleaners: [Assistant]) {
    for (let i = 0; i < cleaners.length; i++) {
      const cleaner: Assistant = cleaners[i];
      this.cleanerMap.set(cleaner.name, cleaner);
    }
  }

  public cleanerRes(res: string, id: string) {}
}
