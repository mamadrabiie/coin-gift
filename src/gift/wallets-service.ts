import { Injectable } from "@nestjs/common";
import * as bip39 from 'bip39'
import { CoinType } from "./schema-interfaces/coins.enum";
import { spawn } from 'child_process';
import * as path from 'path'
import { ConfigService } from "@nestjs/config";
export const TronWeb = require("tronweb");

@Injectable()
export class WalletsService {
    constructor(
        private readonly configService: ConfigService
    ){}
    tronweb = new TronWeb({
        fullHost: "https://api.trongrid.io"
    });
    
    async generateNewTrxWallet(): Promise<{
        trxAddress: string,
        mnemonic: string
    }> {
        let mnemonic = bip39.generateMnemonic()
        const address:string = await this.createAddressFromMnemonic(
            mnemonic,
            CoinType.TRX
        )
        return {
            trxAddress: address.trimEnd(),
            mnemonic
        }
    }

    async createAddressFromMnemonic(mnemonic, coin): Promise<string> {
        const child = spawn(
            path.resolve('./')+'/trustwallet-code',  
            [coin, mnemonic], 
        );
        return new Promise((resolve, reject)=>{
            child.stdout.on("data", (data) => {
                const parsedData = data.toString()
                const [key, value] = parsedData.split(" ")
                if(key === 'validity' && value === 'false') 
                    reject('mnemonic validation failed')
                if(key === 'address') 
                    resolve(value)
            });          
            child.stderr.on("error", (data)=>{
                console.log(`child stderr:\n${data}`);
                reject(data)
            })        
        })
    }

    async chargeWallet(amount: string, trxAddress: string) {
        const t = await this.tronweb.trx.sendTransaction(
            trxAddress,
            parseInt(amount) * 1000000,
            this.configService.get('GiftTrxTreasuryPk')
        );
        return t.transaction.txID
    }
}