import { Controller, Get, HttpStatus, Injectable, Query } from "@nestjs/common";
import { ApiQuery } from "@nestjs/swagger";
import { AuthenticationService } from "./auth.service";
import { EmailValidatorPipe } from "./email-validator.pipe";

@Controller()
export class AuthenticationController {
    constructor(
        private authenticationService:AuthenticationService
    ){}

    @ApiQuery({
        name: 'email',
        required: true,
        type: String
    })
    @Get('auth')
    async otpRequest(
        @Query('email', EmailValidatorPipe) 
        email: string
    ){
        return {
            status: HttpStatus.OK,
            email,
            otpHash: this.authenticationService
            .createOtpHash(email)
        }
    }
}