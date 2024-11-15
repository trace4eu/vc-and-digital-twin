import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { ExceptionTypeFactory } from './exceptionFactory';
import { getExceptionHttpCode } from './exceptionsHttpCodes';

@Catch()
export default class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();

    const customError = ExceptionTypeFactory.create(exception);
    const errorResponse = customError.getResponse();

    response
      .status(getExceptionHttpCode(exception.constructor.name))
      .json({ ...errorResponse, internalCode: exception.constructor.name });
  }
}
