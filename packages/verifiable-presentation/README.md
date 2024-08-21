# verifiable-presentation library

It is a library designed to provide validation functionality for JSON Web Tokens (JWTs) verifiable presentations. 
It exposes a method to validate verifiable presentations. 
This library supports `did:ebsi` method and it makes use of the EBSI library https://www.npmjs.com/package/@cef-ebsi/verifiable-presentation

## Features
- Designed for validating DID:key presentations containing EBSI issued credentials.
- Validate presentation submission and presentation definition.
- Extract the vp_token data.


## Installation

You can install `@trace4eu/verifiable-presentation` via npm:

```bash
npm install @trace4eu/verifiable-presentation
```

## Usage

### Importing the library

```typescript
import {
  validateJwtVP,
} from '@trace4eu/verifiable-presentation';
```

### Validating JSON Web Token (JWT) Verifiable Presentations (VPs)

```typescript
const validationResult = await validateJwtVP(jwtPresentation, audience, options);
```

### Optional option parameters

```typescript
interface PresentationValidationOptions {
  presentationSubmission?: PresentationSubmission;
  presentationDefinition?: PresentationDefinition;
  didRegistry?: string;
  ebsiAuthority?: string;
}
```

## Validation Response
The response object will follow the interface:

```typescript
interface ValidationResult {
  valid: boolean;
  messages?: string[];
  vpData?: VPTokenData;
}
```
- If the valid property is false, the messages array will include reasons why the credential is not valid.
- vpData contains the decoded Verifiable Presentation with the following data:
```
{
    "decodedVerifiablePresentation": {
        ...
    },
    "descriptorMapIds": [
        "urn:did:123456"
    ],
    "verifiableCredentials": [
        {
            "format": "jwt",
            "verifiableCredential": "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpX..."
        }
    ],
    "verifiableCredentialsDecoded": [
        {
            ...
        }
    ],
    "vpToken": "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImRpZ...",
    "vpTokenIssuer": "did:key:z2dmzD81cgPx..."
}
```
