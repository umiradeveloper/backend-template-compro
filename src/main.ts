import 'reflect-metadata';
import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import compression from 'compression';
import { mkdirSync } from 'fs';
import { resolve } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);
  if (config.get('env') === 'production' && ['change-me', 'ganti-dengan-string-acak-yang-panjang'].includes(config.get('jwt.secret')!)) {
    throw new Error('JWT_SECRET wajib diganti di production');
  }

  app.set('trust proxy', 1);
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(compression());
  app.enableCors({ origin: config.get<string[]>('corsOrigins'), credentials: true });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, transformOptions: { enableImplicitConversion: false } }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useBodyParser('json', { limit: '5mb' });

  // file upload dapat diakses publik di /uploads/...
  const uploadDir = resolve(config.get<string>('upload.dir')!);
  mkdirSync(uploadDir, { recursive: true });
  app.useStaticAssets(uploadDir, { prefix: '/uploads', maxAge: '30d' });

  const swagger = new DocumentBuilder()
    .setTitle('Umira CMS API')
    .setDescription('API admin panel & website company profile Umira Sinergi Global')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, swagger));

  const port = config.get<number>('port')!;
  await app.listen(port);
  Logger.log(`🚀 API berjalan di ${config.get('appUrl')}/api  |  Swagger: ${config.get('appUrl')}/api/docs  |  File: ${config.get('assetUrl')}`, 'Bootstrap');
}
bootstrap();
