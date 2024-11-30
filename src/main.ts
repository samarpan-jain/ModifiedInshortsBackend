import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'https://modified-inshorts-clone.vercel.app', // Allow specific origin
    methods: ['GET','POST','PUT','DELETE'],            // Allowed HTTP methods
    allowedHeaders: 'Content-Type,Authorization',
  });
  await app.listen(3000);
}
bootstrap();
