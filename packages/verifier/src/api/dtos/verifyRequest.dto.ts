import { IsObject, IsOptional, IsString } from 'class-validator';
import { PresentationSubmission } from '@trace4eu/verifiable-presentation';

export class VerifyRequestDto {
  @IsOptional()
  state?: string;

  @IsOptional()
  vp_token: object | object[] | string | string[];

  @IsOptional()
  @IsString()
  id_token?: string;

  @IsOptional()
  @IsObject()
  presentation_submission: PresentationSubmission;
}
