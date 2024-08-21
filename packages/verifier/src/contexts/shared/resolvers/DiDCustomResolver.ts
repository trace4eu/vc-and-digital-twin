import { DIDResolver } from 'did-resolver';

export interface DiDCustomResolver {
  getDidResolver(): Record<string, DIDResolver>;
}
