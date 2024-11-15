import { DIDResolutionResult, DIDResolver } from 'did-resolver';
import { DiDCustomResolver } from './DiDCustomResolver';
import didKeyWrapper from '../middleware/didKeyWrapper';
export default class DidKeyResolver implements DiDCustomResolver {
  getDidResolver(): Record<string, DIDResolver> {
    return {
      key: async (did: string): Promise<DIDResolutionResult> => {
        return didKeyWrapper.resolve(did);
      },
    };
  }
}
