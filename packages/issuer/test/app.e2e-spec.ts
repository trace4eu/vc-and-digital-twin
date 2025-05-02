import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '../src/auth.guard';

// Mock the QR code generation
jest.mock('qrcode', () => ({
  toDataURL: jest.fn().mockResolvedValue('dummy-qrcode'),
}));

// Mock the signature wrapper functions used for JWT signing and calculating the thumbprint.
jest.mock('@trace4eu/signature-wrapper/dist/wrappers/joseWrapper', () => ({
  joseWrapper: {
    signJwt: jest.fn().mockResolvedValue('dummy-credential-jwt'),
    calculateJwkThumbprint: jest.fn().mockResolvedValue('dummy-kid'),
  },
}));

// Mock the key utility so that we always get a dummy key.
jest.mock('@trace4eu/signature-wrapper/dist/utils/keys', () => ({
  getPrivateKeyJwkES256: jest.fn().mockReturnValue({
    kty: 'EC',
    use: 'sig',
    crv: 'P-256',
    x: 'dummyX',
    y: 'dummyY',
    d: 'dummyD',
  }),
}));

// Mock credential configurations so that the controller finds a supported credential type.
jest.mock('../src/credential-configurations', () => ({
  credentialSupported: [
    {
      types: ['TestCredential'],
      format: 'jwt_vc_json',
    },
  ],
  credentialSchemas: [
    {
      type: 'TestCredential',
      schema: 'http://example.com/schema',
    },
  ],
}));

// ----- SETUP A DUMMY GLOBAL FETCH -----
// Override fetch so the request succeeds without actually calling an external endpoint.
(global as any).fetch = jest.fn().mockResolvedValue({
  ok: true,
  status: 200,
  json: async () => ({}),
});

// ----- END MOCKS -----

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let controller: AppController;

  // Create a dummy AppService that returns a fixed credentialOfferId and preAuthCode.
  const mockAppService = {
    createCredentialOffer: jest.fn().mockReturnValue({
      credentialOfferId: 'offer123',
      preAuthCode: 'preAuth123',
    }),
  };

  // Provide dummy configuration values.
  const mockConfigService = {
    get: (key: string) => {
      const config = {
        serverUrl: 'http://localhost:3000',
        authServerUrl: 'http://localhost:4000',
        privateKey: 'dummy-private-key',
        issuerDid: 'did:example:issuer',
        issuerName: 'Test Issuer',
      };
      // @ts-expect-error: todo
      return config[key];
    },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        { provide: AppService, useValue: mockAppService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    })
      // Override the AuthGuard to always allow the request.
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    controller = app.get(AppController);
  });

  afterAll(async () => {
    await app.close();
  });

  // --- Test the POST /offer endpoint ---
  it('POST /offer should create a credential offer and return raw offer & QR code', async () => {
    // Build a payload that matches the expected CredentialOfferRequest.
    const payload = {
      type: 'TestCredential',
      user_pin: '1234',
      credentialSubject: {
        name: 'John Doe',
      },
    };

    const res = await request(app.getHttpServer())
      .post('/offer')
      .send(payload)
      .expect(HttpStatus.CREATED);

    expect(res.body).toHaveProperty('rawCredentialOffer');
    expect(res.body).toHaveProperty('qrBase64', 'dummy-qrcode');
    expect(res.body.rawCredentialOffer).toContain('/credential-offer/offer123');
  });

  // --- Test the GET /credential-offer/:id endpoint ---
  it('GET /credential-offer/:id should return credential offer information', async () => {
    const res = await request(app.getHttpServer())
      .get('/credential-offer/offer123')
      .expect(HttpStatus.OK);

    expect(res.body).toHaveProperty(
      'credential_issuer',
      'http://localhost:3000',
    );
    expect(res.body).toHaveProperty('credentials');
    expect(Array.isArray(res.body.credentials)).toBe(true);
    expect(res.body).toHaveProperty('grants');
    expect(res.body.grants).toHaveProperty(
      'urn:ietf:params:oauth:grant-type:pre-authorized_code',
    );
  });

  // --- Test the POST /credential endpoint ---
  it('POST /credential should issue a credential when provided a valid token', async () => {
    // Create a dummy token that decodes (via jsonwebtoken.decode) to { jti: 'preAuth123' }.
    const dummyPayload = { jti: 'preAuth123' };
    const dummyToken = `header.${Buffer.from(JSON.stringify(dummyPayload)).toString('base64')}.signature`;

    // Ensure the controller's in-memory maps contain the offer and pre-auth code.
    controller['preAuthCodeMap'].set('preAuth123', 'offer123');
    controller['offerMap'].set('offer123', {
      pre_auth_code: 'preAuth123',
      types: ['TestCredential'],
      // @ts-expect-error: todo
      user_pin: '1234',
      credentialSubject: {
        name: 'John Doe',
      },
      type: 'TestCredential',
    });

    // Build a dummy request body that matches CredentialRequest.
    const payload = {
      proof: {
        jwt: 'dummy.jwt.token',
      },
    };

    const res = await request(app.getHttpServer())
      .post('/credential')
      .set('authorization', `Bearer ${dummyToken}`)
      .send(payload)
      .expect(HttpStatus.CREATED);

    // Expect the response to contain the signed credential and nonce details.
    expect(res.body).toHaveProperty('format', 'jwt_vc_json');
    expect(res.body).toHaveProperty('credential', 'dummy-credential-jwt');
    expect(res.body).toHaveProperty('c_nonce');
    expect(typeof res.body.c_nonce).toBe('string');
    expect(res.body).toHaveProperty('c_nonce_expires_in', 86400);
  });

  // --- Test the GET /.well-known/openid-credential-issuer endpoint ---
  it('GET /.well-known/openid-credential-issuer should return issuer metadata', async () => {
    const res = await request(app.getHttpServer())
      .get('/.well-known/openid-credential-issuer')
      .expect(HttpStatus.OK);

    expect(res.body).toHaveProperty(
      'authorization_server',
      'http://localhost:4000',
    );
    expect(res.body).toHaveProperty(
      'credential_issuer',
      'http://localhost:3000',
    );
    expect(res.body).toHaveProperty(
      'credential_endpoint',
      'http://localhost:3000/credential',
    );
    expect(res.body).toHaveProperty('display');
    expect(Array.isArray(res.body.display)).toBe(true);
    expect(res.body).toHaveProperty('credentials_supported');
  });
});
