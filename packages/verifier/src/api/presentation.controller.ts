import { Body, Controller, Post } from '@nestjs/common';
import { InitPresentationRequestDto } from './dtos/initPresentationRequest.dto';
import { InitPresentationResponseDto } from './dtos/initPresentationResponse.dto';
import PresentationService from '../contexts/presentation/services/presentation.service';

@Controller('presentations')
export class PresentationController {
  constructor(private presentationService: PresentationService) {}

  @Post()
  async initPresentation(
    @Body() request: InitPresentationRequestDto,
  ): Promise<InitPresentationResponseDto> {
    return this.presentationService.execute(request);
  }
}
