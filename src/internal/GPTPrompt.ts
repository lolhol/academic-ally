export default class GPTPrompt {
  public prompt: string;
  public key: string;

  constructor(prompt: string, key: string) {
    this.prompt = prompt;
    this.key = key;
  }
}
