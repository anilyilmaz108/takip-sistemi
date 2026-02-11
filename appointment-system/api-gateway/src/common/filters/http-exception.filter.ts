import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppLogger } from '../logger/logger.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: AppLogger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : 500;

    const errorResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal Server Error';

    this.logger.error({
      type: 'ERROR',
      timestamp: new Date().toISOString(),
      method: request.method,
      url: request.url,
      user: request.user?.email || null,
      status,
      error: errorResponse,
    });

    response.status(status).json({
      statusCode: status,
      message: errorResponse,
    });
  }
}