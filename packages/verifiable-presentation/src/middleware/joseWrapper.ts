import {
  decodeJwt,
  decodeProtectedHeader,
  importJWK,
  JWK,
  JWTPayload,
  jwtVerify,
} from 'jose';

export interface JWTValidationResult {
  valid: boolean;
  messages?: string[];
}

export interface JWTHeader {
  alg?: string;
  typ?: string;
  kid?: string;
}

class JoseWrapper {
  verifyJwt = async (
    session: string,
    key: JWK,
    alg: string,
    credentialId?: string,
  ): Promise<JWTValidationResult> => {
    try {
      await jwtVerify(session, await importJWK(key, alg || 'ES256'));
      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        messages: [`${credentialId} signature is not correct`],
      };
    }
  };

  decodeJWT = (jwt: string): JWTPayload => {
    return decodeJwt(jwt);
  };

  decodeJwtProtectedHeader = (jwt: string): JWTHeader => {
    return decodeProtectedHeader(jwt);
  };
}
const joseWrapper = new JoseWrapper();
export default joseWrapper;
