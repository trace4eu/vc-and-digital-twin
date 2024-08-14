import { HttpStatus, INestApplication } from '@nestjs/common';
import IdTokenService from '../../../src/contexts/presentation/services/idToken.service';
import VpTokenService, {
  PresentationResult,
} from '../../../src/contexts/presentation/services/vpToken.service';
import PresentationService from '../../../src/contexts/presentation/services/presentation.service';
import { mock } from 'jest-mock-extended';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../src/app.module';
import ResolvedValue = jest.ResolvedValue;
import * as request from 'supertest';
import { Uuid } from '../../../src/contexts/shared/domain/uuid';
import { VerifyRequestDto } from '../../../src/api/dtos/verifyRequest.dto';
describe('Verifier Controller should', () => {
  let app: INestApplication;
  const idTokenService = mock<IdTokenService>();
  const vpTokenService = mock<VpTokenService>();
  let url = '/:sessionId/direct_post';

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(IdTokenService)
      .useValue(idTokenService)
      .overrideProvider(VpTokenService)
      .useValue(vpTokenService)
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

  it('redirect with an error message when passing an invalid credential', async () => {
    const verificationRequestId = Uuid.generate().toString();
    const code = Uuid.generate().toString();
    const state = Uuid.generate().toString();

    url = url.replace(':sessionId', verificationRequestId);

    const body = {
      vp_token: 'vp_token',
      presentation_submission: {},
      state: state,
    };
    vpTokenService.execute.mockResolvedValue({
      valid: false,
      redirectUri: 'openid://',
      code: code,
      message: 'Credential is revoked',
      state: state,
    } as ResolvedValue<PresentationResult>);

    const response = await request(app.getHttpServer()).post(url).send(body);

    expect(response.statusCode).toBe(HttpStatus.FOUND);
    expect(response.headers.location).toBe(
      `openid://?error=invalid_request&error_description=Credential%20is%20revoked&state=${state}`,
    );
  });
  it('redirect with code and state when passing a valid credential with callbackUrl', async () => {
    const verificationRequestId = Uuid.generate().toString();
    const code = Uuid.generate().toString();
    const state = Uuid.generate().toString();

    url = url.replace(':sessionId', verificationRequestId);

    const body = {
      vp_token: 'vp_token',
      presentation_submission: {},
      state: state,
    };

    vpTokenService.execute.mockResolvedValue({
      valid: true,
      redirectUri: 'openid://',
      code: code,
      state: state,
    } as ResolvedValue<PresentationResult>);

    const response = await request(app.getHttpServer()).post(url).send(body);

    expect(response.statusCode).toBe(HttpStatus.FOUND);
    expect(response.headers.location).toBe(
      `openid://?code=${code}&state=${state}`,
    );
  });
  it('return a 200 OK when a successful presentation without callbackUrl', async () => {
    const verificationRequestId = Uuid.generate().toString();

    url = url.replace(':sessionId', verificationRequestId);

    const body = {
      vp_token: 'vp_token',
      presentation_submission: {},
      state: 'asd',
    };

    vpTokenService.execute.mockResolvedValue({
      valid: true,
    } as ResolvedValue<PresentationResult>);

    const response = await request(app.getHttpServer()).post(url).send(body);

    expect(response.statusCode).toBe(HttpStatus.OK);
  });
  it('redirect with code and state when successful id_token validation', async () => {
    const sessionId = Uuid.generate().toString();
    url = url.replace(':sessionId', sessionId);
    const directPostRequestDto = {
      id_token:
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiIsImtpZCI6ImRpZDprZXk6ejJkbXpEODFjZ1B4OFZraTdKYnV1TW1GWXJXUGdZb3l0eWtVWjNleXFodDFqOUtic0VZdmRyanhNalE0dHBuamU5QkRCVHp1TkRQM2tubjZxTFpFcnpkNGJKNWdvMkNDaG9QamQ1R0FIM3pwRkpQNWZ1d1NrNjZVNVBxNkVoRjRuS25IekRuem5FUDhmWDk5blpHZ3diQWgxbzdHajFYNTJUZGhmN1U0S1RrNjZ4c0E1ciJ9.eyJpc3MiOiJkaWQ6a2V5OnoyZG16RDgxY2dQeDhWa2k3SmJ1dU1tRllyV1BnWW95dHlrVVozZXlxaHQxajlLYnNFWXZkcmp4TWpRNHRwbmplOUJEQlR6dU5EUDNrbm42cUxaRXJ6ZDRiSjVnbzJDQ2hvUGpkNUdBSDN6cEZKUDVmdXdTazY2VTVQcTZFaEY0bktuSHpEbnpuRVA4Zlg5OW5aR2d3YkFoMW83R2oxWDUyVGRoZjdVNEtUazY2eHNBNXIiLCJzdWIiOiJkaWQ6a2V5OnoyZG16RDgxY2dQeDhWa2k3SmJ1dU1tRllyV1BnWW95dHlrVVozZXlxaHQxajlLYnNFWXZkcmp4TWpRNHRwbmplOUJEQlR6dU5EUDNrbm42cUxaRXJ6ZDRiSjVnbzJDQ2hvUGpkNUdBSDN6cEZKUDVmdXdTazY2VTVQcTZFaEY0bktuSHpEbnpuRVA4Zlg5OW5aR2d3YkFoMW83R2oxWDUyVGRoZjdVNEtUazY2eHNBNXIiLCJhdWQiOiJodHRwczovL215LWlzc3Vlci5yb2Nrcy9hdXRoIiwiZXhwIjoxNTg5Njk5MzYwLCJpYXQiOjE1ODk2OTkyNjAsInN0YXRlIjoiNDhhMmJhYzYtMTMwYS00Mzc4LWJjYzItMDRlYjU3YzU0M2I5Iiwibm9uY2UiOiJuLTBTNl9XekEyTWoifQ.QlpHFPFwbhFchcMVFX9Qi4PlAPBG96RSGPe7pgOnlgRZ0mDIPMmtae9ey7Tx4iZgQqH3WmGmdJTWD67eyX-qQQ',
    } as VerifyRequestDto;

    const redirectUri =
      'openid://?code=1234&state=48a2bac6-130a-4378-bcc2-04eb57c543b9';
    idTokenService.execute.mockResolvedValue(
      redirectUri as ResolvedValue<string>,
    );

    const response = await request(app.getHttpServer())
      .post(url)
      .send(directPostRequestDto);

    expect(response.status).toBe(HttpStatus.FOUND);
    expect(response.headers.location).toStrictEqual(redirectUri);
  });
});
