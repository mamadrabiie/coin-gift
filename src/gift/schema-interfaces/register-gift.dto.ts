import { IsNumber, IsString, IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { CurrencyEnum } from "./currency.enum";
export class RegisterGiftDto {
    @ApiProperty()
    @IsNumber()
    price: number

    @ApiProperty()
    @IsString()
    name: string

    @ApiProperty()
    @IsEnum(CurrencyEnum)
    currency: string;
}