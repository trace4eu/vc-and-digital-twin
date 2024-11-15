import CustomError from './customError';

export class InvalidUuidFormatException extends CustomError {
  constructor(private uuid: string) {
    super();
    this.message = `[${this.constructor.name}] Invalid uuid format: ${this.uuid}`;
  }
}
