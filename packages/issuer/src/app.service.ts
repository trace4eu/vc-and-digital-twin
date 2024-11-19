import { Injectable } from '@nestjs/common';
import { randomBytes, randomUUID } from 'crypto';
import { CredentialOffer } from './dtos/types';

const generateNonce = (length = 12): string => {
  return randomBytes(length).toString('hex');
};

@Injectable()
export class AppService {
  createCredentialOffer(): CredentialOffer {
    const credentialOfferId = randomUUID();
    const preAuthCode = generateNonce(32);

    return { credentialOfferId, preAuthCode };
  }
}
