import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    cors:{
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST',
      credentials:true,
    }
  });
   app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,     // ลบ properties ที่ไม่อยู่ใน DTO
      transform: true,     // แปลง type ตามที่กำหนดใน DTO
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
