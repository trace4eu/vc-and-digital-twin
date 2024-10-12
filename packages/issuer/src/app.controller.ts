import * as SignatureWrapperTypes from '@trace4eu/signature-wrapper';
import { WalletFactory } from '@trace4eu/signature-wrapper';
import { Controller, Get, Post, Param, Body, Headers, UseGuards} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags, ApiBearerAuth} from '@nestjs/swagger';
import { AppService } from './app.service';

// middleware for authentication before
import { AuthGuard } from './auth.guard'; // Auth guard for token authentication

import { randomUUID, randomBytes } from "crypto";
import fs from "fs";

import { CredentialData } from './swagger-api-schemas/issuer-schemas';
import { UniversityDegreeCredentialConfig, LoginCredentialConfig } from './credential-configurations';


var jwt = require('jsonwebtoken');

const did = 'did:ebsi:zobuuYAHkAbRFCcqdcJfTgR'; //did of issuer (also listed in EBSI TIR: https://api-pilot.ebsi.eu/trusted-issuers-registry/v5/issuers/did:ebsi:zobuuYAHkAbRFCcqdcJfTgR)
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

const wallet = WalletFactory.createInstance(false, did, entityKey);

// implements https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#section-3.5
@ApiTags("OID4VCI (pre-authorized flow)")
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // class variables that need to be set by issuer
  serverURL = "http://localhost:3000/issuer"
  authServerURL = "http://localhost:3000/auth"
  privateKey = entityKey[1].privateKeyHex //fs.readFileSync("./certs/private.pem", "utf8");

  // other class variables
  offerMap = new Map();

  //helper functions
  generateNonce(length=12): string{
    return(randomBytes(length).toString("hex"))
  }

  // creater credential offer
  // called by holder
  @Post("offer")
  @ApiOperation({description: "Insert in body credetnial data, e.g. : {credentialSubject: {...}, type: ...}"})
  postCredentialOffer(@Body() credentialData : CredentialData){
    const uuid = randomUUID();
    const issuer_state = randomUUID();
    const pre_authorized_code = this.generateNonce(32);

    this.offerMap.set(uuid, { issuer_state, pre_authorized_code, credentialData });

    let credentialOffer = `openid-credential-offer://?credential_offer_uri=${this.serverURL}/credential-offer/${uuid}`;
    return(credentialOffer);
  }

  // get credential offer
  // called by issuer
  @Get("credential-offer/:id")
  getCredentialOffer(@Param("id") id : string): any {

    const entry = this.offerMap.get(id);
    let iss_state;
    let pre_auth_code;
    let credentialData;

    if (entry) {
      ({
        issuer_state: iss_state,
        pre_authorized_code: pre_auth_code,
        credentialData,
      } = entry);

      console.log(credentialData);

      if (iss_state) {
        this.offerMap.set(iss_state, credentialData);
      }

      if (pre_auth_code) {
        this.offerMap.set(pre_auth_code, credentialData);
      }
    }

    console.log(iss_state, pre_auth_code);

    const response = {
      credential_issuer: `${this.serverURL}`,
      credentials: credentialData
        ? credentialData.type
        : ["UniversityDegreeCredential"],
      grants: {
        authorization_code: {
          issuer_state: iss_state ?? randomUUID(),
        },
        "urn:ietf:params:oauth:grant-type:pre-authorized_code": {
          "pre-authorized_code": pre_auth_code ?? randomUUID(),
          user_pin_required: true,
        },
      },
    };

    return(response);
  }

  // post credential
  // called by holder
  @Post('credential')
  @UseGuards(AuthGuard)
  @ApiBearerAuth() //auth token contains the credenital_identifier = uiid to find vc offer in mapping
  @ApiBody({
    description: 'Generate a signed credential. Use `https://jwt.io/` to create proof object with jwt containing did of holder (= jwt.payload.iss).',
    schema: {
      properties: {
        proof: {
          type: 'object',
          properties: {
            jwt: { type: 'string' }, //jwt contains did of subject that will hold to be issued VC (found by jwt.payload.iss)
          },
        },
      },
    },
  })
  async credential(
    @Headers('authorization') authHeader: string,
    @Body() requestBody: any,
  ) {
    console.log(authHeader)
    const token = authHeader.split(' ')[1];

    const result = await wallet.verifyJwt(token, 'ES256');
    const uuid = result.payload //TODO: discuss with pablo to make JWTVerifyResult type more usable:https://github.com/trace4eu/ebsi-services-wrapper/blob/main/signature-wrapper/src/types/types.ts
    const decodedHeaderSubjectDID = result.protectedHeader.kid;
    
    console.log("uiid", uuid)

    /*
    const { credential_identifier } = jwt.decode(token) as any;

    let decodedWithHeader;
    let decodedHeaderSubjectDID;
    if (requestBody.proof && requestBody.proof.jwt) {
      decodedWithHeader = jwt.decode(requestBody.proof.jwt, { complete: true });
      decodedHeaderSubjectDID = decodedWithHeader.payload.iss;
    }

    const credentialData = this.offerMap.get(credential_identifier);*/
    console.log("access mapping")
    const credentialData = this.offerMap.get(uuid);

    let credentialSubject = credentialData
      ? {
          id: decodedHeaderSubjectDID,
          ...credentialData.credentialSubject,
          issuance_date: new Date(Math.floor(Date.now() / 1000) * 1000).toISOString(),
        }
      : {
          id: decodedHeaderSubjectDID,
          family_name: 'Doe',
          given_name: 'John',
          birth_date: '1990-01-01',
          degree: 'Bachelor of Computer Science',
          gpa: '1.2',
          age_over_18: true,
          issuance_date: new Date(Math.floor(Date.now() / 1000) * 1000).toISOString(),
        };

    const payload = {
      iss: this.serverURL,
      sub: decodedHeaderSubjectDID || '',
      iat: Math.floor(Date.now() / 1000),
      vc: {
        credentialSubject: credentialSubject,
        expirationDate: new Date((Math.floor(Date.now() / 1000) + 60 * 60) * 1000).toISOString(),
        id: decodedHeaderSubjectDID,
        issuanceDate: new Date(Math.floor(Date.now() / 1000) * 1000).toISOString(),
        issued: new Date(Math.floor(Date.now() / 1000) * 1000).toISOString(),
        issuer: 'did:ebsi:zobuuYAHkAbRFCcqdcJfTgR', //TODO: load in as global variable
        type: credentialData.type,
        '@context': [
          'https://www.w3.org/2018/credentials/v1',
          'https://europa.eu/2018/credentials/eudi/pid/v1',
        ],
        validFrom: new Date(Math.floor(Date.now() / 1000) * 1000).toISOString(),
      },
    };

    const credentialJwt = await wallet.signJwt(
      Buffer.from(JSON.stringify(payload)),
      { alg: SignatureWrapperTypes.Algorithm.ES256 },
      {
        typ: 'JWT', //TODO: should be typ: 'jwt' at least it is like this in tub code?????
        alg: 'ES256',
        kid: 'did:ebsi:zobuuYAHkAbRFCcqdcJfTgR#key-1',
      },
    );
    /*
    const signOptions = {
      algorithm: 'ES256',
    };

    const additionalHeaders = {
      kid: 'did:ebsi:zobuuYAHkAbRFCcqdcJfTgR#key-1',
      typ: 'jwt',
    };

    const idtoken = jwt.sign(payload, this.privateKey, { //TODO: rename to vc or smth
      ...signOptions,
      header: additionalHeaders,
    });*/

    return {
      format: 'jwt_vc',
      credential: credentialJwt,
      c_nonce: this.generateNonce(),
      c_nonce_expires_in: 86400,
    };
  }

  @Get(".well-known/openid-credential-issuer")
  getCredentialIssuerMetadata(){
    const metadata = {
      credential_issuer: `${this.serverURL}`,
      authorization_server: `${this.authServerURL}`,
      credential_endpoint: `${this.serverURL}/credential`,
      credential_response_encryption: {
        alg_values_supported: ["ECDH-ES"],
        enc_values_supported: ["A128GCM"],
        encryption_required: false,
      },
      display: [
        {
          name: "Issuer Name", //TODO set by issuer depends on use case
          locale: "en-US",
          logo: {
            url: "https://8cb0-149-233-55-5.ngrok-free.app/_next/image?url=%2Ftrust-cv-logo.png&w=256&q=75",
            //url: "https://logowik.com/content/uploads/images/technischen-universitat-berlin1469.jpg",
          },
        },
      ],
      credential_configurations_supported: {
        UniversityDegreeCredentialConfig, //TODO set by issuer depends on use case
        LoginCredentialConfig //TODO set by issuer depends on use case
      },
    };
    return(metadata);
  }
}