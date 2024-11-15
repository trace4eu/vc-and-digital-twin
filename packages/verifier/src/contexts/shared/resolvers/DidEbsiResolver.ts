import { DIDResolver } from 'did-resolver';
import { getResolver } from '@cef-ebsi/ebsi-did-resolver';
import { DiDCustomResolver } from './DiDCustomResolver';
import { ConfigService } from '@nestjs/config';
import { ApiConfig } from '../../../../config/configuration';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class DidEbsiResolver implements DiDCustomResolver {
  private ebsiResolverUrl: string;
  constructor(private configService: ConfigService<ApiConfig, true>) {
    this.ebsiResolverUrl = this.configService.get<string>('ebsiDidResolver');
  }

  getDidResolver(): Record<string, DIDResolver> {
    const resolverConfig = {
      registry: this.ebsiResolverUrl,
    };
    const ebsiResolver = getResolver(resolverConfig);
    return ebsiResolver as Record<string, DIDResolver>;
  }
}
