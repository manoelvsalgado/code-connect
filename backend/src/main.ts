import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

let app: NestExpressApplication;

async function bootstrap() {
  app = await NestFactory.create<NestExpressApplication>(AppModule);
  const corsOrigin = process.env.CORS_ORIGIN ?? 'http://localhost:5173';
  const allowedOrigins = corsOrigin
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  // Configuração do CORS
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  // Configuração para servir arquivos estáticos
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Code Connect API')
    .setDescription('API do Code Connect - Sistema de autenticação e posts')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.init();
}

export default async (req: any, res: any) => {
  if (!app) {
    await bootstrap();
  }
  const expressApp = app.getHttpAdapter().getInstance();
  return expressApp(req, res);
};
