import { Controller, Get, Post, Param, Body, HttpException, HttpStatus, Redirect, Query} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { randomUUID, randomBytes, createHash} from "crypto";
var jwt = require('jsonwebtoken');

// implements https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#section-3.5
@ApiTags("Authorization")
@Controller()
export class AuthController {
  constructor(private readonly appService: AppService) {}

  // class variables that need to be set by issuer
  serverURL = "http://localhost:3000/"
  authServerURL = "http://localhost:3000/"
  private publicKey = 'PUBLIC_KEY_HERE'; // Add your public key
  private privateKey = 'PRIVATE_KEY_HERE'; // Add your private key

  // other class variables
  offerMap = new Map();

  // Simulated in-memory stores for tokens and codes
  accessTokens = new Map<string, string>();
  authorizationCodes = new Map<string, any>();

  //helper functions
  generateNonce(length=12): string{
    return(randomBytes(length).toString("hex"))
  }
  
  base64UrlEncodeSha256 = async (input: string) => {
    return createHash('sha256').update(input).digest('base64url');
  };
  
  // POST /verifyAccessToken
  @Post('verifyAccessToken')
  @ApiBody({
    description: 'Verify an access token',
    schema: { properties: { token: { type: 'string' } } },
  })
  verifyAccessToken(@Body() body: { token: string }) {
    const token = body.token;

    if (!token) {
      throw new HttpException('Token is required', HttpStatus.BAD_REQUEST);
    }

    return new Promise((resolve, reject) => {
      jwt.verify(token, this.publicKey, { algorithms: ['ES256'] }, (err: any, decoded: any) => {
        if (err) {
          reject(new HttpException('Invalid token', HttpStatus.UNAUTHORIZED));
        }

        if (decoded.exp < Math.floor(Date.now() / 1000)) {
          reject(new HttpException('Token has expired', HttpStatus.UNAUTHORIZED));
        }

        const storedToken = this.accessTokens.get(decoded.sub);
        if (storedToken !== token) {
          reject(new HttpException('Invalid token', HttpStatus.UNAUTHORIZED));
        }

        resolve({ message: 'Token is valid' });
      });
    });
  }

  // GET /.well-known/openid-configuration
  @Get('.well-known/openid-configuration')
  getOpenIdConfig() {
    const config = {
      issuer: `${this.serverURL}`,
      authorization_endpoint: `${this.authServerURL}/authorize`,
      token_endpoint: `${this.authServerURL}/token`,
      jwks_uri: `${this.authServerURL}/jwks`,
      scopes_supported: ['openid'],
      response_types_supported: ['vp_token', 'id_token'],
      response_modes_supported: ['query'],
      grant_types_supported: ['authorization_code', 'pre-authorized_code'],
      subject_types_supported: ['public'],
      id_token_signing_alg_values_supported: ['ES256'],
      request_object_signing_alg_values_supported: ['ES256'],
      request_parameter_supported: true,
      request_uri_parameter_supported: true,
      token_endpoint_auth_methods_supported: ['private_key_jwt'],
      vp_formats_supported: {
        jwt_vp: {
          alg_values_supported: ['ES256'],
        },
        jwt_vc: {
          alg_values_supported: ['ES256'],
        },
      },
      subject_syntax_types_supported: [
        'did:key:jwk_jcs-pub',
        'did:ebsi:v1',
        'did:ebsi:v2',
      ],
      subject_trust_frameworks_supported: ['ebsi'],
      id_token_types_supported: [
        'subject_signed_id_token',
        'attester_signed_id_token',
      ],
    };

    return config;
  }

  // GET /authorize
  @Get('authorize')
  @Redirect()
  authorize(@Query() query: any) {
    const {
      response_type,
      scope,
      state,
      client_id,
      authorization_details,
      redirect_uri,
      nonce,
      code_challenge,
      code_challenge_method,
      issuer_state,
    } = query;

    if (!client_id) {
      throw new HttpException('Client id is missing', HttpStatus.BAD_REQUEST);
    }

    if (!redirect_uri) {
      throw new HttpException('Missing redirect URI', HttpStatus.BAD_REQUEST);
    }

    if (response_type !== 'code') {
      throw new HttpException('Unsupported response type', HttpStatus.BAD_REQUEST);
    }

    if (code_challenge_method !== 'S256') {
      throw new HttpException('Invalid code challenge method', HttpStatus.BAD_REQUEST);
    }

    this.authorizationCodes.set(client_id, {
      codeChallenge: code_challenge,
      authCode: null,
      issuer_state: issuer_state,
    });

    const payload = {
      iss: this.serverURL,
      aud: client_id,
      nonce: nonce,
      state: state,
      client_id: client_id,
      response_uri: client_id,
      response_mode: 'direct_post',
      response_type: 'id_token',
      scope: 'openid',
    };

    const header = {
      typ: 'jwt',
      alg: 'ES256',
      kid: `did:ebsi:zrZZyoQVrgwpV1QZmRUHNPz#key-2`,
    };

    const requestJar = jwt.sign(payload, this.privateKey, {
      algorithm: 'ES256',
      noTimestamp: true,
      header,
    });

    const redirectUrl = `${redirect_uri}?state=${state}&client_id=${client_id}&redirect_uri=${this.authServerURL}/direct_post&response_type=id_token&response_mode=direct_post&scope=openid&nonce=${nonce}&request=${requestJar}`;

    return { url: redirectUrl, statusCode: 302 };
  }

  // POST /direct_post
  @Post('direct_post')
  @Redirect()
  directPost(@Body() body: any) {
    const { state, id_token } = body;

    if (id_token) {
      const iss = jwt.decode(id_token).iss;
      const authorizationCode = this.generateNonce(32);

      if (this.authorizationCodes.has(iss)) {
        const currentValue = this.authorizationCodes.get(iss);
        this.authorizationCodes.set(iss, {
          ...currentValue,
          authCode: authorizationCode,
        });
      }

      const redirectUrl = `http://localhost:8080?code=${authorizationCode}&state=${state}`;
      return { url: redirectUrl, statusCode: 302 };
    } else {
      throw new HttpException('Invalid ID token', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // POST /token
  @Post('token')
  async token(@Body() body: any) {
    const { client_id, code, code_verifier, grant_type, user_pin, pre_authorized_code } = body;
    let credential_identifier;

    if (grant_type === 'urn:ietf:params:oauth:grant-type:pre-authorized_code') {
      if (user_pin !== '1234') {
        throw new HttpException('Invalid pin', HttpStatus.BAD_REQUEST);
      }
      credential_identifier = pre_authorized_code;
    } else if (grant_type === 'authorization_code') {
      const codeVerifierHash = await this.base64UrlEncodeSha256(code_verifier);
      const clientSession = this.authorizationCodes.get(client_id);

      if (!clientSession || code !== clientSession.authCode || codeVerifierHash !== clientSession.codeChallenge) {
        throw new HttpException('Client could not be verified', HttpStatus.BAD_REQUEST);
      }
      credential_identifier = clientSession.issuer_state;
    }

    const generatedAccessToken = jwt.sign(
      { client_id, credential_identifier },
      this.privateKey,
      { algorithm: 'ES256', expiresIn: '24h' },
    );
    this.accessTokens.set(client_id, generatedAccessToken);

    return {
      access_token: generatedAccessToken,
      token_type: 'bearer',
      expires_in: 86400,
      c_nonce: this.generateNonce(16),
      c_nonce_expires_in: 86400,
    };
  }
}