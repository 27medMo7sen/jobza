import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class LocalAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new HttpException('Authorization header missing', 401);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new HttpException('Token missing', 401);
    }

    let decoded: any;
    try {
      decoded = this.jwtService.verify(token);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new HttpException('Token expired', 402);
      }
      throw new HttpException('Invalid token', 401);
    }

    // attach user to request
    request.user = decoded;

    // ✅ role check
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (requiredRoles && !requiredRoles.includes(decoded.role)) {
      throw new HttpException('Forbidden: insufficient role', 403);
    }

    return true;
  }
}
