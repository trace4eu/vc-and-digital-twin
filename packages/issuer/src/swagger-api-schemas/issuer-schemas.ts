import { ApiProperty } from '@nestjs/swagger';

class CredentialSubject {
  [x: string]: any;
}

export class CredentialOfferRequest {
  @ApiProperty()
  credentialSubject: CredentialSubject;

  @ApiProperty()
  type: string;

  @ApiProperty({ required: false })
  user_pin?: number;
}

export class CredentialOffer extends CredentialOfferRequest {
  pre_auth_code: string;
  types: string[];
}

export class CredentialOfferResponse {
  @ApiProperty()
  rawCredentialOffer: string;

  @ApiProperty()
  qrBase64: string;
}

export class CredentialIssuanceResponse {
  @ApiProperty()
  format: string;

  @ApiProperty()
  credential: any;

  @ApiProperty()
  c_nonce: string;

  @ApiProperty()
  c_nonce_expires_in: number;
}

export class CredentialOfferInformationResponse {
  @ApiProperty()
  credential_issuer: string;

  @ApiProperty()
  credentials: any;

  @ApiProperty()
  grants: {
    'urn:ietf:params:oauth:grant-type:pre-authorized_code': {
      'pre-authorized_code': string;
      user_pin_required: boolean;
    };
  };
}

export class Proof {
  @ApiProperty()
  proof_type: string;

  @ApiProperty()
  jwt: string;
}
export class CredentialRequest {
  @ApiProperty()
  types: string[];

  @ApiProperty()
  format?: string;

  @ApiProperty()
  proof: Proof;
}

export class TrustFramework {
  @ApiProperty()
  name: string;
  @ApiProperty()
  type: string;
  @ApiProperty()
  uri?: string;
  @ApiProperty()
  accreditation_uri?: string;
}

export class Display {
  @ApiProperty()
  name: string;
  @ApiProperty()
  locale: string;
  @ApiProperty()
  logo?: {
    url: string;
  };
  @ApiProperty()
  description?: string;
  @ApiProperty()
  background_color?: string;
  @ApiProperty()
  text_color?: string;
}

export class CredentialIssuerMetadataResponse {
  @ApiProperty()
  authorization_server: string;
  @ApiProperty()
  credential_issuer: string;
  @ApiProperty()
  credential_endpoint: string;
  @ApiProperty()
  deferred_credential_endpoint?: string;
  @ApiProperty()
  credentials_supported: CredentialsSupported[];
  @ApiProperty()
  display?: Display[];
}

export class CredentialsSupported {
  @ApiProperty()
  format: string;
  @ApiProperty()
  types?: string[];
  @ApiProperty()
  trust_framework?: TrustFramework;
  @ApiProperty()
  display: Display[];
}
