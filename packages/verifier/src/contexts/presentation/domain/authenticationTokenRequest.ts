export default interface AuthenticationTokenRequestPrimitives {
  state: string;
  client_id: string;
  redirect_uri: string;
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
}

export class AuthenticationTokenRequest {
  public request?: string;
  public request_uri?: string;
  public exp?: number;
  public presentation_definition?: object;
  public presentation_definition_uri?: string;
  private constructor(
    private state: string,
    private client_id: string,
    private redirect_uri: string,
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
      authenticationTokenRequestPrimitives.redirect_uri,
      authenticationTokenRequestPrimitives.response_type,
      authenticationTokenRequestPrimitives.response_mode,
      authenticationTokenRequestPrimitives.scope,
      authenticationTokenRequestPrimitives.nonce,
      authenticationTokenRequestPrimitives.aud,
      authenticationTokenRequestPrimitives.iss,
    );

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
    return tokenRequest;
  }

  toPrimitives(): AuthenticationTokenRequestPrimitives {
    const tokenRequestPrimitives: AuthenticationTokenRequestPrimitives = {
      state: this.state,
      client_id: this.client_id,
      redirect_uri: this.redirect_uri,
      response_type: this.response_type,
      response_mode: this.response_mode,
      scope: this.scope,
      aud: this.aud,
      nonce: this.nonce,
      iss: this.iss,
    };
    if (this.exp) {
      tokenRequestPrimitives.exp = this.exp;
    }
    if (this.presentation_definition) {
      tokenRequestPrimitives.presentation_definition =
        this.presentation_definition;
    }
    if (this.request) {
      tokenRequestPrimitives.request = this.request;
    }
    if (this.request_uri) {
      tokenRequestPrimitives.request_uri = this.request_uri;
    }
    return tokenRequestPrimitives;
  }

  toURLSearchParams(): URLSearchParams {
    const { exp, presentation_definition, ...rest } = this.toPrimitives();
    const urlParams = new URLSearchParams(rest);
    if (exp) {
      urlParams.append('exp', String(exp));
    }
    if (presentation_definition) {
      urlParams.append(
        'presentation_definition',
        JSON.stringify(presentation_definition),
      );
    }
    return urlParams;
  }
}
