import { PresentationDefinition } from './presentationDefinition.interface';

export interface Openid4vpPrimitives {
  responseType: string;
  responseMode: string;
  clientId: string;
  state: string;
  presentationDefinition: PresentationDefinition;
  nonce: string;
  responseUri: string;
}

export class Openid4vp {
  constructor(
    private responseType: string,
    private responseMode: string,
    private clientId: string,
    private state: string,
    private presentationDefinition: PresentationDefinition,
    private nonce: string,
    private responseUri: string,
  ) {}

  static fromPrimitives(primitives: Openid4vpPrimitives): Openid4vp {
    return new Openid4vp(
      primitives.responseType,
      primitives.clientId,
      primitives.responseMode,
      primitives.state,
      primitives.presentationDefinition,
      primitives.nonce,
      primitives.responseUri,
    );
  }

  buildOpenid4vpUrl(
    sessionId: string,
    baseUrl: string,
    openid4vpRequestProtocol: string,
  ): string {
    const url = new URL(`${openid4vpRequestProtocol}authorize?`);
    url.searchParams.append('response_type', this.responseType);
    url.searchParams.append('client_id', this.clientId);
    url.searchParams.append('request_uri', `${baseUrl}/requests/${sessionId}`);
    return url.toString();
  }

  toPrimitives(): Openid4vpPrimitives {
    return {
      responseType: this.responseType,
      clientId: this.clientId,
      responseMode: this.responseMode,
      state: this.state,
      presentationDefinition: this.presentationDefinition,
      responseUri: this.responseUri,
      nonce: this.nonce,
    };
  }

  getClientId(): string {
    return this.clientId;
  }
}
