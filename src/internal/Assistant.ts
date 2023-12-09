import page from "@/app/page";
import OpenAI from "openai";
import AIDoesNotExistError from "./err/AIDoesNotExistError";
import AITimeoutError from "./err/AITimeoutError";
import GPTManager from "./GPTManager";
import GPTPrompt from "./GPTPrompt";
import { parseGPTResponce } from "./util/GPTParseUtil";
import { delay } from "./util/TimeUtil";

export default class Assistant {
  public name: string;
  public booleanWorking: boolean;

  private key: string;
  private ai: { id: any } | undefined;
  private thread: any;
  private curRun: any;
  private openai: OpenAI | undefined;
  private reqQueue: GPTPrompt[] = [];
  private GPTManager;

  public constructor(
    textbookName: string,
    gptKey: string,
    initInfo: string,
    chapter: string,
    GPTManagerInstance: GPTManager
  ) {
    this.GPTManager = GPTManagerInstance;
    this.name = textbookName;
    this.key = gptKey;
    this.booleanWorking = false;

    this.initAI(initInfo, chapter);
    this.initQueue();
  }

  public addToQueue(prompt: string, key: string) {
    this.reqQueue.push(new GPTPrompt(prompt, key));
  }

  public async initQueue() {
    while (true) {
      if (this.reqQueue.length == 0) {
        await delay(1000);
        continue;
      }

      const curQ = this.reqQueue.shift();
      if (curQ !== undefined) {
        try {
          const result = await this.promptGPT(curQ.prompt);
          const responseAr = parseGPTResponce(result);
          const q = responseAr.shift();

          if (q !== undefined) {
            this.GPTManager.addResponce(curQ.key, q, responseAr);
          }
        } catch (e) {
          this.GPTManager.addError(curQ.key);
        }
      }
    }
  }

  private async initAI(initText: string, chapter: string) {
    this.openai = new OpenAI({
      apiKey: this.key,
    });

    try {
      this.ai = await this.openai.beta.assistants.create({
        name: this.name,
        instructions:
          "You are a multiple choice test creator on the chapter " +
          chapter +
          ".",
        tools: [{ type: "code_interpreter" }],
        model: "gpt-4-1106-preview",
      });

      this.thread = await this.openai.beta.threads.create();
      await this.openai.beta.threads.messages.create(this.thread.id, {
        role: "user",
        content:
          "Remember this text and don't use any other source other then this text in any of your next prompts -> " +
          initText,
      });
    } catch (error) {
      console.log(error);
      //throw new InvalidKeyException("Invalid AI key provided.");
    }
  }

  public parseRetText(txt: string): string {
    return "";
  }

  public async promptGPT(prompt: string) {
    if (this.openai !== undefined) {
      let start = Date.now();

      if (!this.booleanWorking || this.ai === undefined) {
        return "---";
      }

      await this.openai.beta.threads.messages.create(this.thread.id, {
        role: "user",
        content: prompt,
      });

      this.curRun = await this.openai.beta.threads.runs.create(this.thread.id, {
        assistant_id: this.ai.id,
      });

      while (Date.now() - start <= 15000) {
        const status = await this.openai.beta.threads.runs.retrieve(
          this.thread.id,
          this.curRun.id
        );

        // The message return system needs to be re-worked to actually work but for now its fine
        if (status.status == "completed") {
          const message = await this.openai.beta.threads.messages.list(
            this.thread.id
          );
          return message.data[0].content[0].text.value;
        }
      }

      throw new AITimeoutError("Timed out!");
      return "---";
    } else {
      throw new AIDoesNotExistError("AI Does not exist! (== undefined)");
    }
  }
}
