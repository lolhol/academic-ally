import GPTManager from "./GPTManager";

export let MANAGER: GPTManager | undefined = undefined;

// @This will have to be re-worked l8tr
export const TEXTBOOKS = ["The-Book-Thief"];
export const TOKENLEN = 10;

export function register() {
  MANAGER = new GPTManager();
}
