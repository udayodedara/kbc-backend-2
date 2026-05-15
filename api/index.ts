import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from '../src/response/response.interceptor';
import { HttpExceptionFilter } from '../src/http-exception/http-exception.filter';
import express from 'express';

const expressApp = express();
// Workaround for NestJS 11 + Express 4 "app.router" deprecation error
// This prevents app.get('router') from triggering the deprecated getter in Express 4
expressApp.set('router', undefined);

let cachedApp;

async function bootstrap() {
  if (!cachedApp) {
    // Disable automatic body parser registration to avoid internal Express/NestJS 11 compatibility issues
    const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp), {
      bodyParser: false,
    });

    // Manually add body parsers
    expressApp.use(express.json());
    expressApp.use(express.urlencoded({ extended: true }));

    // Global interceptors and filters
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());

    // Swagger Configuration
    const config = new DocumentBuilder()
      .setTitle('API Documentation')
      .setDescription('NestJS Prisma API with Swagger')
      .setVersion('1.0')
      .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    await app.init();
    cachedApp = app;
  }
  return cachedApp;
}

export default async function handler(req, res) {
  await bootstrap();
  expressApp(req, res);
}

