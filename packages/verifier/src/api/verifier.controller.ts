import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Redirect,
} from '@nestjs/common';
import { VerifyRequestDto } from './dtos/verifyRequest.dto';
import IdTokenService from '../contexts/presentation/services/idToken.service';
import VpTokenService from '../contexts/presentation/services/vpToken.service';

@Controller()
export class VerifierController {
  constructor(
    private idTokenService: IdTokenService,
    private vpTokenService: VpTokenService,
  ) {}

  @Post('/:sessionId/direct_post')
  @HttpCode(HttpStatus.FOUND || HttpStatus.OK)
  @Redirect()
  async verify(
    @Param('sessionId') sessionId: string,
    @Body() body: VerifyRequestDto,
  ) {
    if (body.id_token) {
      return {
        url: await this.idTokenService.execute(sessionId, body.id_token),
      };
    }
    const result = await this.vpTokenService.execute(sessionId, body);
    if (!result.valid) {
      const url = `${result.redirectUri}?error=invalid_request&error_description=${result.message}`;
      return {
        url: result.state ? url + `&state=${result.state}` : url,
        statusCode: HttpStatus.FOUND,
      };
    }
    if (!result.code) {
      return {
        statusCode: HttpStatus.OK,
      };
    }
    const url = `${result.redirectUri}?code=${result.code}`;
    return {
      url: result.state ? url + `&state=${result.state}` : url,
    };
  }
}
