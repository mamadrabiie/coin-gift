import { Module } from '@nestjs/common';
import { GiftModule } from './gift/gift.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthenticationModule } from './auth/auth.module';
import { PaymentModule } from './payment/payment.module';
import { TranspotModule } from './transport/transport.module';
import { MerchantModule } from './merchant/merchant.module';
import { PassportModule } from '@nestjs/passport';
import { apiKeyStrategy } from './auth/apiKey.strategy';

@Module({
  imports: [
    GiftModule,
    AuthenticationModule,
    PaymentModule,
    TranspotModule,
    MerchantModule,
    PassportModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env' 
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],

      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('DB_URI'),
        user: configService.get('DB_USER'),
        pass: configService.get('DB_PASS'),
        dbName: configService.get('DB_NAME'),
        useFindAndModify: false,
        useNewUrlParser: true
      }),

      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [
    apiKeyStrategy
  ],
})
export class AppModule {}
