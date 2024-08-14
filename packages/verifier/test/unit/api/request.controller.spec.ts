import { HttpStatus, INestApplication } from '@nestjs/common';
import { mock } from 'jest-mock-extended';
import RequestService from '../../../src/contexts/presentation/services/request.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../src/app.module';
import ResolvedValue = jest.ResolvedValue;
import * as request from 'supertest';

describe('Request Controller should', () => {
  let app: INestApplication;
  const requestService = mock<RequestService>();

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(RequestService)
      .useValue(requestService)
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

  it('return a jwt signed request object', async () => {
    const expectedResponse =
      'eyJ0eXAiOiJvYXV0aC1hdXRoei1yZXErand0IiwiYWxnIjoiRVMyNTYiLCJraWQiOiJiUk1fZTBMdk95S1AyS3RfTnRWUGphdG9BNjFsRlNuRml3TE9lT3FiTzU4In0.eyJzdGF0ZSI6IjJhNzJhYzQwLTUzMGUtNDJjNy04NGE0LWU0NjIxMjFmMzE1MiIsImNsaWVudF9pZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMCIsInJlZGlyZWN0X3VyaSI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9kaXJlY3QtcG9zdCIsInJlc3BvbnNlX3R5cGUiOiJ2cF90b2tlbiIsInJlc3BvbnNlX21vZGUiOiJkaXJlY3RfcG9zdCIsInNjb3BlIjoib3BlbmlkIiwiYXVkIjoiaHR0cHM6Ly9zZWxmLWlzc3VlZC5tZS92MiIsIm5vbmNlIjoibm9uY2UiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjMwMDAiLCJleHAiOjE3MjM0NTcxMjAsInByZXNlbnRhdGlvbl9kZWZpbml0aW9uX3VyaSI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9wcmVzZW50YXRpb24tZGVmaW5pdGlvbnMvODQ2YjhlZjMtMDJhNy00OTNiLWFlNGMtNGM3MTg4MTU5NzQ4IiwiY2xpZW50X21ldGFkYXRhIjp7ImF1dGhvcml6YXRpb25fZW5kcG9pbnQiOiJvcGVuaWQ6IiwicmVzcG9uc2VfdHlwZXNfc3VwcG9ydGVkIjpbInZwX3Rva2VuIiwiaWRfdG9rZW4iXSwidnBfZm9ybWF0c19zdXBwb3J0ZWQiOnsiand0X3ZwIjp7ImFsZ192YWx1ZXNfc3VwcG9ydGVkIjpbIkVTMjU2Il19LCJqd3RfdmMiOnsiYWxnX3ZhbHVlc19zdXBwb3J0ZWQiOlsiRVMyNTYiXX19LCJzY29wZXNfc3VwcG9ydGVkIjpbIm9wZW5pZCJdLCJzdWJqZWN0X3R5cGVzX3N1cHBvcnRlZCI6WyJwdWJsaWMiXSwiaWRfdG9rZW5fc2lnbmluZ19hbGdfdmFsdWVzX3N1cHBvcnRlZCI6WyJFUzI1NiJdLCJyZXF1ZXN0X29iamVjdF9zaWduaW5nX2FsZ192YWx1ZXNfc3VwcG9ydGVkIjpbIkVTMjU2Il0sInN1YmplY3Rfc3ludGF4X3R5cGVzX3N1cHBvcnRlZCI6WyJ1cm46aWV0ZjpwYXJhbXM6b2F1dGg6andrLXRodW1icHJpbnQiLCJkaWQ6a2V5Omp3a19qY3MtcHViIl0sImlkX3Rva2VuX3R5cGVzX3N1cHBvcnRlZCI6WyJzdWJqZWN0X3NpZ25lZF9pZF90b2tlbiJdLCJqd2tzIjp7ImtleXMiOlt7ImNydiI6IlAtMjU2Iiwia3R5IjoiRUMiLCJ4IjoiS1hzcGdncjFrU1ZuTjdjd2d3eWh1QWl4TUNsRWM5SFhVdS1VSzROR1M5byIsInkiOiJXel9vLWQ0WEFMdkVYNGVUQm91bDhQem01bEhCQ1NZemxLT0tsNVg2ei1jIiwia2lkIjoiYlJNX2UwTHZPeUtQMkt0X050VlBqYXRvQTYxbEZTbkZpd0xPZU9xYk81OCJ9XX19fQ.PlSoo_0xqz4AiGWZHN_wUHlLFAcLX8SwtlXCyODw4oY3-B_A7WZCJi89p_8qblSKZbLc7kQHcFvD17ENvPi4Ug';

    requestService.execute.mockResolvedValue(
      expectedResponse as ResolvedValue<string>,
    );

    const response = await request(app.getHttpServer()).get(
      '/request.jwt/1234',
    );

    expect(response.statusCode).toBe(HttpStatus.OK);
    expect(response.text).toBe(expectedResponse);
    expect(
      response.headers['content-type'].includes(
        'application/oauth-authz-req+jwt',
      ),
    ).toBeTruthy();
  });
});
