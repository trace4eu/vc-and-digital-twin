import { HttpStatus, INestApplication } from '@nestjs/common';
import { mock } from 'jest-mock-extended';
import PresentationDefinitionService from '../../../src/contexts/presentation/services/presentationDefinition.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../src/app.module';
import ResolvedValue = jest.ResolvedValue;
import { PresentationDefinition } from '@trace4eu/verifiable-presentation';
import * as request from 'supertest';
describe('Presentation Definition controller shoud', () => {
  let app: INestApplication;
  const presentationDefinitionService = mock<PresentationDefinitionService>();

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PresentationDefinitionService)
      .useValue(presentationDefinitionService)
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

  it('return a presentation definition from a given session', async () => {
    const expectedResponse = {
      id: '32f54163-7166-48f1-93d8-ff217bdb0653',
      input_descriptors: [
        {
          id: 'same-device-in-time-credential',
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
                    const: 'CTWalletSameAuthorisedInTime',
                  },
                },
              },
            ],
          },
        },
      ],
    };

    presentationDefinitionService.execute.mockResolvedValue(
      expectedResponse as ResolvedValue<PresentationDefinition>,
    );

    const response = await request(app.getHttpServer()).get(
      '/presentation-definitions/1234',
    );

    expect(response.statusCode).toBe(HttpStatus.OK);
    expect(response.body).toStrictEqual(expectedResponse);
  });
});
