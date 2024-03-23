import { Body, Controller, Get, HttpStatus, Param, ParseUUIDPipe, Post, UseGuards, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { ApiKeyAuthGuard } from "src/auth/apiKey-auth.guard";
import { NotFoundResponse } from "./base-responses.interface";
import { MerchantService } from "./merchant.service";
import { ITransaction } from "./transaction.interface";
import { TransactionCreatedResponse, TransactionQueryResponse, TransactiontDto } from "./transaction.dto";
import { CallbackService } from "./callback.service";

@ApiTags('Merchant')
@Controller('merchant')
export class MerchantController {
    constructor(
        private merchantService: MerchantService,
        private callbackService: CallbackService
    ){}

    @ApiCreatedResponse({
        description: 'transaction created',
        type: TransactionCreatedResponse
    })
    @Post('transaction')
    @UseGuards(ApiKeyAuthGuard)
    @ApiSecurity('api-key')
    async requestNewTransaction(
        @Body(new ValidationPipe) 
        createTransactionDto: TransactiontDto
    ){
        const tx: ITransaction = await this.merchantService
        .createTransction(
            createTransactionDto
        )
        return {
            statusCode: HttpStatus.CREATED,
            walletAddress: tx.walletAddress,
            currency: tx.currency,
            amount: tx.amount,
            amountAfterWage: tx.amountAfterWage,
            id: tx._id
        }
    }

    @ApiParam({
        name:'id',
        required: true,
        description: 'transaction id',
        type: String
    })
    @ApiOkResponse({
        description:'return transaction status',
        type: TransactionQueryResponse 
    })
    @ApiNotFoundResponse({
        description:'transaction not found',
        type: NotFoundResponse 
    })
    @UseGuards(ApiKeyAuthGuard)
    @ApiSecurity('api-key')
    @Get('transaction/:id')
    async inqueryPayment(
        @Param('id', ParseUUIDPipe) transactionId: string,
    ) {
        const tx: ITransaction = await this.merchantService
        .getTransction(
            transactionId
        )
        return {
            statusCode: HttpStatus.OK,
            txStatus: tx.status,
            amount: tx.amount,
            currency: tx.currency,
            trxDestinationAddress: tx.trxDestinationAddress,
            transferTxId: tx.transferTxId
        }
    }
}