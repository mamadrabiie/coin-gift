import { HttpService, Injectable } from "@nestjs/common";

@Injectable()
export class CallbackService {
    constructor(
        private httpService: HttpService
    ){}

    callMerchantApi(
        transactionId: string,
        callback: string
    ): void {
        this.httpService.post(
            callback,
            {
                transactionId
            }
        )
        .toPromise()
        .then((res) =>
            console.log(`MerchantCallbackSuccess|callback:${callback}|transactionId:${transactionId}}`)
        )
        .catch((err)=>
            console.log(`MerchantCallbackFailed|callback:${callback}|transactionId:${transactionId}}`)
        )    
    }
}