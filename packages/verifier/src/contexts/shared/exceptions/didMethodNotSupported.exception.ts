import CustomError from './customError';

export default class DidMethodNotSupportedException extends CustomError {
  constructor(did: string) {
    super();
    this.message = `[${this.constructor.name}] Did method not supported: ${did}`;
  }
}
