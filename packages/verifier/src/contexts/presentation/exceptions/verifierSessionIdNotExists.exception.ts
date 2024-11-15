import CustomError from '../../shared/exceptions/customError';
export default class VerifierSessionIdNotExistsException extends CustomError {
  constructor(sessionId: string) {
    super();
    this.message = `[${this.constructor.name}] Verifier session id does not exist: ${sessionId}`;
  }
}
