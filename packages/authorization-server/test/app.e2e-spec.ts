import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppController } from '../src/app.controller';
import { ConfigService } from '@nestjs/config';

jest.mock('@trace4eu/signature-wrapper/dist/wrappers/joseWrapper', () => ({
  joseWrapper: {
    signJwt: jest.fn().mockImplementation((_, payload) => {
      return Promise.resolve('dummy-access-token');
    }),
    verifyJwt: jest.fn().mockImplementation((token) => {
      return Promise.resolve({
        payload: {
          exp: Math.floor(Date.now() / 1000) + 3600,
          jti: 'session123',
        },
      });
    }),
    calculateJwkThumbprint: jest.fn().mockResolvedValue('dummy-kid'),
  },
}));

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

describe('AppController (functional)', () => {
  let app: INestApplication;

  // Create a fake ConfigService for testing purposes
  const mockConfigService = {
    get: (key: string) => {
      const config = {
        serverUrl: 'http://localhost:3000',
        authServerUrl: 'http://localhost:4000',
        privateKey: 'dummy-private-key',
      };
      // @ts-expect-error: todo
      return config[key];
    },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /.well-known/openid-configuration should return proper configuration', async () => {
    const res = await request(app.getHttpServer())
      .get('/.well-known/openid-configuration')
      .expect(HttpStatus.OK);

    expect(res.body).toHaveProperty('issuer', 'http://localhost:3000');
    expect(res.body).toHaveProperty(
      'authorization_endpoint',
      'http://localhost:4000/authorize',
    );
    expect(res.body).toHaveProperty(
      'token_endpoint',
      'http://localhost:4000/token',
    );
  });

  it('POST /createAuthSession should create a session successfully', async () => {
    const body = {
      preAuthCode: 'session123',
      userPinHash: 'hashed-pin',
      isPinRequired: true,
    };

    const res = await request(app.getHttpServer())
      .post('/createAuthSession')
      .send(body)
      .expect(HttpStatus.OK);

    expect(res.body).toEqual({
      message: 'Credential offer specific authentication session started',
    });
  });

  it('POST /createAuthSession should throw BAD_REQUEST if pin is required but not provided', async () => {
    const body = {
      preAuthCode: 'session123',
      userPinHash: '',
      isPinRequired: true,
    };

    await request(app.getHttpServer())
      .post('/createAuthSession')
      .send(body)
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('POST /verifyAccessToken should validate a valid token', async () => {
    const controller = app.get(AppController);
    controller['accessTokens'].set('session123', 'dummy-access-token');

    const res = await request(app.getHttpServer())
      .post('/verifyAccessToken')
      .send({ token: 'dummy-access-token' })
      .expect(HttpStatus.OK);

    expect(res.body).toEqual({ message: 'Token is valid' });
  });

  it('GET /jwks should return a proper JWKS structure', async () => {
    const res = await request(app.getHttpServer())
      .get('/jwks')
      .expect(HttpStatus.OK);

    expect(res.body).toHaveProperty('keys');
    expect(Array.isArray(res.body.keys)).toBe(true);
    const key = res.body.keys[0];
    expect(key).not.toHaveProperty('d');
    expect(key).toHaveProperty('kid', 'dummy-kid');
    expect(key).toHaveProperty('alg', 'ES256');
  });
});
