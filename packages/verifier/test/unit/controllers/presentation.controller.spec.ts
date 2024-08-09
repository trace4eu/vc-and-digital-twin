import { mock } from 'jest-mock-extended';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../src/app.module';
import * as request from 'supertest';
import { InitPresentationRequestDto } from '../../../src/api/dtos/initPresentationRequest.dto';
import PresentationService from '../../../src/contexts/presentation/services/presentation.service';
import { InitPresentationResponseDto } from '../../../src/api/dtos/initPresentationResponse.dto';
import ResolvedValue = jest.ResolvedValue;
describe('Verifier Controller should', () => {
  let app: INestApplication;
  const presentationService = mock<PresentationService>();

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PresentationService)
      .useValue(presentationService)
      .compile();
    app = module.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    jest.resetAllMocks();
  });
  afterAll(async () => {
    await app.close();
  });

  it('create a presentation', async () => {
    const inputBody: InitPresentationRequestDto = {
      responseType: 'vp_token',
      presentationDefinition: {
        id: '32f54163-7166-48f1-93d8-ff217bdb0653',
        input_descriptors: [
          {
            id: 'same-device-in-time-credential',
            format: { jwt_vc: { alg: ['ES256'] } },
            constraints: {
              fields: [
                {
                  path: ['$.vc.type'],
                  filter: {
                    type: 'array',
                    contains: { const: 'CTWalletSameAuthorisedInTime' },
                  },
                },
              ],
            },
          },
        ],
      },
      nonce: 'nonce',
      responseMode: 'direct_post',
      presentationDefinitionMode: 'by_value',
      callbackUrl: 'callbackUrl',
    };

    const expectedResponse = {
      qrBase64:
        'data:image/png;base64,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',
      rawOpenid4vp:
        'openid4vp://authorize?response_type=vp_token&client_id=dev.verifier-backend.trace4eu.eu&request_uri=https%3A%2F%2Fdev.verifier-backend.trace4eu.eu%2Frequests%2Fed6ad3fc-b7da-4a55-ae10-5d29099bfc41',
    };

    presentationService.execute.mockResolvedValue(
      expectedResponse as ResolvedValue<InitPresentationResponseDto>,
    );

    const response = await request(app.getHttpServer())
      .post('/presentations')
      .send(inputBody);

    expect(response.statusCode).toBe(HttpStatus.CREATED);
    expect(response.body).toBeDefined();
  });
});
