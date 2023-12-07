import { TEXTBOOKCHAPTERS, TEXTBOOKS } from "./AcademicAlly";
import Assistant from "./Assistant";
import InvalidKeyException from "./err/InvalidKeyException";
import Reader from "./Reader";
import AssistentResponce from "./User/AssistentResponce";
import AssistentResponceStore from "./User/AssistentResponceStore";

export default class GPTManager {
  private assistantMap: Map<string, Map<string, Assistant>> = new Map();
  private responceStore: AssistentResponceStore = new AssistentResponceStore();
  private TEXTBOOKS: string[] = ["124", "1111"];
  private TEXTBOOKCHAPTERS: string[] = ["1234"];
  private key: string;

  constructor() {
    this.key = new Reader("../../.env").read();
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
      for (let i = 0; i < this.TEXTBOOKS.length; i++) {
        let textBookName = this.TEXTBOOKS[i];
        let curChapterList = this.TEXTBOOKCHAPTERS[i];

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
