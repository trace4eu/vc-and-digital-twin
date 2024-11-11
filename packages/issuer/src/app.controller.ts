import * as SignatureWrapperTypes from '@trace4eu/signature-wrapper';
import { WalletFactory } from '@trace4eu/signature-wrapper';
import * as qrcode from 'qrcode';
import { Controller, Get, Post, Param, Body, Headers, UseGuards} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags, ApiBearerAuth, ApiResponse} from '@nestjs/swagger';
import { AppService } from './app.service';

// middleware for authentication before
import { AuthGuard } from './auth.guard'; // Auth guard for token authentication

import { randomUUID, randomBytes } from "crypto";
import fs from "fs";

import { CredentialData, CredentialOfferResponse, CredentialIssuanceResponse, CredentialOfferInformationResponse } from './swagger-api-schemas/issuer-schemas';
import { UniversityDegreeCredentialConfig, LoginCredentialConfig } from './credential-configurations';



const buildB64QrCode = async function (content: string): Promise<string> {
  return qrcode.toDataURL(content);
};
var jwt = require('jsonwebtoken');

//did of issuer (also listed in EBSI TIR: https://api-pilot.ebsi.eu/trusted-issuers-registry/v5/issuers/did:ebsi:zobuuYAHkAbRFCcqdcJfTgR)
const did = 'did:ebsi:zobuuYAHkAbRFCcqdcJfTgR'; //TODO: load in as global variable
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
  serverURL = "http://localhost:3000"
  authServerURL = "http://localhost:3001"

  // other class variables
  offerMap = new Map(); // TODO: change to redis done by pablo

  //helper functions
  generateNonce(length=12): string{
    return(randomBytes(length).toString("hex"))
  }

  // creater credential offer
  // called by holder
  @Post("offer")
  @ApiOperation({description: "Insert in body credetnial data, e.g. : {credentialSubject: {...}, type: ...}"})
  @ApiResponse({ status: 201, description: 'Credential offer creation successfull', type: CredentialOfferResponse})
  async postCredentialOffer(@Body() credentialData : CredentialData){

    // create credential offer
    const {uuid, pre_authorized_code} = this.appService.createCredentialOffer();

    // store credential offer in map
    this.offerMap.set(uuid, {pre_authorized_code, credentialData});

    // format credential offer
    const rawCredentialOffer = `openid-credential-offer://?credential_offer_uri=${this.serverURL}/credential-offer/${uuid}`;
    const qrBase64 = await buildB64QrCode(rawCredentialOffer);
    
    //return credential offer
    const response : CredentialOfferResponse = {
      rawCredentialOffer: rawCredentialOffer,
      qrBase64: qrBase64
    }
    return response;
  }

  // get credential offer
  // called by issuer
  @Get("credential-offer/:id")
  @ApiResponse({ status: 201, description: 'Credential offer information retrieval successfull', type: CredentialOfferInformationResponse})
  getCredentialOffer(@Param("id") id : string): any {

    // get credential offer from map
    const entry = this.offerMap.get(id);
    let pre_auth_code;
    let credentialData;

    // check if offer exists and create new offer entry based on chosen flow: authorization or pre-authorization
    if (entry) {
      ({
        pre_authorized_code: pre_auth_code,
        credentialData,
      } = entry);

      if (pre_auth_code) { // for pre-authorized code flow
        this.offerMap.set(pre_auth_code, credentialData);
      }
    }

    // return credential offer information
    const response : CredentialOfferInformationResponse = {
      credential_issuer: `${this.serverURL}`,
      credentials: credentialData
        ? credentialData.type
        : ["UniversityDegreeCredential"], //TODO: this needs to be adapted by use case
      grants: {
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
  @ApiResponse({ status: 201, description: 'Credential issuance successfull', type: CredentialIssuanceResponse})
  async credential(
    @Headers('authorization') authHeader: string,
    @Body() requestBody: any, //TODO: define requestBody type
  ) {
    const token = authHeader.split(' ')[1];

    const result = await wallet.verifyJwt(token, 'ES256');
    const load = result.payload as Record<string, any>; //TODO: discuss with pablo to make JWTVerifyResult type more usable:https://github.com/trace4eu/ebsi-services-wrapper/blob/main/signature-wrapper/src/types/types.ts
    const credential_identifier = load.credential_identifier 
    const decodedHeaderSubjectDID = requestBody.proof.jwt ? jwt.decode(requestBody.proof.jwt).iss : null; //TODO: check if jwt is valid and has iss field

    const credentialData = this.offerMap.get(credential_identifier); //TODO: should be found by issuer_state or pre_authorization_code depending on authorization or pre-authorization code flow???

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
        issuer: did,
        type: credentialData.type,
        '@context': [
          'https://www.w3.org/2018/credentials/v1',
          'https://europa.eu/2018/credentials/eudi/pid/v1',
        ],
        validFrom: new Date(Math.floor(Date.now() / 1000) * 1000).toISOString(),
      },
    };

    const credentialJwt = await wallet.signJwt( //TODO check if necessarey to change this code so that one uses the signature wrapper function: https://github.com/trace4eu/ebsi-services-wrapper/blob/main/signature-wrapper/README.md#signvc
      Buffer.from(JSON.stringify(payload)),
      { alg: SignatureWrapperTypes.Algorithm.ES256 },
      {
        typ: 'JWT',
        alg: 'ES256',
        kid: `${did}#key-1`,
      },
    );

    const response : CredentialIssuanceResponse = {
      format: 'jwt_vc',
      credential: credentialJwt,
      c_nonce: this.generateNonce(),
      c_nonce_expires_in: 86400,
    }
    return response;
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
            url: "https://logowik.com/content/uploads/images/technischen-universitat-berlin1469.jpg"
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