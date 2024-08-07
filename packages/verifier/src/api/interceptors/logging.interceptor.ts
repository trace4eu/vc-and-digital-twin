import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import CustomError from '../../contexts/shared/exceptions/customError';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const className = context.getClass().name;
    const methodName = context.getHandler().name;
    const request = context.switchToHttp().getRequest();

    this.logger.debug({
      type: 'request',
      method: `${className}.${methodName}`,
      httpMethod: request.method,
      path: `${request.url}`,
      request: request.body,
    });

    return next.handle().pipe(
      tap({
        next: (data) => {
          this.logger.debug({
            type: 'response',
            method: `${className}.${methodName}`,
            httpMethod: request.method,
            path: `${request.url}`,
            request: request.body,
            response: data,
          });
        },
        error: (err) => {
          let customError = err;
          if (err instanceof CustomError) {
            customError = err as CustomError;
          }
          this.logger.error({
            method: `${className}.${methodName}`,
            message: customError.message,
            customError: customError,
            error:
              customError instanceof CustomError
                ? customError.getError()
                : undefined,
            payload:
              customError instanceof CustomError
                ? customError.getPayload()
                : undefined,
          });
        },
      }),
    );
  }
}
