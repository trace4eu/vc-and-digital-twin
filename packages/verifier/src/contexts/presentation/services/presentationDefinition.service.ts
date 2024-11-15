import { Injectable } from '@nestjs/common';
import { VerifierSessionRepository } from '../infrastructure/verifierSession.repository';
import VerifierSessionIdNotExistsException from '../exceptions/verifierSessionIdNotExists.exception';
import { VerificationProcessStatus } from '../domain/verifierSession';
import VerifierSessionAlreadyVerifiedException from '../exceptions/verifierSessionAlreadyVerified.exception';
import { SessionId } from '../domain/sessionId';

@Injectable()
export default class PresentationDefinitionService {
  constructor(private verifierSessionRepository: VerifierSessionRepository) {}

  async execute(sessionId: string) {
    const verifierSession = await this.verifierSessionRepository.getByKey(
      new SessionId(sessionId).toString(),
    );
    if (!verifierSession)
      throw new VerifierSessionIdNotExistsException(sessionId);
    if (verifierSession.getStatus() !== VerificationProcessStatus.PENDING) {
      throw new VerifierSessionAlreadyVerifiedException(sessionId);
    }
    return verifierSession.getPresentationDefinition();
  }
}
