import * as fs from "fs";
import { random, remove } from "lodash";
import Assistant from "../Assistant";
import { parseAssistentName, parseGPTResponce } from "../util/GPTParseUtil";
import { getCleanerPrompt } from "../prompt/promptMakerUtil";

type StorageType = { [key: string]: string[] };

export default class QAStorage {
  private cleanerMap: Assistant[] = [];

  public addToFile(
    question: string,
    answers: string[],
    book: string,
    chapter: number
  ) {
    const filePath = this.getFilePath(book, chapter);

    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, '{"iter": []}', "utf-8");
    }

    const readData: Buffer = fs.readFileSync(filePath);
    let json: StorageType = JSON.parse(readData.toString());
    if (json[question] === undefined) {
      json[question] = answers;
      json["iter"].push(question);
    }

    this.write(json, book, chapter);
  }

  private write(data: StorageType, book: string, chapter: number) {
    fs.writeFileSync(
      this.getFilePath(book, chapter),
      JSON.stringify(data, undefined, 2)
    );
  }

  private getFilePath(book: string, chapter: number): string {
    return (
      "./public/qadata/" +
      book.toLowerCase() +
      "_" +
      chapter.toString() +
      ".json"
    );
  }

  private getFileContents(book: string, chapter: number): string {
    const filePath = this.getFilePath(book, chapter);
    if (!fs.existsSync(filePath)) {
      return "";
    }
    const readData: Buffer = fs.readFileSync(filePath);

    return readData.toString();
  }

  public getRandomQA(book: string, chapter: number): string[] {
    const readData = this.getFileContents(book, chapter);
    let json: StorageType = JSON.parse(readData);
    let jsonLen = json["iter"].length;
    return json[json["iter"][random(jsonLen)]];
  }

  public initQAStorageCleaners(cleaners: Assistant[]) {
    for (let i = 0; i < cleaners.length; i++) {
      const cleaner: Assistant = cleaners[i];
      this.cleanerMap.push(cleaner);
      cleaner.isInStandByMode = true;
    }
  }

  public getQuestionsFromTextbookString(
    textbook: string,
    chapter: number
  ): string {
    const textbookChapterContent: StorageType = JSON.parse(
      this.getFileContents(textbook, chapter)
    );

    const iterativeListOfChapterContent: string[] =
      textbookChapterContent["iter"];

    let returnQuestionString = "";
    for (let i = 0; i < iterativeListOfChapterContent.length; i++) {
      returnQuestionString =
        returnQuestionString +
        iterativeListOfChapterContent[i] +
        (i == iterativeListOfChapterContent.length - 1 ? "" : " ");
    }

    return returnQuestionString;
  }

  private isExistsDataOn(book: string, chapter: number): boolean {
    const filePath = this.getFilePath(book, chapter);
    return fs.existsSync(filePath);
  }

  // Assuming TEXTBOOK_NUMBER
  public cleanStarage() {
    for (let [key, value] of this.cleanerMap.entries()) {
      const assistentNameParsed: string[] = parseAssistentName(value.name);
      if (
        this.isExistsDataOn(
          assistentNameParsed[0],
          Number.parseInt(assistentNameParsed[1])
        )
      ) {
        value.isInStandByMode = false;
        value.addToQueue(
          getCleanerPrompt(
            this.getQuestionsFromTextbookString(
              assistentNameParsed[0],
              Number.parseInt(assistentNameParsed[1])
            )
          ),
          "0000"
        );

        console.log(
          "Added cleaner: " +
            assistentNameParsed[0] +
            " " +
            assistentNameParsed[1]
        );
      }
    }
  }

  public cleanerRes(res: string, id: string, instance: Assistant) {
    if (
      res ===
      "There are no questions with the same meaning that need to be removed."
    ) {
      return;
    }

    const parsedResponse = parseGPTResponce(res);
    console.log("Cleaner res: " + parsedResponse);
    const parsedName = parseAssistentName(id);
    const intChapter = Number.parseInt(parsedName[1]);
    const QAHistory: StorageType = JSON.parse(
      this.getFileContents(parsedName[0], intChapter)
    );

    for (let i = 0; i < parsedResponse.length; i++) {
      const cur = parsedResponse[i];
      const posOfNeededToRemove = QAHistory["iter"].indexOf(cur);

      if (posOfNeededToRemove !== -1) {
        QAHistory["iter"].splice(posOfNeededToRemove, 1);
      }
    }

    this.write(QAHistory, parsedName[0], intChapter);
    instance.isInStandByMode = true;
  }
}
