import BadRequestException from '../../../api/excepcions/badRequest.exception';

export class InvalidIdTokenStateException extends BadRequestException {
  constructor() {
    super('Invalid state in IdToken');
  }
}
