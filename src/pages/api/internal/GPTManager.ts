import Assistant from "./Assistant";
import AssistentResponce from "./user/AssistentResponce";
import AssistentResponceStore from "./user/AssistentResponceStore";
import * as fs from "fs";
import type TextbookManager from "./textbooks/TextbookManager";
import GetUpdateResponce from "./user/GetUpdateResponce";

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
      let timesDone = 0;

      for (let i = 0; i < textbooks.length; i++) {
        let textBookName = textbooks[i];

        let textbookChapterNumb =
          this.textBookManager.getTextBookChapters(textBookName);

        if (textbookChapterNumb === undefined) continue;

        console.log(textbookChapterNumb);

        let curChapters: Map<string, Assistant> = new Map();
        for (let j = 0; j < textbookChapterNumb; j++) {
          let curChapterData = this.textBookManager.getBookChapterData(
            textBookName,
            i
          );

          if (curChapterData === undefined) continue;

          let assistant = new Assistant(
            textBookName,
            this.key,
            (...args) => this.addResponce(...args),
            (...args) => this.addError(...args),
            curChapterData,
            j.toString()
          );

          timesDone++;

          // TODO: "multithreading" (l8tr)
          /*for (let k = 1; k < 5; k++) {
            curChapters.set(j.toString() + "_" + k.toString(), assistant);
          }*/

          if (timesDone >= 12) {
            return;
          }

          curChapters.set(j.toString(), assistant);
        }

        if (timesDone >= 12) {
          return;
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
    this.responceStore.remove(key);
    this.responceStore.addUserStore(key);

    console.log(JSON.stringify(chapter), [
      ...this.assistantMap.get(textbook)!.keys(),
    ]);
    console.log(this.assistantMap.get(textbook)?.has(chapter));

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

  public getUpdate(token: string): GetUpdateResponce {
    let res = this.responceStore.isResponded(token);
    //console.log(this.responceStore.data);
    //console.log(res);
    if (res == "false") {
      const updateResFalse = new GetUpdateResponce(false, false, null);
      return updateResFalse;
    } else if (res == "error") {
      const updateResErr = new GetUpdateResponce(true, true, null);
      return updateResErr;
    }

    if (typeof res != "string") {
      const updateRes = new GetUpdateResponce(true, false, res);
      this.responceStore.remove(token);
      return updateRes;
    }

    return new GetUpdateResponce(true, true, null);
  }
}
