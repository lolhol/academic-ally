import * as fs from "fs";
type UserHistory = Record<string, string[]>;

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
    let userHistory = this.getUserHistory();

    if (userHistory[userKey] === undefined) {
      userHistory[userKey] = [question];
    } else {
      if (userHistory[userKey].length < this.maxLen) {
        userHistory[userKey].push(question);
      } else {
        userHistory[userKey].unshift(question);
        userHistory[userKey].pop();
      }
    }

    this.write(userHistory);
  }

  public getUserHistory(): UserHistory {
    const readData: Buffer = fs.readFileSync(this.filePath);
    return JSON.parse(readData.toString());
  }

  public isContains(userKey: string, question: string): boolean {
    let userHistory = this.getUserHistory();
    if (userHistory[userKey]?.includes(question)) {
      return true;
    }

    return false;
  }

  private write(newDat: UserHistory) {
    fs.writeFileSync(this.filePath, JSON.stringify(newDat, undefined, 2));
  }

  public replaceKey(userKey: string, newKey: string) {
    let userHistory = this.getUserHistory();

    if (userHistory[userKey] !== undefined) {
      const tmp = userHistory[userKey];
      delete userHistory[userKey];
      userHistory[newKey] = tmp;
      this.write(userHistory);
    }
  }
}
