import { DIDResolutionResult } from 'did-resolver/src/resolver';
import DidKeyResolver from '../../../../../src/contexts/shared/resolvers/DidKeyResolver';
import DidEbsiResolver from '../../../../../src/contexts/shared/resolvers/DidEbsiResolver';
import ResolverFactory from '../../../../../src/contexts/shared/resolvers/resolverFactory';
import DidMethodNotSupportedException from '../../../../../src/contexts/shared/exceptions/didMethodNotSupported.exception';
import { ConfigService } from '@nestjs/config';
import { ApiConfig } from '../../../../../config/configuration';

describe('ResolverFactory should', () => {
  const didKeyResolver: DidKeyResolver = new DidKeyResolver();
  const configService = new ConfigService<ApiConfig, true>();
  configService.set(
    'ebsiDidResolver',
    'https://api-pilot.ebsi.eu/did-registry/v5/identifiers',
  );
  const didEbsiResolver: DidEbsiResolver = new DidEbsiResolver(configService);
  const resolverFactory = new ResolverFactory(didKeyResolver, didEbsiResolver);
  it('create a did ebsi resolver and resolve the did', async () => {
    const did = 'did:ebsi:zfEmvX5twhXjQJiCWsukvQA';
    const resolver = resolverFactory.execute(did);
    expect(resolver).toBeDefined();

    const didDocumentResolution = await resolver.resolve(did);
    const expectedResult: DIDResolutionResult = {
      didResolutionMetadata: {
        contentType: 'application/did+ld+json',
      },
      didDocument: {
        '@context': [
          'https://www.w3.org/ns/did/v1',
          'https://w3id.org/security/suites/jws-2020/v1',
        ],
        id: 'did:ebsi:zfEmvX5twhXjQJiCWsukvQA',
        controller: ['did:ebsi:zfEmvX5twhXjQJiCWsukvQA'],
        verificationMethod: [
          {
            id: 'did:ebsi:zfEmvX5twhXjQJiCWsukvQA#B1j4_YigHlSA8COHBiIngdvmDZz-Oh2wpNzHqPvrDWs',
            type: 'JsonWebKey2020',
            controller: 'did:ebsi:zfEmvX5twhXjQJiCWsukvQA',
            publicKeyJwk: {
              kty: 'EC',
              crv: 'secp256k1',
              x: 'lz3FOKqK5fPeCtvNj8sJ7C-kyzYWR8_9-1AC55uViyk',
              y: 'DsDdohC_-zyK7xCddFy-sczoxpOc2nJxNlN2AI812AQ',
            },
          },
          {
            id: 'did:ebsi:zfEmvX5twhXjQJiCWsukvQA#yzVc8uD5KS3GCtzNuVFL2A8Qzk29dHh4M-FDYtQ8tRg',
            type: 'JsonWebKey2020',
            controller: 'did:ebsi:zfEmvX5twhXjQJiCWsukvQA',
            publicKeyJwk: {
              kty: 'EC',
              crv: 'P-256',
              x: 'jJXC89Sj0RRriF-5nVntJufmAQMTRHa9HwLBYef8WFY',
              y: 'TV1Q6vHPMWgYr0O82EJMZXwPjOxA9qgagvNoPGgdI3U',
            },
          },
        ],
        authentication: [
          'did:ebsi:zfEmvX5twhXjQJiCWsukvQA#B1j4_YigHlSA8COHBiIngdvmDZz-Oh2wpNzHqPvrDWs',
          'did:ebsi:zfEmvX5twhXjQJiCWsukvQA#yzVc8uD5KS3GCtzNuVFL2A8Qzk29dHh4M-FDYtQ8tRg',
        ],
        assertionMethod: [
          'did:ebsi:zfEmvX5twhXjQJiCWsukvQA#yzVc8uD5KS3GCtzNuVFL2A8Qzk29dHh4M-FDYtQ8tRg',
        ],
        capabilityInvocation: [
          'did:ebsi:zfEmvX5twhXjQJiCWsukvQA#B1j4_YigHlSA8COHBiIngdvmDZz-Oh2wpNzHqPvrDWs',
        ],
      },
      didDocumentMetadata: {},
    };
    expect(didDocumentResolution).toStrictEqual(expectedResult);
  });
  it('create a did key resolver and resolve the did', async () => {
    const did =
      'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9Kbs5BA7wRrxfnHykRApirS1WfHPZGrbMcKAbg4eiwxzpxH1MYg93oDtEkCyPH5YHjix3uVkZhBcav3EjyFj6bbieKTGZfQt9LGN8KuSv8BiiQ1qfrn8msNWkxws4iRfEN1AU';
    const resolver = resolverFactory.execute(did);
    expect(resolver).toBeDefined();

    const didDocumentResolution = await resolver.resolve(did);
    const exepctedResoult: DIDResolutionResult = {
      didResolutionMetadata: {
        contentType: 'application/did+ld+json',
      },
      didDocument: {
        '@context': [
          'https://www.w3.org/ns/did/v1',
          'https://w3id.org/security/suites/jws-2020/v1',
        ],
        id: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9Kbs5BA7wRrxfnHykRApirS1WfHPZGrbMcKAbg4eiwxzpxH1MYg93oDtEkCyPH5YHjix3uVkZhBcav3EjyFj6bbieKTGZfQt9LGN8KuSv8BiiQ1qfrn8msNWkxws4iRfEN1AU',
        verificationMethod: [
          {
            id: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9Kbs5BA7wRrxfnHykRApirS1WfHPZGrbMcKAbg4eiwxzpxH1MYg93oDtEkCyPH5YHjix3uVkZhBcav3EjyFj6bbieKTGZfQt9LGN8KuSv8BiiQ1qfrn8msNWkxws4iRfEN1AU#z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9Kbs5BA7wRrxfnHykRApirS1WfHPZGrbMcKAbg4eiwxzpxH1MYg93oDtEkCyPH5YHjix3uVkZhBcav3EjyFj6bbieKTGZfQt9LGN8KuSv8BiiQ1qfrn8msNWkxws4iRfEN1AU',
            type: 'JsonWebKey2020',
            controller:
              'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9Kbs5BA7wRrxfnHykRApirS1WfHPZGrbMcKAbg4eiwxzpxH1MYg93oDtEkCyPH5YHjix3uVkZhBcav3EjyFj6bbieKTGZfQt9LGN8KuSv8BiiQ1qfrn8msNWkxws4iRfEN1AU',
            publicKeyJwk: {
              crv: 'P-256',
              kty: 'EC',
              x: 'lUBEc3u_nF9_IfhU2RxzdlfOeYDAc4VJ782ner-khvE',
              y: 'E0gBvI3MCoIDUptoa-VlkMWwEdsZ8VQoeLQ6uQN7MUc',
            },
          },
        ],
        authentication: [
          'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9Kbs5BA7wRrxfnHykRApirS1WfHPZGrbMcKAbg4eiwxzpxH1MYg93oDtEkCyPH5YHjix3uVkZhBcav3EjyFj6bbieKTGZfQt9LGN8KuSv8BiiQ1qfrn8msNWkxws4iRfEN1AU#z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9Kbs5BA7wRrxfnHykRApirS1WfHPZGrbMcKAbg4eiwxzpxH1MYg93oDtEkCyPH5YHjix3uVkZhBcav3EjyFj6bbieKTGZfQt9LGN8KuSv8BiiQ1qfrn8msNWkxws4iRfEN1AU',
        ],
        assertionMethod: [
          'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9Kbs5BA7wRrxfnHykRApirS1WfHPZGrbMcKAbg4eiwxzpxH1MYg93oDtEkCyPH5YHjix3uVkZhBcav3EjyFj6bbieKTGZfQt9LGN8KuSv8BiiQ1qfrn8msNWkxws4iRfEN1AU#z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9Kbs5BA7wRrxfnHykRApirS1WfHPZGrbMcKAbg4eiwxzpxH1MYg93oDtEkCyPH5YHjix3uVkZhBcav3EjyFj6bbieKTGZfQt9LGN8KuSv8BiiQ1qfrn8msNWkxws4iRfEN1AU',
        ],
        capabilityInvocation: [
          'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9Kbs5BA7wRrxfnHykRApirS1WfHPZGrbMcKAbg4eiwxzpxH1MYg93oDtEkCyPH5YHjix3uVkZhBcav3EjyFj6bbieKTGZfQt9LGN8KuSv8BiiQ1qfrn8msNWkxws4iRfEN1AU#z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9Kbs5BA7wRrxfnHykRApirS1WfHPZGrbMcKAbg4eiwxzpxH1MYg93oDtEkCyPH5YHjix3uVkZhBcav3EjyFj6bbieKTGZfQt9LGN8KuSv8BiiQ1qfrn8msNWkxws4iRfEN1AU',
        ],
        capabilityDelegation: [
          'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9Kbs5BA7wRrxfnHykRApirS1WfHPZGrbMcKAbg4eiwxzpxH1MYg93oDtEkCyPH5YHjix3uVkZhBcav3EjyFj6bbieKTGZfQt9LGN8KuSv8BiiQ1qfrn8msNWkxws4iRfEN1AU#z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9Kbs5BA7wRrxfnHykRApirS1WfHPZGrbMcKAbg4eiwxzpxH1MYg93oDtEkCyPH5YHjix3uVkZhBcav3EjyFj6bbieKTGZfQt9LGN8KuSv8BiiQ1qfrn8msNWkxws4iRfEN1AU',
        ],
      },
      didDocumentMetadata: {},
    };
    expect(didDocumentResolution).toStrictEqual(exepctedResoult);
  });
  it('raise an error for an unsupported did method', () => {
    const did = 'did:whatever:1234';
    expect(() => resolverFactory.execute(did)).toThrow(
      DidMethodNotSupportedException,
    );
  });
});
