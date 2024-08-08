import { SessionId } from './sessionId';
import { Openid4vpData } from '../services/presentation.service';
import { PresentationDefinition } from './presentationDefinition.interface';

export enum VerificationProcessStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
}

export interface VerifierSessionPrimitives {
  sessionId: string;
  status: VerificationProcessStatus;
  openid4vpData?: Openid4vpData;
  openid4vpAuthorizeData?: Openid4vpAuthorizeData;
  code?: string;
}

export interface Openid4vpAuthorizeData {
  nonce?: string;
  clientId: string;
  redirectUri: string;
  state?: string;
  tokenState?: string;
  presentationDefinition?: PresentationDefinition;
}

export class VerifierSession {
  constructor(
    private sessionId: SessionId,
    private status: VerificationProcessStatus,
    private openid4vpData?: Openid4vpData,
    private openid4vpAuthorizeData?: Openid4vpAuthorizeData,
    private code?: string,
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
      primitives.openid4vpAuthorizeData,
      primitives.code,
    );
  }

  toPrimitives(): VerifierSessionPrimitives {
    return {
      sessionId: this.sessionId.toString(),
      status: this.status,
      openid4vpData: this.openid4vpData,
      openid4vpAuthorizeData: this.openid4vpAuthorizeData,
      code: this.code,
    };
  }

  getSessionId(): SessionId {
    return this.sessionId;
  }

  getStatus(): VerificationProcessStatus {
    return this.status;
  }

  getPresentationDefinition(): PresentationDefinition | undefined {
    if (this.openid4vpData?.presentationDefinition) {
      return this.openid4vpData.presentationDefinition;
    }
    if (this.openid4vpAuthorizeData?.presentationDefinition) {
      return this.openid4vpAuthorizeData.presentationDefinition;
    }
    return undefined;
  }

  getState(): string | undefined {
    if (this.openid4vpData?.state) {
      return this.openid4vpData.state;
    }
    if (this.openid4vpAuthorizeData?.state) {
      return this.openid4vpAuthorizeData.state;
    }
    return undefined;
  }
  getRedirectUri(): string {
    return this.openid4vpAuthorizeData?.redirectUri ?? 'openid://';
  }

  getCode(): string | undefined {
    return this.code;
  }

  getCallbackURL(): string | undefined {
    return this.openid4vpData?.callbackUrl;
  }

  setCode(code: string) {
    this.code = code;
  }
}
