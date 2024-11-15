import { Controller, Get, Param } from '@nestjs/common';
import PresentationDefinitionService from '../contexts/presentation/services/presentationDefinition.service';

@Controller('presentation-definitions')
export class PresentationDefinitionController {
  constructor(
    private presentationDefinitionService: PresentationDefinitionService,
  ) {}

  @Get('/:sessionId')
  async getPresentation(@Param('sessionId') sessionId: string) {
    return this.presentationDefinitionService.execute(sessionId);
  }
}
