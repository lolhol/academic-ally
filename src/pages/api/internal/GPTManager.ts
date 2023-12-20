import Assistant from "./Assistant";
import type AssistentResponce from "./user/AssistentResponce";
import AssistentResponceStore from "./user/AssistentResponceStore";
import * as fs from "fs";
import type TextbookManager from "./textbooks/TextbookManager";

export default class GPTManager {
  private assistantMap: Map<string, Map<string, Assistant>> = new Map();
  private responceStore: AssistentResponceStore = new AssistentResponceStore();
  private key: string;

  constructor(private textBookManager: TextbookManager) {
    this.key = fs.readFileSync("./.env", "utf8");
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
      const textbooks = this.textBookManager.getBookList();

      for (let i = 0; i < textbooks.length; i++) {
        let textBookName = textbooks[i];
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
            (...args) => this.addResponce(...args),
            (...args) => this.addError(...args),
            curChapterList[j],
            j.toString()
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

    //console.log(textbook);
    //console.log(this.assistantMap);

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
