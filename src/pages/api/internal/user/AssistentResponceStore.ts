import { Crushed } from "next/font/google";
import AssistentResponce from "./AssistentResponce";

export default class AssistentResponceStore {
  public data: Map<string, AssistentResponce> = new Map();
  public timeSinceLastClean = Date.now();

  public addUserStore(token: string) {
    if (Date.now() - this.timeSinceLastClean >= 120000) {
      this.cleanUp();
    }

    this.data.set(token, new AssistentResponce("WAITING!", [], Date.now()));
  }

  public addErr(token: string) {
    this.set(token, "CHATGPT_ERROR_ERROR_CHATGPT", []);
  }

  public remove(token: string) {
    this.data.delete(token);
  }

  public isUser(token: string) {
    return this.data.has(token);
  }

  public set(token: string, question: string, answers: string[]) {
    this.data.set(token, new AssistentResponce(question, answers, Date.now()));
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
      console.log("RETURNED REAL VAL!");
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
