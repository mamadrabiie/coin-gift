import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { OtpValidation } from "../otp-validation.dto";

export class BuyGiftDto extends OtpValidation {
    @ApiProperty()
    @IsString()
    giftId: string
}