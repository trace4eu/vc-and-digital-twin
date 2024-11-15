import BadRequestException from '../../../api/excepcions/badRequest.exception';

export class InvalidIdTokenNonceException extends BadRequestException {
  constructor(nonce: string) {
    super(`Invalid nonce in IdToken: ${nonce}`);
  }
}
