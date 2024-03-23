import { HttpModule, Module } from '@nestjs/common';
import { GiftController } from './gift.controller';
import { GiftService } from './gift.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { GiftSchema } from './schema-interfaces/gift.schema';
import { PricingService } from './pricing.service';
import { AuthenticationModule } from 'src/auth/auth.module';
import { PaymentModule } from 'src/payment/payment.module';
import { PurchaseSchema } from './schema-interfaces/purchase.schema';
import { WalletsService } from './wallets-service';
import { TranspotModule } from 'src/transport/transport.module';

@Module({
  imports:[
    MongooseModule.forFeature([
      {
        name: 'Gift',
        schema: GiftSchema,
        collection: 'gifts'
      },
      {
        name: 'Purchase',
        schema: PurchaseSchema,
        collection: 'purchases'
      }
    ]),
    HttpModule,
    AuthenticationModule,
    PaymentModule,
    TranspotModule
  ],
  controllers: [GiftController],
  providers: [
    GiftService,
    PricingService,
    WalletsService
  ]
})
export class GiftModule {}
