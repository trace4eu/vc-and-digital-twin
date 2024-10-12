import * as SignatureWrapperTypes from '@trace4eu/signature-wrapper';
import { Controller, Get, Post, Param, Body, HttpException, HttpStatus, Redirect, Query} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { randomUUID, randomBytes, createHash} from "crypto";
import { PostDirectPostBody, PostTokenBody } from './swagger-api-schemas/auth-schemas';
var jwt = require('jsonwebtoken');

const did = 'did:ebsi:zobuuYAHkAbRFCcqdcJfTgR'; //did of issuer
const entityKey = [
  {
    alg: SignatureWrapperTypes.Algorithm.ES256K,
    privateKeyHex:
      'c4877a6d51c382b25a57684b5ac0a70398ab77b0eda0fcece0ca14ed00737e57',
  },
  {
    alg: SignatureWrapperTypes.Algorithm.ES256,
    privateKeyHex:
      'fa50bbba9feade27ea61dd9973abfd7c04e72366b607558cd0b423b75d067a86',
  },
];

const wallet = SignatureWrapperTypes.WalletFactory.createInstance(false, did, entityKey);

const generateAccessToken = async (sub: string, credential_identifier: string, serverUrl: string): Promise<string | undefined> => {
  try{
    // Define payload type
    const payload: {
      iss: string;
      sub: string;
      aud: string;
      exp: number;
      iat: number;
      scope: string;
      credential_identifier: string;
    } = {
      iss: serverUrl, //TODO should be loaded in from global variable
      sub: sub, // Subject is the client_id
      aud: serverUrl,
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // Expires in 1 hour
      iat: Math.floor(Date.now() / 1000),
      scope: "openid",
      credential_identifier: credential_identifier,
    };

    // Sign the JWT
    const token: string = await wallet.signJwt(
      Buffer.from(JSON.stringify(payload)),
      { alg: SignatureWrapperTypes.Algorithm.ES256 },
      {
        typ: 'JWT',
        alg: 'ES256',
      }
    );
    
    return token;
  }catch(e){
    console.log(e);
    return undefined
  }
}

const buildIdToken = async (aud: string, serverUrl: string): Promise<string | undefined> => {
  try{
    // Define payload type
    const payload: {
      iss: string;
      sub: string;
      aud: string;
      exp: number;
      iat: number;
      auth_time: number;
      nonce: string;
    } = {
      iss: serverUrl, //TODO should be loaded in from global variable
      sub: "user123", 
      aud: aud, 
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // Expires in 1 hour
      iat: Math.floor(Date.now() / 1000), // Issued at current time
      auth_time: Math.floor(Date.now() / 1000) - 60 * 5, // Authentication time 5 minutes ago
      nonce: "nonceValue",
    };

    // Sign the JWT token
    const idToken: string = await wallet.signJwt(
      Buffer.from(JSON.stringify(payload)),
      { alg: SignatureWrapperTypes.Algorithm.ES256 },
      {
        typ: 'JWT',
        alg: 'ES256',
      }
    );
    return idToken;
  }catch(e){
    console.log(e);
    return undefined
  }
}


// implements https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#section-3.5
@ApiTags("Authorization")
@Controller("auth")
export class AppController {
  constructor(private readonly appService: AppService) {}

  // class variables that need to be set by issuer
  serverURL = "http://localhost:3000/issuer" //TODO should be loaded in from global variable
  authServerURL = "http://localhost:3000/auth" //TODO should be loaded in from global variable


  //issuer identity
  //private publicKey = 'PUBLIC_KEY_HERE'; // TODO how to get?
  private privateKey = entityKey[1].privateKeyHex; 

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

  // GET /authorize
  @Get('authorize') //TODO what is the prupose of this endpoint
  @ApiQuery({ name: 'response_type', required: true, description: 'The response type: should be: ``code``' })
  @ApiQuery({ name: 'scope', required: true, description: 'OAuth2 scopes requested' })
  @ApiQuery({ name: 'state', required: true, description: 'State parameter to maintain state' })
  @ApiQuery({ name: 'client_id', required: true, description: 'Client identifier' })
  @ApiQuery({ name: 'authorization_details', required: false, description: 'Authorization details (optional)' })
  @ApiQuery({ name: 'redirect_uri', required: true, description: 'Redirection URI: should be `http://localhost:3000/auth/authorize`' })
  @ApiQuery({ name: 'nonce', required: false, description: 'Cryptographic nonce (optional)' })
  @ApiQuery({ name: 'code_challenge', required: false, description: 'PKCE code challenge (optional)' })
  @ApiQuery({ name: 'code_challenge_method', required: false, description: 'PKCE code challenge method (optional)`: should be: ``S256``' })
  @ApiQuery({ name: 'issuer_state', required: false, description: 'Issuer state (optional)' })
  @Redirect()
  async authorize(@Query() query: any) {
    try{
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
      console.log("responsetype=",response_type)
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
  
      /*const header = {
        typ: 'jwt',
        alg: 'ES256',
        kid: `${did}#key-2`,
      };
  
      const requestJar = jwt.sign(payload, this.privateKey, {
        algorithm: 'ES256',
        noTimestamp: true,
        header,
      });*/
  
      const requestJar = await wallet.signJwt(
        Buffer.from(JSON.stringify(payload)),
        { alg: SignatureWrapperTypes.Algorithm.ES256 },
        {
          typ: 'JWT',
          alg: 'ES256',
        }
      );
      const redirectUri = this.authServerURL+"/direct_post"
      const redirectUrl = `${redirect_uri}?state=${state}&client_id=${client_id}&redirect_uri=${redirectUri}&response_type=id_token&response_mode=direct_post&scope=openid&nonce=${nonce}&request=${requestJar}`;
  
      return { url: redirectUrl, statusCode: 302 };
    }catch(e){
      console.log("here", e);
    }
  }

