import { Injectable } from '@nestjs/common';
import { VerifierSessionRepository } from '../infrastructure/verifierSession.repository';
import { Uuid } from '../../shared/domain/uuid';
import { SessionId } from '../domain/sessionId';
import VerifierSessionAlreadyVerifiedException from '../exceptions/verifierSessionAlreadyVerified.exception';
import {
  VerificationProcessStatus,
  VerifierSession,
  VerifierSessionPrimitives,
} from '../domain/verifierSession';
import { DidJwtWrapper } from '../../shared/middleware/didJwtWrapper';
import IdTokenVerificationFailedException from '../exceptions/idTokenVerificationFailed.exception';
import { decodeJWT } from 'did-jwt';
import { IdTokenNonceNotFoundException } from '../exceptions/idTokenNonceNotFound.exception';
import { InvalidIdTokenNonceException } from '../exceptions/invalidIdTokenNonce.exception';
import { InvalidIdTokenStateException } from '../exceptions/invalidIdTokenState.exception';
import { IdTokenStateNotFoundException } from '../exceptions/idTokenStateNotFound.exception';

@Injectable()
export default class IdTokenService {
  constructor(
    private verifierSessionRepository: VerifierSessionRepository,
    private didJwtWrapper: DidJwtWrapper,
  ) {}

  async execute(sessionId: string, idToken: string): Promise<string> {
    const verifierSession = await this.verifierSessionRepository.getByKey(
      new SessionId(sessionId).toString(),
    );
    if (
      !verifierSession ||
      verifierSession.getStatus() !== VerificationProcessStatus.PENDING
    ) {
      throw new VerifierSessionAlreadyVerifiedException(sessionId);
    }

    let verifierSessionPrimitives = verifierSession.toPrimitives();

    const validationResult = await this.didJwtWrapper.verifyJWT(
      idToken,
      verifierSessionPrimitives.openid4vpData.clientId,
    );
    if (!validationResult.verified) {
      throw new IdTokenVerificationFailedException(
        validationResult.errorMessage ? validationResult.errorMessage : '',
      );
    }

    const decodedToken = decodeJWT(idToken);
    const { nonce, state } = decodedToken.payload;
    this.validatedNonce(verifierSessionPrimitives, nonce);
    this.validatedIdTokenState(verifierSessionPrimitives, state);

    const code = Uuid.generate().toString();
    verifierSessionPrimitives = {
      ...verifierSessionPrimitives,
      code: code,
      status: VerificationProcessStatus.VERIFIED,
      idToken,
    };
    await this.verifierSessionRepository.save(
      VerifierSession.fromPrimitives(verifierSessionPrimitives),
    );
    return this.buildRedirectUri(verifierSessionPrimitives, code);
  }

  private validatedNonce(
    verifierSessionPrimitives: VerifierSessionPrimitives,
    nonce: string,
  ) {
    if (!verifierSessionPrimitives.openid4vpData.nonce) return;

    if (!nonce) throw new IdTokenNonceNotFoundException();

    if (nonce !== verifierSessionPrimitives.openid4vpData.nonce)
      throw new InvalidIdTokenNonceException(nonce);
  }
  private validatedIdTokenState(
    verifierSessionPrimitives: VerifierSessionPrimitives,
    state: string,
  ) {
    if (!verifierSessionPrimitives.openid4vpData.state) return;
    if (!state) throw new IdTokenStateNotFoundException();
    if (state !== verifierSessionPrimitives.openid4vpData.state)
      throw new InvalidIdTokenStateException();
  }

  private buildRedirectUri(
    verifierSession: VerifierSessionPrimitives,
    code: string,
  ) {
    const redirectUri: string =
      verifierSession.openid4vpData.redirectUri || 'openid://';
    let searchParams: { code: string; state?: string } = { code };
    if (verifierSession.openid4vpData.state) {
      searchParams = {
        ...searchParams,
        state: verifierSession.openid4vpData.state,
      };
    }
    return `${redirectUri}?${new URLSearchParams(searchParams).toString()}`;
  }
}
