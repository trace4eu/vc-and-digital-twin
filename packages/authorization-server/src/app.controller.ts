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

// implements https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#section-3.5
@ApiTags("Authorization")
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // class variables that need to be set by issuer
  serverURL = "http://localhost:3000" //TODO should be loaded in from global variable
  authServerURL = "http://localhost:3001" //TODO should be loaded in from global variable

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
      const payload = decoded.payload as Record<string, any>

  
      // Check if token is expired
      if (payload.exp < Math.floor(Date.now() / 1000)) {
        throw new HttpException('Token has expired', HttpStatus.UNAUTHORIZED);
      }

      // Check if the token matches the stored token
      const storedToken = this.accessTokens.get(payload.sub);
      if (storedToken !== token) {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }

      // If the token is valid, return a success message
      return { message: 'Token is valid' };

    } catch (err) {
      // Handle invalid token or any other error
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('token')
  @ApiBody({
    description: 'Generate an access token',
    schema: { properties: { client_id: { type: 'string' }, pre_auhtorized_code: { type: 'string' }, user_pin: { type: 'string' } } },
  })
  async token(@Body() body: { client_id: string, pre_auhtorized_code: string, user_pin: string }) {
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