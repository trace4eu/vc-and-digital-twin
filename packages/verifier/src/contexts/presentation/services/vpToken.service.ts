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
import { VpValidatorWrapper } from '../../shared/vpValidatorWrapper';
import { ConfigService } from '@nestjs/config';
import { ApiConfig } from '../../../../config/configuration';
import { ValidationResult } from '@trace4eu/verifiable-presentation';

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
  private ebsiAuthority: string;
  constructor(
    private verifierSessionRepository: VerifierSessionRepository,
    private vpValidatorWrapper: VpValidatorWrapper,
    private configService: ConfigService<ApiConfig, true>,
  ) {
    this.ebsiAuthority = this.configService.get<string>('ebsiAuthority');
  }

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

    this.state = verifierSession.getState();
    this.redirectUri = verifierSession.getRedirectUri();
    if (this.redirectUri) {
      this.code = Uuid.generate().toString();
      verifierSession.setCode(this.code);
    } else {
      this.redirectUri = 'openid://';
    }

    let result = this.validateVpFormat(presentationRequestDto.vp_token);
    if (!result.valid) return this.getResult(result);
    const decodedToken = joseWrapper.decodeJWT(
      presentationRequestDto.vp_token as string,
    );
    // validate state&nonce from jwt_vp
    result = this.validateVerifierSession(
      verifierSession,
      (decodedToken as { state: string }).state,
      (decodedToken as { nonce: string }).nonce,
    );
    if (!result.valid) return this.getResult(result);

    const validationResult: ValidationResult =
      await this.vpValidatorWrapper.validateJwtVP(
        presentationRequestDto.vp_token as string,
        (decodedToken as { aud: string }).aud,
        {
          presentationSubmission:
            presentationRequestDto.presentation_submission,
          presentationDefinition: verifierSession.getPresentationDefinition(),
          ebsiAuthority: this.ebsiAuthority,
        },
      );
    if (!validationResult.valid) {
      return this.getResult({
        valid: validationResult.valid,
        message: validationResult.messages?.concat().toString(),
      });
    }

    //update verifier session
    const verifierSessionPrimitives = verifierSession.toPrimitives();
    verifierSessionPrimitives.status = VerificationProcessStatus.VERIFIED;
    verifierSessionPrimitives.vpTokenData = validationResult.vpData;
    await this.verifierSessionRepository.save(
      VerifierSession.fromPrimitives(verifierSessionPrimitives),
    );

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
    nonce?: string,
  ) {
    if (verifierSession.getStatus() !== VerificationProcessStatus.PENDING) {
      throw new VerifierSessionAlreadyVerifiedException(
        verifierSession.getSessionId().toString(),
      );
    }
    if (state && verifierSession.getState() !== state)
      return { valid: false, message: 'invalid state' };
    if (nonce && verifierSession.getNonce() !== nonce)
      return { valid: false, message: 'invalid state' };
    return { valid: true };
  }

  private getResult(result: PresentationResult): PresentationResult {
    if (this.redirectUri) result.redirectUri = this.redirectUri;
    if (this.code) result.code = this.code;
    if (this.state) result.state = this.state;
    return result;
  }

  private validateVpFormat(vpToken: any): PresentationResult {
    if (typeof vpToken !== 'string') {
      return {
        valid: false,
        message: 'vp format not supported',
      } as PresentationResult;
    }
    try {
      joseWrapper.decodeJWT(vpToken);
      return { valid: true };
    } catch (error) {
      return { valid: false };
    }
  }
}
