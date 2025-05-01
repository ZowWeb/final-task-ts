export class InvalidCommandException extends Error {
  constructor(message: string) {
      super(message);
      this.name = 'InvalidCommandException';
  }
}
