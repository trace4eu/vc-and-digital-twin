import CustomError from '../../shared/exceptions/customError';
export default class VerifierSessionAlreadyVerifiedException extends CustomError {
  constructor(sessionId: string) {
    super();
    this.message = `[${this.constructor.name}] Verifier session already verified: ${sessionId}`;
  }
}
