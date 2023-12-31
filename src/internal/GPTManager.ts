import Assistant from "./Assistant";
import AssistentResponce from "./user/AssistentResponce";
import AssistentResponceStore from "./user/AssistentResponceStore";
import * as fs from "fs";
import type TextbookManager from "./textbooks/TextbookManager";
import GetUpdateResponce from "./user/GetUpdateResponce";
import { threadId } from "worker_threads";
import chalk from "chalk";
import QAStorage from "./storage/QAStorage";
import UserAnsweredQAManager from "./user/UserAnsweredQAManager";
import { getMultiChoicePrompt } from "./prompt/promptMakerUtil";
import { parseAssistentName } from "./util/GPTParseUtil";

export default class GPTManager {
  private assistantMap: Map<string, Map<string, Assistant>> = new Map();
  private qaStorage: QAStorage;
  private responceStore: AssistentResponceStore;
  private userAnsweredQAManager: UserAnsweredQAManager;
  private key: string;

  constructor(private textBookManager: TextbookManager) {
    this.key = fs.readFileSync("./.env", "utf8");
    this.responceStore = new AssistentResponceStore();
    this.qaStorage = new QAStorage();
    this.createAssistants();
    this.userAnsweredQAManager = new UserAnsweredQAManager();
  }

  public addResponce(
    token: string,
    question: string,
    answers: string[],
    bookChapterData: string
  ) {
    const bookChapter = parseAssistentName(bookChapterData);
    if (!this.userAnsweredQAManager.isContains(token, question)) {
      this.responceStore.set(token, question, answers);
      this.qaStorage.addToFile(
        question,
        answers,
        bookChapter[0],
        Number.parseInt(bookChapter[1])
      );
      this.userAnsweredQAManager.addQuestion(question, token);
    } else {
      this.promptGPT(
        token,
        getMultiChoicePrompt(this.getAlrAnsweredQuestions(token)),
        bookChapter[0],
        bookChapter[1]
      );
    }
  }

  public getAlrAnsweredQuestions(token: string): string {
    return this.userAnsweredQAManager.getAllQuestions(token);
  }

  public addError(e: unknown, token: string) {
    this.responceStore.addErr(token);
    console.error("Chat GPT error!");
    console.error(e);
  }

  public createAssistants() {
    try {
      const textbooks = this.textBookManager.getBookList();
      const cleanerMap: Assistant[] = [];
      let timesDone = 0;

      for (let i = 0; i < textbooks.length; i++) {
        let textBookName = textbooks[i];

        let textbookChapterNumb =
          this.textBookManager.getTextBookChapters(textBookName);

        if (textbookChapterNumb === undefined) continue;

        let curChapters: Map<string, Assistant> = new Map();
        for (let j: number = 0; j < textbookChapterNumb; j++) {
          const assistentName: string = (
            textBookName +
            "_" +
            j.toString()
          ).toUpperCase();

          let curChapterData = this.textBookManager.getBookChapterData(
            textBookName,
            i
          );

          if (curChapterData === undefined) continue;

          let assistant = new Assistant(
            assistentName,
            this.key,
            (...args) => this.addResponce(...args),
            undefined,
            (...args) => this.addError(...args),
            curChapterData,
            j.toString()
          );

          // TODO: MIGHT NEED TO re-code this! having 1 assistent and 1 cleaner / book is inefficient idk
          let cleaner = new Assistant(
            assistentName + "_CLEANER",
            this.key,
            (...args) => this.addResponce(...args),
            (...args) => this.qaStorage.cleanerRes(...args),
            (...args) => this.addError(...args),
            curChapterData,
            j.toString()
          );
          cleanerMap.push(cleaner);

          timesDone++;

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

      this.qaStorage.initQAStorageCleaners(cleanerMap);

      console.log(chalk.bold(chalk.blue("Done init GPTManager!")));
    } catch (e) {
      console.log(chalk.red("INVALID KEY!"));
    }
  }

  public startCleaning() {
    this.qaStorage.cleanStarage();
  }

  public promptGPT(
    key: string,
    prompt: string,
    textbook: string,
    chapter: string
  ): boolean {
    this.responceStore.remove(key);
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

  public getUpdate(token: string): GetUpdateResponce {
    let res = this.responceStore.isResponded(token);

    if (res == "false") {
      const updateResFalse = new GetUpdateResponce(false, false, null);
      return updateResFalse;
    } else if (res == "error") {
      const updateResErr = new GetUpdateResponce(true, true, null);
      this.responceStore.remove(token);
      return updateResErr;
    }

    if (typeof res != "string") {
      const updateRes = new GetUpdateResponce(true, false, res);
      this.responceStore.remove(token);
      return updateRes;
    }

    return new GetUpdateResponce(true, true, null);
  }

  public isGeneratingFor(token: string): boolean {
    return this.responceStore.isGeneratingFor(token);
  }

  public updateTokenUserQAStorage(oldToken: string, newToken: string) {
    this.userAnsweredQAManager.replaceKey(oldToken, newToken);
  }
}
