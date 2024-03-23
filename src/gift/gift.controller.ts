import { Body, Controller ,Get,HttpStatus, Post, Query, Redirect, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiQuery } from '@nestjs/swagger';
import { AuthenticationService } from 'src/auth/auth.service';
import { PaymentService } from 'src/payment/payment.service';
import { ZarinpalVerificationDto } from 'src/payment/transaction_verification.dto';
import { GiftService } from './gift.service';
import { PricingService } from './pricing.service';
import { BuyGiftDto } from './schema-interfaces/buy-gift.dto';
import { CurrencyEnum } from './schema-interfaces/currency.enum';
import { RegisterGiftDto } from './schema-interfaces/register-gift.dto';

@Controller('gift')
export class GiftController {
    constructor(
        private giftservice:GiftService,
        private pricingService: PricingService,
        private authservice: AuthenticationService,
        private confgiService: ConfigService,
    ){}
    
    @Post()
    public async registerGift(@Body() registerGiftDto: RegisterGiftDto) {
        return {
            gift: await this.giftservice.create(registerGiftDto),
            status: HttpStatus.CREATED,
        }
    }

    @Get()
    async getAllGifts() {
        let gifts = await this.giftservice.getAllGifts(
            CurrencyEnum.TRX
        );
        gifts = await this.pricingService.convertPrices(
            gifts, 
            CurrencyEnum.TRX
        )
        return {
            gifts,
            status: HttpStatus.OK,
        }
    }

    @Post('buy')
    public async buyGift(@Body() buyGiftDto: BuyGiftDto) {
        const {otp, otpHash, email} =  buyGiftDto
        await this.authservice
        .validateOtpCredentials(
            email,
            otpHash,
            otp
        )
        const url = await this.giftservice.requestForBuyingGift(
            buyGiftDto
        )
        return {
            url,
            status: HttpStatus.CREATED,
        }
    }

    @ApiQuery({
        name:'paymentRefNum',
        type: String
    })
    @Get('payment/verify')
    async verifyPurchaseFromUser (
        @Query('paymentRefNum') 
        paymentRefNum: string
    ) {
        const purchase = await this.giftservice
        .getPurchaseIfPaymentCompleted(
            paymentRefNum
        )
        
        return {
            status: HttpStatus.OK ,
            mnemonic: purchase.encryptedMnemonic
        }          
    }

    @Get('payment/zarinpal')
    @Redirect()
    async verifyPaymentfromZarinPal (
        @Query(ValidationPipe) 
        transactionDto:ZarinpalVerificationDto
    ) {
        const paymentRefNumber = await this.giftservice.validatePaymentFromZarinpal(
            transactionDto.Authority
        )
        await this.giftservice.completePuchase(
            transactionDto.Authority,
            paymentRefNumber
        )
        return {
            "url": `${this.confgiService.get('PAYMENT_LANDPAGE')}?refNum=${paymentRefNumber}` ,
            "statusCode": 301
        }          
    }
}
