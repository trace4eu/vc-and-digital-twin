import { mock } from 'jest-mock-extended';
import ResolvedValue = jest.ResolvedValue;
import {
  DidJwtWrapper,
  VerificationResult,
} from '../../../../../src/contexts/shared/middleware/didJwtWrapper';
import { VerifierSessionRepository } from '../../../../../src/contexts/presentation/infrastructure/verifierSession.repository';
import IdTokenService from '../../../../../src/contexts/presentation/services/idToken.service';
import { Uuid } from '../../../../../src/contexts/shared/domain/uuid';
import { SessionId } from '../../../../../src/contexts/presentation/domain/sessionId';
import {
  VerificationProcessStatus,
  VerifierSession,
  VerifierSessionPrimitives,
} from '../../../../../src/contexts/presentation/domain/verifierSession';
import { Openid4vpData } from '../../../../../src/contexts/presentation/services/presentation.service';
import { InvalidIdTokenNonceException } from '../../../../../src/contexts/presentation/exceptions/invalidIdTokenNonce.exception';
import { InvalidIdTokenStateException } from '../../../../../src/contexts/presentation/exceptions/invalidIdTokenState.exception';
import IdTokenVerificationFailedException from '../../../../../src/contexts/presentation/exceptions/idTokenVerificationFailed.exception';
import VerifierSessionAlreadyVerifiedException from '../../../../../src/contexts/presentation/exceptions/verifierSessionAlreadyVerified.exception';

