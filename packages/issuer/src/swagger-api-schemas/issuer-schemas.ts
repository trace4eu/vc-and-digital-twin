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

export class CredentialOffer {
  @ApiProperty()
  rawCredentialOffer: string;

  @ApiProperty()
  qrBase64: string;
}