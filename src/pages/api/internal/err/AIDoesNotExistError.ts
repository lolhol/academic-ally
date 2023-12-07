export default class AIDoesNotExistError extends Error {
  constructor(message: string) {
    super(message);
  }
}
