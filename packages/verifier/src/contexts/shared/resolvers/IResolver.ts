import { Resolver } from 'did-resolver';

export interface IResolver {
  execute(did: string): Resolver;
}
