import { PresentationSubmissionFormatValidator } from '../../src/validators/presentationSubmissionFormatValidator';

describe('PresentationSubmissionFormatValidator', () => {
  it('should validate a valid presentation_submission with a presentation_definition', () => {
    const presentationDefinition: PresentationDefinition = {
      id: 'PresentationDefinition Id test 1',
      input_descriptors: [
        {
          id: 'InputDescriptor Id test 1',
          format: {
            ldp_vc: {
              proof_type: ['Ed25519Signature2018'],
            },
          },
          constraints: {
            fields: [
              {
                path: ['$.type'],
                filter: {
                  type: 'string',
                  pattern: 'IDCardCredential',
                },
              },
            ],
          },
        },
        {
          id: 'InputDescriptor Id test 2',
          format: {
            ldp_vc: {
              proof_type: ['Ed25519Signature2018'],
            },
          },
          constraints: {
            fields: [
              {
                path: ['$.type'],
                filter: {
                  type: 'string',
                  pattern: 'IDCardCredential',
                },
              },
            ],
          },
        },
      ],
    };
    const presentationSubmission: PresentationSubmission = {
      id: 'presentation_submission_id_test_1',
      definition_id: 'PresentationDefinition Id test 1',
      descriptor_map: [
        {
          id: 'InputDescriptor Id test 1',
          format: 'ldp_vp',
          path: '$',
          path_nested: {
            format: 'ldp_vc',
            path: '$.verifiableCredential[0]',
          },
        },
        {
          id: 'InputDescriptor Id test 2',
          format: 'ldp_vp',
          path: '$',
          path_nested: {
            format: 'ldp_vc',
            path: '$.verifiableCredential[0]',
          },
        },
      ],
    };

    const presentationSubmissionValidator =
      new PresentationSubmissionFormatValidator(
        presentationSubmission,
        presentationDefinition,
      );

    const result = presentationSubmissionValidator.validate();
    expect(result.valid).toBeTruthy();
  });
  it('should not validate a presentation_submission with an invalid definition_id', () => {
    const presentationDefinition: PresentationDefinition = {
      id: 'PresentationDefinition Id test 1',
      input_descriptors: [
        {
          id: 'InputDescriptor Id test 1',
          format: {
            ldp_vc: {
              proof_type: ['Ed25519Signature2018'],
            },
          },
          constraints: {
            fields: [
              {
                path: ['$.type'],
                filter: {
                  type: 'string',
                  pattern: 'IDCardCredential',
                },
              },
            ],
          },
        },
        {
          id: 'InputDescriptor Id test 2',
          format: {
            ldp_vc: {
              proof_type: ['Ed25519Signature2018'],
            },
          },
          constraints: {
            fields: [
              {
                path: ['$.type'],
                filter: {
                  type: 'string',
                  pattern: 'IDCardCredential',
                },
              },
            ],
          },
        },
      ],
    };
    const presentationSubmission: PresentationSubmission = {
      id: 'presentation_submission_id_test_1',
      definition_id: 'INVALID',
      descriptor_map: [
        {
          id: 'InputDescriptor Id test 1',
          format: 'ldp_vp',
          path: '$',
          path_nested: {
            format: 'ldp_vc',
            path: '$.verifiableCredential[0]',
          },
        },
        {
          id: 'InputDescriptor Id test 2',
          format: 'ldp_vp',
          path: '$',
          path_nested: {
            format: 'ldp_vc',
            path: '$.verifiableCredential[0]',
          },
        },
      ],
    };

    const presentationSubmissionValidator =
      new PresentationSubmissionFormatValidator(
        presentationSubmission,
        presentationDefinition,
      );

    const result = presentationSubmissionValidator.validate();
    expect(result.valid).toBeFalsy();
    expect(result.message).toBe(
      'presentation_submission definition_id does not match presentation_definition id',
    );
  });
  it('should not validate a presentation_submission with an invalid descriptor_map_id', () => {
    const presentationDefinition: PresentationDefinition = {
      id: 'PresentationDefinition Id test 1',
      input_descriptors: [
        {
          id: 'InputDescriptor Id test 1',
          format: {
            ldp_vc: {
              proof_type: ['Ed25519Signature2018'],
            },
          },
          constraints: {
            fields: [
              {
                path: ['$.type'],
                filter: {
                  type: 'string',
                  pattern: 'IDCardCredential',
                },
              },
            ],
          },
        },
        {
          id: 'InputDescriptor Id test 2',
          format: {
            ldp_vc: {
              proof_type: ['Ed25519Signature2018'],
            },
          },
          constraints: {
            fields: [
              {
                path: ['$.type'],
                filter: {
                  type: 'string',
                  pattern: 'IDCardCredential',
                },
              },
            ],
          },
        },
      ],
    };
    const presentationSubmission: PresentationSubmission = {
      id: 'presentation_submission_id_test_1',
      definition_id: 'PresentationDefinition Id test 1',
      descriptor_map: [
        {
          id: 'InputDescriptor Id test 1',
          format: 'ldp_vp',
          path: '$',
          path_nested: {
            format: 'ldp_vc',
            path: '$.verifiableCredential[0]',
          },
        },
        {
          id: 'INVALID',
          format: 'ldp_vp',
          path: '$',
          path_nested: {
            format: 'ldp_vc',
            path: '$.verifiableCredential[0]',
          },
        },
      ],
    };

    const presentationSubmissionValidator =
      new PresentationSubmissionFormatValidator(
        presentationSubmission,
        presentationDefinition,
      );

    const result = presentationSubmissionValidator.validate();
    expect(result.valid).toBeFalsy();
    expect(result.message).toBe(
      'presentation_submission descriptor_map id does not match presentation_definition input_descriptors ids',
    );
  });

  it('should not validate a presentation_submission with a descriptor_map length different from input_descriptor length', () => {
    const presentationDefinition: PresentationDefinition = {
      id: 'PresentationDefinition Id test 1',
      input_descriptors: [
        {
          id: 'InputDescriptor Id test 1',
          format: {
            ldp_vc: {
              proof_type: ['Ed25519Signature2018'],
            },
          },
          constraints: {
            fields: [
              {
                path: ['$.type'],
                filter: {
                  type: 'string',
                  pattern: 'IDCardCredential',
                },
              },
            ],
          },
        },
        {
          id: 'InputDescriptor Id test 2',
          format: {
            ldp_vc: {
              proof_type: ['Ed25519Signature2018'],
            },
          },
          constraints: {
            fields: [
              {
                path: ['$.type'],
                filter: {
                  type: 'string',
                  pattern: 'IDCardCredential',
                },
              },
            ],
          },
        },
      ],
    };
    const presentationSubmission: PresentationSubmission = {
      id: 'presentation_submission_id_test_1',
      definition_id: 'PresentationDefinition Id test 1',
      descriptor_map: [
        {
          id: 'InputDescriptor Id test 1',
          format: 'ldp_vp',
          path: '$',
          path_nested: {
            format: 'ldp_vc',
            path: '$.verifiableCredential[0]',
          },
        },
      ],
    };

    const presentationSubmissionValidator =
      new PresentationSubmissionFormatValidator(
        presentationSubmission,
        presentationDefinition,
      );

    const result = presentationSubmissionValidator.validate();
    expect(result.valid).toBeFalsy();
    expect(result.message).toBe(
      'presentation_submission descriptor_map length does not match presentation_definition input_descriptors length',
    );
  });
});
