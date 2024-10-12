import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  authServerURL = 'http://localhost:3001'

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new HttpException('Authorization header is missing', HttpStatus.UNAUTHORIZED);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new HttpException('Token is missing', HttpStatus.UNAUTHORIZED);
    }

    try {

      const verificationResponse = await fetch(`${this.authServerURL}/verifyAccessToken`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: token }),
      });

      if (!verificationResponse.ok) {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }

      /*
      const authServerURL = 'http://localhost:3000/'; // Replace with actual auth server URL

      const verificationResponse = await fetch(`${authServerURL}/verifyAccessToken`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (!verificationResponse.ok) {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }

      const result = await verificationResponse.text();
      console.log('Token verification response:', result);
      */

      // If the token is verified successfully, allow the request
      return true;
    } catch (error) {
      console.error('Error verifying token:', error);
      throw new HttpException('Error verifying token', HttpStatus.UNAUTHORIZED);
    }
  }
}
