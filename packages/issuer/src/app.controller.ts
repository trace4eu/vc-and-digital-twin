import * as qrcode from 'qrcode';
import { decode, JwtPayload } from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

// middleware for authentication before
import { AuthGuard } from './auth.guard'; // Auth guard for token authentication
import { randomBytes, randomUUID } from 'crypto';

import {
  CredentialIssuanceResponse,
  CredentialIssuerMetadataResponse,
  CredentialOffer,
  CredentialOfferInformationResponse,
  CredentialOfferRequest,
  CredentialOfferResponse,
  CredentialRequest,
} from './swagger-api-schemas/issuer-schemas';
import {
  credentialSchemas,
  credentialSupported,
} from './credential-configurations';
import {
  joseWrapper,
  JWK,
} from '@trace4eu/signature-wrapper/dist/wrappers/joseWrapper';
import { ConfigService } from '@nestjs/config';
import { ApiConfig } from '../config/configuration';
import { getPrivateKeyJwkES256 } from '@trace4eu/signature-wrapper/dist/utils/keys';

const buildB64QrCode = async function (content: string): Promise<string> {
  return qrcode.toDataURL(content);
};
const ALGORITHM = 'ES256';
@ApiTags('OID4VCI (pre-authorized flow)')
@Controller()
export class AppController {
  private offerMap: Map<string, CredentialOffer> = new Map();
  private preAuthCodeMap: Map<string, string> = new Map();
  private readonly serverURL: string;
  private readonly authServerURL: string;
  private readonly privateKey: JWK;
  private readonly publicKey: JWK;
  private readonly issuerDid: string;
  private readonly issuerName: string;

