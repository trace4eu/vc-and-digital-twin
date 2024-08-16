interface JsonCredential {
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

interface CredentialSchema {
  id: string;
  type: string;
}
interface TermsOfUse {
  id: string;
  type: string;
}

interface Issuer {
  id: string;
  name: string;
}

interface CredentialStatus {
  type: string;
  id: string;
  statusListCredential: string;
  statusListIndex: string;
}

interface CredentialSubject {
  id?: string;
  [x: string]: any;
}

interface Proof {
  type: string;
  created: string;
  proofPurpose: string;
  verificationMethod: string;
  jws: string;
}
