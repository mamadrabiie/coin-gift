export interface IPurchase {
    giftId: string
    currency: string
    email: string
    requestedTime: Date
    completedTime: Date
    price: number
    amount: string
    paymentResNumber: string
    paymentRefNumber: string
    encryptedMnemonic: string
    trxAddress: string
    chargeTxId: string
}