import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { IGift } from './schema-interfaces/gift.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterGiftDto } from './schema-interfaces/register-gift.dto';
import { CurrencyEnum } from './schema-interfaces/currency.enum';
import { BuyGiftDto } from './schema-interfaces/buy-gift.dto';
import { IPurchase } from './schema-interfaces/purchase.interface';
import { PricingService } from './pricing.service';
import { PaymentService } from 'src/payment/payment.service';
import { WalletsService } from './wallets-service';
import { MailService } from 'src/transport/mail.service';
import { MailSubjectEnum } from 'src/transport/interfaces/mail-subject.enum';

@Injectable()
export class GiftService {
    
    constructor(
        @InjectModel('Gift') 
        private giftmodel:Model<IGift>,
        @InjectModel('Purchase') 
        private purchaseModel:Model<IPurchase>,
        private pricingService: PricingService,
        private paymentService: PaymentService,
        private walletService: WalletsService,
        private mailService: MailService
    ){}
    async create(iregistergift: RegisterGiftDto) {
        return this.giftmodel.create(iregistergift)
    }
    async getAllGifts(currency: CurrencyEnum): Promise<IGift[]>{
        return await this.giftmodel.find({
            currency
        })
    }
    async requestForBuyingGift(buyGiftDto: BuyGiftDto): Promise<string> {
        const gift = await this.giftmodel.findById(buyGiftDto.giftId)
        const purchase = await this.purchaseModel.create({
            amount: await this.pricingService.convertPriceToAmount(
                gift.price,
                gift.currency
            ),
            currency: gift.currency,
            email: buyGiftDto.email,
            giftId: gift.id,
            price: gift.price, 
        })
        const {url, paymentResNumber} = await this.paymentService
        .requestPaymentForPurchase(
            purchase.price,
            purchase.email
        )
        console.log(`PaymentInitiated|${buyGiftDto.email}|${paymentResNumber}|${purchase.price}`)
        await this.purchaseModel.findByIdAndUpdate(
            purchase.id,
            {
                paymentResNumber,
                requestedTime: new Date()
            }
        )
        return url
    }

    async validatePaymentFromZarinpal(paymentResNumber: string) {
        console.log(`ValidatingPayment|${paymentResNumber}`)
        const purchase = await this.purchaseModel.findOne({
            paymentResNumber
        })
        if(!purchase) throw new NotFoundException()
        return await this.paymentService.verifyZarinpal(
            purchase.paymentResNumber,
            purchase.price
        )
    }

    async getPurchaseIfPaymentCompleted(
        paymentRefNumber: string
    ) {
        const purchase =await this.purchaseModel.findOne({
            paymentRefNumber
        })
        console.log(purchase)
        if(!purchase || !purchase.paymentRefNumber) 
            throw new NotFoundException('purchase not found')
        return purchase
    }
    

    async completePuchase(
        paymentResNumber: string, 
        paymentRefNumber: string
    ) {
        console.log(`CompletingPayment|${paymentResNumber}|${paymentRefNumber}`)
        
        if(paymentRefNumber === 'DoubleSpend'){
            const purchase = await this.purchaseModel
            .findOne({paymentResNumber})
            if(purchase.chargeTxId || purchase.encryptedMnemonic) 
                throw new BadRequestException('DoubleSpendAttempt')
        }

        const {trxAddress, mnemonic} = await this.walletService
        .generateNewTrxWallet()
        console.log(`WalletGenerated|${paymentResNumber}|${trxAddress}|${mnemonic}`)
        
        const purchase = await this.purchaseModel
        .findOneAndUpdate(
            {paymentResNumber},
            {
                paymentRefNumber,
                completedTime: new Date(),
                trxAddress,
                encryptedMnemonic: mnemonic
            },
            {new: true}
        )
        console.log(`PurchaseRegistered|${purchase._id}|${trxAddress}`)

        this.mailService.sendMail(
            purchase.email,
            {mnemonic},
            'Security Alert! Do not Share this!',
            MailSubjectEnum.WALLET     
        )

        const txId = await this.walletService.chargeWallet(
            purchase.amount,
            trxAddress
        )
        console.log(`WalletCharged|${trxAddress}|${purchase.amount} TRX|${txId}`)
        await this.purchaseModel
        .findByIdAndUpdate(
            purchase.id,
            {
                chargeTxId: txId
            },
            {new: true}
        )
    }
}
