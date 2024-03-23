import { CurrencyEnum } from "src/gift/schema-interfaces/currency.enum"

export enum TransactionStatusEnum {
    PENDING = 'pending',
    SUCCESS = 'success',
    TIMEOUT = 'timeout',
    SETTLED = 'settled'
}
export interface ITransaction {
    _id: string
    trxDestinationAddress: string
    pvk: string
    pbk: string
    transferTxId: string
    currency: CurrencyEnum
    callback: string
    amount: number
    amountAfterWage:number
    walletAddress: string
    status: TransactionStatusEnum
    createdTime: Date //default
    completedTime: Date
}