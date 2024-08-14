import { Injectable } from '@nestjs/common';
import { VerifierSessionRepository } from '../infrastructure/verifierSession.repository';
import { PresentationRequest } from '../domain/presentationRequest.interface';
import { SessionId } from '../domain/sessionId';
import {
  VerificationProcessStatus,
  VerifierSession,
} from '../domain/verifierSession';
import joseWrapper from '../../shared/joseWrapper';
import { Uuid } from '../../shared/domain/uuid';
import VerifierSessionAlreadyVerifiedException from '../exceptions/verifierSessionAlreadyVerified.exception';

export interface PresentationResult {
  valid: boolean;
  message?: string;
  redirectUri?: string;
  code?: string;
  state?: string;
}

@Injectable()
export default class VpTokenService {
  private redirectUri: string | undefined;
  private code: string;
  private state: string | undefined;
  constructor(private verifierSessionRepository: VerifierSessionRepository) {}

  async execute(
    sessionId: string,
    presentationRequestDto: PresentationRequest,
  ): Promise<PresentationResult> {
    const verifierSession = await this.getSessionData(sessionId);
    if (!verifierSession) {
      return {
        valid: false,
        message: 'session expired',
      } as PresentationResult;
    }
    const result: PresentationResult = this.validateVerifierSession(
      verifierSession,
      presentationRequestDto.state,
    );
    if (!result.valid) return result;

    this.state = verifierSession.getState();
    this.redirectUri = verifierSession.getCallbackURL();
    if (this.redirectUri) {
      this.code = Uuid.generate().toString();
      verifierSession.setCode(this.code);
    } else {
      this.redirectUri = 'openid://';
    }

    let decodedToken = presentationRequestDto.vp_token;
    let isJwtVP = false;
    if (typeof decodedToken === 'string') {
      isJwtVP = true;
      decodedToken = joseWrapper.decodeJWT(
        presentationRequestDto.vp_token as string,
      );
    }

    // validate Presentation
    // if not valid return { valid: false, message }
    // if valid => extract data (vpTokenIssuer, verifiableCredentials, verifiableCredentialsDecoded, descriptorMapIds, presentationSubmission)
    // use library vp-validator fr that purpose
    // update verifier session
    // ToDO: status list credential (revocation)

    return this.getResult(result);
  }

  private async getSessionData(sessionId: string) {
    return await this.verifierSessionRepository.getByKey(
      new SessionId(sessionId),
    );
  }

  private validateVerifierSession(
    verifierSession: VerifierSession,
    state?: string,
  ) {
    if (verifierSession.getStatus() !== VerificationProcessStatus.PENDING) {
      throw new VerifierSessionAlreadyVerifiedException(
        verifierSession.getSessionId().toString(),
      );
    }
    if (state && verifierSession.getState() !== state)
      return { valid: false, message: 'invalid state' };
    return { valid: true };
  }

  private getResult(result: PresentationResult): PresentationResult {
    return {
      ...result,
      redirectUri: this.redirectUri,
      code: this.code,
      state: this.state,
    };
  }
}
