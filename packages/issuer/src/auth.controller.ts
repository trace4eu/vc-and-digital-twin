import { Controller, Get, Post, Param, Body} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

import { randomUUID, randomBytes } from "crypto";
import { CredentialData } from './types/credential-data';
import { UniversityDegreeCredentialConfig, LoginCredentialConfig } from './credential-configurations';

// implements https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#section-3.5
@ApiTags("Authorization")
@Controller()
export class AuthController {
  constructor(private readonly appService: AppService) {}

  @Get("controller-hello")
  getHello(): string {
    return "Hello this is auth controller";
  }
}