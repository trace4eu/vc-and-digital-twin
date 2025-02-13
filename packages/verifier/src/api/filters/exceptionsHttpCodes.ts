import { HttpStatus } from '@nestjs/common';
import { UnauthorizedException } from '../excepcions/unauthorized.exception';
import { InvalidUuidFormatException } from '../../contexts/shared/exceptions/invalidUuidFormat.exception';
import InternalServerErrorCustom from '../excepcions/internalServerError.exception';
import BadRequestException from '../excepcions/badRequest.exception';
import NotFoundException from '../excepcions/notFound.exception';
import VerifierSessionIdNotExistsException from '../../contexts/presentation/exceptions/verifierSessionIdNotExists.exception';
import VerifierSessionAlreadyVerifiedException from '../../contexts/presentation/exceptions/verifierSessionAlreadyVerified.exception';
import DidMethodNotSupportedException from '../../contexts/shared/exceptions/didMethodNotSupported.exception';
import VerifierSessionCodeNotValidException from '../../contexts/presentation/exceptions/verifierSessionCodeNotValid.exception';

const ExceptionsHttpCodes = {
  [InvalidUuidFormatException.name]: HttpStatus.BAD_REQUEST,
  [InternalServerErrorCustom.name]: HttpStatus.INTERNAL_SERVER_ERROR,
  [BadRequestException.name]: HttpStatus.BAD_REQUEST,
  [NotFoundException.name]: HttpStatus.INTERNAL_SERVER_ERROR,
  [UnauthorizedException.name]: HttpStatus.UNAUTHORIZED,
  [VerifierSessionIdNotExistsException.name]: HttpStatus.BAD_REQUEST,
  [VerifierSessionAlreadyVerifiedException.name]: HttpStatus.BAD_REQUEST,
  [DidMethodNotSupportedException.name]: HttpStatus.BAD_REQUEST,
  [VerifierSessionCodeNotValidException.name]: HttpStatus.BAD_REQUEST,
  unknown: HttpStatus.INTERNAL_SERVER_ERROR,
};

export function getExceptionHttpCode(exceptionName: string): number {
  return ExceptionsHttpCodes[exceptionName] || ExceptionsHttpCodes.unknown;
}
