export default class InvalidKeyException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidKeyException";
    Object.setPrototypeOf(this, InvalidKeyException.prototype);
  }
}
