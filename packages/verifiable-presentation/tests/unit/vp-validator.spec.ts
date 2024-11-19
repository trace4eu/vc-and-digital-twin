import { EbsiPresentationValidator } from '../../src/validators/ebsiPresentationValidator';
import { validateJwtVP } from '../../src';

describe('Verifiable Presentation library should', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('validate a valid jwt verifiable presentation using EbsiPresentationValidator', async () => {
    const presentation =
      'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImRpZDprZXk6ejJkbXpEODFjZ1B4OFZraTdKYnV1TW1GWXJXUGdZb3l0eWtVWjNleXFodDFqOUticDdjTFpMUnhzWnVFVGs5Qk5nM29WYVJURFFDTjh1WGF5eHlldDVaY2pnWnh2d251TVhZV0d6czdMeFgxczRHUmJMVUp3RkpIRnpFZU56QnM2VndLOFNKeWpyaUtqRTg2eEtGVEVBd1ZzN3F5U0hrcjhaM3lpbWhzU0w3YmtjTTdOdCN6MmRtekQ4MWNnUHg4VmtpN0pidXVNbUZZcldQZ1lveXR5a1VaM2V5cWh0MWo5S2JwN2NMWkxSeHNadUVUazlCTmczb1ZhUlREUUNOOHVYYXl4eWV0NVpjamdaeHZ3bnVNWFlXR3pzN0x4WDFzNEdSYkxVSndGSkhGekVlTnpCczZWd0s4U0p5anJpS2pFODZ4S0ZURUF3VnM3cXlTSGtyOFozeWltaHNTTDdia2NNN050In0.eyJpYXQiOjE3MDkxMTQyMzMsImV4cCI6NTEwOTQzNjgwMCwiaXNzIjoiZGlkOmtleTp6MmRtekQ4MWNnUHg4VmtpN0pidXVNbUZZcldQZ1lveXR5a1VaM2V5cWh0MWo5S2JwN2NMWkxSeHNadUVUazlCTmczb1ZhUlREUUNOOHVYYXl4eWV0NVpjamdaeHZ3bnVNWFlXR3pzN0x4WDFzNEdSYkxVSndGSkhGekVlTnpCczZWd0s4U0p5anJpS2pFODZ4S0ZURUF3VnM3cXlTSGtyOFozeWltaHNTTDdia2NNN050IiwiYXVkIjoiaHR0cHM6Ly9hcGktY29uZm9ybWFuY2UuZWJzaS5ldS9jb25mb3JtYW5jZS92My9hdXRoLW1vY2siLCJzdWIiOiJkaWQ6a2V5OnoyZG16RDgxY2dQeDhWa2k3SmJ1dU1tRllyV1BnWW95dHlrVVozZXlxaHQxajlLYnA3Y0xaTFJ4c1p1RVRrOUJOZzNvVmFSVERRQ044dVhheXh5ZXQ1WmNqZ1p4dndudU1YWVdHenM3THhYMXM0R1JiTFVKd0ZKSEZ6RWVOekJzNlZ3SzhTSnlqcmlLakU4NnhLRlRFQXdWczdxeVNIa3I4WjN5aW1oc1NMN2JrY003TnQiLCJuYmYiOjE3MDkxMTQyMzMsIm5vbmNlIjoiZDE0NDRkODItZDQ1Zi00MmJmLTkxNzktZTUzOTNmNjBjNTI0Iiwic3RhdGUiOiIwMGYzMTVkNS03NTk5LTQ4MGUtOGM4MC1jMWZlMWNjMDBlMzgiLCJqdGkiOiJ1cm46ZGlkOjgyNjZmNDJiLTFmZjYtNDA3Ni05ZjMyLWExNjc3YWIwYzliZCIsInZwIjp7ImlkIjoidXJuOmRpZDo4MjY2ZjQyYi0xZmY2LTQwNzYtOWYzMi1hMTY3N2FiMGM5YmQiLCJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVQcmVzZW50YXRpb24iXSwiaG9sZGVyIjoiZGlkOmtleTp6MmRtekQ4MWNnUHg4VmtpN0pidXVNbUZZcldQZ1lveXR5a1VaM2V5cWh0MWo5S2JwN2NMWkxSeHNadUVUazlCTmczb1ZhUlREUUNOOHVYYXl4eWV0NVpjamdaeHZ3bnVNWFlXR3pzN0x4WDFzNEdSYkxVSndGSkhGekVlTnpCczZWd0s4U0p5anJpS2pFODZ4S0ZURUF3VnM3cXlTSGtyOFozeWltaHNTTDdia2NNN050IiwidmVyaWZpYWJsZUNyZWRlbnRpYWwiOlsiZXlKaGJHY2lPaUpGVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0lzSW10cFpDSTZJbVJwWkRwbFluTnBPbnB5Y20xUWRYUktUVFZqWjJScVIxRkdOR05FZVRWaUkzUkNOaTFVYjJreFdsSk9TM1ZmUkVkaVpHVnJiVXhETjJFM1R6SjBha1JEUTNaalVGZHlja2xMTTJNaWZRLmV5SnFkR2tpT2lKMWNtNDZaR2xrT2pFeU16UTFOaUlzSW5OMVlpSTZJbVJwWkRwclpYazZlakprYlhwRU9ERmpaMUI0T0ZacmFUZEtZblYxVFcxR1dYSlhVR2RaYjNsMGVXdFZXak5sZVhGb2RERnFPVXRpY0RkalRGcE1Vbmh6V25WRlZHczVRazVuTTI5V1lWSlVSRkZEVGpoMVdHRjVlSGxsZERWYVkycG5XbmgyZDI1MVRWaFpWMGQ2Y3pkTWVGZ3hjelJIVW1KTVZVcDNSa3BJUm5wRlpVNTZRbk0yVm5kTE9GTktlV3B5YVV0cVJUZzJlRXRHVkVWQmQxWnpOM0Y1VTBocmNqaGFNM2xwYldoelUwdzNZbXRqVFRkT2RDSXNJbWx6Y3lJNkltUnBaRHBsWW5OcE9ucHljbTFRZFhSS1RUVmpaMlJxUjFGR05HTkVlVFZpSWl3aWJtSm1Jam94TmpNMU56STBPREF3TENKbGVIQWlPalV4TURrME16WTRNREFzSW1saGRDSTZNVFl6TlRVMU1qQXdNQ3dpZG1NaU9uc2lRR052Ym5SbGVIUWlPbHNpYUhSMGNITTZMeTkzZDNjdWR6TXViM0puTHpJd01UZ3ZZM0psWkdWdWRHbGhiSE12ZGpFaVhTd2lhV1FpT2lKMWNtNDZaR2xrT2pFeU16UTFOaUlzSW5SNWNHVWlPbHNpVm1WeWFXWnBZV0pzWlVOeVpXUmxiblJwWVd3aUxDSldaWEpwWm1saFlteGxRWFIwWlhOMFlYUnBiMjRpWFN3aWFYTnpkV1Z5SWpvaVpHbGtPbVZpYzJrNmVuSnliVkIxZEVwTk5XTm5aR3BIVVVZMFkwUjVOV0lpTENKcGMzTjFZVzVqWlVSaGRHVWlPaUl5TURJeExURXhMVEF4VkRBd09qQXdPakF3V2lJc0luWmhiR2xrUm5KdmJTSTZJakl3TWpFdE1URXRNREZVTURBNk1EQTZNREJhSWl3aWFYTnpkV1ZrSWpvaU1qQXlNUzB4TUMwek1GUXdNRG93TURvd01Gb2lMQ0pqY21Wa1pXNTBhV0ZzVTNWaWFtVmpkQ0k2ZXlKcFpDSTZJbVJwWkRwclpYazZlakprYlhwRU9ERmpaMUI0T0ZacmFUZEtZblYxVFcxR1dYSlhVR2RaYjNsMGVXdFZXak5sZVhGb2RERnFPVXRpY0RkalRGcE1Vbmh6V25WRlZHczVRazVuTTI5V1lWSlVSRkZEVGpoMVdHRjVlSGxsZERWYVkycG5XbmgyZDI1MVRWaFpWMGQ2Y3pkTWVGZ3hjelJIVW1KTVZVcDNSa3BJUm5wRlpVNTZRbk0yVm5kTE9GTktlV3B5YVV0cVJUZzJlRXRHVkVWQmQxWnpOM0Y1VTBocmNqaGFNM2xwYldoelUwdzNZbXRqVFRkT2RDSXNJbkJsY25OdmJtRnNTV1JsYm5ScFptbGxjaUk2SWtsVUwwUkZMekV5TXpRaUxDSm1ZVzFwYkhsT1lXMWxJam9pUTJGemRHRm1hVzl5YVNJc0ltWnBjbk4wVG1GdFpTSTZJa0pwWVc1allTSXNJbVJoZEdWUFprSnBjblJvSWpvaU1Ua3pNQzB4TUMwd01TSjlMQ0pqY21Wa1pXNTBhV0ZzVTJOb1pXMWhJanA3SW1sa0lqb2lhSFIwY0hNNkx5OWhjR2t0Y0dsc2IzUXVaV0p6YVM1bGRTOTBjblZ6ZEdWa0xYTmphR1Z0WVhNdGNtVm5hWE4wY25rdmRqSXZjMk5vWlcxaGN5OHdlREJtTkRGaE1XWTBPVE0wWlRFeFpqaG1PVGhsTkRRMFpXUXpOR1ppTURRd05qUTFaR05qTURSalpXRmtNbUZsTWpobVkyRXdOakpsWVdKbVlXTXhPREVpTENKMGVYQmxJam9pUm5Wc2JFcHpiMjVUWTJobGJXRldZV3hwWkdGMGIzSXlNREl4SW4wc0ltVjRjR2x5WVhScGIyNUVZWFJsSWpvaU1qRXpNUzB4TVMwek1GUXdNRG93TURvd01Gb2lmWDAueUFaNzJ5aTFEQzVlRXFKOV9PMWRRM1ZnRkItaVQ4NW1VWTNTTnZFdC1WdWxfalBLY1JzUjhjZVMxY2UwOGxKVVRhTThYM0hSTXBIUFU3cW1Qa0xSdlEiXX19.mEXR5cQHnHnjntnO8JsfaOS1olzawim8T9Tq9Wxm02q7wi-PywBRwapuVyjzCMU4N5Hfqw0l2oI-cPWHj85_wA';

    const presentationSubmission = {
      definition_id: 'holder-wallet-qualification-presentation',
      descriptor_map: [
        {
          format: 'jwt_vp',
          id: 'urn:did:123456',
          path: '$',
          path_nested: {
            format: 'jwt_vc',
            id: 'urn:did:123456',
            path: '$.vp.verifiableCredential[0]',
          },
        },
      ],
      id: 'a0b9a75a-95cc-49a6-818d-a2b18c2a417a',
    };

    const presentationDefinition = {
      id: 'holder-wallet-qualification-presentation',
      input_descriptors: [
        {
          id: 'urn:did:123456',
          constraints: {
            fields: [
              {
                path: ['$.vc.type'],
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

    jest
      .spyOn(EbsiPresentationValidator.prototype, 'validate')
      .mockImplementation()
      .mockResolvedValue({ valid: true });

    const validationResult = await validateJwtVP(
      presentation,
      'https://api-conformance.ebsi.eu/conformance/v3/auth-mock',
      {
        presentationDefinition,
        presentationSubmission,
      },
    );

    expect(
      jest.spyOn(EbsiPresentationValidator.prototype, 'validate').mock.calls
        .length,
    ).toEqual(1);
    expect(validationResult.valid).toBeTruthy();
  });
});