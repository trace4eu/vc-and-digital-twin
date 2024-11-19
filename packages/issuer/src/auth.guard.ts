import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ApiConfig } from '../config/configuration';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly authServerURL: string;

  constructor(
    private reflector: Reflector,
    private configService: ConfigService<ApiConfig, true>,
  ) {
    this.authServerURL = this.configService.get<string>('authServerUrl');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    context.switchToHttp().getResponse();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new HttpException(
        'Authorization header is missing',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new HttpException('Token is missing', HttpStatus.UNAUTHORIZED);
    }

    try {
      const verificationResponse = await fetch(
        `${this.authServerURL}/verifyAccessToken`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: token }),
        },
      );

      if (!verificationResponse.ok) {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }

      // If the token is verified successfully, allow the request
      return true;
    } catch (error) {
      console.error('Error verifying token:', error);
      throw new HttpException('Error verifying token', HttpStatus.UNAUTHORIZED);
    }
  }
}
