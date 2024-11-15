import CustomError from '../../contexts/shared/exceptions/customError';
import { ApiErrors } from './httpErrors';

export class UnauthorizedException extends CustomError {
  constructor() {
    super();
    this.message = `[${this.constructor.name}] ${ApiErrors.BAD_REQUEST}: request`;
  }
}
