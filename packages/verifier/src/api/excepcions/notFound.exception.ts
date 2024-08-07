import { ApiErrors } from './httpErrors';
import CustomError from '../../contexts/shared/exceptions/customError';
export default class NotFoundException extends CustomError {
  constructor(errorMessage: string) {
    super();
    this.message = `[${this.constructor.name}] ${ApiErrors.NOT_FOUND}: ${errorMessage}`;
  }
}
