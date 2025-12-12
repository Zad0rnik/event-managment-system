import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class ContentTypeGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const contentType = request.headers['content-type'];

    if (
      request.method !== 'GET' &&
      request.method !== 'DELETE' &&
      (!contentType || !contentType.includes('application/json'))
    ) {
      throw new BadRequestException(
        'Content-Type must be application/json'
      );
    }

    return true;
  }
}
