import { HttpModule, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TranspotModule } from "src/transport/transport.module";
import { CallbackService } from "./callback.service";
import { MerchantController } from "./merchant.controller";
import { MerchantService } from "./merchant.service";
import { TransactionSchema } from "./transaction.schema";
import { TronService } from "./tron.service";

@Module({
    imports:[
      HttpModule,
      MongooseModule.forFeature([
        {
            name:'Transaction',
            schema: TransactionSchema,
            collection: 'transactions'
        }
      ])
    ],
    controllers:[
      MerchantController
    ],
    providers:[
      MerchantService,
      TronService,
      CallbackService
    ],
    exports:[MerchantService]
})
export class MerchantModule{}