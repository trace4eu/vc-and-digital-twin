import { Controller, Get, Param } from '@nestjs/common';

@Controller('requests')
export class RequestController {
  constructor() {}

  @Get('/:sessionId')
  async getRequest(@Param('sessionId') transactionId: string) {
    return transactionId;
  }
}
