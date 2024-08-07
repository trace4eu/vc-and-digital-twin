import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { UnauthorizedException } from '../excepcions/unauthorized.exception';
import CustomError from '../../contexts/shared/exceptions/customError';
import BadRequestException from '../excepcions/badRequest.exception';
import NotFoundException from '../excepcions/notFound.exception';
import InternalServerErrorException from '../excepcions/internalServerError.exception';

const logger = new Logger();

export class ExceptionTypeFactory {
  static create(exception: Error) {
    if (
      exception instanceof HttpException &&
      exception.getStatus() === HttpStatus.UNAUTHORIZED
    ) {
      return new UnauthorizedException();
    }
    if (exception instanceof CustomError) {
      return exception as CustomError;
    }
    if (exception.name === 'NotFoundException') {
      logger.error({
        method: `${ExceptionTypeFactory.name}.${this.name}`,
        message: 'Not Found Exception: ' + exception.message,
        customError: exception as Error,
      });
      return new NotFoundException(exception.message);
    }
    if (exception.name === 'BadRequestException') {
      // Validation pipe
      return new BadRequestException(
        (exception as BadRequestException).getResponse().message,
      );
    }
    logger.error({
      method: `${ExceptionTypeFactory.name}.${this.name}`,
      message: 'Exception does not match any known type',
      customError: exception as Error,
    });
    return new InternalServerErrorException();
  }
}
