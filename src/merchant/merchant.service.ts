import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { NotFoundResponse } from "./base-responses.interface";
import { ITransaction, TransactionStatusEnum } from "./transaction.interface";
import { TransactiontDto } from "./transaction.dto";
import { TronService } from "./tron.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MerchantService {
   
    constructor(
        @InjectModel('Transaction')
        private transactionModel: Model<ITransaction>,
        private Tronservice :TronService,
        private config: ConfigService
    ){}

    async createTransction(
        createTransactionDto: TransactiontDto
    ): Promise<ITransaction> {
        const {
            walletAddress,
            pbk,
            pvk
        } = await this.Tronservice.getNewRawWallet()
        const tx = await this.transactionModel.create({
            amount: createTransactionDto.amount,
            trxDestinationAddress: createTransactionDto.trxDestinationAddress,
            callback: createTransactionDto.callback,
            currency: createTransactionDto.currency,
            pbk,
            pvk,
            walletAddress,
            amountAfterWage: createTransactionDto.amount * parseFloat(this.config.get('TxWage')),   
        })
        this.Tronservice.checkTrxBalanceJob(
            walletAddress,
            tx.amount,
            tx.id
        )
        return tx
    }

    async getTransction(
        transactionId: string
    ): Promise<ITransaction> {
        const tx = await this.transactionModel.findById(
            transactionId
        ) 
        if(!tx) 
            throw new NotFoundException('cant find transaction')
        return tx
    }

    async startAllBalanceCheckingJobs() {
        const trxs:ITransaction[] 
		= await this.transactionModel.find({
            status: {$in:[
                TransactionStatusEnum.PENDING,
                TransactionStatusEnum.SUCCESS
            ]}
        })
        trxs && trxs.forEach((t) => {
            this.Tronservice.checkTrxBalanceJob(
                t.walletAddress, 
                t.amount,
                t._id
            )
        })
    }  
}