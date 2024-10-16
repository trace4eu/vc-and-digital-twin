import { Injectable } from '@nestjs/common';
import { InitPresentationRequestDto } from '../../../api/dtos/initPresentationRequest.dto';
import { InitPresentationResponseDto } from '../../../api/dtos/initPresentationResponse.dto';
import { Uuid } from '../../shared/domain/uuid';
import { ConfigService } from '@nestjs/config';
import { ApiConfig } from '../../../../config/configuration';
import {
  VerificationProcessStatus,
  VerifierSession,
  VerifierSessionPrimitives,
} from '../domain/verifierSession';
import { SessionId } from '../domain/sessionId';
import { VerifierSessionRepository } from '../infrastructure/verifierSession.repository';
import { buildB64QrCode } from '../../shared/middleware/qrCodeWrapper';
import { PresentationDefinition } from '@trace4eu/verifiable-presentation';
import { ClientMetadata } from '../domain/clientMetadata.interface';
import { getPublicJWKFromPublicHex } from '../../shared/middleware/jwkConverter';
import VerifierSessionIdNotExistsException from '../exceptions/verifierSessionIdNotExists.exception';
import { GetPresentationResponseDto } from '../../../api/dtos/getPresentationResponse.dto';
import VerifierSessionCodeNotValidException from '../exceptions/verifierSessionCodeNotValid.exception';

export interface Openid4vpData {
  clientId: string;
  responseType: string;
  responseMode: string;
  presentationDefinition?: PresentationDefinition;
  presentationDefinitionMode?: string;
  state: string;
  nonce: string;
  redirectUri?: string;
  clientMetadata?: ClientMetadata;
}
@Injectable()
export default class PresentationService {
  private readonly clientId: string;
  private readonly openid4vpRequestProtocol: string;
  private readonly clientMetadata: ClientMetadata;
  constructor(
    private configService: ConfigService<ApiConfig, true>,
    private verifierSessionRepository: VerifierSessionRepository,
  ) {
    this.clientId = this.configService.get<string>('verifierClientId');
    this.openid4vpRequestProtocol = this.configService.get<string>(
      'openid4vpRequestProtocol',
    );
    this.clientMetadata = {
      authorization_endpoint: 'openid4vp:',
      response_types_supported: ['vp_token', 'id_token'],
      vp_formats_supported: {
        jwt_vp: {
          alg_values_supported: ['ES256'],
        },
        jwt_vc: {
          alg_values_supported: ['ES256'],
        },
      },
      scopes_supported: ['openid'],
      subject_types_supported: ['public'],
      id_token_signing_alg_values_supported: ['ES256'],
      request_object_signing_alg_values_supported: ['ES256'],
      subject_syntax_types_supported: [
        'urn:ietf:params:oauth:jwk-thumbprint',
        'did:key:jwk_jcs-pub',
      ],
      id_token_types_supported: ['subject_signed_id_token'],
    };
  }
  async execute(
    initPresentationRequest: InitPresentationRequestDto,
  ): Promise<InitPresentationResponseDto> {
    const sessionId = new SessionId(Uuid.generate().toString());
    const state = Uuid.generate().toString();

    const openid4vpData = await this.buildOpenId4vpData(
      state,
      initPresentationRequest,
      this.clientMetadata,
    );

    const verifierSession = VerifierSession.buildFromOpenid4vpRequest(
      sessionId,
      openid4vpData,
    );

    await this.verifierSessionRepository.save(verifierSession);
    return this.buildOpenid4vpResponse(
      sessionId.toString(),
      this.openid4vpRequestProtocol,
      this.clientId,
    );
  }

  async getPresentation(
    sessionId: string,
    code?: string,
  ): Promise<GetPresentationResponseDto> {
    const verifierSession = await this.verifierSessionRepository.getByKey(
      new SessionId(sessionId),
    );
    if (!verifierSession)
      throw new VerifierSessionIdNotExistsException(sessionId);
    const verifierSessionPrimitives = verifierSession.toPrimitives();
    if (
      code &&
      verifierSessionPrimitives.code &&
      verifierSessionPrimitives.code !== code
    ) {
      throw new VerifierSessionCodeNotValidException();
    }

    return this.buildGetPresentationResponse(verifierSessionPrimitives);
  }

  private buildGetPresentationResponse(
    verifierSessionPrimitives: VerifierSessionPrimitives,
  ): GetPresentationResponseDto {
    if (
      verifierSessionPrimitives.status === VerificationProcessStatus.VERIFIED
    ) {
      return {
        vpTokenData: verifierSessionPrimitives.vpTokenData,
        status: VerificationProcessStatus.VERIFIED,
      };
    }
    if (verifierSessionPrimitives.status === VerificationProcessStatus.ERROR) {
      const response: GetPresentationResponseDto = {
        status: verifierSessionPrimitives.status,
      };
      if (verifierSessionPrimitives.errorMessage)
        response.errorMessage = verifierSessionPrimitives.errorMessage;
      return response;
    }
    return {
      status: VerificationProcessStatus.PENDING,
    };
  }

  private async buildOpenid4vpResponse(
    sessionId: string,
    openid4vpRequestProtocol: string,
    clientId: string,
  ): Promise<InitPresentationResponseDto> {
    const rawOpenid4vp = this.buildOpenid4vpUrl(
      sessionId,
      openid4vpRequestProtocol,
      clientId,
    );
    const qrBase64 = await buildB64QrCode(rawOpenid4vp);
    return {
      qrBase64: qrBase64,
      rawOpenid4vp: rawOpenid4vp,
    };
  }

  buildOpenid4vpUrl(
    sessionId: string,
    openid4vpRequestProtocol: string,
    clientId: string,
  ): string {
    const url = new URL(`${openid4vpRequestProtocol}authorize?`);
    url.searchParams.append('client_id', clientId);
    url.searchParams.append(
      'request_uri',
      `${clientId}/request.jwt/${sessionId}`,
    );
    return url.toString();
  }

  async buildOpenId4vpData(
    state: string,
    presentationRequest: InitPresentationRequestDto,
    clientMetadata: ClientMetadata,
  ): Promise<Openid4vpData> {
    const publicKeyJWK = await getPublicJWKFromPublicHex(
      this.configService.get<string>('authorizationServerPublicKey'),
    );
    const clientMetadataWithJwks = {
      ...clientMetadata,
      jwks: { keys: [publicKeyJWK] },
    };

    return {
      clientId: this.clientId,
      state: state,
      ...presentationRequest,
      clientMetadata: clientMetadataWithJwks,
    };
  }
}
