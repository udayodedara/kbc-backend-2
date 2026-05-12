import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from '../src/response/response.interceptor';
import { HttpExceptionFilter } from '../src/http-exception/http-exception.filter';
import express from 'express';

let cachedServer;

async function bootstrap() {
  if (!cachedServer) {
    // Disable internal bodyParser detection to avoid the 'app.router' probe crash
    const app = await NestFactory.create(AppModule, { bodyParser: false });
    
    const expressInstance = app.getHttpAdapter().getInstance();
    
    // Manually add parsers which are safe
    expressInstance.use(express.json());
    expressInstance.use(express.urlencoded({ extended: true }));

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
    SwaggerModule.setup('api/docs', app, document, {
      customCssUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
      customJs: [
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js',
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js',
      ],
    });

    await app.init();
    cachedServer = expressInstance;
  }
  return cachedServer;
}

export default async function handler(req, res) {
  const server = await bootstrap();
  return server(req, res);
}
