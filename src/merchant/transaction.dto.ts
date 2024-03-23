import { ApiProperty, ApiResponseProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsNumber, IsEmail, IsOptional, IsEnum, IsUrl, Min } from "class-validator";
import { CurrencyEnum } from "src/gift/schema-interfaces/currency.enum";
import { CreatedBaseResponse, OKBaseResponse } from "./base-responses.interface";
import { TransactionStatusEnum } from "./transaction.interface";

export class TransactiontDto {
    @ApiProperty({
        example: 10,
        description:'in Trx! 0.03 Fee will be collected'
    })
    @IsNotEmpty()
    @IsNumber()
    @Min(5)
    amount:number;

    @ApiProperty()
    @IsOptional()
    @IsString()
    callback:string

    @ApiProperty({
        example: CurrencyEnum.TRX
    })
    @IsEnum(CurrencyEnum)
    currency: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    trxDestinationAddress: string
}

export class TransactionCreatedResponse extends CreatedBaseResponse {
    @ApiResponseProperty({
        example: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'
    })
    walletAddress: string

    @ApiResponseProperty({
        example: CurrencyEnum.TRX
    })
    currency: string

    @ApiResponseProperty({
        example: 10
    })
    amount: number

    @ApiResponseProperty({
        example: 9.03,
    })
    amountAfterWage: number

    @ApiResponseProperty({
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    id: string
}

export class TransactionQueryResponse extends OKBaseResponse {
    @ApiResponseProperty({
        example: 
        `${TransactionStatusEnum.PENDING}|${TransactionStatusEnum.SUCCESS}|${TransactionStatusEnum.SETTLED}|${TransactionStatusEnum.TIMEOUT}`
    })
    txStatus: TransactionStatusEnum

    @ApiResponseProperty({
        example: 10
    })
    amount: number

    @ApiResponseProperty({
        example: CurrencyEnum.TRX
    })
    currency: string

    @ApiResponseProperty({
        example: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'
    })
    trxDestinationAddress: string

    @ApiResponseProperty({
        example: '4bc3ca865574d0f0d279ca46f7e3507274f71ebe4b1690a21eca007aff5f2013'
    })
    transferTxId: string
}