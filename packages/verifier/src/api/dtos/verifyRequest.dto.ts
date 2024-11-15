import { IsOptional, IsString } from 'class-validator';

export class VerifyRequestDto {
  @IsOptional()
  state?: string;

  @IsOptional()
  vp_token: object | object[] | string | string[];

  @IsOptional()
  @IsString()
  id_token?: string;

  @IsOptional()
  @IsString()
  presentation_submission: string;
}
