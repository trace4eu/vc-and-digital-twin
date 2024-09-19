import { ApiProperty } from '@nestjs/swagger';

class CredentialSubject {
    @ApiProperty()
    age: number;

    @ApiProperty()
    name: string
}

export class CredentialData {
  @ApiProperty()
  credentialSubject: CredentialSubject;

  @ApiProperty()
  type: string[];
}