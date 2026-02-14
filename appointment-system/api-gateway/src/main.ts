import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppLogger } from './common/logger/logger.service';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { ActiveUserGuard } from './common/guards/active-user.guard';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { ErrorMaskingInterceptor } from './common/interceptors/error-masking.interceptor';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:4200',
      'https://app.domain.com',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const logger = app.get(AppLogger);

  app.useGlobalInterceptors(
    new LoggingInterceptor(logger),
    new ErrorMaskingInterceptor(),
    new TransformInterceptor(),
  );
  app.useGlobalFilters(new AllExceptionsFilter(logger));
  app.useGlobalGuards(new ActiveUserGuard());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
