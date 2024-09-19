import { ApiProperty } from '@nestjs/swagger';

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
}