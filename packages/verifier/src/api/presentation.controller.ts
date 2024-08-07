import { Controller, Get, Param, Post } from '@nestjs/common';

@Controller('presentation')
export class PresentationController {
  constructor() {}

  @Post()
  async initPresentation() {
    return 'OK';
  }

  @Get('/:sessionId')
  async getPresentation(@Param('sessionId') transactionId: string) {
    return transactionId;
  }
}
