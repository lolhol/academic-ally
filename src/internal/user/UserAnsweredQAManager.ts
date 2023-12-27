import * as fs from "fs";

type UserHistory = { [k in string]?: string[] };

export default class UserAnsweredQAManager {
  private filePath: any = "./public/user/userData.json";

  // This is set to 3 for now only!.
  private maxLen = 100;

  public constructor() {
    if (
      !fs.existsSync(this.filePath) ||
      fs.readFileSync(this.filePath).toString() == ""
    ) {
      fs.writeFileSync(this.filePath, "{}", "utf-8");
    }
  }

  public addQuestion(question: string, userKey: string) {
    const userHistory = this.getUserHistory();
    const questions = (userHistory[userKey] ??= []);
    questions.push(question);
    if (questions.length > this.maxLen) {
      questions.shift();
    }

    this.write(userHistory);
  }

  public getUserHistory(): UserHistory {
    const readData: Buffer = fs.readFileSync(this.filePath);
    return JSON.parse(readData.toString());
  }

  public isContains(userKey: string, question: string): boolean {
    return !!this.getUserHistory()[userKey]?.includes(question);
  }

  private write(newDat: UserHistory) {
    fs.writeFileSync(this.filePath, JSON.stringify(newDat, undefined, 2));
  }

  public replaceKey(userKey: string, newKey: string) {
    const userHistory = this.getUserHistory();

    if (userHistory[userKey] !== undefined) {
      const tmp = userHistory[userKey];
      delete userHistory[userKey];
      userHistory[newKey] = tmp;
      this.write(userHistory);
    }
  }

  public getAllQuestions(key: string): string {
    const history = this.getUserHistory();
    return (history[key] ?? []).join(" ");
  }
}
