import 'dotenv/config';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';

import { jwtConstants } from '../constants';
import { IS_PUBLIC_KEY } from '../decorators/isPublic.decorator';
import { IS_INTERNAL_SCHEDULER_KEY } from '../decorators/isInternalScheduler.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const reflectorTarget = [
      context.getHandler(),
      context.getClass()
    ];
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, reflectorTarget);
    const isInternalScheduler = this.reflector.getAllAndOverride<boolean>(IS_INTERNAL_SCHEDULER_KEY, reflectorTarget);
    const request = context.switchToHttp().getRequest();

    // 💡 See this condition
    if (isPublic) return true;

    if (isInternalScheduler) return this.isInternalSchedulerAllowed(request);

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret
      });

      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private isInternalSchedulerAllowed(request: Request) {
    const token = this.extractInternalServicesTokenFromHeader(request);

    return token === process.env.INTERNAL_SCHEDULER_HEADER_TOKEN;

  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }

  private extractInternalServicesTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Internal' ? token : undefined;
  }
}
