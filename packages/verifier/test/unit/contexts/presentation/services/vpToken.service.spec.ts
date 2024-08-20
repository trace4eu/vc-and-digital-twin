import { mock } from 'jest-mock-extended';
import { SessionId } from '../../../../../src/contexts/presentation/domain/sessionId';
import { Uuid } from '../../../../../src/contexts/shared/domain/uuid';
import ResolvedValue = jest.ResolvedValue;
import VpTokenService, {
  PresentationResult,
} from '../../../../../src/contexts/presentation/services/vpToken.service';
import { VerifierSessionRepository } from '../../../../../src/contexts/presentation/infrastructure/verifierSession.repository';
import { Openid4vpData } from '../../../../../src/contexts/presentation/services/presentation.service';
import {
  VerificationProcessStatus,
  VerifierSession,
} from '../../../../../src/contexts/presentation/domain/verifierSession';
import VerifierSessionAlreadyVerifiedException from '../../../../../src/contexts/presentation/exceptions/verifierSessionAlreadyVerified.exception';
import { VpValidatorWrapper } from '../../../../../src/contexts/shared/vpValidatorWrapper';
import { ConfigService } from '@nestjs/config';
import { ApiConfig } from '../../../../../config/configuration';

describe('VP token service should', () => {
  const verifierSessionRepository = mock<VerifierSessionRepository>();
  const vpValidatorWrapper = mock<VpValidatorWrapper>();
  const configService = new ConfigService<ApiConfig, true>();
  const vpTokenService = new VpTokenService(
    verifierSessionRepository,
    vpValidatorWrapper,
    configService,
  );

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
      presentation_submission: {
        id: 'a0b9a75a-95cc-49a6-818d-a2b18c2a417a',
        definition_id: 'holder-wallet-test-presentation',
        descriptor_map: [
          {
            format: 'jwt_vp',
            id: 'urn:did:123456',
            path: '$',
            path_nested: {
              format: 'jwt_vc',
              id: 'urn:did:123456',
              path: '$.vp.verifiableCredential[0]',
            },
          },
        ],
      },
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
      vp_token:
        'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImRpZDprZXk6ejJkbXpEODFjZ1B4OFZraTdKYnV1TW1GWXJXUGdZb3l0eWtVWjNleXFodDFqOUticDdjTFpMUnhzWnVFVGs5Qk5nM29WYVJURFFDTjh1WGF5eHlldDVaY2pnWnh2d251TVhZV0d6czdMeFgxczRHUmJMVUp3RkpIRnpFZU56QnM2VndLOFNKeWpyaUtqRTg2eEtGVEVBd1ZzN3F5U0hrcjhaM3lpbWhzU0w3YmtjTTdOdCN6MmRtekQ4MWNnUHg4VmtpN0pidXVNbUZZcldQZ1lveXR5a1VaM2V5cWh0MWo5S2JwN2NMWkxSeHNadUVUazlCTmczb1ZhUlREUUNOOHVYYXl4eWV0NVpjamdaeHZ3bnVNWFlXR3pzN0x4WDFzNEdSYkxVSndGSkhGekVlTnpCczZWd0s4U0p5anJpS2pFODZ4S0ZURUF3VnM3cXlTSGtyOFozeWltaHNTTDdia2NNN050In0.eyJpYXQiOjE3MDkxMTU0OTAsImV4cCI6NTEwOTQzNjgwMCwiaXNzIjoiZGlkOmtleTp6MmRtekQ4MWNnUHg4VmtpN0pidXVNbUZZcldQZ1lveXR5a1VaM2V5cWh0MWo5S2JwN2NMWkxSeHNadUVUazlCTmczb1ZhUlREUUNOOHVYYXl4eWV0NVpjamdaeHZ3bnVNWFlXR3pzN0x4WDFzNEdSYkxVSndGSkhGekVlTnpCczZWd0s4U0p5anJpS2pFODZ4S0ZURUF3VnM3cXlTSGtyOFozeWltaHNTTDdia2NNN050IiwiYXVkIjoiaHR0cHM6Ly9hcGktY29uZm9ybWFuY2UuZWJzaS5ldS9jb25mb3JtYW5jZS92My9hdXRoLW1vY2siLCJzdWIiOiJkaWQ6a2V5OnoyZG16RDgxY2dQeDhWa2k3SmJ1dU1tRllyV1BnWW95dHlrVVozZXlxaHQxajlLYnA3Y0xaTFJ4c1p1RVRrOUJOZzNvVmFSVERRQ044dVhheXh5ZXQ1WmNqZ1p4dndudU1YWVdHenM3THhYMXM0R1JiTFVKd0ZKSEZ6RWVOekJzNlZ3SzhTSnlqcmlLakU4NnhLRlRFQXdWczdxeVNIa3I4WjN5aW1oc1NMN2JrY003TnQiLCJuYmYiOjE3MDkxMTU0OTAsIm5vbmNlIjoiNDQ5ODNjNTctZGIyOS00ZDQwLWFmM2UtZmM3NDI4OTI1ODNjIiwic3RhdGUiOiI2OTU0MzEwMS0yZmZkLTQzNjUtOTg2Ny1hOGM0MDZiZmMwOTkiLCJqdGkiOiJ1cm46ZGlkOmYzZDg0YWNhLTRhZmUtNGU3Zi1iNTBlLTk0MWFkMWY3ZTVjNSIsInZwIjp7ImlkIjoidXJuOmRpZDpmM2Q4NGFjYS00YWZlLTRlN2YtYjUwZS05NDFhZDFmN2U1YzUiLCJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVQcmVzZW50YXRpb24iXSwiaG9sZGVyIjoiZGlkOmtleTp6MmRtekQ4MWNnUHg4VmtpN0pidXVNbUZZcldQZ1lveXR5a1VaM2V5cWh0MWo5S2JwN2NMWkxSeHNadUVUazlCTmczb1ZhUlREUUNOOHVYYXl4eWV0NVpjamdaeHZ3bnVNWFlXR3pzN0x4WDFzNEdSYkxVSndGSkhGekVlTnpCczZWd0s4U0p5anJpS2pFODZ4S0ZURUF3VnM3cXlTSGtyOFozeWltaHNTTDdia2NNN050IiwidmVyaWZpYWJsZUNyZWRlbnRpYWwiOlsiZXlKaGJHY2lPaUpGVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0lzSW10cFpDSTZJbVJwWkRwbFluTnBPbnB5Y20xUWRYUktUVFZqWjJScVIxRkdOR05FZVRWaUkzUkNOaTFVYjJreFdsSk9TM1ZmUkVkaVpHVnJiVXhETjJFM1R6SjBha1JEUTNaalVGZHlja2xMTTJNaWZRLmV5SnFkR2tpT2lKMWNtNDZaR2xrT2pFeU16UTFOaUlzSW5OMVlpSTZJbVJwWkRwclpYazZlakprYlhwRU9ERmpaMUI0T0ZacmFUZEtZblYxVFcxR1dYSlhVR2RaYjNsMGVXdFZXak5sZVhGb2RERnFPVXRpY0RkalRGcE1Vbmh6V25WRlZHczVRazVuTTI5V1lWSlVSRkZEVGpoMVdHRjVlSGxsZERWYVkycG5XbmgyZDI1MVRWaFpWMGQ2Y3pkTWVGZ3hjelJIVW1KTVZVcDNSa3BJUm5wRlpVNTZRbk0yVm5kTE9GTktlV3B5YVV0cVJUZzJlRXRHVkVWQmQxWnpOM0Y1VTBocmNqaGFNM2xwYldoelUwdzNZbXRqVFRkT2RDSXNJbWx6Y3lJNkltUnBaRHBsWW5OcE9ucHljbTFRZFhSS1RUVmpaMlJxUjFGR05HTkVlVFZpSWl3aWJtSm1Jam94TmpNMU56STBPREF3TENKbGVIQWlPakUyTXpneU16QTBNREFzSW1saGRDSTZNVFl6TlRVMU1qQXdNQ3dpZG1NaU9uc2lRR052Ym5SbGVIUWlPbHNpYUhSMGNITTZMeTkzZDNjdWR6TXViM0puTHpJd01UZ3ZZM0psWkdWdWRHbGhiSE12ZGpFaVhTd2lhV1FpT2lKMWNtNDZaR2xrT2pFeU16UTFOaUlzSW5SNWNHVWlPbHNpVm1WeWFXWnBZV0pzWlVOeVpXUmxiblJwWVd3aUxDSldaWEpwWm1saFlteGxRWFIwWlhOMFlYUnBiMjRpWFN3aWFYTnpkV1Z5SWpvaVpHbGtPbVZpYzJrNmVuSnliVkIxZEVwTk5XTm5aR3BIVVVZMFkwUjVOV0lpTENKcGMzTjFZVzVqWlVSaGRHVWlPaUl5TURJeExURXhMVEF4VkRBd09qQXdPakF3V2lJc0luWmhiR2xrUm5KdmJTSTZJakl3TWpFdE1URXRNREZVTURBNk1EQTZNREJhSWl3aWFYTnpkV1ZrSWpvaU1qQXlNUzB4TUMwek1GUXdNRG93TURvd01Gb2lMQ0pqY21Wa1pXNTBhV0ZzVTNWaWFtVmpkQ0k2ZXlKcFpDSTZJbVJwWkRwclpYazZlakprYlhwRU9ERmpaMUI0T0ZacmFUZEtZblYxVFcxR1dYSlhVR2RaYjNsMGVXdFZXak5sZVhGb2RERnFPVXRpY0RkalRGcE1Vbmh6V25WRlZHczVRazVuTTI5V1lWSlVSRkZEVGpoMVdHRjVlSGxsZERWYVkycG5XbmgyZDI1MVRWaFpWMGQ2Y3pkTWVGZ3hjelJIVW1KTVZVcDNSa3BJUm5wRlpVNTZRbk0yVm5kTE9GTktlV3B5YVV0cVJUZzJlRXRHVkVWQmQxWnpOM0Y1VTBocmNqaGFNM2xwYldoelUwdzNZbXRqVFRkT2RDSXNJbkJsY25OdmJtRnNTV1JsYm5ScFptbGxjaUk2SWtsVUwwUkZMekV5TXpRaUxDSm1ZVzFwYkhsT1lXMWxJam9pUTJGemRHRm1hVzl5YVNJc0ltWnBjbk4wVG1GdFpTSTZJa0pwWVc1allTSXNJbVJoZEdWUFprSnBjblJvSWpvaU1Ua3pNQzB4TUMwd01TSjlMQ0pqY21Wa1pXNTBhV0ZzVTJOb1pXMWhJanA3SW1sa0lqb2lhSFIwY0hNNkx5OWhjR2t0Y0dsc2IzUXVaV0p6YVM1bGRTOTBjblZ6ZEdWa0xYTmphR1Z0WVhNdGNtVm5hWE4wY25rdmRqSXZjMk5vWlcxaGN5OHdlREJtTkRGaE1XWTBPVE0wWlRFeFpqaG1PVGhsTkRRMFpXUXpOR1ppTURRd05qUTFaR05qTURSalpXRmtNbUZsTWpobVkyRXdOakpsWVdKbVlXTXhPREVpTENKMGVYQmxJam9pUm5Wc2JFcHpiMjVUWTJobGJXRldZV3hwWkdGMGIzSXlNREl4SW4wc0ltVjRjR2x5WVhScGIyNUVZWFJsSWpvaU1qQXlNUzB4TVMwek1GUXdNRG93TURvd01Gb2lmWDAuelZQREpqSFJUbjVkbDF0RWo3eGh3dzhvdTh1RkFBZHpJR1JjOXFqZGktZlBuY3drZ05CdVVQMGVzQi1PLWt5WmZRaDA1aW5WeWQtT2dCLU0yNnVxbGciXX19.qSQw6hmWFIY8hsx1jpidl0NgHZoC2wnWvtmai_qk-HiOEzpYROusM-VBAwAX8TxHJHC66WAQKvRgqfgOTnMbIg',
      presentation_submission: {
        id: 'a0b9a75a-95cc-49a6-818d-a2b18c2a417a',
        definition_id: 'holder-wallet-test-presentation',
        descriptor_map: [
          {
            format: 'jwt_vp',
            id: 'urn:did:123456',
            path: '$',
            path_nested: {
              format: 'jwt_vc',
              id: 'urn:did:123456',
              path: '$.vp.verifiableCredential[0]',
            },
          },
        ],
      },
    };
    const presentationResponse = await vpTokenService.execute(
      'f2459fae-4572-4c28-9b19-c90c8fa750a5',
      presentationRequest,
    );
    const expectedPresentationResponse = {
      valid: false,
      message: 'invalid state',
      redirectUri: 'openid://',
      state: 'state',
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
      vp_token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      presentation_submission: {
        id: 'a0b9a75a-95cc-49a6-818d-a2b18c2a417a',
        definition_id: 'holder-wallet-test-presentation',
        descriptor_map: [
          {
            format: 'jwt_vp',
            id: 'urn:did:123456',
            path: '$',
            path_nested: {
              format: 'jwt_vc',
              id: 'urn:did:123456',
              path: '$.vp.verifiableCredential[0]',
            },
          },
        ],
      },
    };

    await expect(
      vpTokenService.execute(
        'f2459fae-4572-4c28-9b19-c90c8fa750a5',
        presentationRequest,
      ),
    ).rejects.toThrow(VerifierSessionAlreadyVerifiedException);
  });
});
