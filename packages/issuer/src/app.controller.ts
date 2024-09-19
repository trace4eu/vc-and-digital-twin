import { Controller, Get, Post, Param, Body} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

import { randomUUID, randomBytes } from "crypto";
import { CredentialData } from './types/credential-data';
import { UniversityDegreeCredentialConfig, LoginCredentialConfig } from './credential-configurations';

// implements https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#section-3.5
@ApiTags("OID4VCI (pre-authorized flow)")
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // class variables that need to be set by issuer
  serverURL = "http://localhost:3000/"
  authServerURL = "todo" //TODO

  // other class variables
  offerMap = new Map();

  //helper functions
  generateNonce(length=12): string{
    return(randomBytes(length).toString("hex"))
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post("offer")
  @ApiOperation({description: "Insert in body credetnial data, e.g. : {credentialSubject: {...}, type: ...}"})
  postCredentialOffer(@Body() credentialData : CredentialData){
    const uuid = randomUUID();
    const issuer_state = randomUUID();
    const pre_authorized_code = this.generateNonce(32);
    /*
    credentialData: {
      credentialSubject: {
        .... subject data 
      },
      type: ["LoginCredential" || "UniversityDegreeCredential"]
    }
    */
    this.offerMap.set(uuid, { issuer_state, pre_authorized_code, credentialData });

    let credentialOffer = `openid-credential-offer://?credential_offer_uri=${this.serverURL}/credential-offer/${uuid}`;
    return(credentialOffer);
  }

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

  // post credential
}