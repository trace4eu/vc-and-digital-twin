import {
  IsIn,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { PresentationDefinition } from '@trace4eu/verifiable-presentation';

export class InitPresentationRequestDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(['vp_token', 'id_token'])
  responseType: string;

  @IsNotEmpty()
  @IsObject()
  presentationDefinition: PresentationDefinition;

  @IsNotEmpty()
  @IsString()
  nonce: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['direct_post'])
  responseMode: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['by_value', 'by_reference'])
  presentationDefinitionMode: string;

  @IsOptional()
  @IsString()
  redirectUri?: string;
}
