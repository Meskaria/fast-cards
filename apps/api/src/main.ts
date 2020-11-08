/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from 'apps/api/src/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // run only on dev envs
  if (process.env.APP_ENV !== 'production') {
    const options = new DocumentBuilder()
      .setTitle('Meskaria API')
      .setDescription('Meskaria API documentation')
      .setVersion('0.1')
      .addBearerAuth({ name: 'Authorization', in: 'header', type: 'apiKey' })
      .build();

    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup(`${globalPrefix}/explore`, app, document);
  }

  const port = process.env.PORT || 3333;
  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });
}

bootstrap();
