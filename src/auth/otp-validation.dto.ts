import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString, IsString, Max, MaxLength, Min, MinLength } from "class-validator";

export class OtpValidation {
    @ApiProperty()
    @IsNumberString()
    @MinLength(11)
    @MaxLength(11)
    phoneNumber: string

    @ApiProperty()
    @IsString()
    otpHash: string

    @ApiProperty()
    @IsString()
    @MinLength(6)
    @MaxLength(6)
    otp: string
}