import { Crushed } from "next/font/google";
import AssistentResponce from "./AssistentResponce";
import chalk from "chalk";

export default class AssistentResponceStore {
  public data: Map<string, AssistentResponce>;
  private currentlyGenerating: Set<string> = new Set();
  public timeSinceLastClean = Date.now();

  public constructor() {
    this.data = new Map();
    console.log(chalk.blue("Done init UserStore!"));
  }

  public addUserStore(token: string) {
    if (Date.now() - this.timeSinceLastClean >= 120000) {
      this.cleanUp();
    }

    this.currentlyGenerating.add(token);
    this.data.set(token, new AssistentResponce("WAITING!", [], Date.now()));
  }

  public addErr(token: string) {
    this.set(token, "CHATGPT_ERROR_ERROR_CHATGPT", []);
  }

  public remove(token: string) {
    this.data.delete(token);
    this.currentlyGenerating.delete(token);
  }

  public isUser(token: string) {
    return this.data.has(token);
  }

  public set(token: string, question: string, answers: string[]) {
    this.data.set(token, new AssistentResponce(question, answers, Date.now()));
  }

  public isGeneratingFor(token: string): boolean {
    return this.currentlyGenerating.has(token);
  }

  private cleanUp() {
    let curPos = 0;
    let arr = Array.from(this.data.entries());
    this.data = new Map();

    while (curPos < arr.length) {
      let [key, val] = arr[curPos];
      curPos++;

      if (Date.now() - val.creationDate <= 600000) {
        this.data.set(key, val);
      }
    }
  }

  public isResponded(token: string): string | AssistentResponce {
    if (this.isUser(token)) {
      if (
        this.data.get(token)?.question.includes("CHATGPT_ERROR_ERROR_CHATGPT")
      ) {
        return "error";
      } else if (!this.data.get(token)?.question.includes("WAITING!")) {
        const cur = this.data.get(token);
        if (cur !== undefined) {
          return cur;
        }
      }
    }

    return "false";
  }
}
