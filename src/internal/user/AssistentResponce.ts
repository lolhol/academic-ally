export default class AssistentResponce {
  public question: string = "";
  public answers: string[] = [];
  public creationDate: number = 0;

  constructor(question: string, answers: string[], creationDate: number) {
    this.question = question;
    this.answers = answers;
    this.creationDate = creationDate;
  }
}
