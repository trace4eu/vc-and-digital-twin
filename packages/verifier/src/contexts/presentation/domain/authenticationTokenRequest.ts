import { ClientMetadata } from './clientMetadata.interface';

export default interface AuthenticationTokenRequestPrimitives {
  state: string;
  client_id: string;
  redirect_uri?: string;
  response_uri?: string;
  response_type: string;
  response_mode: string;
  scope: 'openid';
  nonce: string;
  aud: string;
  iss: string;
  request?: string;
  request_uri?: string;
  exp?: number;
  presentation_definition?: object;
  presentation_definition_uri?: string;
  client_metadata?: ClientMetadata;
}

export class AuthenticationTokenRequest {
  public request?: string;
  public request_uri?: string;
  public response_uri?: string;
  public exp?: number;
  public presentation_definition?: object;
  public presentation_definition_uri?: string;
  public client_metadata?: ClientMetadata;
  private constructor(
    private state: string,
    private client_id: string,
    private response_type: string,
    private response_mode: string,
    private scope: 'openid',
    private nonce: string,
    private aud: string,
    private iss: string,
  ) {}
  static create(
    authenticationTokenRequestPrimitives: AuthenticationTokenRequestPrimitives,
  ): AuthenticationTokenRequest {
    const tokenRequest = new AuthenticationTokenRequest(
      authenticationTokenRequestPrimitives.state,
      authenticationTokenRequestPrimitives.client_id,
      authenticationTokenRequestPrimitives.response_type,
      authenticationTokenRequestPrimitives.response_mode,
      authenticationTokenRequestPrimitives.scope,
      authenticationTokenRequestPrimitives.nonce,
      authenticationTokenRequestPrimitives.aud,
      authenticationTokenRequestPrimitives.iss,
    );

    if (authenticationTokenRequestPrimitives.response_uri) {
      tokenRequest.response_uri =
        authenticationTokenRequestPrimitives.response_uri;
    }

    if (authenticationTokenRequestPrimitives.exp) {
      tokenRequest.exp = authenticationTokenRequestPrimitives.exp;
    }
    if (authenticationTokenRequestPrimitives.presentation_definition) {
      tokenRequest.presentation_definition =
        authenticationTokenRequestPrimitives.presentation_definition;
    }
    if (authenticationTokenRequestPrimitives.presentation_definition_uri) {
      tokenRequest.presentation_definition_uri =
        authenticationTokenRequestPrimitives.presentation_definition_uri;
    }
    if (authenticationTokenRequestPrimitives.request) {
      tokenRequest.request = authenticationTokenRequestPrimitives.request;
    }
    if (authenticationTokenRequestPrimitives.request_uri) {
      tokenRequest.request_uri =
        authenticationTokenRequestPrimitives.request_uri;
    }
    if (authenticationTokenRequestPrimitives.client_metadata) {
      tokenRequest.client_metadata =
        authenticationTokenRequestPrimitives.client_metadata;
    }
    return tokenRequest;
  }

  toPrimitives(): AuthenticationTokenRequestPrimitives {
    const tokenRequestPrimitives: AuthenticationTokenRequestPrimitives = {
      state: this.state,
      client_id: this.client_id,
      response_type: this.response_type,
      response_mode: this.response_mode,
      scope: this.scope,
      aud: this.aud,
      nonce: this.nonce,
      iss: this.iss,
    };
    if (this.response_uri) {
      tokenRequestPrimitives.response_uri = this.response_uri;
    }
    if (this.exp) {
      tokenRequestPrimitives.exp = this.exp;
    }
    if (this.presentation_definition) {
      tokenRequestPrimitives.presentation_definition =
        this.presentation_definition;
    }
    if (this.presentation_definition_uri) {
      tokenRequestPrimitives.presentation_definition_uri =
        this.presentation_definition_uri;
    }
    if (this.request) {
      tokenRequestPrimitives.request = this.request;
    }
    if (this.request_uri) {
      tokenRequestPrimitives.request_uri = this.request_uri;
    }
    if (this.client_metadata) {
      tokenRequestPrimitives.client_metadata = this.client_metadata;
    }
    return tokenRequestPrimitives;
  }
}
