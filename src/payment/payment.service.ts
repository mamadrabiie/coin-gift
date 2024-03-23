import { HttpService, Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as soap from 'soap'

@Injectable()
export class PaymentService {
    
    constructor(
        private configService: ConfigService,
        private httpService: HttpService
    ){}

    async requestPaymentForPurchase(
        price: number, 
        email: string
    ): Promise<{ url: string; paymentResNumber: string; }>  {
        try{
            const paymentResNumber = await this.requestGateZarinPal(
                price,
                email
            )
            return {
                url:`https://www.zarinpal.com/pg/StartPay/${paymentResNumber}`,
                paymentResNumber
            }
        }catch(e){
            console.error(e)
        } 
    }
    
    async verifyZarinpal(
        paymentResNumber: string,
        price: number
    ): Promise<string> {
        const res = await this.httpService.post(
            this.configService.get('ZARINPAL_VERIFICATION_URL'),
            {
                merchant_id: this.configService.get('ZARINPAL_GATEWAY'),
                amount: price * 10000,
                authority: paymentResNumber
            }
        ).toPromise()
        .then((res) => {
            if(res.data['data']['code'] === 100)
                return res.data['data']["ref_id"]
            else if(res.data['data']['code'] === 101)
                return 'DoubleSpend'
            else {
                console.log(`GatewayVrfFailed|${res.data['errors']['message']}|${res.data['errors']['code']|res.data['errors']['validations']}`)
                throw new InternalServerErrorException()
            }  
        })
        .catch(err => {
            console.log(`GatewayVrfError|${err}`)
            throw new InternalServerErrorException()
        })
        return res
    }

    async requestGateZarinPal(
        price: number,
        email: string 
    ): Promise<string> {
        const res = await this.httpService.post(
            this.configService.get('ZARINPAL_URL'),
            {
                merchant_id: this.configService.get('ZARINPAL_GATEWAY'),
                amount: price * 10000,
                description: 'coingift',
                callback_url: this.configService.get('PAYMENT_VERIFICATION_API')
            }
        ).toPromise()
        .then((res) => {
            if(res.data['data']['message'] === 'Success')
                return res.data['data']["authority"]
            else {
                console.log(`GatewayReqFailed|${res.data['errors']['message']}|${res.data['errors']['code']|res.data['errors']['validations']}`)
                throw new InternalServerErrorException()
            }  
        })
        .catch(err => {
            console.log(`GatewayReqErr|${err}`)
            throw new InternalServerErrorException()
        })
        return res
    }
}