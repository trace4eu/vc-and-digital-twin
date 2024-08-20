import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { InitPresentationRequestDto } from './dtos/initPresentationRequest.dto';
import { InitPresentationResponseDto } from './dtos/initPresentationResponse.dto';
import PresentationService from '../contexts/presentation/services/presentation.service';
import { VPTokenData } from '@trace4eu/verifiable-presentation';
import { GetPresentationResponseDto } from './dtos/getPresentationResponse.dto';

@Controller('presentations')
export class PresentationController {
  constructor(private presentationService: PresentationService) {}

  @Post()
  async initPresentation(
    @Body() request: InitPresentationRequestDto,
  ): Promise<InitPresentationResponseDto> {
    return this.presentationService.execute(request);
  }

  @Get('/:sessionId')
  async getPresentation(
    @Param('sessionId') sessionId: string,
    @Query() code?: string,
  ): Promise<GetPresentationResponseDto> {
    return this.presentationService.getPresentation(sessionId, code);
  }
}
