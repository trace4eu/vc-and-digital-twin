import JsonSchemaWrapper from '../../src/middleware/jsonSchemaWrapper';
import { PresentationSubmissionValidator } from '../../src/validators/presentationSubmissionValidator';

describe('PresentationSubmissionValidator should', () => {
  const jsonSchemaWrapper = new JsonSchemaWrapper();
  it('validate a valid presentation_submission against presentation definition', () => {
    const presentationDefinition = {
      id: 'bfd1100c-068f-4b74-a66a-9c78fd1652c8',
      format: {
        jwt_vc: {
          alg: ['ES256'],
        },
        jwt_vp: {
          alg: ['ES256'],
        },
      },
      input_descriptors: [
        {
          id: 'Credential1',
          format: {
            jwt_vc: {
              alg: ['ES256'],
            },
          },
          constraints: {
            fields: [
              {
                path: ['$.vc.type', '$.type'],
                filter: {
                  type: 'array',
                  contains: {
                    const: 'VerifiableAttestation',
                  },
                },
              },
            ],
          },
        },
        {
          id: 'Credential2',
          format: {
            jwt_vc: {
              alg: ['ES256'],
            },
          },
          constraints: {
            fields: [
              {
                path: ['$.type', '$.vc.type'],
                filter: {
                  type: 'array',
                  contains: {
                    const: 'VerifiableAttestation',
                  },
                },
              },
            ],
          },
        },
        {
          id: 'Credential3',
          format: {
            jwt_vc: {
              alg: ['ES256'],
            },
          },
          constraints: {
            fields: [
              {
                path: ['$.vc.type'],
                filter: {
                  type: 'array',
                  contains: {
                    const: 'VerifiableAttestation',
                  },
                },
              },
            ],
          },
        },
      ],
    };

    const verifiableCredentials = [
      {
        jti: 'vc:ebsi:conformance#6f680bc5-c163-4d3b-8ddc-aef2e0ec1a08',
        sub: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9Kboj7g9PfXJxbbs4KYegyr7ELnFVnpDMzbJJDDNZjavX6jvtDmALMbXAGW67pdTgFea2FrGGSFs8Ejxi96oFLGHcL4P6bjLDPBJEvRRHSrG4LsPne52fczt2MWjHLLJBvhAC',
        iss: 'did:ebsi:zjHZjJ4Sy7r92BxXzFGs7qD',
        nbf: 1707131359,
        exp: 1707217759,
        iat: 1707131359,
        vc: {
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          id: 'vc:ebsi:conformance#6f680bc5-c163-4d3b-8ddc-aef2e0ec1a08',
          type: [
            'VerifiableCredential',
            'VerifiableAttestation',
            'VerifiableAuthorisationToOnboard',
          ],
          issuer: 'did:ebsi:zjHZjJ4Sy7r92BxXzFGs7qD',
          issuanceDate: '2024-02-05T11:09:19Z',
          issued: '2024-02-05T11:09:19Z',
          validFrom: '2024-02-05T11:09:19Z',
          expirationDate: '2024-02-06T11:09:19Z',
          credentialSubject: {
            id: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9Kboj7g9PfXJxbbs4KYegyr7ELnFVnpDMzbJJDDNZjavX6jvtDmALMbXAGW67pdTgFea2FrGGSFs8Ejxi96oFLGHcL4P6bjLDPBJEvRRHSrG4LsPne52fczt2MWjHLLJBvhAC',
          },
          credentialSchema: {
            id: 'https://api-conformance.ebsi.eu/trusted-schemas-registry/v3/schemas/z3MgUFUkb722uq4x3dv5yAJmnNmzDFeK5UC8x83QoeLJM',
            type: 'FullJsonSchemaValidator2021',
          },
          termsOfUse: {
            id: 'https://api-conformance.ebsi.eu/trusted-issuers-registry/v5/issuers/did:ebsi:zjHZjJ4Sy7r92BxXzFGs7qD/attributes/bcdb6bc952c8c897ca1e605fce25f82604c76c16d479770014b7b262b93c0250',
            type: 'IssuanceCertificate',
          },
        },
      },
      {
        jti: 'vc:ebsi:conformance#a295fed3-d639-454d-9b1a-925a2d74a582',
        sub: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9Kboj7g9PfXJxbbs4KYegyr7ELnFVnpDMzbJJDDNZjavX6jvtDmALMbXAGW67pdTgFea2FrGGSFs8Ejxi96oFLGHcL4P6bjLDPBJEvRRHSrG4LsPne52fczt2MWjHLLJBvhAC',
        iss: 'did:ebsi:zjHZjJ4Sy7r92BxXzFGs7qD',
        nbf: 1707131359,
        exp: 1707217759,
        iat: 1707131359,
        vc: {
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          id: 'vc:ebsi:conformance#a295fed3-d639-454d-9b1a-925a2d74a582',
          type: [
            'VerifiableCredential',
            'VerifiableAttestation',
            'VerifiableAuthorisationToOnboard',
          ],
          issuer: 'did:ebsi:zjHZjJ4Sy7r92BxXzFGs7qD',
          issuanceDate: '2024-02-05T11:09:19Z',
          issued: '2024-02-05T11:09:19Z',
          validFrom: '2024-02-05T11:09:19Z',
          expirationDate: '2024-02-06T11:09:19Z',
          credentialSubject: {
            id: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9Kboj7g9PfXJxbbs4KYegyr7ELnFVnpDMzbJJDDNZjavX6jvtDmALMbXAGW67pdTgFea2FrGGSFs8Ejxi96oFLGHcL4P6bjLDPBJEvRRHSrG4LsPne52fczt2MWjHLLJBvhAC',
          },
          credentialSchema: {
            id: 'https://api-conformance.ebsi.eu/trusted-schemas-registry/v3/schemas/z3MgUFUkb722uq4x3dv5yAJmnNmzDFeK5UC8x83QoeLJM',
            type: 'FullJsonSchemaValidator2021',
          },
          termsOfUse: {
            id: 'https://api-conformance.ebsi.eu/trusted-issuers-registry/v5/issuers/did:ebsi:zjHZjJ4Sy7r92BxXzFGs7qD/attributes/bcdb6bc952c8c897ca1e605fce25f82604c76c16d479770014b7b262b93c0250',
            type: 'IssuanceCertificate',
          },
        },
      },
      {
        jti: 'vc:ebsi:conformance#a295fed3-d639-454d-9b1a-925a2d74a582',
        sub: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9Kboj7g9PfXJxbbs4KYegyr7ELnFVnpDMzbJJDDNZjavX6jvtDmALMbXAGW67pdTgFea2FrGGSFs8Ejxi96oFLGHcL4P6bjLDPBJEvRRHSrG4LsPne52fczt2MWjHLLJBvhAC',
        iss: 'did:ebsi:zjHZjJ4Sy7r92BxXzFGs7qD',
        nbf: 1707131359,
        exp: 1707217759,
        iat: 1707131359,
        vc: {
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          id: 'vc:ebsi:conformance#a295fed3-d639-454d-9b1a-925a2d74a582',
          type: [
            'VerifiableCredential',
            'VerifiableAttestation',
            'VerifiableAuthorisationToOnboard',
          ],
          issuer: 'did:ebsi:zjHZjJ4Sy7r92BxXzFGs7qD',
          issuanceDate: '2024-02-05T11:09:19Z',
          issued: '2024-02-05T11:09:19Z',
          validFrom: '2024-02-05T11:09:19Z',
          expirationDate: '2024-02-06T11:09:19Z',
          credentialSubject: {
            id: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9Kboj7g9PfXJxbbs4KYegyr7ELnFVnpDMzbJJDDNZjavX6jvtDmALMbXAGW67pdTgFea2FrGGSFs8Ejxi96oFLGHcL4P6bjLDPBJEvRRHSrG4LsPne52fczt2MWjHLLJBvhAC',
          },
          credentialSchema: {
            id: 'https://api-conformance.ebsi.eu/trusted-schemas-registry/v3/schemas/z3MgUFUkb722uq4x3dv5yAJmnNmzDFeK5UC8x83QoeLJM',
            type: 'FullJsonSchemaValidator2021',
          },
          termsOfUse: {
            id: 'https://api-conformance.ebsi.eu/trusted-issuers-registry/v5/issuers/did:ebsi:zjHZjJ4Sy7r92BxXzFGs7qD/attributes/bcdb6bc952c8c897ca1e605fce25f82604c76c16d479770014b7b262b93c0250',
            type: 'IssuanceCertificate',
          },
        },
      },
    ];

    const descriptorMapIds = ['Credential1', 'Credential2', 'Credential3'];

    const presentationSubmissionValidator = new PresentationSubmissionValidator(
      presentationDefinition,
      verifiableCredentials,
      descriptorMapIds,
      jsonSchemaWrapper,
    );

    const result = presentationSubmissionValidator.validate();
    expect(result.valid).toBeTruthy();
  });
  it('fail validating a presentation_submission with credentials not matching presentation_definition constrains ', () => {
    const presentationDefinition = {
      id: 'bfd1100c-068f-4b74-a66a-9c78fd1652c8',
      format: {
        jwt_vc: {
          alg: ['ES256'],
        },
        jwt_vp: {
          alg: ['ES256'],
        },
      },
      input_descriptors: [
        {
          id: 'Credential1',
          format: {
            jwt_vc: {
              alg: ['ES256'],
            },
          },
          constraints: {
            fields: [
              {
                path: ['$.vc.type'],
                filter: {
                  type: 'array',
                  contains: {
                    const: 'VerifiableAttestation22',
                  },
                },
              },
            ],
          },
        },
        {
          id: 'Credential2',
          format: {
            jwt_vc: {
              alg: ['ES256'],
            },
          },
          constraints: {
            fields: [
              {
                path: ['$.vc.type'],
                filter: {
                  type: 'array',
                  contains: {
                    const: 'VerifiableAttestation',
                  },
                },
              },
            ],
          },
        },
        {
          id: 'Credential3',
          format: {
            jwt_vc: {
              alg: ['ES256'],
            },
          },
          constraints: {
            fields: [
              {
                path: ['$.vc.type'],
                filter: {
                  type: 'array',
                  contains: {
                    const: 'VerifiableAttestation',
                  },
                },
              },
            ],
          },
        },
      ],
    };

    const verifiableCredentials = [
      {
        jti: 'vc:ebsi:conformance#6f680bc5-c163-4d3b-8ddc-aef2e0ec1a08',
        sub: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9Kboj7g9PfXJxbbs4KYegyr7ELnFVnpDMzbJJDDNZjavX6jvtDmALMbXAGW67pdTgFea2FrGGSFs8Ejxi96oFLGHcL4P6bjLDPBJEvRRHSrG4LsPne52fczt2MWjHLLJBvhAC',
        iss: 'did:ebsi:zjHZjJ4Sy7r92BxXzFGs7qD',
        nbf: 1707131359,
        exp: 1707217759,
        iat: 1707131359,
        vc: {
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          id: 'vc:ebsi:conformance#6f680bc5-c163-4d3b-8ddc-aef2e0ec1a08',
          type: [
            'VerifiableCredential',
            'VerifiableAttestation',
            'VerifiableAuthorisationToOnboard',
          ],
          issuer: 'did:ebsi:zjHZjJ4Sy7r92BxXzFGs7qD',
          issuanceDate: '2024-02-05T11:09:19Z',
          issued: '2024-02-05T11:09:19Z',
          validFrom: '2024-02-05T11:09:19Z',
          expirationDate: '2024-02-06T11:09:19Z',
          credentialSubject: {
            id: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9Kboj7g9PfXJxbbs4KYegyr7ELnFVnpDMzbJJDDNZjavX6jvtDmALMbXAGW67pdTgFea2FrGGSFs8Ejxi96oFLGHcL4P6bjLDPBJEvRRHSrG4LsPne52fczt2MWjHLLJBvhAC',
          },
          credentialSchema: {
            id: 'https://api-conformance.ebsi.eu/trusted-schemas-registry/v3/schemas/z3MgUFUkb722uq4x3dv5yAJmnNmzDFeK5UC8x83QoeLJM',
            type: 'FullJsonSchemaValidator2021',
          },
          termsOfUse: {
            id: 'https://api-conformance.ebsi.eu/trusted-issuers-registry/v5/issuers/did:ebsi:zjHZjJ4Sy7r92BxXzFGs7qD/attributes/bcdb6bc952c8c897ca1e605fce25f82604c76c16d479770014b7b262b93c0250',
            type: 'IssuanceCertificate',
          },
        },
      },
      {
        jti: 'vc:ebsi:conformance#a295fed3-d639-454d-9b1a-925a2d74a582',
        sub: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9Kboj7g9PfXJxbbs4KYegyr7ELnFVnpDMzbJJDDNZjavX6jvtDmALMbXAGW67pdTgFea2FrGGSFs8Ejxi96oFLGHcL4P6bjLDPBJEvRRHSrG4LsPne52fczt2MWjHLLJBvhAC',
        iss: 'did:ebsi:zjHZjJ4Sy7r92BxXzFGs7qD',
        nbf: 1707131359,
        exp: 1707217759,
        iat: 1707131359,
        vc: {
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          id: 'vc:ebsi:conformance#a295fed3-d639-454d-9b1a-925a2d74a582',
          type: [
            'VerifiableCredential',
            'VerifiableAttestation',
            'VerifiableAuthorisationToOnboard',
          ],
          issuer: 'did:ebsi:zjHZjJ4Sy7r92BxXzFGs7qD',
          issuanceDate: '2024-02-05T11:09:19Z',
          issued: '2024-02-05T11:09:19Z',
          validFrom: '2024-02-05T11:09:19Z',
          expirationDate: '2024-02-06T11:09:19Z',
          credentialSubject: {
            id: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9Kboj7g9PfXJxbbs4KYegyr7ELnFVnpDMzbJJDDNZjavX6jvtDmALMbXAGW67pdTgFea2FrGGSFs8Ejxi96oFLGHcL4P6bjLDPBJEvRRHSrG4LsPne52fczt2MWjHLLJBvhAC',
          },
          credentialSchema: {
            id: 'https://api-conformance.ebsi.eu/trusted-schemas-registry/v3/schemas/z3MgUFUkb722uq4x3dv5yAJmnNmzDFeK5UC8x83QoeLJM',
            type: 'FullJsonSchemaValidator2021',
          },
          termsOfUse: {
            id: 'https://api-conformance.ebsi.eu/trusted-issuers-registry/v5/issuers/did:ebsi:zjHZjJ4Sy7r92BxXzFGs7qD/attributes/bcdb6bc952c8c897ca1e605fce25f82604c76c16d479770014b7b262b93c0250',
            type: 'IssuanceCertificate',
          },
        },
      },
      {
        jti: 'vc:ebsi:conformance#a295fed3-d639-454d-9b1a-925a2d74a582',
        sub: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9Kboj7g9PfXJxbbs4KYegyr7ELnFVnpDMzbJJDDNZjavX6jvtDmALMbXAGW67pdTgFea2FrGGSFs8Ejxi96oFLGHcL4P6bjLDPBJEvRRHSrG4LsPne52fczt2MWjHLLJBvhAC',
        iss: 'did:ebsi:zjHZjJ4Sy7r92BxXzFGs7qD',
        nbf: 1707131359,
        exp: 1707217759,
        iat: 1707131359,
        vc: {
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          id: 'vc:ebsi:conformance#a295fed3-d639-454d-9b1a-925a2d74a582',
          type: [
            'VerifiableCredential',
            'VerifiableAttestation',
            'VerifiableAuthorisationToOnboard',
          ],
          issuer: 'did:ebsi:zjHZjJ4Sy7r92BxXzFGs7qD',
          issuanceDate: '2024-02-05T11:09:19Z',
          issued: '2024-02-05T11:09:19Z',
          validFrom: '2024-02-05T11:09:19Z',
          expirationDate: '2024-02-06T11:09:19Z',
          credentialSubject: {
            id: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9Kboj7g9PfXJxbbs4KYegyr7ELnFVnpDMzbJJDDNZjavX6jvtDmALMbXAGW67pdTgFea2FrGGSFs8Ejxi96oFLGHcL4P6bjLDPBJEvRRHSrG4LsPne52fczt2MWjHLLJBvhAC',
          },
          credentialSchema: {
            id: 'https://api-conformance.ebsi.eu/trusted-schemas-registry/v3/schemas/z3MgUFUkb722uq4x3dv5yAJmnNmzDFeK5UC8x83QoeLJM',
            type: 'FullJsonSchemaValidator2021',
          },
          termsOfUse: {
            id: 'https://api-conformance.ebsi.eu/trusted-issuers-registry/v5/issuers/did:ebsi:zjHZjJ4Sy7r92BxXzFGs7qD/attributes/bcdb6bc952c8c897ca1e605fce25f82604c76c16d479770014b7b262b93c0250',
            type: 'IssuanceCertificate',
          },
        },
      },
    ];

    const descriptorMapIds = ['Credential1', 'Credential2', 'Credential3'];

    const presentationSubmissionValidator = new PresentationSubmissionValidator(
      presentationDefinition,
      verifiableCredentials,
      descriptorMapIds,
      jsonSchemaWrapper,
    );

    const result = presentationSubmissionValidator.validate();
    expect(result.valid).toBeFalsy();
    expect(result.message).toBe(
      'presentation_submission verifiable credential Credential1 does not match presentation_definition constrains',
    );
  });

  it('fail validating a presentation_submission with credentials not matching presentation_definition constrains path ', () => {
    const presentationDefinition = {
      id: 'bfd1100c-068f-4b74-a66a-9c78fd1652c8',
      format: {
        jwt_vc: {
          alg: ['ES256'],
        },
        jwt_vp: {
          alg: ['ES256'],
        },
      },
      input_descriptors: [
        {
          id: 'Credential1',
          format: {
            jwt_vc: {
              alg: ['ES256'],
            },
          },
          constraints: {
            fields: [
              {
                path: ['$.vc.types'],
                filter: {
                  type: 'array',
                  contains: {
                    const: 'VerifiableAttestation22',
                  },
                },
              },
            ],
          },
        },
        {
          id: 'Credential2',
          format: {
            jwt_vc: {
              alg: ['ES256'],
            },
          },
          constraints: {
            fields: [
              {
                path: ['$.vc.type'],
                filter: {
                  type: 'array',
                  contains: {
                    const: 'VerifiableAttestation',
                  },
                },
              },
            ],
          },
        },
        {
          id: 'Credential3',
          format: {
            jwt_vc: {
              alg: ['ES256'],
            },
          },
          constraints: {
            fields: [
              {
                path: ['$.vc.type'],
                filter: {
                  type: 'array',
                  contains: {
                    const: 'VerifiableAttestation',
                  },
                },
              },
            ],
          },
        },
      ],
    };

    const verifiableCredentials = [
      {
        jti: 'vc:ebsi:conformance#6f680bc5-c163-4d3b-8ddc-aef2e0ec1a08',
        sub: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9Kboj7g9PfXJxbbs4KYegyr7ELnFVnpDMzbJJDDNZjavX6jvtDmALMbXAGW67pdTgFea2FrGGSFs8Ejxi96oFLGHcL4P6bjLDPBJEvRRHSrG4LsPne52fczt2MWjHLLJBvhAC',
        iss: 'did:ebsi:zjHZjJ4Sy7r92BxXzFGs7qD',
        nbf: 1707131359,
        exp: 1707217759,
        iat: 1707131359,
        vc: {
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          id: 'vc:ebsi:conformance#6f680bc5-c163-4d3b-8ddc-aef2e0ec1a08',
          type: [
            'VerifiableCredential',
            'VerifiableAttestation',
            'VerifiableAuthorisationToOnboard',
          ],
          issuer: 'did:ebsi:zjHZjJ4Sy7r92BxXzFGs7qD',
          issuanceDate: '2024-02-05T11:09:19Z',
          issued: '2024-02-05T11:09:19Z',
          validFrom: '2024-02-05T11:09:19Z',
          expirationDate: '2024-02-06T11:09:19Z',
          credentialSubject: {
            id: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9Kboj7g9PfXJxbbs4KYegyr7ELnFVnpDMzbJJDDNZjavX6jvtDmALMbXAGW67pdTgFea2FrGGSFs8Ejxi96oFLGHcL4P6bjLDPBJEvRRHSrG4LsPne52fczt2MWjHLLJBvhAC',
          },
          credentialSchema: {
            id: 'https://api-conformance.ebsi.eu/trusted-schemas-registry/v3/schemas/z3MgUFUkb722uq4x3dv5yAJmnNmzDFeK5UC8x83QoeLJM',
            type: 'FullJsonSchemaValidator2021',
          },
          termsOfUse: {
            id: 'https://api-conformance.ebsi.eu/trusted-issuers-registry/v5/issuers/did:ebsi:zjHZjJ4Sy7r92BxXzFGs7qD/attributes/bcdb6bc952c8c897ca1e605fce25f82604c76c16d479770014b7b262b93c0250',
            type: 'IssuanceCertificate',
          },
        },
      },
      {
        jti: 'vc:ebsi:conformance#a295fed3-d639-454d-9b1a-925a2d74a582',
        sub: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9Kboj7g9PfXJxbbs4KYegyr7ELnFVnpDMzbJJDDNZjavX6jvtDmALMbXAGW67pdTgFea2FrGGSFs8Ejxi96oFLGHcL4P6bjLDPBJEvRRHSrG4LsPne52fczt2MWjHLLJBvhAC',
        iss: 'did:ebsi:zjHZjJ4Sy7r92BxXzFGs7qD',
        nbf: 1707131359,
        exp: 1707217759,
        iat: 1707131359,
        vc: {
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          id: 'vc:ebsi:conformance#a295fed3-d639-454d-9b1a-925a2d74a582',
          type: [
            'VerifiableCredential',
            'VerifiableAttestation',
            'VerifiableAuthorisationToOnboard',
          ],
          issuer: 'did:ebsi:zjHZjJ4Sy7r92BxXzFGs7qD',
          issuanceDate: '2024-02-05T11:09:19Z',
          issued: '2024-02-05T11:09:19Z',
          validFrom: '2024-02-05T11:09:19Z',
          expirationDate: '2024-02-06T11:09:19Z',
          credentialSubject: {
            id: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9Kboj7g9PfXJxbbs4KYegyr7ELnFVnpDMzbJJDDNZjavX6jvtDmALMbXAGW67pdTgFea2FrGGSFs8Ejxi96oFLGHcL4P6bjLDPBJEvRRHSrG4LsPne52fczt2MWjHLLJBvhAC',
          },
          credentialSchema: {
            id: 'https://api-conformance.ebsi.eu/trusted-schemas-registry/v3/schemas/z3MgUFUkb722uq4x3dv5yAJmnNmzDFeK5UC8x83QoeLJM',
            type: 'FullJsonSchemaValidator2021',
          },
          termsOfUse: {
            id: 'https://api-conformance.ebsi.eu/trusted-issuers-registry/v5/issuers/did:ebsi:zjHZjJ4Sy7r92BxXzFGs7qD/attributes/bcdb6bc952c8c897ca1e605fce25f82604c76c16d479770014b7b262b93c0250',
            type: 'IssuanceCertificate',
          },
        },
      },
      {
        jti: 'vc:ebsi:conformance#a295fed3-d639-454d-9b1a-925a2d74a582',
        sub: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9Kboj7g9PfXJxbbs4KYegyr7ELnFVnpDMzbJJDDNZjavX6jvtDmALMbXAGW67pdTgFea2FrGGSFs8Ejxi96oFLGHcL4P6bjLDPBJEvRRHSrG4LsPne52fczt2MWjHLLJBvhAC',
        iss: 'did:ebsi:zjHZjJ4Sy7r92BxXzFGs7qD',
        nbf: 1707131359,
        exp: 1707217759,
        iat: 1707131359,
        vc: {
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          id: 'vc:ebsi:conformance#a295fed3-d639-454d-9b1a-925a2d74a582',
          type: [
            'VerifiableCredential',
            'VerifiableAttestation',
            'VerifiableAuthorisationToOnboard',
          ],
          issuer: 'did:ebsi:zjHZjJ4Sy7r92BxXzFGs7qD',
          issuanceDate: '2024-02-05T11:09:19Z',
          issued: '2024-02-05T11:09:19Z',
          validFrom: '2024-02-05T11:09:19Z',
          expirationDate: '2024-02-06T11:09:19Z',
          credentialSubject: {
            id: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9Kboj7g9PfXJxbbs4KYegyr7ELnFVnpDMzbJJDDNZjavX6jvtDmALMbXAGW67pdTgFea2FrGGSFs8Ejxi96oFLGHcL4P6bjLDPBJEvRRHSrG4LsPne52fczt2MWjHLLJBvhAC',
          },
          credentialSchema: {
            id: 'https://api-conformance.ebsi.eu/trusted-schemas-registry/v3/schemas/z3MgUFUkb722uq4x3dv5yAJmnNmzDFeK5UC8x83QoeLJM',
            type: 'FullJsonSchemaValidator2021',
          },
          termsOfUse: {
            id: 'https://api-conformance.ebsi.eu/trusted-issuers-registry/v5/issuers/did:ebsi:zjHZjJ4Sy7r92BxXzFGs7qD/attributes/bcdb6bc952c8c897ca1e605fce25f82604c76c16d479770014b7b262b93c0250',
            type: 'IssuanceCertificate',
          },
        },
      },
    ];

    const descriptorMapIds = ['Credential1', 'Credential2', 'Credential3'];

    const presentationSubmissionValidator = new PresentationSubmissionValidator(
      presentationDefinition,
      verifiableCredentials,
      descriptorMapIds,
      jsonSchemaWrapper,
    );

    const result = presentationSubmissionValidator.validate();
    expect(result.valid).toBeFalsy();
    expect(result.message).toBe(
      'presentation_submission verifiable credential Credential1 does not match presentation_definition constrains path',
    );
  });
});
