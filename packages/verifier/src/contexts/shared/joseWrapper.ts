import {
  calculateJwkThumbprint,
  decodeJwt,
  exportJWK,
  generateKeyPair,
  importJWK,
  JWK,
  JWTPayload,
  jwtVerify,
  SignJWT,
} from 'jose';

export interface JWTValidationResult {
  valid: boolean;
  message?: string;
}

class JoseWrapper {
  verifyJwt = async (
    session: string,
    key: JWK,
  ): Promise<JWTValidationResult> => {
    try {
      await jwtVerify(session, await importJWK(key, 'ES256K'));
      return { valid: true };
    } catch (error) {
      return { valid: false, message: (error as Error).message };
    }
  };

  signJwt = async (
    jwk: JWK,
    payload: Buffer,
    exp?: number,
  ): Promise<string> => {
    const expiration = Math.floor(Date.now() / 1000) + Math.floor(exp || 900);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const jws = new SignJWT(JSON.parse(payload.toString()))
      .setProtectedHeader({
        alg: 'ES256',
        typ: 'JWT',
      })
      .setExpirationTime(expiration)
      .sign(await importJWK(jwk, 'ES256'));

    return jws;
  };

  generateKeys = async (): Promise<JWK> => {
    return exportJWK((await generateKeyPair('ES256K')).privateKey);
  };

  calculateJwkThumbprint = async (publicJwk: JWK) => {
    return calculateJwkThumbprint(publicJwk, 'sha256');
  };

  decodeJWT = (jwt: string): JWTPayload => {
    return decodeJwt(jwt);
  };
}
const joseWrapper = new JoseWrapper();
export default joseWrapper;
