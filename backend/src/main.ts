import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.useStaticAssets(join(process.cwd(), 'storage'), {
    prefix: '/storage',
  });

  app.setGlobalPrefix('api');

  const configService = app.get(ConfigService);

  const allowedOrigins = (
    configService.get<string>('CORS_ORIGINS') ?? 'http://localhost:3000'
  )
    .split(',')
    .map((origin) => origin.trim())
    .filter?.(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header (e.g. server-to-server).
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked origin: ${origin}`), false);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  const port = Number(configService.get('PORT') ?? 3000);

  await app.listen(port);

  console.log(`Server running at http://localhost:${port}/api`);
}

bootstrap();
