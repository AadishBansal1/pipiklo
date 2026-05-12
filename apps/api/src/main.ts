import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
    credentials: true,
  })

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
    })
  )

  const config = new DocumentBuilder()
    .setTitle('Pipiklo API')
    .setDescription('Pipiklo digital assets marketplace API')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document)

  const port = process.env.PORT ?? 3001
  await app.listen(port)
  console.log(`🚀 Pipiklo API running on http://localhost:${port}`)
  console.log(`📖 API Docs: http://localhost:${port}/api/docs`)
}

bootstrap()
