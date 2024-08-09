import { Injectable } from '@nestjs/common';
import { InitPresentationRequestDto } from '../../../api/dtos/initPresentationRequest.dto';
import { InitPresentationResponseDto } from '../../../api/dtos/initPresentationResponse.dto';
import { Uuid } from '../../shared/domain/uuid';
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
  private readonly clientId: string;
  private readonly openid4vpRequestProtocol: string;
  constructor(
    private configService: ConfigService<ApiConfig, true>,
    private sessionRepository: VerifierSessionRepository,
  ) {
    this.clientId = this.configService.get<string>('verifierClientId');
    this.openid4vpRequestProtocol = this.configService.get<string>(
      'openid4vpRequestProtocol',
    );
  }
  async execute(
    initPresentationRequest: InitPresentationRequestDto,
  ): Promise<InitPresentationResponseDto> {
    const sessionId = new SessionId(Uuid.generate().toString());
    const state = Uuid.generate().toString();

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
      this.openid4vpRequestProtocol,
      this.clientId,
    );
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
}
