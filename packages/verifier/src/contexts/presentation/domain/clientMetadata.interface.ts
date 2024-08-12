import { JWK } from 'jose';

export interface ClientMetadata {
  authorization_endpoint?: string;
  response_types_supported?: string[];
  vp_formats_supported?: VpFormatsSupported;
  scopes_supported?: string[];
  subject_types_supported?: string[];
  id_token_signing_alg_values_supported?: string[];
  request_object_signing_alg_values_supported?: string[];
  subject_syntax_types_supported?: string[];
  id_token_types_supported?: string[];
  jwks?: Keys;
}

export interface Keys {
  keys: JWK[];
}

export interface VpFormatsSupported {
  jwt_vp: JwtVp;
  jwt_vc: JwtVc;
}

export interface JwtVp {
  alg_values_supported: string[];
}

export interface JwtVc {
  alg_values_supported: string[];
}
