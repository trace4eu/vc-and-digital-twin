import { Injectable } from '@nestjs/common';
import { randomUUID, randomBytes } from "crypto";
import { CredentialOffer } from './dtos/types';


const generateNonce = (length=12): string => {
  return(randomBytes(length).toString("hex"))
}

@Injectable()
export class AppService {
  createCredentialOffer(): CredentialOffer {
    const uuid = randomUUID();
    const pre_authorized_code = generateNonce(32);

    const credentialOffer = {uuid, pre_authorized_code}

    return credentialOffer;
  }

  
}
