import { Injectable } from '@nestjs/common';
import { VerifierSessionRepository } from '../infrastructure/verifierSession.repository';
import VerificationRequestIdNotExistsException from '../exceptions/verificationSessionNotExists.exception';
import { VerificationProcessStatus } from '../domain/verifierSession';
import AlreadyVerifiedException from '../exceptions/alreadyVerified.exception';
import { SessionId } from '../domain/sessionId';

@Injectable()
export default class PresentationDefinitionService {
  constructor(private sessionRepository: VerifierSessionRepository) {}

  async execute(sessionId: string) {
    const verifierSession = await this.sessionRepository.getByKey(
      new SessionId(sessionId),
    );
    if (!verifierSession)
      throw new VerificationRequestIdNotExistsException(sessionId);
    if (verifierSession.getStatus() !== VerificationProcessStatus.PENDING) {
      throw new AlreadyVerifiedException(sessionId);
    }
    return verifierSession.getPresentationDefinition();
  }
}
