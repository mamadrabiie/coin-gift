import * as mongoose from 'mongoose';

export const PurchaseSchema = new mongoose.Schema({
    giftId: {type: String},
    currency: {type: String},
    email: {type: String},
    requestedTime: {type: Date},
    completedTime: {type: Date},
    price: {type: Number},
    amount: {type: Number},
    paymentResNumber: {type: String},
    paymentRefNumber: {type: String},
    encryptedMnemonic: {type: String},
    trxAddress: {type: String},
    chargeTxId: {type: String}
})