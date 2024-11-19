// adapt the vc configs to use case
export const credentialSupported = [
  {
    format: 'jwt_vc_json',
    types: [
      'VerifiableCredential',
      'VerifiableAttestation',
      'UniversityDegree',
    ],
    display: [
      {
        name: 'University Credential',
        locale: 'en-US',
        logo: {
          url: 'https://logowik.com/content/uploads/images/technischen-universitat-berlin1469.jpg',
        },
        background_color: '#12107c',
        text_color: '#FFFFFF',
      },
    ],
  },
  {
    format: 'jwt_vc',
    types: ['VerifiableCredential', 'VerifiableAttestation', 'Login'],
    display: [
      {
        name: 'Login Credential',
        locale: 'en-US',
        logo: {
          url: 'https://logowik.com/content/uploads/images/technischen-universitat-berlin1469.jpg',
        },
        background_color: '#12107c',
        text_color: '#FFFFFF',
      },
    ],
  },
];

export const credentialSchemas = [
  {
    type: 'Login',
    schema:
      'https://api-pilot.ebsi.eu/trusted-schemas-registry/v3/schemas/zDpWGUBenmqXzurskry9Nsk6vq2R8thh9VSeoRqguoyMD',
  },
  {
    type: 'UniversityDegree',
    schema:
      'https://api-pilot.ebsi.eu/trusted-schemas-registry/v3/schemas/zDpWGUBenmqXzurskry9Nsk6vq2R8thh9VSeoRqguoyMD',
  },
  {
    type: 'default',
    schema:
      'https://api-pilot.ebsi.eu/trusted-schemas-registry/v3/schemas/zDpWGUBenmqXzurskry9Nsk6vq2R8thh9VSeoRqguoyMD',
  },
];
