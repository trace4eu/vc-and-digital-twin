import base64url from 'base64url';
import { ec as EC } from 'elliptic';
import { JWK } from 'jose';
import joseWrapper from './joseWrapper';

const getPublicJWKFromPublicHex = async (
  publicKeyHex: string,
): Promise<JWK> => {
  const cleanPublicKeyHex = publicKeyHex.replace('0x04', '');

  const jwk = <JWK>{
    crv: 'P-256',
    kty: 'EC',
  };

  const X = cleanPublicKeyHex.substring(0, 64);
  const bufX = Buffer.from(X, 'hex');
  jwk.x = base64url(bufX);

  const Y = cleanPublicKeyHex.substring(64, 128);
  const bufY = Buffer.from(Y, 'hex');
  jwk.y = base64url(bufY);

  jwk.kid = await joseWrapper.calculateJwkThumbprint(jwk);

  return jwk;
};

const getJWKfromHex = async (
  publicKeyHex: string,
  privateKeyHex: string,
): Promise<JWK> => {
  const jwk = await getPublicJWKFromPublicHex(publicKeyHex);

  const cleanPrivateKeyHex = privateKeyHex.replace('0x', '');

  const buf = Buffer.from(cleanPrivateKeyHex, 'hex');
  jwk.d = base64url(buf);

  return jwk as JWK;
};

export { getJWKfromHex, getPublicJWKFromPublicHex };
