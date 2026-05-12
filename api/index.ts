import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ResponseInterceptor } from '../src/response/response.interceptor';
import { HttpExceptionFilter } from '../src/http-exception/http-exception.filter';
import express from 'express';

const expressApp = express();
let cachedApp;

async function bootstrap() {
  if (!cachedApp) {
    const adapter = new ExpressAdapter(expressApp);
    const app = await NestFactory.create(AppModule, adapter, { abortOnError: false });
    
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());

    await app.init();
    cachedApp = expressApp;
  }
  return cachedApp;
}

export default async function handler(req, res) {
  await bootstrap();
  return expressApp(req, res);
}