  constructor(
    private configService: ConfigService<ApiConfig, true>,
    private readonly appService: AppService,
  ) {
    this.serverURL = this.configService.get<string>('serverUrl');
    this.authServerURL = this.configService.get<string>('authServerUrl');
    this.privateKey = getPrivateKeyJwkES256(
      this.configService.get<string>('privateKey'),
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { d, ...publicJwk } = this.privateKey;
    this.publicKey = publicJwk;
    this.issuerDid = this.configService.get<string>('issuerDid');
    this.issuerName = this.configService.get<string>('issuerName');
  }
  generateNonce(length = 12): string {
    return randomBytes(length).toString('hex');
  }

  @Post('offer')
  @ApiBody({ type: CredentialOfferRequest })
  @ApiResponse({
    status: 201,
    description: 'Credential offer creation successfull',
    type: CredentialOfferResponse,
  })
  async postCredentialOffer(@Body() credentialData: CredentialOfferRequest) {
    const credential = credentialSupported.find((credentialSupported) =>
      credentialSupported.types.includes(credentialData.type),
    );
    if (!credential)
      throw new HttpException(
        'Credential not supported',
        HttpStatus.BAD_REQUEST,
      );
    const { credentialOfferId, preAuthCode } =
      this.appService.createCredentialOffer();

    this.offerMap.set(credentialOfferId, {
      pre_auth_code: preAuthCode,
      types: credential.types,
      ...credentialData,
    });
    this.preAuthCodeMap.set(preAuthCode, credentialOfferId);

    await fetch(`${this.authServerURL}/createAuthSession`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        preAuthCode: preAuthCode,
        userPinHash: credentialData.user_pin
          ? bcrypt.hashSync(credentialData.user_pin.toString(), 10)
          : undefined,
        isPinRequired: !!credentialData.user_pin,
      }),
    });

    const rawCredentialOffer = `openid-credential-offer://?credential_offer_uri=${this.serverURL}/credential-offer/${credentialOfferId}`;
    const qrBase64 = await buildB64QrCode(rawCredentialOffer);

    const response: CredentialOfferResponse = {
      rawCredentialOffer: rawCredentialOffer,
      qrBase64: qrBase64,
    };
    return response;
  }

  @Get('credential-offer/:id')
  @ApiResponse({
    status: 201,
    description: 'Credential offer information retrieval successfully',
    type: CredentialOfferInformationResponse,
  })
  getCredentialOffer(@Param('id') id: string): any {
    const credentialOffer = this.offerMap.get(id) as CredentialOffer;
    const credential = credentialSupported.find((credentialSupported) =>
      credentialSupported.types.includes(
        credentialOffer.types[credentialOffer.types.length - 1],
      ),
    );
    if (!credentialOffer)
      throw new HttpException(
        'Credential offer not found',
        HttpStatus.NOT_FOUND,
      );

    return {
      credential_issuer: `${this.serverURL}`,
      credentials: [
        {
          format: credential?.format,
          types: credential?.types,
        },
      ],
      grants: {
        'urn:ietf:params:oauth:grant-type:pre-authorized_code': {
          'pre-authorized_code': credentialOffer.pre_auth_code ?? randomUUID(),
          user_pin_required: !!credentialOffer.user_pin,
        },
      },
    };
  }

  @Post('credential')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiBody({
    type: CredentialRequest,
  })
  @ApiResponse({
    status: 201,
    description: 'Credential issuance successfull',
    type: CredentialIssuanceResponse,
  })
  async credential(
    @Headers('authorization') authHeader: string,
    @Body() requestBody: CredentialRequest,
  ) {
    const token = authHeader.split(' ')[1];
    const preAuthCode = (decode(token) as JwtPayload).jti;
    if (!preAuthCode)
      throw new HttpException(
        'No credential identifier found',
        HttpStatus.BAD_REQUEST,
      );
    const credentialOfferId = this.preAuthCodeMap.get(preAuthCode);
    if (!credentialOfferId)
      throw new HttpException(
        'No credential identifier found',
        HttpStatus.BAD_REQUEST,
      );
    const credentialOfferData = this.offerMap.get(credentialOfferId);
    if (!credentialOfferData)
      throw new HttpException(
        'No credential data found',
        HttpStatus.BAD_REQUEST,
      );
    const decodedHeaderSubjectDID = requestBody.proof.jwt
      ? (decode(requestBody.proof.jwt) as JwtPayload).iss
      : null; //TODO: check if jwt is valid and has iss field

    const credentialSubject = credentialOfferData.credentialSubject
      ? {
          id: decodedHeaderSubjectDID,
          ...credentialOfferData.credentialSubject,
          issuance_date: new Date(
            Math.floor(Date.now() / 1000) * 1000,
          ).toISOString(),
        }
      : {
          id: decodedHeaderSubjectDID,
          family_name: 'Doe',
          given_name: 'John',
          birth_date: '1990-01-01',
          degree: 'Bachelor of Computer Science',
          gpa: '1.2',
          age_over_18: true,
          issuance_date: new Date(
            Math.floor(Date.now() / 1000) * 1000,
          ).toISOString(),
        };

    const { schema } =
      credentialSchemas.find((credentialSchema) => {
        if (credentialOfferData?.type) {
          return credentialOfferData.type === credentialSchema.type;
        }
      }) ?? credentialSchemas[credentialSchemas.length - 1];

    const credentialId = randomUUID();
    const issuedAt = Math.floor(Date.now() / 1000);
    const expirationDate = issuedAt + 60 * 60;
    const payload = {
      jti: `urn:uuid:${credentialId}`,
      iss: this.issuerDid,
      sub: decodedHeaderSubjectDID || '',
      iat: issuedAt,
      nbf: issuedAt,
      exp: expirationDate,
      vc: {
        credentialSubject,
        expirationDate: new Date(expirationDate * 1000).toISOString(),
        id: `urn:uuid:${credentialId}`,
        issuanceDate: new Date(
          Math.floor(Date.now() / 1000) * 1000,
        ).toISOString(),
        issued: new Date(issuedAt * 1000).toISOString(),
        issuer: this.issuerDid,
        type: credentialOfferData?.types,
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        validFrom: new Date(issuedAt * 1000).toISOString(),
        credentialSchema: {
          id: schema,
          type: 'FullJsonSchemaValidator2021',
        },
      },
    };

    const kid = await joseWrapper.calculateJwkThumbprint(this.publicKey);
    const credentialJwt = await joseWrapper.signJwt(
      this.privateKey,
      Buffer.from(JSON.stringify(payload)),
      {
        typ: 'JWT',
        alg: 'ES256',
        kid: `${this.issuerDid}#${kid}`,
      },
    );

    const response: CredentialIssuanceResponse = {
      format: 'jwt_vc_json',
      credential: credentialJwt,
      c_nonce: this.generateNonce(),
      c_nonce_expires_in: 86400,
    };
    return response;
  }

  @ApiResponse({
    status: 200,
    type: CredentialIssuerMetadataResponse,
  })
  @Get('.well-known/openid-credential-issuer')
  getCredentialIssuerMetadata(): CredentialIssuerMetadataResponse {
    return {
      authorization_server: `${this.authServerURL}`,
      credential_issuer: `${this.serverURL}`,
      credential_endpoint: `${this.serverURL}/credential`,
      display: [
        //TODO: change depending on your use case
        {
          name: this.issuerName,
          locale: 'en-US',
          logo: {
            url: 'https://logowik.com/content/uploads/images/technischen-universitat-berlin1469.jpg',
          },
        },
      ],
      credentials_supported: credentialSupported,
    };
  }
}
