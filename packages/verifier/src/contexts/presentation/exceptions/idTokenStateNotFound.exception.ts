import NotFoundException from '../../../api/excepcions/notFound.exception';

export class IdTokenStateNotFoundException extends NotFoundException {
  constructor() {
    super('State not found in IdToken');
  }
}
