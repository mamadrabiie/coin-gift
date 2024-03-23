import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { CronJob } from "cron";
import { Model } from "mongoose";
import { CallbackService } from "./callback.service";
export const TronWeb = require("tronweb");
import { ITransaction, TransactionStatusEnum } from "./transaction.interface";

@Injectable()
export class TronService {
		
    constructor(
        private configService: ConfigService,
        @InjectModel('Transaction')
        private transactionModel: Model<ITransaction>,
        private callbackService: CallbackService
    ){}
    tronweb = new TronWeb({
        fullHost: "https://api.trongrid.io"
    });

    async getNewRawWallet(): Promise<{
        walletAddress: string
        pvk: string
        pbk: string
    }> {
        const rawWallet = await this.tronweb.createAccount()
        console.log(`RawWalletCreated|address:${rawWallet.address.base58}`)
        return {
            walletAddress: rawWallet.address.base58,
            pvk: rawWallet.privateKey,
            pbk: rawWallet.publicKey,
        }
    }

    async checkTrxBalanceJob(
        address: string, 
        amount: number, 
        transactionId
    ) {
        let c = 1
        console.log(`TrxBalanceChecking|transactionId:${transactionId}`)
        const job = new CronJob(`0 */2 * * * *`, async () => {
            try{
                const balance =  await this.tronweb.trx.getBalance(address);
                // console.log(`TrxBalanceChecking|transactionId:${transactionId}|balance:${balance}|address:${address}`);
                if(parseFloat(balance)  && balance  >= amount * 1000000){
                    console.log(`TrxPaymentCompleted|transactionId:${transactionId}`)
                    const tx = await this.transactionModel.findById(transactionId)
                    if(tx.status != TransactionStatusEnum.SUCCESS)
                        await this.transactionModel.findByIdAndUpdate(
                            transactionId,
                            {
                                status: TransactionStatusEnum.SUCCESS,
                                completedTime: new Date()
                            }        
                        )
                    const transferTxId = await this.transferToDestinationWallet(
                        tx.pvk,
                        tx.amountAfterWage * 1000000,
                        tx.trxDestinationAddress
                    )
                    await this.transactionModel.findByIdAndUpdate(
                        transactionId,
                        {
                            transferTxId,
                            status: TransactionStatusEnum.SETTLED
                        }        
                    )
                    this.callbackService.callMerchantApi(
                        transactionId,
                        tx.callback
                    )
                    job.stop();
                }
                c++;
                if (c > this.configService.get('MaxCheckTime')) {
                    console.log(
                        `TrxTransactionTimedOut|TxId:${transactionId}`,
                    );  
                    await this.transactionModel.findByIdAndUpdate(
                        transactionId,
                        {
                            status: TransactionStatusEnum.TIMEOUT                       
                        }        
                    )
                    job.stop();
                }
            }catch(e){
                console.error(e)
            }

        }, null, null, null, this.checkTrxBalanceJob);
        job.start();
    }
  
    //---------------------collect feature---------------------------------
    async transferToDestinationWallet(
        privatekey, 
        amount,
        trxDestinationAddress
    ) {
        try {
            const Tx = await this.tronweb.trx.sendTransaction(
                trxDestinationAddress,
                amount,
                privatekey
            );
            return Tx.transaction.txID
        }catch(e){
            console.error(e)
            throw new InternalServerErrorException();   
        }
    }
}