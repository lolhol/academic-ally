import GPTManager from "./GPTManager";
import AssistentResponceStore from "./User/AssistentResponceStore";

export const MANAGER: GPTManager = new GPTManager();

// @This will have to be re-worked l8tr
export const TEXTBOOKS = ["The Book Thief", "Geometry"];
export const TEXTBOOKCHAPTERS = [
  [1, 2, 3, 4, 5, 6],
  [1, 2, 3, 4, 5, 6],
];

export const TOKENLEN = 10;
