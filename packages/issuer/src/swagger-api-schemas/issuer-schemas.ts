import { ApiProperty } from '@nestjs/swagger';

//TODO: customize for specific use case
class CredentialSubject {
    @ApiProperty()
    age: number;

    @ApiProperty()
    name: string
}

export class CredentialData {
  @ApiProperty()
  credentialSubject: CredentialSubject; //todo make this of type as defined in the credentifal-configurations.ts --> how to generalize the code?

  @ApiProperty()
  type: string[];

  @ApiProperty({required: false})
  user_pin: string;
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
    "urn:ietf:params:oauth:grant-type:pre-authorized_code": {
      "pre-authorized_code": string;
      user_pin_required: boolean;
    }
  };
}