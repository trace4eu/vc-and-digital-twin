import { ApiErrors } from './httpErrors';
import CustomError from '../../contexts/shared/exceptions/customError';
export default class BadRequestException extends CustomError {
  constructor(errorMessage: string) {
    super();
    this.message = `[${this.constructor.name}] ${ApiErrors.BAD_REQUEST}: ${errorMessage}`;
  }
}
