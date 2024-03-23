import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNumberString, IsString, Max, MaxLength, Min, MinLength } from "class-validator";

export class OtpValidation {
    @ApiProperty()
    @IsEmail()
    email: string

    @ApiProperty()
    @IsString()
    otpHash: string

    @ApiProperty()
    @IsString()
    @MinLength(6)
    @MaxLength(6)
    otp: string
}