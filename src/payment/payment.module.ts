import { HttpModule, Module } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Module({
  imports:[HttpModule],
  controllers: [],
  providers: [PaymentService],
  exports:[PaymentService]
})
export class PaymentModule {}
