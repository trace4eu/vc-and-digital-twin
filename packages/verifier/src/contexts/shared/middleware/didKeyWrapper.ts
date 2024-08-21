import { resolver as transmuteDidKeyResolver } from '@transmute/did-key.js';
import { DIDResolutionResult, Resolver } from 'did-resolver';
import { getResolver } from '@cef-ebsi/key-did-resolver';

class DidKeyWrapper {
  private ebsiDidKeyResolver: Resolver;

  constructor() {
    this.ebsiDidKeyResolver = new Resolver(getResolver());
  }

  async resolve(did: string): Promise<DIDResolutionResult> {
    const didResolutionResult = await this.ebsiDidKeyResolver.resolve(did);
    if (!didResolutionResult.didDocument) {
      return (await transmuteDidKeyResolver.resolve(
        did,
      )) as DIDResolutionResult;
    }
    return didResolutionResult;
  }
}

const didKeyWrapper = new DidKeyWrapper();

export default didKeyWrapper;
