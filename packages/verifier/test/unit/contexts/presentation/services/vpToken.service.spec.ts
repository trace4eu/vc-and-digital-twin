import { mock } from 'jest-mock-extended';
import { SessionId } from '../../../../../src/contexts/presentation/domain/sessionId';
import { Uuid } from '../../../../../src/contexts/shared/domain/uuid';
import ResolvedValue = jest.ResolvedValue;
import VpTokenService, {
  PresentationResult,
} from '../../../../../src/contexts/presentation/services/vpToken.service';
import { VerifierSessionRepository } from '../../../../../src/contexts/presentation/infrastructure/verifierSession.repository';
import { Openid4vpData } from '../../../../../src/contexts/presentation/services/presentation.service';
import { PresentationDefinition } from '../../../../../src/contexts/presentation/domain/presentationDefinition.interface';
import { ClientMetadata } from '../../../../../src/contexts/presentation/domain/clientMetadata.interface';
import {
  VerificationProcessStatus,
  VerifierSession,
} from '../../../../../src/contexts/presentation/domain/verifierSession';
import VerifierSessionAlreadyVerifiedException from '../../../../../src/contexts/presentation/exceptions/verifierSessionAlreadyVerified.exception';

describe('VP token service should', () => {
  const verifierSessionRepository = mock<VerifierSessionRepository>();
  const vpTokenService = new VpTokenService(verifierSessionRepository);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('return an error if session is already expired', async () => {
    verifierSessionRepository.getByKey.mockResolvedValue(
      undefined as ResolvedValue<any>,
    );

    const presentationRequest = {
      state: 'state',
      vp_token: 'vp_token',
      presentation_submission: 'presentation_submission',
    };
    const presentationResponse = await vpTokenService.execute(
      'f2459fae-4572-4c28-9b19-c90c8fa750a5',
      presentationRequest,
    );
    const expectedPresentationResponse: PresentationResult = {
      valid: false,
      message: 'session expired',
    };

    expect(presentationResponse).toStrictEqual(expectedPresentationResponse);
  });
  it('return an error if state is wrong', async () => {
    const openid4vpData: Openid4vpData = {
      responseType: 'vp_token',
      responseMode: 'direct_post',
      presentationDefinition: {
        id: 'id',
        input_descriptors: [
          {
            id: 'id',
            constraints: {},
          },
        ],
      },
      presentationDefinitionMode: 'by_value',
      state: 'state',
      nonce: '1234',
    };
    const verifierSession = new VerifierSession(
      new SessionId(Uuid.generate().toString()),
      VerificationProcessStatus.PENDING,
      openid4vpData,
    );
    verifierSessionRepository.getByKey.mockResolvedValue(
      verifierSession as ResolvedValue<VerifierSession>,
    );

    const presentationRequest = {
      state: 'wrong_state',
      vp_token: 'vp_token',
      presentation_submission: 'presentation_submission',
    };
    const presentationResponse = await vpTokenService.execute(
      'f2459fae-4572-4c28-9b19-c90c8fa750a5',
      presentationRequest,
    );
    const expectedPresentationResponse = {
      valid: false,
      message: 'invalid state',
    };

    expect(presentationResponse).toStrictEqual(expectedPresentationResponse);
  });
  it('raise an exception if verifier session has been already verified', async () => {
    const openid4vpData: Openid4vpData = {
      responseType: 'vp_token',
      responseMode: 'direct_post',
      presentationDefinition: {
        id: 'id',
        input_descriptors: [
          {
            id: 'id',
            constraints: {},
          },
        ],
      },
      presentationDefinitionMode: 'by_value',
      state: 'state',
      nonce: '1234',
    };
    const verifierSession = new VerifierSession(
      new SessionId(Uuid.generate().toString()),
      VerificationProcessStatus.VERIFIED,
      openid4vpData,
    );
    verifierSessionRepository.getByKey.mockResolvedValue(
      verifierSession as ResolvedValue<VerifierSession>,
    );

    const presentationRequest = {
      state: 'state',
      vp_token: 'vp_token',
      presentation_submission: 'presentation_submission',
    };

    await expect(
      vpTokenService.execute(
        'f2459fae-4572-4c28-9b19-c90c8fa750a5',
        presentationRequest,
      ),
    ).rejects.toThrow(VerifierSessionAlreadyVerifiedException);
  });
});
