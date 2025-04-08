import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const document = new DocumentBuilder()
    .setTitle('Rate limited task queue system')
    .setDescription('The tasks API description')
    .setVersion('1.0')
    .addTag('Task')
    .addBearerAuth()
    .build();
  const documentFactory = SwaggerModule.createDocument(app, document);
  SwaggerModule.setup('api', app, documentFactory);
  const config = app.get(ConfigService);
  const port = config.get<number>('PORT') || 4001;
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);
  console.log(`App running on http://localhost:${port}`);
}
bootstrap();
