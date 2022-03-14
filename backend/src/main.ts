import "dotenv/config";
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import 'cookie-parser';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { WsAdapter } from '@nestjs/platform-ws';
import * as bodyParser from 'body-parser';
import { SwaggerModule, DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('API alive code')
    .setDescription('')
    .setVersion('1.0')
    .build();

  const options: SwaggerDocumentOptions = {
    ignoreGlobalPrefix: false,
  }

  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, document);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.use(cookieParser());

  app.useWebSocketAdapter(new WsAdapter(app));

  app.use(bodyParser.json({limit: '50mb'}));
  app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
  
  app.useWebSocketAdapter(new WsAdapter(app));

  await app.listen(process.env.PORT);
}
bootstrap();
