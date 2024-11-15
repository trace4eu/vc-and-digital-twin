import NotFoundException from '../../../api/excepcions/notFound.exception';

export class IdTokenNonceNotFoundException extends NotFoundException {
  constructor() {
    super('Nonce not found in IdToken');
  }
}
