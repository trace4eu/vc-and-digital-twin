import { Resolver, ResolverRegistry } from 'did-resolver';
import { Injectable } from '@nestjs/common';

import { IResolver } from './IResolver';
import DidKeyResolver from './DidKeyResolver';
import DidEbsiResolver from './DidEbsiResolver';
import DidMethodNotSupportedException from '../exceptions/didMethodNotSupported.exception';
@Injectable()
export default class ResolverFactory implements IResolver {
  constructor(
    private didKeyResolver: DidKeyResolver,
    private didEbsiResolver: DidEbsiResolver,
  ) {}

  execute(did: string): Resolver {
    let resolution: ResolverRegistry;
    switch (true) {
      case this.isKeyDid(did):
        resolution = this.didKeyResolver.getDidResolver();
        break;
      case this.isEbsiDid(did):
        resolution = this.didEbsiResolver.getDidResolver();
        break;
      default:
        throw new DidMethodNotSupportedException(did);
    }
    return new Resolver(resolution);
  }

  private isKeyDid = (did: string): boolean => {
    if (!did) return false;
    return !!did.match(/^did:key:/g);
  };

  private isEbsiDid = (did: string): boolean => {
    if (!did) return false;
    return !!did.match(/^did:ebsi:/g);
  };
}
