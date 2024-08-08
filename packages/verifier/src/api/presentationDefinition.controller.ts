import { Controller, Get, Param } from '@nestjs/common';

@Controller('presentation-definitions')
export class PresentationDefinitionController {
  constructor() {}

  @Get('/:sessionId')
  async getPresentation(@Param('sessionId') sessionId: string) {
    return sessionId;
  }
}
