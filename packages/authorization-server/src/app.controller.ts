import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { randomBytes } from 'crypto';
import { ApiConfig, loadConfig } from '../config/configuration';
import {
  joseWrapper,
  JWK,
} from '@trace4eu/signature-wrapper/dist/wrappers/joseWrapper';
import { getPrivateKeyJwkES256 } from '@trace4eu/signature-wrapper/dist/utils/keys';
import { ConfigService } from '@nestjs/config';

const ALGORITHM = 'ES256';

@ApiTags('Authorization')
@Controller()
export class AppController {
  private readonly serverURL: string;
  private readonly authServerURL: string;
  private accessTokens = new Map<string, string>();
  private readonly privateKey: JWK;
  private readonly publicKey: JWK;

  constructor(private configService: ConfigService<ApiConfig, true>) {
    this.serverURL = this.configService.get<string>('serverUrl');
    this.authServerURL = this.configService.get<string>('authServerUrl');
    this.privateKey = getPrivateKeyJwkES256(
      this.configService.get<string>('privateKey'),
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { d, ...publicJwk } = this.privateKey;
    this.publicKey = publicJwk;
  }

  generateNonce(length = 12): string {
    return randomBytes(length).toString('hex');
  }

  async generateAccessToken(
    sub: string,
    credentialOfferId: string,
    serverUrl: string,
  ): Promise<string | undefined> {
    try {
      const payload: {
        iss: string;
        sub: string;
        aud: string;
        exp: number;
        iat: number;
        scope: string;
        jti: string;
      } = {
        iss: serverUrl,
        sub: sub,
        aud: serverUrl,
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        iat: Math.floor(Date.now() / 1000),
        scope: 'openid',
        jti: credentialOfferId,
      };

      return await joseWrapper.signJwt(
        this.privateKey,
        Buffer.from(JSON.stringify(payload)),
        {
          typ: 'JWT',
          alg: 'ES256',
        },
      );
    } catch (e) {
      console.log(e);
      return undefined;
    }
  }

  @Post('verifyAccessToken')
  @ApiBody({
    schema: { properties: { token: { type: 'string' } } },
  })
  @HttpCode(HttpStatus.OK)
  async verifyAccessToken(
    @Body() body: { token: string },
  ): Promise<{ message: string }> {
    const token = body.token;

    if (!token) {
      throw new HttpException('Token is required', HttpStatus.BAD_REQUEST);
    }

    try {
      const decoded = await joseWrapper.verifyJwt(
        token,
        this.publicKey,
        'ES256',
      );
      const payload = decoded.payload as Record<string, any>;

      if (payload.exp < Math.floor(Date.now() / 1000)) {
        throw new HttpException('Token has expired', HttpStatus.UNAUTHORIZED);
      }

      const storedToken = this.accessTokens.get(payload.jti);
      if (storedToken !== token) {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }

      return { message: 'Token is valid' };
    } catch (err) {
      throw new HttpException('Invalid token ', HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('token')
  @ApiBody({
    description: 'Generate an access token',
    schema: {
      properties: {
        client_id: { type: 'string' },
        pre_authorized_code: { type: 'string' },
        user_pin: { type: 'string' },
      },
    },
  })
  async token(
    @Body()
    body: {
      grant_type: string;
      'pre-authorized_code': string;
      user_pin?: string;
    },
  ) {
    try {
      const { grant_type, user_pin } = body;
      const preAuthCode = body['pre-authorized_code'];
      if (
        grant_type !== 'urn:ietf:params:oauth:grant-type:pre-authorized_code'
      ) {
        throw new HttpException('Invalid grant', HttpStatus.BAD_REQUEST);
      }

      if (user_pin !== undefined && user_pin !== '1234') {
        //TODO by use case: implement own needed routine
        throw new HttpException('Invalid pin', HttpStatus.BAD_REQUEST);
      }

      const generatedAccessToken = await this.generateAccessToken(
        this.authServerURL,
        preAuthCode,
        this.authServerURL,
      );

      if (generatedAccessToken === undefined) {
        throw new HttpException(
          'Error generating access token',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        this.accessTokens.set(preAuthCode, generatedAccessToken);
        return {
          access_token: generatedAccessToken,
          token_type: 'bearer',
          expires_in: 86400,
          c_nonce: this.generateNonce(16),
          c_nonce_expires_in: 86400,
        };
      }
    } catch (e) {
      console.log(e);
    }
  }

  @Get('/.well-known/openid-configuration')
  getOpenIdConfiguration() {
    return {
      issuer: `${this.serverURL}`,
      authorization_endpoint: `${this.authServerURL}/authorize`,
      token_endpoint: `${this.authServerURL}/token`,
      jwks_uri: `${this.authServerURL}/jwks`,
      scopes_supported: ['openid'],
      response_types_supported: ['vp_token', 'id_token'], //TODO: erase the one that is not performed
      response_modes_supported: ['query'],
      grant_types_supported: ['pre-authorized_code'],
      subject_types_supported: ['public'],
      id_token_signing_alg_values_supported: ['ES256'],
      request_object_signing_alg_values_supported: ['ES256'],
      request_parameter_supported: true,
      request_uri_parameter_supported: true,
      token_endpoint_auth_methods_supported: ['private_key_jwt'],
      request_authentication_methods_supported: {
        authorization_endpoint: ['request_object'],
      },
      vp_formats_supported: {
        jwt_vp: {
          alg_values_supported: ['ES256'],
        },
        jwt_vc: {
          alg_values_supported: ['ES256'],
        },
      },
      subject_syntax_types_supported: ['did:key:jwk_jcs-pub'],
      id_token_types_supported: [
        'subject_signed_id_token',
        'attester_signed_id_token',
      ],
    };
  }

  @Get('/jwks')
  async getJwks() {
    const publicKeyJwk = getPrivateKeyJwkES256(
      loadConfig().privateKey as string,
    );
    delete publicKeyJwk.d;
    publicKeyJwk.kid = await joseWrapper.calculateJwkThumbprint(publicKeyJwk);
    publicKeyJwk.alg = ALGORITHM;
    return {
      keys: [publicKeyJwk],
    };
  }
}
