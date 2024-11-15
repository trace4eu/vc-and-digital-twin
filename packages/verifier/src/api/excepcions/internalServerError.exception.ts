import { ApiErrors } from './httpErrors';
import CustomError from '../../contexts/shared/exceptions/customError';
export default class InternalServerErrorException extends CustomError {
  constructor() {
    super();
    this.message = `[${this.constructor.name}] ${ApiErrors.INTERNAL_SERVER_ERROR}`;
  }
}
