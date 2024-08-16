type JwtCredential = string;

interface JsonPresentation {
  '@context': string[];
  type: string | string[];
  verifiableCredential: (JwtCredential | JsonCredential)[];
  proof: Proof;
}

interface Proof {
  type: string;
  proofPurpose: string;
  verificationMethod: string;
  created: string;
  jws: string;
}
