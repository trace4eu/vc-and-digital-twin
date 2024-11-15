import { ApiProperty } from '@nestjs/swagger';

export class PostDirectPostBody {
  @ApiProperty()
  state: string;

  @ApiProperty()
  id_token: string;
}

export class PostTokenBody {
    @ApiProperty({
      description: 'Client identifier',
      example: 'client123',
    })
    client_id: string;
  
    @ApiProperty({
      description: 'Authorization code',
      example: 'authCode123',
      required: false,
    })
    code?: string;
  
    @ApiProperty({
      description: 'Code verifier used in PKCE',
      example: 'codeVerifier123',
      required: false,
    })
    code_verifier?: string;
  
    @ApiProperty({
      description: 'Grant type for the token request',
      example: 'authorization_code',
    })
    grant_type: string;
  
    @ApiProperty({
      description: 'User PIN for verification in pre-authorized code flow',
      example: '1234',
      required: false,
    })
    user_pin?: string;
  
    @ApiProperty({
      description: 'Pre-authorized code',
      example: 'preAuthCode123',
      required: false,
    })
    pre_authorized_code?: string;
}