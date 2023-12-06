import { TEXTBOOKCHAPTERS, TEXTBOOKS } from "./AcademicAlly";
import Assistant from "./Assistant";
import InvalidKeyException from "./err/InvalidKeyException";
import Reader from "./Reader";
import AssistentResponceStore from "./User/AssistentResponceStore";

export default class GPTManager {
  private assistantMap: Map<string, Map<string, Assistant>> = new Map();
  private responceStore: AssistentResponceStore = new AssistentResponceStore();

  constructor() {
    this.createAssistants();
  }

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
        let curChapterList = TEXTBOOKCHAPTERS[i];

        let curChapters: Map<string, Assistant> = new Map();
        for (let j = 0; j < curChapterList.length; j++) {
          let assistant = new Assistant(
            textBookName,
            "KEY",
            textBookName,
            j.toString()
          );

          curChapters.set(curChapterList[j].toString(), assistant);
        }

        this.assistantMap.set(textBookName, curChapters);
      }
    } catch (e) {
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

  public getUpdate(token: string) {
    return this.responceStore.isResponded(token);
  }
}
