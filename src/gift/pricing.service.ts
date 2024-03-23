import { HttpService, Injectable } from "@nestjs/common";
import { CurrencyEnum } from "./schema-interfaces/currency.enum";
import { IGift } from "./schema-interfaces/gift.schema";

@Injectable()
export class PricingService {
    constructor(
        private httpService: HttpService
    ){}

    async convertPrices(
        gifts: IGift[],
        currency: CurrencyEnum
    ): Promise<IGift[]>{
        let data = {
            dstCurrency:"rls",
            srcCurrency:currency
        }
        const market = await this.httpService.post('https://api.nobitex.ir/market/stats',data=data).toPromise();
        const i = `${data.srcCurrency}-rls`
        const rate = parseInt(market.data.stats[i].latest)/10000
        return gifts.map((gift) => {
            return {
                currency: gift.currency,
                price: gift.price,
                name: gift.name,
                _id: gift._id,
                amount: parseInt((gift.price / rate).toFixed())
            }
        })
    }

    async convertPriceToAmount(
        price: number,
        currency: CurrencyEnum
    ): Promise<number>{
        let data = {
            dstCurrency:"rls",
            srcCurrency:currency
        }
        const market = await this.httpService.post('https://api.nobitex.ir/market/stats',data=data).toPromise();
        const i = `${data.srcCurrency}-rls`
        const rate = parseInt(market.data.stats[i].latest)/10000
        return parseInt((price / rate).toFixed())
    }
}