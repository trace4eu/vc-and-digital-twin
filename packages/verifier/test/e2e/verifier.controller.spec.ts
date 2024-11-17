import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import joseWrapper from '../../src/contexts/shared/middleware/joseWrapper';
import { ec as EC } from 'elliptic';
import { loadConfig } from '../../config/configuration';
import { Uuid } from '../../src/contexts/shared/domain/uuid';

describe('Presentation e2e flow', () => {
  let application: INestApplication;
  const apiConfig = loadConfig();

  const verifiableCredential =
    'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImRpZDplYnNpOnpmRW12WDV0d2hYalFKaUNXc3VrdlFBI3l6VmM4dUQ1S1MzR0N0ek51VkZMMkE4UXprMjlkSGg0TS1GRFl0UTh0UmcifQ.eyJqdGkiOiJ1cm46dXVpZDo4MmY4YWE3YS04M2U3LTRlM2QtOGUwZS02ZTA1MTJjMjI1OGYiLCJzdWIiOiJkaWQ6a2V5OnoyZG16RDgxY2dQeDhWa2k3SmJ1dU1tRllyV1BnWW95dHlrVVozZXlxaHQxajlLYnBzckVRdDUyeWNMN0cxTkw4d25kWm9UWjlYbndhRGNFSzdSWnllNkFMZW94UUFYZWUyY1FCWktjeTdkSmVzSmd6WGE5bXlYTHhnOGtkVVZwWGs1M1UyZGo5eWN2djQ3eDlWRWtYb0JTMnRIdG1YZ0JXQjhYRlY1OXRoWEZqeHRXdzYiLCJpc3MiOiJkaWQ6ZWJzaTp6ZkVtdlg1dHdoWGpRSmlDV3N1a3ZRQSIsIm5iZiI6MTcxMzg3NjI0MSwiaWF0IjoxNzEzODc2MjQxLCJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJpZCI6InVybjp1dWlkOjgyZjhhYTdhLTgzZTctNGUzZC04ZTBlLTZlMDUxMmMyMjU4ZiIsInR5cGUiOlsiVmVyaWZpYWJsZUNyZWRlbnRpYWwiLCJWZXJpZmlhYmxlQXR0ZXN0YXRpb24iLCJUZXN0Il0sImlzc3VlciI6ImRpZDplYnNpOnpmRW12WDV0d2hYalFKaUNXc3VrdlFBIiwiaXNzdWVkIjoiMjAyNC0wNC0yM1QxMjo0NDowMVoiLCJjcmVkZW50aWFsU3ViamVjdCI6eyJpZCI6ImRpZDprZXk6ejJkbXpEODFjZ1B4OFZraTdKYnV1TW1GWXJXUGdZb3l0eWtVWjNleXFodDFqOUticHNyRVF0NTJ5Y0w3RzFOTDh3bmRab1RaOVhud2FEY0VLN1JaeWU2QUxlb3hRQVhlZTJjUUJaS2N5N2RKZXNKZ3pYYTlteVhMeGc4a2RVVnBYazUzVTJkajl5Y3Z2NDd4OVZFa1hvQlMydEh0bVhnQldCOFhGVjU5dGhYRmp4dFd3NiIsInRlc3QiOiJ0ZXN0In0sImNyZWRlbnRpYWxTY2hlbWEiOnsiaWQiOiJodHRwczovL2FwaS1waWxvdC5lYnNpLmV1L3RydXN0ZWQtc2NoZW1hcy1yZWdpc3RyeS92My9zY2hlbWFzL3pEcFdHVUJlbm1xWHp1cnNrcnk5TnNrNnZxMlI4dGhoOVZTZW9ScWd1b3lNRCIsInR5cGUiOiJGdWxsSnNvblNjaGVtYVZhbGlkYXRvcjIwMjEifSwiaXNzdWFuY2VEYXRlIjoiMjAyNC0wNC0yM1QxMjo0NDowMVoiLCJ2YWxpZEZyb20iOiIyMDI0LTA0LTIzVDEyOjQ0OjAxWiJ9fQ.2IuSSKuOQyHATVslEQ0--4Fg9NL2r1TSZt2uUvdM0k1oYf8BUm7AVFxKoEQBtj8k6EK2IzxBIE9B-be1g3P5BQ';
  const holderDid =
    'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9KbpsrEQt52ycL7G1NL8wndZoTZ9XnwaDcEK7RZye6ALeoxQAXee2cQBZKcy7dJesJgzXa9myXLxg8kdUVpXk53U2dj9ycvv47x9VEkXoBS2tHtmXgBWB8XFV59thXFjxtWw6';
  const privateKeyJwk = {
    kid: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9KbpsrEQt52ycL7G1NL8wndZoTZ9XnwaDcEK7RZye6ALeoxQAXee2cQBZKcy7dJesJgzXa9myXLxg8kdUVpXk53U2dj9ycvv47x9VEkXoBS2tHtmXgBWB8XFV59thXFjxtWw6#z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9KbpsrEQt52ycL7G1NL8wndZoTZ9XnwaDcEK7RZye6ALeoxQAXee2cQBZKcy7dJesJgzXa9myXLxg8kdUVpXk53U2dj9ycvv47x9VEkXoBS2tHtmXgBWB8XFV59thXFjxtWw6',
    kty: 'EC',
    x: 'P4eO8WHO8NVflpTej9DpDuUOZOcYMKgQzgD6ddnacIc',
    y: 'cbbDiU7CNZVEqN_sHPfbyIhickn0pmkUoioflthqOI4',
    crv: 'P-256',
    d: '4SLhCYSh3toax52ATe-DNqVcc41l7EziQKqDD6Qbfrk',
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    application = module.createNestApplication();
    await application.init();
  });

  beforeEach(async () => {
    jest.resetAllMocks();
  });

  afterEach(async () => {
    await application.close();
  });
  it('should redirect with the error message when vp_token contains a wrong state', async () => {
    const presentationDefinition = {
      id: 'bfd1100c-068f-4b74-a66a-9c78fd1652c8',
      format: { jwt_vc: { alg: ['ES256'] }, jwt_vp: { alg: ['ES256'] } },
      input_descriptors: [
        {
          id: 'EmailCredential',
          constraints: {
            fields: [
              {
                path: ['$vc.type'],
                filter: {
                  type: 'array',
                  contains: { const: 'VerifiableAttestation' },
                },
              },
            ],
          },
        },
      ],
    };
    const initPresentationResponse = await request(application.getHttpServer())
      .post('/presentations')
      .send({
        responseType: 'vp_token',
        presentationDefinition,
        nonce: 'nonce',
        responseMode: 'direct_post',
        presentationDefinitionMode: 'by_reference',
        redirectUri: 'openid://',
      });

    expect(initPresentationResponse.statusCode).toBe(HttpStatus.CREATED);
    expect(initPresentationResponse.body.qrBase64).toBeDefined();
    expect(initPresentationResponse.body.rawOpenid4vp).toBeDefined();

    const qrParams = new URLSearchParams(
      initPresentationResponse.body.rawOpenid4vp,
    );
    const requestUri = qrParams.get('request_uri');
    expect(requestUri).toBeDefined();
    const sessionId = requestUri?.split('/').slice(-1)[0];
    expect(sessionId).toBeDefined();

    const getRequestJwtResponse = await request(
      application.getHttpServer(),
    ).get(
      (requestUri as string).replace(apiConfig.verifierClientId as string, ''),
    );

    expect(getRequestJwtResponse.statusCode).toBe(HttpStatus.OK);
    expect(getRequestJwtResponse.text).toBeDefined();
    expect(
      getRequestJwtResponse.headers['content-type'].includes(
        'application/oauth-authz-req+jwt',
      ),
    ).toBeTruthy();

    const authRequestDecoded = joseWrapper.decodeJWT(
      getRequestJwtResponse.text,
    );
    const state = authRequestDecoded.state as string;
    expect(authRequestDecoded.nonce).toBeDefined();
    expect(state).toBeDefined();
    expect(authRequestDecoded.presentation_definition_uri).toBeDefined();

    const presentationDefinitionUri = (
      authRequestDecoded.presentation_definition_uri as string
    ).replace(apiConfig.verifierClientId as string, '');
    const getPresentationDefinitionResponse = await request(
      application.getHttpServer(),
    ).get(presentationDefinitionUri);

    expect(getPresentationDefinitionResponse.body).toStrictEqual(
      presentationDefinition,
    );

    const directPostUri = (authRequestDecoded.response_uri as string).replace(
      apiConfig.verifierClientId as string,
      '',
    );
    const directPostResponse = await request(application.getHttpServer())
      .post(directPostUri)
      .send({
        vp_token:
          'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImRpZDprZXk6ejJkbXpEODFjZ1B4OFZraTdKYnV1TW1GWXJXUGdZb3l0eWtVWjNleXFodDFqOUticDdjTFpMUnhzWnVFVGs5Qk5nM29WYVJURFFDTjh1WGF5eHlldDVaY2pnWnh2d251TVhZV0d6czdMeFgxczRHUmJMVUp3RkpIRnpFZU56QnM2VndLOFNKeWpyaUtqRTg2eEtGVEVBd1ZzN3F5U0hrcjhaM3lpbWhzU0w3YmtjTTdOdCN6MmRtekQ4MWNnUHg4VmtpN0pidXVNbUZZcldQZ1lveXR5a1VaM2V5cWh0MWo5S2JwN2NMWkxSeHNadUVUazlCTmczb1ZhUlREUUNOOHVYYXl4eWV0NVpjamdaeHZ3bnVNWFlXR3pzN0x4WDFzNEdSYkxVSndGSkhGekVlTnpCczZWd0s4U0p5anJpS2pFODZ4S0ZURUF3VnM3cXlTSGtyOFozeWltaHNTTDdia2NNN050In0.eyJpYXQiOjE3MDkxMTU0OTAsImV4cCI6NTEwOTQzNjgwMCwiaXNzIjoiZGlkOmtleTp6MmRtekQ4MWNnUHg4VmtpN0pidXVNbUZZcldQZ1lveXR5a1VaM2V5cWh0MWo5S2JwN2NMWkxSeHNadUVUazlCTmczb1ZhUlREUUNOOHVYYXl4eWV0NVpjamdaeHZ3bnVNWFlXR3pzN0x4WDFzNEdSYkxVSndGSkhGekVlTnpCczZWd0s4U0p5anJpS2pFODZ4S0ZURUF3VnM3cXlTSGtyOFozeWltaHNTTDdia2NNN050IiwiYXVkIjoiaHR0cHM6Ly9hcGktY29uZm9ybWFuY2UuZWJzaS5ldS9jb25mb3JtYW5jZS92My9hdXRoLW1vY2siLCJzdWIiOiJkaWQ6a2V5OnoyZG16RDgxY2dQeDhWa2k3SmJ1dU1tRllyV1BnWW95dHlrVVozZXlxaHQxajlLYnA3Y0xaTFJ4c1p1RVRrOUJOZzNvVmFSVERRQ044dVhheXh5ZXQ1WmNqZ1p4dndudU1YWVdHenM3THhYMXM0R1JiTFVKd0ZKSEZ6RWVOekJzNlZ3SzhTSnlqcmlLakU4NnhLRlRFQXdWczdxeVNIa3I4WjN5aW1oc1NMN2JrY003TnQiLCJuYmYiOjE3MDkxMTU0OTAsIm5vbmNlIjoiNDQ5ODNjNTctZGIyOS00ZDQwLWFmM2UtZmM3NDI4OTI1ODNjIiwic3RhdGUiOiI2OTU0MzEwMS0yZmZkLTQzNjUtOTg2Ny1hOGM0MDZiZmMwOTkiLCJqdGkiOiJ1cm46ZGlkOmYzZDg0YWNhLTRhZmUtNGU3Zi1iNTBlLTk0MWFkMWY3ZTVjNSIsInZwIjp7ImlkIjoidXJuOmRpZDpmM2Q4NGFjYS00YWZlLTRlN2YtYjUwZS05NDFhZDFmN2U1YzUiLCJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVQcmVzZW50YXRpb24iXSwiaG9sZGVyIjoiZGlkOmtleTp6MmRtekQ4MWNnUHg4VmtpN0pidXVNbUZZcldQZ1lveXR5a1VaM2V5cWh0MWo5S2JwN2NMWkxSeHNadUVUazlCTmczb1ZhUlREUUNOOHVYYXl4eWV0NVpjamdaeHZ3bnVNWFlXR3pzN0x4WDFzNEdSYkxVSndGSkhGekVlTnpCczZWd0s4U0p5anJpS2pFODZ4S0ZURUF3VnM3cXlTSGtyOFozeWltaHNTTDdia2NNN050IiwidmVyaWZpYWJsZUNyZWRlbnRpYWwiOlsiZXlKaGJHY2lPaUpGVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0lzSW10cFpDSTZJbVJwWkRwbFluTnBPbnB5Y20xUWRYUktUVFZqWjJScVIxRkdOR05FZVRWaUkzUkNOaTFVYjJreFdsSk9TM1ZmUkVkaVpHVnJiVXhETjJFM1R6SjBha1JEUTNaalVGZHlja2xMTTJNaWZRLmV5SnFkR2tpT2lKMWNtNDZaR2xrT2pFeU16UTFOaUlzSW5OMVlpSTZJbVJwWkRwclpYazZlakprYlhwRU9ERmpaMUI0T0ZacmFUZEtZblYxVFcxR1dYSlhVR2RaYjNsMGVXdFZXak5sZVhGb2RERnFPVXRpY0RkalRGcE1Vbmh6V25WRlZHczVRazVuTTI5V1lWSlVSRkZEVGpoMVdHRjVlSGxsZERWYVkycG5XbmgyZDI1MVRWaFpWMGQ2Y3pkTWVGZ3hjelJIVW1KTVZVcDNSa3BJUm5wRlpVNTZRbk0yVm5kTE9GTktlV3B5YVV0cVJUZzJlRXRHVkVWQmQxWnpOM0Y1VTBocmNqaGFNM2xwYldoelUwdzNZbXRqVFRkT2RDSXNJbWx6Y3lJNkltUnBaRHBsWW5OcE9ucHljbTFRZFhSS1RUVmpaMlJxUjFGR05HTkVlVFZpSWl3aWJtSm1Jam94TmpNMU56STBPREF3TENKbGVIQWlPakUyTXpneU16QTBNREFzSW1saGRDSTZNVFl6TlRVMU1qQXdNQ3dpZG1NaU9uc2lRR052Ym5SbGVIUWlPbHNpYUhSMGNITTZMeTkzZDNjdWR6TXViM0puTHpJd01UZ3ZZM0psWkdWdWRHbGhiSE12ZGpFaVhTd2lhV1FpT2lKMWNtNDZaR2xrT2pFeU16UTFOaUlzSW5SNWNHVWlPbHNpVm1WeWFXWnBZV0pzWlVOeVpXUmxiblJwWVd3aUxDSldaWEpwWm1saFlteGxRWFIwWlhOMFlYUnBiMjRpWFN3aWFYTnpkV1Z5SWpvaVpHbGtPbVZpYzJrNmVuSnliVkIxZEVwTk5XTm5aR3BIVVVZMFkwUjVOV0lpTENKcGMzTjFZVzVqWlVSaGRHVWlPaUl5TURJeExURXhMVEF4VkRBd09qQXdPakF3V2lJc0luWmhiR2xrUm5KdmJTSTZJakl3TWpFdE1URXRNREZVTURBNk1EQTZNREJhSWl3aWFYTnpkV1ZrSWpvaU1qQXlNUzB4TUMwek1GUXdNRG93TURvd01Gb2lMQ0pqY21Wa1pXNTBhV0ZzVTNWaWFtVmpkQ0k2ZXlKcFpDSTZJbVJwWkRwclpYazZlakprYlhwRU9ERmpaMUI0T0ZacmFUZEtZblYxVFcxR1dYSlhVR2RaYjNsMGVXdFZXak5sZVhGb2RERnFPVXRpY0RkalRGcE1Vbmh6V25WRlZHczVRazVuTTI5V1lWSlVSRkZEVGpoMVdHRjVlSGxsZERWYVkycG5XbmgyZDI1MVRWaFpWMGQ2Y3pkTWVGZ3hjelJIVW1KTVZVcDNSa3BJUm5wRlpVNTZRbk0yVm5kTE9GTktlV3B5YVV0cVJUZzJlRXRHVkVWQmQxWnpOM0Y1VTBocmNqaGFNM2xwYldoelUwdzNZbXRqVFRkT2RDSXNJbkJsY25OdmJtRnNTV1JsYm5ScFptbGxjaUk2SWtsVUwwUkZMekV5TXpRaUxDSm1ZVzFwYkhsT1lXMWxJam9pUTJGemRHRm1hVzl5YVNJc0ltWnBjbk4wVG1GdFpTSTZJa0pwWVc1allTSXNJbVJoZEdWUFprSnBjblJvSWpvaU1Ua3pNQzB4TUMwd01TSjlMQ0pqY21Wa1pXNTBhV0ZzVTJOb1pXMWhJanA3SW1sa0lqb2lhSFIwY0hNNkx5OWhjR2t0Y0dsc2IzUXVaV0p6YVM1bGRTOTBjblZ6ZEdWa0xYTmphR1Z0WVhNdGNtVm5hWE4wY25rdmRqSXZjMk5vWlcxaGN5OHdlREJtTkRGaE1XWTBPVE0wWlRFeFpqaG1PVGhsTkRRMFpXUXpOR1ppTURRd05qUTFaR05qTURSalpXRmtNbUZsTWpobVkyRXdOakpsWVdKbVlXTXhPREVpTENKMGVYQmxJam9pUm5Wc2JFcHpiMjVUWTJobGJXRldZV3hwWkdGMGIzSXlNREl4SW4wc0ltVjRjR2x5WVhScGIyNUVZWFJsSWpvaU1qQXlNUzB4TVMwek1GUXdNRG93TURvd01Gb2lmWDAuelZQREpqSFJUbjVkbDF0RWo3eGh3dzhvdTh1RkFBZHpJR1JjOXFqZGktZlBuY3drZ05CdVVQMGVzQi1PLWt5WmZRaDA1aW5WeWQtT2dCLU0yNnVxbGciXX19.qSQw6hmWFIY8hsx1jpidl0NgHZoC2wnWvtmai_qk-HiOEzpYROusM-VBAwAX8TxHJHC66WAQKvRgqfgOTnMbIg',
        presentation_submission: JSON.stringify({
          id: 'presentation_submission_id_test_1',
          definition_id: 'bfd1100c-068f-4b74-a66a-9c78fd1652c8',
          descriptor_map: [
            {
              format: 'jwt_vp',
              id: 'EmailCredential',
              path: '$',
              path_nested: {
                format: 'jwt_vc',
                id: 'EmailCredential',
                path: '$.vp.verifiableCredential[0]',
              },
            },
          ],
        }),
      });
    expect(directPostResponse.statusCode).toBe(HttpStatus.FOUND);
    expect(directPostResponse.headers.location).toContain(
      `openid://?error=invalid_request&error_description=invalid%20state&state=${state}`,
    );
  });
  it('should redirect with the code and state when redirectUri is informed in the init presentation request and the verification finish successfully', async () => {
    const presentationDefinition = {
      id: '32f54163-7166-48f1-93d8-ff217bdb0653',
      input_descriptors: [
        {
          id: '123456',
          format: {
            jwt_vc: {
              alg: ['ES256'],
            },
            jwt_vp: {
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
    const initPresentationResponse = await request(application.getHttpServer())
      .post('/presentations')
      .send({
        responseType: 'vp_token',
        presentationDefinition,
        nonce: Uuid.generate().toString(),
        responseMode: 'direct_post',
        presentationDefinitionMode: 'by_reference',
        redirectUri: 'openid://',
      });

    expect(initPresentationResponse.statusCode).toBe(HttpStatus.CREATED);
    expect(initPresentationResponse.body.qrBase64).toBeDefined();
    expect(initPresentationResponse.body.rawOpenid4vp).toBeDefined();

    const qrParams = new URLSearchParams(
      initPresentationResponse.body.rawOpenid4vp,
    );
    const requestUri = qrParams.get('request_uri');
    expect(requestUri).toBeDefined();
    const sessionId = requestUri?.split('/').slice(-1)[0];
    expect(sessionId).toBeDefined();

    const getRequestJwtResponse = await request(
      application.getHttpServer(),
    ).get(
      (requestUri as string).replace(apiConfig.verifierClientId as string, ''),
    );

    expect(getRequestJwtResponse.statusCode).toBe(HttpStatus.OK);
    expect(getRequestJwtResponse.text).toBeDefined();
    expect(
      getRequestJwtResponse.headers['content-type'].includes(
        'application/oauth-authz-req+jwt',
      ),
    ).toBeTruthy();

    const authRequestDecoded = joseWrapper.decodeJWT(
      getRequestJwtResponse.text,
    );
    const state = authRequestDecoded.state as string;
    expect(authRequestDecoded.nonce).toBeDefined();
    expect(state).toBeDefined();
    expect(authRequestDecoded.presentation_definition_uri).toBeDefined();

    const presentationDefinitionUri = (
      authRequestDecoded.presentation_definition_uri as string
    ).replace(apiConfig.verifierClientId as string, '');
    const getPresentationDefinitionResponse = await request(
      application.getHttpServer(),
    ).get(presentationDefinitionUri);

    expect(getPresentationDefinitionResponse.body).toStrictEqual(
      presentationDefinition,
    );

    const vpId = Uuid.generate();
    const payload = {
      iat: Math.floor(Date.now() / 1000),
      iss: holderDid,
      aud: authRequestDecoded.aud,
      sub: holderDid,
      nbf: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + Math.floor(900),
      nonce: authRequestDecoded.nonce,
      state: state,
      jti: vpId.toString(),
      vp: {
        id: vpId.toString(),
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiablePresentation'],
        holder: holderDid,
        verifiableCredential: [verifiableCredential],
      },
    };
    const signatureHeader = {
      alg: 'ES256',
      typ: 'JWT',
    };
    const vpToken = await joseWrapper.signJwt(
      privateKeyJwk,
      signatureHeader,
      Buffer.from(JSON.stringify(payload)),
    );

    const directPostUri = (authRequestDecoded.response_uri as string).replace(
      apiConfig.verifierClientId as string,
      '',
    );
    const directPostResponse = await request(application.getHttpServer())
      .post(directPostUri)
      .send({
        vp_token: vpToken,
        presentation_submission: JSON.stringify({
          definition_id: '32f54163-7166-48f1-93d8-ff217bdb0653',
          descriptor_map: [
            {
              format: 'jwt_vp',
              id: '123456',
              path: '$',
              path_nested: {
                format: 'jwt_vc',
                id: '123456',
                path: '$.vp.verifiableCredential[0]',
              },
            },
          ],
          id: '79e3c83b-46a3-4001-b465-e3c282e0b4cb',
        }),
      });
    expect(directPostResponse.statusCode).toBe(HttpStatus.FOUND);
    expect(directPostResponse.headers.location).toContain(`openid://?code=`);
    expect(directPostResponse.headers.location).toContain(`state`);

    const codeAndState = (
      directPostResponse.headers.location as string
    ).replace('openid://?', '');

    const getWalletResponse = await request(application.getHttpServer()).get(
      `/presentations/${sessionId}?${codeAndState}`,
    );

    const expectedWalletResponse = {
      vpTokenData: {
        verifiableCredentials: [
          {
            format: 'jwt',
            verifiableCredential:
              'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImRpZDplYnNpOnpmRW12WDV0d2hYalFKaUNXc3VrdlFBI3l6VmM4dUQ1S1MzR0N0ek51VkZMMkE4UXprMjlkSGg0TS1GRFl0UTh0UmcifQ.eyJqdGkiOiJ1cm46dXVpZDo4MmY4YWE3YS04M2U3LTRlM2QtOGUwZS02ZTA1MTJjMjI1OGYiLCJzdWIiOiJkaWQ6a2V5OnoyZG16RDgxY2dQeDhWa2k3SmJ1dU1tRllyV1BnWW95dHlrVVozZXlxaHQxajlLYnBzckVRdDUyeWNMN0cxTkw4d25kWm9UWjlYbndhRGNFSzdSWnllNkFMZW94UUFYZWUyY1FCWktjeTdkSmVzSmd6WGE5bXlYTHhnOGtkVVZwWGs1M1UyZGo5eWN2djQ3eDlWRWtYb0JTMnRIdG1YZ0JXQjhYRlY1OXRoWEZqeHRXdzYiLCJpc3MiOiJkaWQ6ZWJzaTp6ZkVtdlg1dHdoWGpRSmlDV3N1a3ZRQSIsIm5iZiI6MTcxMzg3NjI0MSwiaWF0IjoxNzEzODc2MjQxLCJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJpZCI6InVybjp1dWlkOjgyZjhhYTdhLTgzZTctNGUzZC04ZTBlLTZlMDUxMmMyMjU4ZiIsInR5cGUiOlsiVmVyaWZpYWJsZUNyZWRlbnRpYWwiLCJWZXJpZmlhYmxlQXR0ZXN0YXRpb24iLCJUZXN0Il0sImlzc3VlciI6ImRpZDplYnNpOnpmRW12WDV0d2hYalFKaUNXc3VrdlFBIiwiaXNzdWVkIjoiMjAyNC0wNC0yM1QxMjo0NDowMVoiLCJjcmVkZW50aWFsU3ViamVjdCI6eyJpZCI6ImRpZDprZXk6ejJkbXpEODFjZ1B4OFZraTdKYnV1TW1GWXJXUGdZb3l0eWtVWjNleXFodDFqOUticHNyRVF0NTJ5Y0w3RzFOTDh3bmRab1RaOVhud2FEY0VLN1JaeWU2QUxlb3hRQVhlZTJjUUJaS2N5N2RKZXNKZ3pYYTlteVhMeGc4a2RVVnBYazUzVTJkajl5Y3Z2NDd4OVZFa1hvQlMydEh0bVhnQldCOFhGVjU5dGhYRmp4dFd3NiIsInRlc3QiOiJ0ZXN0In0sImNyZWRlbnRpYWxTY2hlbWEiOnsiaWQiOiJodHRwczovL2FwaS1waWxvdC5lYnNpLmV1L3RydXN0ZWQtc2NoZW1hcy1yZWdpc3RyeS92My9zY2hlbWFzL3pEcFdHVUJlbm1xWHp1cnNrcnk5TnNrNnZxMlI4dGhoOVZTZW9ScWd1b3lNRCIsInR5cGUiOiJGdWxsSnNvblNjaGVtYVZhbGlkYXRvcjIwMjEifSwiaXNzdWFuY2VEYXRlIjoiMjAyNC0wNC0yM1QxMjo0NDowMVoiLCJ2YWxpZEZyb20iOiIyMDI0LTA0LTIzVDEyOjQ0OjAxWiJ9fQ.2IuSSKuOQyHATVslEQ0--4Fg9NL2r1TSZt2uUvdM0k1oYf8BUm7AVFxKoEQBtj8k6EK2IzxBIE9B-be1g3P5BQ',
          },
        ],
        verifiableCredentialsDecoded: [
          {
            jti: 'urn:uuid:82f8aa7a-83e7-4e3d-8e0e-6e0512c2258f',
            sub: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9KbpsrEQt52ycL7G1NL8wndZoTZ9XnwaDcEK7RZye6ALeoxQAXee2cQBZKcy7dJesJgzXa9myXLxg8kdUVpXk53U2dj9ycvv47x9VEkXoBS2tHtmXgBWB8XFV59thXFjxtWw6',
            iss: 'did:ebsi:zfEmvX5twhXjQJiCWsukvQA',
            nbf: 1713876241,
            iat: 1713876241,
            vc: {
              '@context': ['https://www.w3.org/2018/credentials/v1'],
              id: 'urn:uuid:82f8aa7a-83e7-4e3d-8e0e-6e0512c2258f',
              type: ['VerifiableCredential', 'VerifiableAttestation', 'Test'],
              issuer: 'did:ebsi:zfEmvX5twhXjQJiCWsukvQA',
              issued: '2024-04-23T12:44:01Z',
              credentialSubject: {
                id: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9KbpsrEQt52ycL7G1NL8wndZoTZ9XnwaDcEK7RZye6ALeoxQAXee2cQBZKcy7dJesJgzXa9myXLxg8kdUVpXk53U2dj9ycvv47x9VEkXoBS2tHtmXgBWB8XFV59thXFjxtWw6',
                test: 'test',
              },
              credentialSchema: {
                id: 'https://api-pilot.ebsi.eu/trusted-schemas-registry/v3/schemas/zDpWGUBenmqXzurskry9Nsk6vq2R8thh9VSeoRqguoyMD',
                type: 'FullJsonSchemaValidator2021',
              },
              issuanceDate: '2024-04-23T12:44:01Z',
              validFrom: '2024-04-23T12:44:01Z',
            },
          },
        ],
        descriptorMapIds: ['123456'],
        vpTokenIssuer:
          'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9KbpsrEQt52ycL7G1NL8wndZoTZ9XnwaDcEK7RZye6ALeoxQAXee2cQBZKcy7dJesJgzXa9myXLxg8kdUVpXk53U2dj9ycvv47x9VEkXoBS2tHtmXgBWB8XFV59thXFjxtWw6',
        decodedVerifiablePresentation: expect.any(Object),
        vpToken: expect.any(String),
      },
      status: 'verified',
    };

    expect(getWalletResponse.statusCode).toBe(HttpStatus.OK);
    expect(getWalletResponse.body).toStrictEqual(expectedWalletResponse);
  });
  it('should get a HTTP 200 OK when redirectUri is NOT informed in the init presentation request and the verification finish successfully', async () => {
    const presentationDefinition = {
      id: '32f54163-7166-48f1-93d8-ff217bdb0653',
      input_descriptors: [
        {
          id: '123456',
          format: {
            jwt_vc: {
              alg: ['ES256'],
            },
            jwt_vp: {
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
    const initPresentationResponse = await request(application.getHttpServer())
      .post('/presentations')
      .send({
        responseType: 'vp_token',
        presentationDefinition,
        nonce: Uuid.generate().toString(),
        responseMode: 'direct_post',
        presentationDefinitionMode: 'by_reference',
      });

    expect(initPresentationResponse.statusCode).toBe(HttpStatus.CREATED);
    expect(initPresentationResponse.body.qrBase64).toBeDefined();
    expect(initPresentationResponse.body.rawOpenid4vp).toBeDefined();

    const qrParams = new URLSearchParams(
      initPresentationResponse.body.rawOpenid4vp,
    );
    const requestUri = qrParams.get('request_uri');
    expect(requestUri).toBeDefined();
    const sessionId = requestUri?.split('/').slice(-1)[0];
    expect(sessionId).toBeDefined();

    const getRequestJwtResponse = await request(
      application.getHttpServer(),
    ).get(
      (requestUri as string).replace(apiConfig.verifierClientId as string, ''),
    );

    expect(getRequestJwtResponse.statusCode).toBe(HttpStatus.OK);
    expect(getRequestJwtResponse.text).toBeDefined();
    expect(
      getRequestJwtResponse.headers['content-type'].includes(
        'application/oauth-authz-req+jwt',
      ),
    ).toBeTruthy();

    const authRequestDecoded = joseWrapper.decodeJWT(
      getRequestJwtResponse.text,
    );
    const state = authRequestDecoded.state as string;
    expect(authRequestDecoded.nonce).toBeDefined();
    expect(state).toBeDefined();
    expect(authRequestDecoded.presentation_definition_uri).toBeDefined();

    const presentationDefinitionUri = (
      authRequestDecoded.presentation_definition_uri as string
    ).replace(apiConfig.verifierClientId as string, '');
    const getPresentationDefinitionResponse = await request(
      application.getHttpServer(),
    ).get(presentationDefinitionUri);

    expect(getPresentationDefinitionResponse.body).toStrictEqual(
      presentationDefinition,
    );

    const vpId = Uuid.generate();
    const payload = {
      iat: Math.floor(Date.now() / 1000),
      iss: holderDid,
      aud: authRequestDecoded.aud,
      sub: holderDid,
      nbf: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + Math.floor(900),
      nonce: authRequestDecoded.nonce,
      state: state,
      jti: vpId.toString(),
      vp: {
        id: vpId.toString(),
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiablePresentation'],
        holder: holderDid,
        verifiableCredential: [verifiableCredential],
      },
    };
    const signatureHeader = {
      alg: 'ES256',
      typ: 'JWT',
    };
    const vpToken = await joseWrapper.signJwt(
      privateKeyJwk,
      signatureHeader,
      Buffer.from(JSON.stringify(payload)),
    );

    const directPostUri = (authRequestDecoded.response_uri as string).replace(
      apiConfig.verifierClientId as string,
      '',
    );
    const directPostResponse = await request(application.getHttpServer())
      .post(directPostUri)
      .send({
        vp_token: vpToken,
        presentation_submission: JSON.stringify({
          definition_id: '32f54163-7166-48f1-93d8-ff217bdb0653',
          descriptor_map: [
            {
              format: 'jwt_vp',
              id: '123456',
              path: '$',
              path_nested: {
                format: 'jwt_vc',
                id: '123456',
                path: '$.vp.verifiableCredential[0]',
              },
            },
          ],
          id: '79e3c83b-46a3-4001-b465-e3c282e0b4cb',
        }),
      });
    expect(directPostResponse.statusCode).toBe(HttpStatus.OK);

    const getWalletResponse = await request(application.getHttpServer()).get(
      `/presentations/${sessionId}`,
    );

    const expectedWalletResponse = {
      vpTokenData: {
        verifiableCredentials: [
          {
            format: 'jwt',
            verifiableCredential:
              'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImRpZDplYnNpOnpmRW12WDV0d2hYalFKaUNXc3VrdlFBI3l6VmM4dUQ1S1MzR0N0ek51VkZMMkE4UXprMjlkSGg0TS1GRFl0UTh0UmcifQ.eyJqdGkiOiJ1cm46dXVpZDo4MmY4YWE3YS04M2U3LTRlM2QtOGUwZS02ZTA1MTJjMjI1OGYiLCJzdWIiOiJkaWQ6a2V5OnoyZG16RDgxY2dQeDhWa2k3SmJ1dU1tRllyV1BnWW95dHlrVVozZXlxaHQxajlLYnBzckVRdDUyeWNMN0cxTkw4d25kWm9UWjlYbndhRGNFSzdSWnllNkFMZW94UUFYZWUyY1FCWktjeTdkSmVzSmd6WGE5bXlYTHhnOGtkVVZwWGs1M1UyZGo5eWN2djQ3eDlWRWtYb0JTMnRIdG1YZ0JXQjhYRlY1OXRoWEZqeHRXdzYiLCJpc3MiOiJkaWQ6ZWJzaTp6ZkVtdlg1dHdoWGpRSmlDV3N1a3ZRQSIsIm5iZiI6MTcxMzg3NjI0MSwiaWF0IjoxNzEzODc2MjQxLCJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJpZCI6InVybjp1dWlkOjgyZjhhYTdhLTgzZTctNGUzZC04ZTBlLTZlMDUxMmMyMjU4ZiIsInR5cGUiOlsiVmVyaWZpYWJsZUNyZWRlbnRpYWwiLCJWZXJpZmlhYmxlQXR0ZXN0YXRpb24iLCJUZXN0Il0sImlzc3VlciI6ImRpZDplYnNpOnpmRW12WDV0d2hYalFKaUNXc3VrdlFBIiwiaXNzdWVkIjoiMjAyNC0wNC0yM1QxMjo0NDowMVoiLCJjcmVkZW50aWFsU3ViamVjdCI6eyJpZCI6ImRpZDprZXk6ejJkbXpEODFjZ1B4OFZraTdKYnV1TW1GWXJXUGdZb3l0eWtVWjNleXFodDFqOUticHNyRVF0NTJ5Y0w3RzFOTDh3bmRab1RaOVhud2FEY0VLN1JaeWU2QUxlb3hRQVhlZTJjUUJaS2N5N2RKZXNKZ3pYYTlteVhMeGc4a2RVVnBYazUzVTJkajl5Y3Z2NDd4OVZFa1hvQlMydEh0bVhnQldCOFhGVjU5dGhYRmp4dFd3NiIsInRlc3QiOiJ0ZXN0In0sImNyZWRlbnRpYWxTY2hlbWEiOnsiaWQiOiJodHRwczovL2FwaS1waWxvdC5lYnNpLmV1L3RydXN0ZWQtc2NoZW1hcy1yZWdpc3RyeS92My9zY2hlbWFzL3pEcFdHVUJlbm1xWHp1cnNrcnk5TnNrNnZxMlI4dGhoOVZTZW9ScWd1b3lNRCIsInR5cGUiOiJGdWxsSnNvblNjaGVtYVZhbGlkYXRvcjIwMjEifSwiaXNzdWFuY2VEYXRlIjoiMjAyNC0wNC0yM1QxMjo0NDowMVoiLCJ2YWxpZEZyb20iOiIyMDI0LTA0LTIzVDEyOjQ0OjAxWiJ9fQ.2IuSSKuOQyHATVslEQ0--4Fg9NL2r1TSZt2uUvdM0k1oYf8BUm7AVFxKoEQBtj8k6EK2IzxBIE9B-be1g3P5BQ',
          },
        ],
        verifiableCredentialsDecoded: [
          {
            jti: 'urn:uuid:82f8aa7a-83e7-4e3d-8e0e-6e0512c2258f',
            sub: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9KbpsrEQt52ycL7G1NL8wndZoTZ9XnwaDcEK7RZye6ALeoxQAXee2cQBZKcy7dJesJgzXa9myXLxg8kdUVpXk53U2dj9ycvv47x9VEkXoBS2tHtmXgBWB8XFV59thXFjxtWw6',
            iss: 'did:ebsi:zfEmvX5twhXjQJiCWsukvQA',
            nbf: 1713876241,
            iat: 1713876241,
            vc: {
              '@context': ['https://www.w3.org/2018/credentials/v1'],
              id: 'urn:uuid:82f8aa7a-83e7-4e3d-8e0e-6e0512c2258f',
              type: ['VerifiableCredential', 'VerifiableAttestation', 'Test'],
              issuer: 'did:ebsi:zfEmvX5twhXjQJiCWsukvQA',
              issued: '2024-04-23T12:44:01Z',
              credentialSubject: {
                id: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9KbpsrEQt52ycL7G1NL8wndZoTZ9XnwaDcEK7RZye6ALeoxQAXee2cQBZKcy7dJesJgzXa9myXLxg8kdUVpXk53U2dj9ycvv47x9VEkXoBS2tHtmXgBWB8XFV59thXFjxtWw6',
                test: 'test',
              },
              credentialSchema: {
                id: 'https://api-pilot.ebsi.eu/trusted-schemas-registry/v3/schemas/zDpWGUBenmqXzurskry9Nsk6vq2R8thh9VSeoRqguoyMD',
                type: 'FullJsonSchemaValidator2021',
              },
              issuanceDate: '2024-04-23T12:44:01Z',
              validFrom: '2024-04-23T12:44:01Z',
            },
          },
        ],
        descriptorMapIds: ['123456'],
        vpTokenIssuer:
          'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9KbpsrEQt52ycL7G1NL8wndZoTZ9XnwaDcEK7RZye6ALeoxQAXee2cQBZKcy7dJesJgzXa9myXLxg8kdUVpXk53U2dj9ycvv47x9VEkXoBS2tHtmXgBWB8XFV59thXFjxtWw6',
        decodedVerifiablePresentation: expect.any(Object),
        vpToken: expect.any(String),
      },
      status: 'verified',
    };

    expect(getWalletResponse.statusCode).toBe(HttpStatus.OK);
    expect(getWalletResponse.body).toStrictEqual(expectedWalletResponse);
  });
});
