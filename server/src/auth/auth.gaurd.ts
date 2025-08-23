import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    console.log('Auth Header:', authHeader);
    if (!authHeader) {
      return false;
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      return false;
    }

    try {
      const decoded = this.jwtService.verify(token);
      console.log(decoded);
    } catch (error) {
      console.log(JSON.parse(JSON.stringify(error)));
      if (JSON.parse(JSON.stringify(error))['message'] === 'jwt expired') {
        throw new HttpException('Token expired', 402);
      }
      throw new HttpException('Invalid token', 401);
    }
    request.user = this.jwtService.verify(token);
    return true;
  }
}
