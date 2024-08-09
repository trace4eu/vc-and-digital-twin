import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import RequestService from '../contexts/presentation/services/request.service';

@Controller('request.jwt')
export class RequestController {
  constructor(private requestService: RequestService) {}

  @Get('/:sessionId')
  async getRequest(
    @Param('sessionId') sessionId: string,
    @Res() response: Response,
  ) {
    const signedRequest = await this.requestService.execute(sessionId);
    response.setHeader('Content-Type', 'application/oauth-authz-req+jwt');
    response.send(signedRequest);
  }
}
