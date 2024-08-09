import base64url from 'base64url';
import { ec as EC } from 'elliptic';
import { Base64 } from 'js-base64';
import { JWK } from 'jose';

const getPublicJWKFromPublicHex = (publicKeyHex: string): JWK => {
  const ec = new EC('secp256k1');
  const key = ec.keyFromPublic(publicKeyHex.replace('0x', ''), 'hex');
  const pubPoint = key.getPublic();
  const pubJwk: JWK = {
    kty: 'EC',
    crv: 'secp256k1',
    x: Base64.fromUint8Array(pubPoint.getX().toArrayLike(Buffer), true),
    y: Base64.fromUint8Array(pubPoint.getY().toArrayLike(Buffer), true),
  };

  return pubJwk;
};

const getJWKfromHex = (publicKeyHex: string, privateKeyHex: string): JWK => {
  const jwk = <JWK>{
    crv: 'P-256',
    kty: 'EC',
  };

  const cleanPublicKeyHex = publicKeyHex.replace('0x04', '');
  const cleanPrivateKeyHex = privateKeyHex.replace('0x', '');

  const buf = Buffer.from(cleanPrivateKeyHex, 'hex');
  jwk.d = base64url(buf);

  const X = cleanPublicKeyHex.substr(0, 64);
  const bufX = Buffer.from(X, 'hex');
  jwk.x = base64url(bufX);

  const Y = cleanPublicKeyHex.substr(64, 64);
  const bufY = Buffer.from(Y, 'hex');
  jwk.y = base64url(bufY);

  return jwk as JWK;
};

export { getJWKfromHex, getPublicJWKFromPublicHex };
