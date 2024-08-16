import CustomError from './customError';

export default class UnsupportedStatusListCredentialTypeException extends CustomError {
  constructor() {
    super();
    this.message = `Only EBSI verifiable presentations supported`;
  }
}
