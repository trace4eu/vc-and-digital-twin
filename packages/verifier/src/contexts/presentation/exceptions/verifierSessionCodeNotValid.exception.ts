import BadRequestException from '../../../api/excepcions/badRequest.exception';
export default class VerifierSessionCodeNotValidException extends BadRequestException {
  constructor() {
    super('Verifier session invalid code');
  }
}
