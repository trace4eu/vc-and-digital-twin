import BadRequestException from '../../../api/excepcions/badRequest.exception';

export default class IdTokenVerificationFailedException extends BadRequestException {
  constructor(description: string) {
    super(`Id Token verification failed: ${description}`);
  }
}