describe('IdTokenServiceShould', () => {
  const didJwtWrapper = mock<DidJwtWrapper>();
  const verifierSessionRepository = mock<VerifierSessionRepository>();
  const idTokenService = new IdTokenService(
    verifierSessionRepository,
    didJwtWrapper,
  );

  const idToken =
    'eyJraWQiOiJkaWQ6a2V5OnoyZG16RDgxY2dQeDhWa2k3SmJ1dU1tRllyV1BnWW95dHlrVVozZXlxaHQxajlLYnNFWXZkcmp4TWpRNHRwbmplOUJEQlR6dU5EUDNrbm42cUxaRXJ6ZDRiSjVnbzJDQ2hvUGpkNUdBSDN6cEZKUDVmdXdTazY2VTVQcTZFaEY0bktuSHpEbnpuRVA4Zlg5OW5aR2d3YkFoMW83R2oxWDUyVGRoZjdVNEtUazY2eHNBNXIjejJkbXpEODFjZ1B4OFZraTdKYnV1TW1GWXJXUGdZb3l0eWtVWjNleXFodDFqOUtic0VZdmRyanhNalE0dHBuamU5QkRCVHp1TkRQM2tubjZxTFpFcnpkNGJKNWdvMkNDaG9QamQ1R0FIM3pwRkpQNWZ1d1NrNjZVNVBxNkVoRjRuS25IekRuem5FUDhmWDk5blpHZ3diQWgxbzdHajFYNTJUZGhmN1U0S1RrNjZ4c0E1ciIsImFsZyI6IkVTMjU2SyIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJkaWQ6a2V5OnoyZG16RDgxY2dQeDhWa2k3SmJ1dU1tRllyV1BnWW95dHlrVVozZXlxaHQxajlLYnNFWXZkcmp4TWpRNHRwbmplOUJEQlR6dU5EUDNrbm42cUxaRXJ6ZDRiSjVnbzJDQ2hvUGpkNUdBSDN6cEZKUDVmdXdTazY2VTVQcTZFaEY0bktuSHpEbnpuRVA4Zlg5OW5aR2d3YkFoMW83R2oxWDUyVGRoZjdVNEtUazY2eHNBNXIiLCJzdWIiOiJkaWQ6a2V5OnoyZG16RDgxY2dQeDhWa2k3SmJ1dU1tRllyV1BnWW95dHlrVVozZXlxaHQxajlLYnNFWXZkcmp4TWpRNHRwbmplOUJEQlR6dU5EUDNrbm42cUxaRXJ6ZDRiSjVnbzJDQ2hvUGpkNUdBSDN6cEZKUDVmdXdTazY2VTVQcTZFaEY0bktuSHpEbnpuRVA4Zlg5OW5aR2d3YkFoMW83R2oxWDUyVGRoZjdVNEtUazY2eHNBNXIiLCJhdWQiOiJodHRwczovL2lzc3Vlci51cmwiLCJzdGF0ZSI6ImRlY2JiMTMyLTE0YmMtNDFmYy1hMmFlLTJlOTEyN2UxNmE3MiIsIm5vbmNlIjoiNmNiODg0NmMtOGU4My00ZWZjLTk1OWYtYTJmOWFkOTZjNzM5IiwiY2xpZW50X2lkIjoiZGlkOmtleTp6MmRtekQ4MWNnUHg4VmtpN0pidXVNbUZZcldQZ1lveXR5a1VaM2V5cWh0MWo5S2JzRVl2ZHJqeE1qUTR0cG5qZTlCREJUenVORFAza25uNnFMWkVyemQ0Yko1Z28yQ0Nob1BqZDVHQUgzenBGSlA1ZnV3U2s2NlU1UHE2RWhGNG5Lbkh6RG56bkVQOGZYOTluWkdnd2JBaDFvN0dqMVg1MlRkaGY3VTRLVGs2NnhzQTVyIiwiZXhwIjoxNzA3MTQzNjgwfQ.o5io-Q_2kOhInyHb920ruzar86K9nfUkMmVgJo_pEIwLdxTYWfKa_9YOMWoJpQI1ZJv-CPdiSbVL0nEzslwioA';
  const clientId =
    'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9KbsEYvdrjxMjQ4tpnje9BDBTzuNDP3knn6qLZErzd4bJ5go2CChoPjd5GAH3zpFJP5fuwSk66U5Pq6EhF4nKnHzDnznEP8fX99nZGgwbAh1o7Gj1X52Tdhf7U4KTk66xsA5r';

  beforeEach(() => {
    didJwtWrapper.verifyJWT.mockResolvedValue({
      verified: true,
    } as ResolvedValue<VerificationResult>);
  });

  it('process a directPost request and return the code for the authenticated user', async () => {
    const openid4vpData: Openid4vpData = {
      clientId,
      responseType: 'id_token',
      responseMode: 'direct_post',
      state: 'decbb132-14bc-41fc-a2ae-2e9127e16a72',
      nonce: '6cb8846c-8e83-4efc-959f-a2f9ad96c739',
    };
    const sessionId = new SessionId(Uuid.generate().toString());
    const verifierSession = new VerifierSession(
      sessionId,
      VerificationProcessStatus.PENDING,
      openid4vpData,
    );

    verifierSessionRepository.getByKey.mockResolvedValue(
      verifierSession as ResolvedValue<VerifierSession>,
    );

    const location = await idTokenService.execute(
      sessionId.toString(),
      idToken,
    );

    const verifierSessionPrimitives: VerifierSessionPrimitives = {
      openid4vpData: {
        clientId,
        responseType: 'id_token',
        responseMode: 'direct_post',
        state: 'decbb132-14bc-41fc-a2ae-2e9127e16a72',
        nonce: '6cb8846c-8e83-4efc-959f-a2f9ad96c739',
      },
      code: expect.any(String) as string,
      status: VerificationProcessStatus.VERIFIED,
      idToken,
      sessionId: sessionId.toString(),
    };

    expect(
      verifierSessionRepository.save.mockImplementation(),
    ).toHaveBeenCalledWith(
      VerifierSession.fromPrimitives(verifierSessionPrimitives),
    );
    expect(location).toContain('openid:');
    expect(location).toContain('state=decbb132-14bc-41fc-a2ae-2e9127e16a72');
  });

  it('raise an error if idToken nonce is different from VerifierSession nonce', async () => {
    const openid4vpData: Openid4vpData = {
      clientId,
      responseType: 'id_token',
      responseMode: 'direct_post',
      state: 'decbb132-14bc-41fc-a2ae-2e9127e16a72',
      nonce: 'wrong_nonce',
    };
    const sessionId = new SessionId(Uuid.generate().toString());
    const verifierSession = new VerifierSession(
      sessionId,
      VerificationProcessStatus.PENDING,
      openid4vpData,
    );

    verifierSessionRepository.getByKey.mockResolvedValue(
      verifierSession as ResolvedValue<VerifierSession>,
    );

    await expect(
      idTokenService.execute(sessionId.toString(), idToken),
    ).rejects.toThrow(InvalidIdTokenNonceException);
  });
  it('raise an error if idToken state is different from VerifierSession state', async () => {
    const openid4vpData: Openid4vpData = {
      clientId,
      responseType: 'id_token',
      responseMode: 'direct_post',
      state: 'wrong_state',
      nonce: '6cb8846c-8e83-4efc-959f-a2f9ad96c739',
    };
    const sessionId = new SessionId(Uuid.generate().toString());
    const verifierSession = new VerifierSession(
      sessionId,
      VerificationProcessStatus.PENDING,
      openid4vpData,
    );

    verifierSessionRepository.getByKey.mockResolvedValue(
      verifierSession as ResolvedValue<VerifierSession>,
    );

    await expect(
      idTokenService.execute(sessionId.toString(), idToken),
    ).rejects.toThrow(InvalidIdTokenStateException);
  });
  it('raise an error if signature is invalid', async () => {
    const openid4vpData: Openid4vpData = {
      clientId,
      responseType: 'id_token',
      responseMode: 'direct_post',
      state: 'decbb132-14bc-41fc-a2ae-2e9127e16a72',
      nonce: '6cb8846c-8e83-4efc-959f-a2f9ad96c739',
    };
    const sessionId = new SessionId(Uuid.generate().toString());
    const verifierSession = new VerifierSession(
      sessionId,
      VerificationProcessStatus.PENDING,
      openid4vpData,
    );

    verifierSessionRepository.getByKey.mockResolvedValue(
      verifierSession as ResolvedValue<VerifierSession>,
    );

    didJwtWrapper.verifyJWT.mockResolvedValue({
      verified: false,
    } as ResolvedValue<VerificationResult>);

    await expect(
      idTokenService.execute(sessionId.toString(), idToken),
    ).rejects.toThrow(IdTokenVerificationFailedException);
  });

  it('raise an error if already verified', async () => {
    const openid4vpData: Openid4vpData = {
      clientId,
      responseType: 'id_token',
      responseMode: 'direct_post',
      state: 'decbb132-14bc-41fc-a2ae-2e9127e16a72',
      nonce: '6cb8846c-8e83-4efc-959f-a2f9ad96c739',
    };
    const sessionId = new SessionId(Uuid.generate().toString());
    const verifierSession = new VerifierSession(
      sessionId,
      VerificationProcessStatus.VERIFIED,
      openid4vpData,
    );

    verifierSessionRepository.getByKey.mockResolvedValue(
      verifierSession as ResolvedValue<VerifierSession>,
    );
    await expect(
      idTokenService.execute(sessionId.toString(), idToken),
    ).rejects.toThrow(VerifierSessionAlreadyVerifiedException);
  });
});
