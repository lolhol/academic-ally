import OpenAI from "../../node_modules/openai/index";
import AITimeoutError from "./err/AITimeoutError";
import InvalidKeyException from "./err/InvalidKeyException";

export default class Assistant {
  public name: string;
  public key: string;
  public ai: { id: any } | undefined;

  public booleanWorking: boolean;
  private thread: any;
  private curRun: any;

  public constructor(textbookName: string, gptKey: string) {
    this.name = textbookName;
    this.key = gptKey;
    this.booleanWorking = false;

    this.initAI();
  }

  private async initAI() {
    const ai = new OpenAI({
      apiKey: this.key,
    });

    // TODO: add a chooser for the textbook and prompt chat GPT with it

    try {
      this.ai = await openai.beta.assistants.create({
        name: this.name,
        instructions: "You are a multiple choice test creator.",
        tools: [{ type: "code_interpreter" }],
        model: "gpt-4-1106-preview",
      });

      this.thread = await openai.beta.threads.create();

      await openai.beta.threads.messages.create(this.thread.id, {
        role: "user",
        content:
          "Remember this text and don't use any other source other then this text -> " +
          "...",
      });

      // @here
    } catch (error) {
      throw new InvalidKeyException("Invalid AI key provided.");
    }
  }

  public parseRetText(txt: string): string {
    return "";
  }

  public async promptGPT(prompt: string) {
    let start = Date.now();

    if (!this.booleanWorking || this.ai === undefined) {
      return "---";
    }

    await openai.beta.threads.messages.create(this.thread.id, {
      role: "user",
      content: prompt,
    });

    this.curRun = await openai.beta.threads.runs.create(this.thread.id, {
      assistant_id: this.ai.id,
    });

    while (Date.now() - start <= 15000) {
      const status = await openai.beta.threads.runs.retrieve(
        this.thread.id,
        this.curRun.id
      );

      // The message return system needs to be re-worked to actually work but for now its fine
      if (status.status == "completed") {
        const message = await openai.beta.threads.messages.list(this.thread.id);
        return message.data[0].content[0].text.value;
      }
    }

    throw new AITimeoutError("Timed out!");
    return "---";
  }
}
