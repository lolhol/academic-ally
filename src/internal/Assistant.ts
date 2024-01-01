import page from "@/app/page";
import OpenAI from "openai";
import AIDoesNotExistError from "./err/AIDoesNotExistError";
import AITimeoutError from "./err/AITimeoutError";
import GPTPrompt from "./GPTPrompt";
import { parseGPTResponce } from "./util/GPTParseUtil";
import { delay } from "./util/TimeUtil";

export default class Assistant {
  private ai: { id: any } | undefined;
  private thread: any;
  private curRun: any;
  private openai: OpenAI | undefined;
  private reqQueue: GPTPrompt[] = [];

  private chapter: string;

  public isInStandByMode: boolean = false;

  public constructor(
    public name: string,
    private key: string,
    private onResponce: (
      token: string,
      question: string,
      answers: string[],
      bookChapterData: string
    ) => void,
    private retResponseFunction:
      | ((res: string, id: string, instance: Assistant) => void)
      | undefined,
    private onError: (e: unknown, token: string) => void,
    initInfo: string,
    chapter: string
  ) {
    this.initAI(initInfo, chapter);
    this.initQueue();

    this.chapter = chapter;
  }

  public returnResponse(res: string) {
    if (this.retResponseFunction !== undefined) {
      this.retResponseFunction(res, this.name, this);
    }
  }

  public addToQueue(prompt: string, key: string) {
    this.reqQueue.push(new GPTPrompt(prompt, key));
  }

  public async initQueue() {
    while (true) {
      // This is used in order to stop the cleaners from taking up performance idk if it will help a lot tho
      if (this.isInStandByMode) {
        await delay(15000);
        continue;
      }

      if (
        this.reqQueue.length == 0 ||
        this.ai === undefined ||
        this.openai === undefined
      ) {
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
            this.onResponce(curQ.key, q, responseAr, this.name);
          }
        } catch (e) {
          this.onError(e, curQ.key);
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

  public async promptGPT(prompt: string) {
    if (this.openai !== undefined) {
      let start = Date.now();

      if (this.ai === undefined) {
        return "---";
      }

      await this.openai.beta.threads.messages.create(this.thread.id, {
        role: "user",
        content: prompt,
      });

      this.curRun = await this.openai.beta.threads.runs.create(this.thread.id, {
        assistant_id: this.ai.id,
      });

      console.log("Starting new AI request!");

      let lastStatusCheck = Date.now();
      while (Date.now() - start <= 50000) {
        const status = await this.openai.beta.threads.runs.retrieve(
          this.thread.id,
          this.curRun.id
        );

        // The message return system needs to be re-worked to actually work but for now its fine

        /*if (Date.now() - lastStatusCheck >= 1000) {
          console.log(status.status);
          lastStatusCheck = Date.now();
        }*/

        if (status.status == "completed") {
          const message = await this.openai.beta.threads.messages.list(
            this.thread.id
          );

          console.log(
            "Completed AI Request! Took " + (Date.now() - start) + "ms."
          );

          const gptResponse = (message.data[0].content[0] as any).text.value;

          this.returnResponse(gptResponse);

          return gptResponse;
        }
      }

      console.error("Timed out!");
      throw new AITimeoutError("Timed out!");
      return "---";
    } else {
      throw new AIDoesNotExistError("AI Does not exist! (== undefined)");
    }
  }
}
