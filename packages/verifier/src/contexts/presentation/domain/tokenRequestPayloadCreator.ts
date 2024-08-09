import { VerifierSessionPrimitives } from '../verifierSession';
import AuthenticationTokenRequestPrimitives, {
  AuthenticationTokenRequest,
} from '../authenticationTokenRequest';

export class TokenRequestPayloadCreator {
  constructor(private verifierSession: VerifierSessionPrimitives) {}

  static create(
    verifierSession: VerifierSessionPrimitives,
    clientId: string,
    requestObjectExp: number,
  ): AuthenticationTokenRequest {
    const tokenRequest: AuthenticationTokenRequestPrimitives = {
      state: verifierSession.openid4vpData.state,
      client_id: clientId,
      redirect_uri: `${clientId}/direct-post`,
      response_type: verifierSession.openid4vpData.responseType,
      response_mode: verifierSession.openid4vpData.responseMode,
      scope: 'openid',
      aud: 'https://self-issued.me/v2', //ToDO for idToken which value should be here
      nonce: verifierSession.openid4vpData.nonce,
      exp: Date.now() + requestObjectExp,
      iss: clientId, //ToDO issuer should be the authz server, but how to link
    };

    if (
      verifierSession.openid4vpData.responseType === 'vp_token' &&
      verifierSession.openid4vpData.presentationDefinitionMode === 'by_value'
    ) {
      tokenRequest.presentation_definition =
        verifierSession.openid4vpData.presentationDefinition;
    }
    if (
      verifierSession.openid4vpData.responseType === 'vp_token' &&
      verifierSession.openid4vpData.presentationDefinitionMode ===
        'by_reference'
    ) {
      tokenRequest.presentation_definition_uri = `${clientId}/presentation-definitions/${verifierSession.sessionId}`;
    }

    return AuthenticationTokenRequest.create(tokenRequest);
  }
}
