import CustomError from '../../shared/exceptions/customError';
export default class VerificationRequestIdNotExistsException extends CustomError {
  constructor(sessionId: string) {
    super();
    this.message = `[${this.constructor.name}] Verification Request id does not exist: ${sessionId}`;
  }
}
