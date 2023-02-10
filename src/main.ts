import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { appConfig } from '@shared/configs';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from '@shared/exception-filters/global-exception.filter';
import * as session from 'express-session';
import { authConstants } from '@shared/common';

const port = appConfig.getPort();
const host = appConfig.getHost();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('BLOG-BACKEND')
    .setDescription('REST API')
    .setVersion('1.0.0')
    .addTag('BLOG')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);

  app.useGlobalFilters(new GlobalExceptionFilter(app.get(HttpAdapterHost)));

  app.enableCors({
    origin: '*',
    credentials: true,
    exposedHeaders: ['Authorization'],
  });
  await app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => new BadRequestException(errors),
    }),
  );
  await app.use(
    session({
      secret: authConstants.secret,
      resave: false,
      saveUninitialized: false,
    }),
  );

  await app.listen(port, host, () =>
    console.log(`Server started on port ${port}`),
  );
}
bootstrap();
