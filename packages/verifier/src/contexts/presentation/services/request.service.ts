import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiConfig } from '../../../../config/configuration';
import { VerifierSessionRepository } from '../infrastructure/verifierSession.repository';
import { SessionId } from '../domain/sessionId';
import { VerificationProcessStatus } from '../domain/verifierSession';
import VerifierSessionIdNotExistsException from '../exceptions/verifierSessionIdNotExists.exception';
import VerifierSessionAlreadyVerifiedException from '../exceptions/verifierSessionAlreadyVerified.exception';
import { TokenRequestPayloadCreator } from '../domain/tokenRequestPayloadCreator';
import { AuthenticationTokenRequest } from '../domain/authenticationTokenRequest';
import joseWrapper from '../../shared/middleware/joseWrapper';
import { getJWKfromHex } from '../../shared/middleware/jwkConverter';

@Injectable()
export default class RequestService {
  private readonly clientId: string;
  private readonly requestObjectExp: number;
  // ToDO authz server keys check how to manage this
  private readonly authorizationServerPublicKey: string;
  private readonly authorizationServerPrivateKey: string;

  constructor(
    private configService: ConfigService<ApiConfig, true>,
    private verifierSessionRepository: VerifierSessionRepository,
  ) {
    this.clientId = this.configService.get<string>('verifierClientId');
    this.requestObjectExp = this.configService.get<number>(
      'openid4vpRequestObjectExp',
    );
    this.authorizationServerPublicKey = this.configService.get<string>(
      'authorizationServerPublicKey',
    );
    this.authorizationServerPrivateKey = this.configService.get<string>(
      'authorizationServerPrivateKey',
    );
  }

  async execute(sessionId: string) {
    const verifierSession = await this.verifierSessionRepository.getByKey(
      new SessionId(sessionId).toString(),
    );
    if (!verifierSession)
      throw new VerifierSessionIdNotExistsException(sessionId);
    if (verifierSession.getStatus() !== VerificationProcessStatus.PENDING) {
      throw new VerifierSessionAlreadyVerifiedException(sessionId);
    }
    // payload creator
    const authenticationTokenRequest = TokenRequestPayloadCreator.create(
      verifierSession.toPrimitives(),
      this.clientId,
      this.requestObjectExp,
    );

    return this.signAuthenticationTokenRequest(authenticationTokenRequest);
  }

  private async signAuthenticationTokenRequest(
    authenticationTokenRequest: AuthenticationTokenRequest,
  ) {
    const jwtHeader = {
      typ: 'oauth-authz-req+jwt',
      alg: 'ES256',
    };
    return await joseWrapper.signJwt(
      await getJWKfromHex(
        this.authorizationServerPublicKey,
        this.authorizationServerPrivateKey,
      ),
      jwtHeader,
      Buffer.from(JSON.stringify(authenticationTokenRequest.toPrimitives())),
      this.requestObjectExp,
    );
  }
}
