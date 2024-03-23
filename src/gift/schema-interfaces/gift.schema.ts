import * as mongoose from 'mongoose';
import { CurrencyEnum } from './currency.enum';

export const GiftSchema = new mongoose.Schema({
    currency:{
        type: CurrencyEnum,
        required:[true,'valid currency required']
    },
    price:{type:Number,required:false},
    name:{type:String},
})

export interface IGift  {
    _id: string
    price: number
    currency: CurrencyEnum;
    amount?: number
    name: string
}