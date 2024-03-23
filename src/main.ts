import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MerchantService } from './merchant/merchant.service';
import { MerchantModule } from './merchant/merchant.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder().addBearerAuth()
    .addApiKey({type: 'apiKey', name: 'api-key', in: 'header'},'api-key')
    .setTitle('Coin-gift')
    .setDescription('The Coin-gift API description')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('v1/api', app, document);
  app.enableCors()

  const merchantService = app.select(AppModule).select(MerchantModule).get(MerchantService, { strict: true })
  await merchantService.startAllBalanceCheckingJobs();
  
  await app.listen(3000);
}
bootstrap();
