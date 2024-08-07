import { Controller, Get, Param } from '@nestjs/common';

@Controller('request')
export class RequestController {
  constructor() {}

  @Get('/:sessionId')
  async getRequest(@Param('sessionId') transactionId: string) {
    return transactionId;
  }
}
