interface DecodedVerifiableCredential {
  jti?: string;
  sub?: string;
  iss: string;
  nbf?: number;
  exp?: number;
  iat: number;
  vc?: Vc;
}

interface Issuer {
  id: string;
  name: string;
}
interface Vc {
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

interface CredentialStatus {
  id: string;
  type: string;
  statusPurpose?: string;
  statusListIndex: string;
  statusListCredential: string;
}

interface CredentialSchema {
  id: string;
  type: string;
}

interface CredentialSubject {
  id: string;
}
