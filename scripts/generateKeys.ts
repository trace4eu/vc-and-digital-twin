import { exportJWK, generateKeyPair, JWK } from 'jose';
import base64url from 'base64url';
const toHex = (data: string): string =>
  Buffer.from(data, 'base64').toString('hex');

const getPublicKeyHexFromJWK = (jwk: JWK): string => {
  // Used to retrieve a public key example
  const publikKeyHex = `0x04${toHex(jwk.x as string)}${toHex(jwk.y as string)}`;
  return publikKeyHex;
};

const getPrivateKeyHexFromJWK = (privateKeyJwk: JWK): string => {
  // Used to retrieve a private key example
  return base64url.decode(privateKeyJwk.d as string, 'hex');
};

async function generateKeys(algorithm: string): Promise<JWK> {
  return await exportJWK((await generateKeyPair(algorithm)).privateKey);
}

async function main() {
  const jwkKeyPair = await generateKeys('ES256');
  console.log({ jwkKeyPair });
  console.log(`Private key hex: ${getPrivateKeyHexFromJWK(jwkKeyPair)}`);
  console.log(`Public key hex: ${getPublicKeyHexFromJWK(jwkKeyPair)}`);
  console.log(`Success!`);
}

main();
