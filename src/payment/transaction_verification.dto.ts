import { Equals, IsNotEmpty,  IsString } from "class-validator";

export class ZarinpalVerificationDto {
    @IsNotEmpty()
    @IsString()
    Authority:string;

    @Equals('OK')
    @IsNotEmpty()
    Status:string;
}