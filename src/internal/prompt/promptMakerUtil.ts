import GPTManager from "../GPTManager";
export function getMultiChoicePrompt(alrAnswered: string): string {
  return (
    "Make me a question and 4 answers based on the text above. Make sure that the first answer is the right answer to the question and that the answers are not duplicated. Answer this with this format - QUESTION, BLANK LINE, CORRECT ANSWER, BLANK LINE, ANSWER, BLANK LINE, ANSWER, BLANK LINE, ANSWER. Exclude questions: " +
    alrAnswered
  );
}

export function getCleanerPrompt(questionsToClean: string): string {
  return (
    "Out of these questions, list me the ones that have the same meaning and thus need to be removed. In your response, ONLY GIVE ME THESE QUESTIONS IN THE STYLE OF: Question to be removed, LINE SKIP, Question to be removed, LINE SKIP, ... . The questions are: " +
    questionsToClean
  );
}
