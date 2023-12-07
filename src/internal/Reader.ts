import fs from "fs";

export default class Reader {
  public file = "";
  public constructor(file: string) {
    this.file = file;
  }

  public read(): string {
    fs.readFile(this.file, "utf8", (data) => {
      return data;
    });

    return "";
  }
}
