import { Schema } from "mongoose";
import { CurrencyEnum } from "src/gift/schema-interfaces/currency.enum";
import { v4 as uuidv4 } from 'uuid';
import { TransactionStatusEnum } from "./transaction.interface";

export const TransactionSchema = new Schema({
    _id:{type: String, default:uuidv4},
    trxDestinationAddress: {type:String},
    pvk: {type:String},
    pbk: {type:String},
    transferTxId: {type:String},
    currency: {type:CurrencyEnum},
    callback: {type:String},
    amount: {type:Number},
    amountAfterWage: {type:Number},
    walletAddress: {type:String},
    status: {type:TransactionStatusEnum,default:TransactionStatusEnum.PENDING},
    createdTime: {type: Date},
    completedTime: {type: Date}
})