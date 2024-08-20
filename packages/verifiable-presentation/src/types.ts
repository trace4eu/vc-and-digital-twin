import { JWTPayload } from 'jose';

export interface DecodedVerifiableCredential {
  jti?: string;
  sub?: string;
  iss: string;
  nbf?: number;
  exp?: number;
  iat: number;
  vc?: Vc;
}

export interface Issuer {
  id: string;
  name: string;
}
export interface Vc {
  '@context': string[];
  id: string;
  type: string[];
  issuer: string | Issuer;
  issuanceDate?: string;
  validFrom?: string;
  validUntil?: string;
  issued?: string;
  credentialSubject: CredentialSubject;
  credentialSchema?: CredentialSchema;
  credentialStatus?: CredentialStatus;
  expirationDate?: string;
}

export interface CredentialStatus {
  id: string;
  type: string;
  statusPurpose?: string;
  statusListIndex: string;
  statusListCredential: string;
}

export interface CredentialSchema {
  id: string;
  type: string;
}

export interface JsonCredential {
  '@context': string[];
  id: string;
  type: string[];
  issuer: string | Issuer;
  validUntil?: string;
  validFrom?: string;
  expirationDate?: string;
  credentialStatus?: CredentialStatus;
  issuanceDate?: string;
  issued?: string;
  credentialSubject: CredentialSubject;
  credentialSchema?: CredentialSchema;
  termsOfUse?: TermsOfUse;
  proof: Proof;
}

export interface CredentialSchema {
  id: string;
  type: string;
}
export interface TermsOfUse {
  id: string;
  type: string;
}

export interface Issuer {
  id: string;
  name: string;
}

export interface CredentialStatus {
  type: string;
  id: string;
  statusListCredential: string;
  statusListIndex: string;
}

export interface CredentialSubject {
  id?: string;
  [x: string]: any;
}

export interface Proof {
  type: string;
  created: string;
  proofPurpose: string;
  verificationMethod: string;
  jws: string;
}

export type JwtCredential = string;

export interface JsonPresentation {
  '@context': string[];
  type: string | string[];
  verifiableCredential: (JwtCredential | JsonCredential)[];
  proof: Proof;
}

export interface Proof {
  type: string;
  proofPurpose: string;
  verificationMethod: string;
  created: string;
  jws: string;
}

export interface PresentationDefinition {
  id: string;
  input_descriptors: InputDescriptor[];
}

export interface InputDescriptor {
  id: string;
  format?: object;
  constraints: {
    fields?: {
      path: string[];
      filter: object;
    }[];
  };
}

export interface PresentationSubmission {
  id: string;
  definition_id: string;
  descriptor_map: SubmissionEntry[];
}

export interface SubmissionEntry {
  id?: string;
  format: string;
  path: string;
  path_nested?: SubmissionEntry;
}

export interface CredentialValidationOptions {
  didRegistry?: string;
  ebsiAuthority?: string;
}

export interface PresentationValidationOptions {
  presentationSubmission?: PresentationSubmission;
  presentationDefinition?: PresentationDefinition;
  didRegistry?: string;
  ebsiAuthority?: string;
}

export interface ValidationResult {
  valid: boolean;
  messages?: string[];
  vpData?: VPTokenData;
}

export interface VerifiablePresentation extends JWTPayload {
  vp?: {
    id: string;
    '@context': string[];
    type: string[];
    holder: string;
    verifiableCredential: string[] | JsonCredential[];
  };
}

export interface ExtractorResult {
  valid: boolean;
  message?: string;
  verifiableCredential?: CredentialFormatTuple;
  verifiableCredentialDecoded?: any;
}
export interface PresentationResult {
  valid: boolean;
  message?: string;
}

export enum CredentialFormat {
  JWT = 'jwt',
  JSON = 'json',
}

export interface CredentialFormatTuple {
  format: CredentialFormat;
  verifiableCredential: string | object;
}

export interface VPTokenData {
  vpTokenIssuer?: string;
  verifiableCredentials?: CredentialFormatTuple[];
  verifiableCredentialsDecoded?: any[];
  descriptorMapIds?: string[];
  decodedVerifiablePresentation?: VerifiablePresentation;
  vpToken?: object | object[] | string | string[];
}

export interface ExtractionResult {
  result: PresentationResult;
  vpTokenData?: VPTokenData;
}
