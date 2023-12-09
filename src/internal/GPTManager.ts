import { TEXTBOOKS } from "./AcademicAlly";
import Assistant from "./Assistant";
import AssistentResponce from "./User/AssistentResponce";
import AssistentResponceStore from "./User/AssistentResponceStore";
import * as fs from "fs";
import TextbookManager from "./textbooks/TextbookManager";

export default class GPTManager {
  private assistantMap: Map<string, Map<string, Assistant>> = new Map();
  private responceStore: AssistentResponceStore = new AssistentResponceStore();
  private key: string;
  private textBookManager: TextbookManager;

  constructor() {
    this.key = fs.readFileSync("./.env", "utf8");
    this.textBookManager = new TextbookManager(TEXTBOOKS);
    this.createAssistants();
  }

  private indexTextbooks() {}

  public addResponce(token: string, question: string, answers: string[]) {
    this.responceStore.set(token, question, answers);
  }

  public addError(token: string) {
    this.responceStore.addErr(token);
  }

  public createAssistants() {
    try {
      for (let i = 0; i < TEXTBOOKS.length; i++) {
        let textBookName = TEXTBOOKS[i];
        let curChapterList = this.textBookManager.getBookChapterData(
          textBookName,
          i
        );

        if (curChapterList === undefined) continue;

        let curChapters: Map<string, Assistant> = new Map();
        for (let j = 0; j < curChapterList.length; j++) {
          let assistant = new Assistant(
            textBookName,
            this.key,
            curChapterList[j],
            j.toString(),
            this
          );

          // TODO: "multithreading" (l8tr)
          /*for (let k = 1; k < 5; k++) {
            curChapters.set(j.toString() + "_" + k.toString(), assistant);
          }*/

          curChapters.set(j.toString(), assistant);
        }

        this.assistantMap.set(textBookName, curChapters);
      }

      console.log("Done init!");
    } catch (e) {
      console.log(e);
      console.log("INVALID KEY!");
    }
  }

  public promptGPT(
    key: string,
    prompt: string,
    textbook: string,
    chapter: string
  ): boolean {
    this.responceStore.addUserStore(key);
    if (
      this.assistantMap.has(textbook) &&
      this.assistantMap.get(textbook)?.has(chapter)
    ) {
      const gpt = this.assistantMap.get(textbook)?.get(chapter);
      gpt?.addToQueue(prompt, key);
      return true;
    }

    return false;
  }

  public getUpdate(token: string): string | AssistentResponce {
    return this.responceStore.isResponded(token);
  }
}
