import GPTManager from "./GPTManager";
import TextbookManager from "./textbooks/TextbookManager";

// @This will have to be re-worked l8tr
const TEXTBOOKS = ["The-Book-Thief"];
export const TOKENLEN = 10;
export const MANAGER = new GPTManager(new TextbookManager(TEXTBOOKS));
