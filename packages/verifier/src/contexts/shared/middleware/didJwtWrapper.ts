import { decodeJWT, JWTVerifyOptions, verifyJWT } from 'did-jwt';
import { Injectable } from '@nestjs/common';
import ResolverFactory from '../resolvers/resolverFactory';

export interface VerificationResult {
  verified: boolean;
  errorMessage?: string;
}
@Injectable()
export class DidJwtWrapper {
  constructor(private didResolverFactory: ResolverFactory) {}
  async verifyJWT(jwt: string, audience: string): Promise<VerificationResult> {
    const decodedJwt = decodeJWT(jwt);
    if (audience && !decodedJwt.payload.aud) {
      return { verified: false, errorMessage: 'missing aud field' };
    }
    const did = (decodedJwt.header.kid as string).split('#')[0];
    const resolver = this.didResolverFactory.execute(did);
    const options: JWTVerifyOptions = {
      audience: audience,
      resolver: resolver,
    };
    try {
      const jwtVerified = await verifyJWT(jwt, options);
      return { verified: jwtVerified.verified };
    } catch (e) {
      return { verified: false, errorMessage: e.message };
    }
  }
}
