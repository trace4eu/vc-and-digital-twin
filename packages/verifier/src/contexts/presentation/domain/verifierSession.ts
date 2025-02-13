import { SessionId } from './sessionId';
import { Openid4vpData } from '../services/presentation.service';
import {
  PresentationDefinition,
  VPTokenData,
} from '@trace4eu/verifiable-presentation';

export enum VerificationProcessStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  ERROR = 'error',
}

export interface VerifierSessionPrimitives {
  sessionId: string;
  status: VerificationProcessStatus;
  openid4vpData: Openid4vpData;
  code?: string;
  vpTokenData?: VPTokenData;
  idToken?: string;
  errorMessage?: string;
}
export class VerifierSession {
  constructor(
    private sessionId: SessionId,
    private status: VerificationProcessStatus,
    private openid4vpData: Openid4vpData,
    private code?: string,
    private vpTokenData?: VPTokenData,
    private idToken?: string,
    private errorMessage?: string,
  ) {}

  static buildFromOpenid4vpRequest(
    sessionId: SessionId,
    openid4vpData: Openid4vpData,
  ) {
    return new VerifierSession(
      sessionId,
      VerificationProcessStatus.PENDING,
      openid4vpData,
    );
  }

  static fromPrimitives(
    primitives: VerifierSessionPrimitives,
  ): VerifierSession {
    return new VerifierSession(
      new SessionId(primitives.sessionId),
      primitives.status,
      primitives.openid4vpData,
      primitives.code,
      primitives.vpTokenData,
      primitives.idToken,
      primitives.errorMessage,
    );
  }

  toPrimitives(): VerifierSessionPrimitives {
    return {
      sessionId: this.sessionId.toString(),
      status: this.status,
      openid4vpData: this.openid4vpData,
      code: this.code,
      vpTokenData: this.vpTokenData,
      idToken: this.idToken,
      errorMessage: this.errorMessage,
    };
  }

  getSessionId(): SessionId {
    return this.sessionId;
  }

  getStatus(): VerificationProcessStatus {
    return this.status;
  }

  getPresentationDefinition(): PresentationDefinition | undefined {
    return this.openid4vpData?.presentationDefinition;
  }

  getState(): string | undefined {
    return this.openid4vpData.state;
  }
  getNonce(): string {
    return this.openid4vpData.nonce;
  }

  getRedirectUri(): string | undefined {
    return this.openid4vpData.redirectUri;
  }

  setCode(code: string) {
    this.code = code;
  }
}