  // POST /direct_post
  @Post('direct_post')
  @Redirect()
  directPost(@Body() body: PostDirectPostBody) {
    const { state, id_token } = body;

    console.log("executed")

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
  async token(@Body() body: PostTokenBody) {
    try{
      const { client_id, code, code_verifier, grant_type, user_pin, pre_authorized_code } = body;
      let credential_identifier;

      if (grant_type === 'urn:ietf:params:oauth:grant-type:pre-authorized_code') {
        if (user_pin !== '1234') {
          throw new HttpException('Invalid pin', HttpStatus.BAD_REQUEST);
        }
        credential_identifier = pre_authorized_code;
      } else if (grant_type === 'authorization_code' && code_verifier !== undefined) {
        const codeVerifierHash = await this.base64UrlEncodeSha256(code_verifier);
        const clientSession = this.authorizationCodes.get(client_id);

        if (!clientSession || code !== clientSession.authCode || codeVerifierHash !== clientSession.codeChallenge) {
          throw new HttpException('Client could not be verified', HttpStatus.BAD_REQUEST);
        }
        credential_identifier = clientSession.issuer_state;
      }

      const generatedAccessToken = await generateAccessToken(client_id, credential_identifier, this.serverURL);
      
      if(generatedAccessToken === undefined){
        throw new HttpException('Error generating access token', HttpStatus.INTERNAL_SERVER_ERROR);
      }else{
        this.accessTokens.set(client_id, generatedAccessToken);
        return {
          access_token: generatedAccessToken,
          token_type: 'bearer',
          expires_in: 86400,
          c_nonce: this.generateNonce(16),
          c_nonce_expires_in: 86400,
        };
      }
    }catch(e){
      console.log(e);
    }
  }
  
  // POST /verifyAccessToken --> endpoint used by issuer to verify access token prior to VC issuance
  @Post('verifyAccessToken')
  @ApiBody({
    description: 'Verify an access token',
    schema: { properties: { token: { type: 'string' } } },
  })
  async verifyAccessToken(@Body() body: { token: string }): Promise<{ message: string }> {
    const token = body.token;

    if (!token) {
      throw new HttpException('Token is required', HttpStatus.BAD_REQUEST);
    }

    try {
      // Verify the JWT using wallet.verifyJwt
      const decoded = await wallet.verifyJwt(token, 'ES256'); 

      console.log(decoded)
      /*
      // Check if token is expired
      if (decoded.payload.exp < Math.floor(Date.now() / 1000)) {
        throw new HttpException('Token has expired', HttpStatus.UNAUTHORIZED);
      }

      // Check if the token matches the stored token
      const storedToken = this.accessTokens.get(decoded.payload.sub);
      if (storedToken !== token) {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }*/

      // If the token is valid, return a success message
      return { message: 'Token is valid' };

    } catch (err) {
      // Handle invalid token or any other error
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }
  /*// POST /verifyAccessToken --> endpoint used by issuer to verify access token prio vc issuance
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
  }*/

  // GET /.well-known/openid-configuration --> enpoint used by wallet to get info about authorization to issuer service
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

  @Post('temp-verifyAccessToken')
  @ApiBody({
    description: 'Verify an access token',
    schema: { properties: { token: { type: 'string' } } },
  })
  async tempVerifyAccessToken(@Body() body: { token: string }): Promise<{ message: string }> {
    const token = body.token;

    if (!token) {
      throw new HttpException('Token is required', HttpStatus.BAD_REQUEST);
    }

    try {
      // Verify the JWT using wallet.verifyJwt
      const decoded = await wallet.verifyJwt(token, 'ES256'); 

      console.log(decoded)

      // If the token is valid, return a success message
      return { message: 'Token is valid' };

    } catch (err) {
      // Handle invalid token or any other error
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('temp-token')
  @ApiBody({
    description: 'Generate an access token',
    schema: { properties: { client_id: { type: 'string' }, pre_auhtorized_code: { type: 'string' }, user_pin: { type: 'string' } } },
  })
  async tempToken(@Body() body: { client_id: string, pre_auhtorized_code: string, user_pin: string }) {
    try{
      const { client_id, pre_auhtorized_code, user_pin } = body;
      if (user_pin !== '1234') {
        throw new HttpException('Invalid pin', HttpStatus.BAD_REQUEST);
      }

      //note: credential_identifier is the pre_authorized_code
      const generatedAccessToken = await generateAccessToken(client_id, pre_auhtorized_code, this.serverURL);
      
      if(generatedAccessToken === undefined){
        throw new HttpException('Error generating access token', HttpStatus.INTERNAL_SERVER_ERROR);
      }else{
        this.accessTokens.set(client_id, generatedAccessToken);
        return {
          access_token: generatedAccessToken,
          token_type: 'bearer',
          expires_in: 86400,
          c_nonce: this.generateNonce(16),
          c_nonce_expires_in: 86400,
        };
      }
    }catch(e){
      console.log(e);
    }
  }
}