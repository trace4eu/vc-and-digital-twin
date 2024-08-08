import { Injectable } from '@nestjs/common';
import { InitPresentationRequestDto } from '../../../api/dtos/initPresentationRequest.dto';
import { InitPresentationResponseDto } from '../../../api/dtos/initPresentationResponse.dto';
import { Uuid } from '../../shared/domain/uuid';
import { Openid4vp } from '../domain/openid4vp';
import { ConfigService } from '@nestjs/config';
import { ApiConfig } from '../../../../config/configuration';
import { VerifierSession } from '../domain/verifierSession';
import { SessionId } from '../domain/sessionId';
import { VerifierSessionRepository } from '../infrastructure/verifierSession.repository';
import { buildB64QrCode } from '../../shared/qrCodeWrapper';
import { PresentationDefinition } from '../domain/presentationDefinition.interface';

export interface Openid4vpData {
  responseType: string;
  responseMode: string;
  presentationDefinition: PresentationDefinition;
  presentationDefinitionMode: string;
  state: string;
  callbackUrl: string;
  nonce: string;
}
@Injectable()
export default class PresentationService {
  constructor(
    private configService: ConfigService<ApiConfig, true>,
    private sessionRepository: VerifierSessionRepository,
  ) {}
  async execute(
    initPresentationRequest: InitPresentationRequestDto,
  ): Promise<InitPresentationResponseDto> {
    const sessionId = new SessionId(Uuid.generate().toString());
    const state = Uuid.generate().toString();
    const clientId = this.configService.get<string>('verifierClientId');
    const baseUrl = this.configService.get<string>('verifierPublicUrl');
    const openid4vpRequestProtocol = this.configService.get<string>(
      'openid4vpRequestProtocol',
    );

    // build OpenID4VP object
    const openid4vp = new Openid4vp(
      initPresentationRequest.responseType,
      initPresentationRequest.responseMode,
      clientId,
      state,
      initPresentationRequest.presentationDefinition,
      initPresentationRequest.nonce,
      `${clientId}/direct-post`,
    );

    const openid4vpData: Openid4vpData = {
      state: state,
      ...initPresentationRequest,
    };

    const verifierSession = VerifierSession.buildFromOpenid4vpRequest(
      sessionId,
      openid4vpData,
    );

    await this.sessionRepository.save(verifierSession);
    return this.buildOpenid4vpResponse(
      sessionId.toString(),
      openid4vp,
      baseUrl,
      openid4vpRequestProtocol,
    );
  }

  private async buildOpenid4vpResponse(
    sessionId: string,
    openid4vp: Openid4vp,
    baseUrl: string,
    openid4vpRequestProtocol: string,
  ): Promise<InitPresentationResponseDto> {
    const rawOpenid4vp = openid4vp.buildOpenid4vpUrl(
      sessionId,
      baseUrl,
      openid4vpRequestProtocol,
    );
    const qrBase64 = await buildB64QrCode(rawOpenid4vp);
    return {
      client_id: openid4vp.getClientId(),
      request_uri: `${baseUrl}/requests/${sessionId}`,
      qrBase64: qrBase64,
      rawOpenid4vp: rawOpenid4vp,
    };
  }
}
