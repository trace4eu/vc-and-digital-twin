import { HttpStatus } from '@nestjs/common';
import { UnauthorizedException } from '../excepcions/unauthorized.exception';
import { InvalidUuidFormatException } from '../../contexts/shared/exceptions/invalidUuidFormat.exception';
import InternalServerErrorCustom from '../excepcions/internalServerError.exception';
import BadRequestException from '../excepcions/badRequest.exception';
import NotFoundException from '../excepcions/notFound.exception';

const ExceptionsHttpCodes = {
  [InvalidUuidFormatException.name]: HttpStatus.BAD_REQUEST,
  [InternalServerErrorCustom.name]: HttpStatus.INTERNAL_SERVER_ERROR,
  [BadRequestException.name]: HttpStatus.BAD_REQUEST,
  [NotFoundException.name]: HttpStatus.INTERNAL_SERVER_ERROR,
  [UnauthorizedException.name]: HttpStatus.UNAUTHORIZED,
  unknown: HttpStatus.INTERNAL_SERVER_ERROR,
};

export function getExceptionHttpCode(exceptionName: string): number {
  return ExceptionsHttpCodes[exceptionName] || ExceptionsHttpCodes.unknown;
}
