import CustomError from '../../shared/exceptions/customError';
export default class AlreadyVerifiedException extends CustomError {
  constructor(sessionId: string) {
    super();
    this.message = `[${this.constructor.name}] Verification session already verified: ${sessionId}`;
  }
}
