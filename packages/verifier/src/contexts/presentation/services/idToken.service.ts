import { Injectable } from '@nestjs/common';
import { VerifierSessionRepository } from '../infrastructure/verifierSession.repository';

@Injectable()
export default class IdTokenService {
  constructor(private verifierSessionRepository: VerifierSessionRepository) {}

  async execute(sessionId: string, idToken: string): Promise<string> {
    return 'string';
  }
}
