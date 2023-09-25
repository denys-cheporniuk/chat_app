import { NestFactory } from '@nestjs/core';
import {BadRequestException, ValidationPipe} from "@nestjs/common";
import * as cookieParser from 'cookie-parser';
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';

import { AppModule } from "@/modules/app/app.module";
import { MAX_FILE_SIZE, MAX_FILES_ALLOWED } from "@/modules/constants";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: "http://localhost:5173",
    allowedHeaders: [
      'Accept',
      'Authorization',
      'Content-Type',
      'X-Requested-With',
      'apollo-require-preflight',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })

  app.use(cookieParser());

  app.use(graphqlUploadExpress({
    maxFileSize: MAX_FILE_SIZE,
    maxFiles: MAX_FILES_ALLOWED,
  }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        const formattedErrors = errors.reduce((acc, error) => {
          acc[error.property] = Object.values(error.constraints).join(', ');

          return acc;
        }, {});

        throw new BadRequestException(formattedErrors);
      }
    })
  );

  await app.listen(3000);
}
bootstrap();
