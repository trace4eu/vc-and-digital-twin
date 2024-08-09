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
  openid4vpData: Openid4vpData;
  code?: string;
}
export class VerifierSession {
  constructor(
    private sessionId: SessionId,
    private status: VerificationProcessStatus,
    private openid4vpData: Openid4vpData,
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
      primitives.code,
    );
  }

  toPrimitives(): VerifierSessionPrimitives {
    return {
      sessionId: this.sessionId.toString(),
      status: this.status,
      openid4vpData: this.openid4vpData,
      code: this.code,
    };
  }

  getSessionId(): SessionId {
    return this.sessionId;
  }

  getStatus(): VerificationProcessStatus {
    return this.status;
  }

  getPresentationDefinition(): PresentationDefinition {
    return this.openid4vpData.presentationDefinition;
  }

  getState(): string | undefined {
    if (this.openid4vpData?.state) {
      return this.openid4vpData.state;
    }
    return undefined;
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
