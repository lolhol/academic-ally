import * as fs from "fs";

// TODO: make @this (its 2am rn not gon do today)
export default class QAStorage {
  private fileLoc: string = "./public/qadata/data.json";

  public addToFile(question: string, answers: string[]) {
    let jsonData = fs.readFileSync(this.fileLoc, "utf-8");
    let data = JSON.parse(jsonData);
  }
}
