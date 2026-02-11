import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { AppLogger } from '../logger/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: AppLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const user = request.user;

    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - now;

        this.logger.log({
          type: 'REQUEST',
          timestamp: new Date().toISOString(),
          method,
          url,
          userId: user?.id || null,
          email: user?.email || null,
          responseTime,
        });
      }),
    );
  }
}