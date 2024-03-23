import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as otpGenerator from 'otp-generator';
import * as crypto from 'crypto';
import { MailSubjectEnum } from "src/transport/interfaces/mail-subject.enum";
import { MailService } from "src/transport/mail.service";
@Injectable()
export class AuthenticationService {
    
    constructor(
        private readonly configService: ConfigService,
        private readonly mailService: MailService
    ){}
    
    createOtpHash(email: string): string {
        let otp = otpGenerator.generate(5, { 
            alphabets: false, 
            upperCase: false, 
            specialChars: false 
        })
        this.sendEmail(email, otp)
        const key = this.configService.get('OTP_SECRET_KEY');
        const ttl = parseInt(this.configService.get('OTP_TTL'));
        const expires = Date.now() + ttl;
        const data = `${email}.${otp}.${expires}`;
        const hash = crypto.createHmac('sha256', key).update(data).digest('hex');
        return `${hash}.${expires}`;
    }
    sendEmail(email: string, otp: string) {
        this.mailService.sendMail(
            email,
            {
                otp
            },
            'One Time Password',
            MailSubjectEnum.OTP,
        )
    }

    async validateOtpCredentials(
        email: string, 
        otpHash: string, 
        otp: string
    ): Promise<void> {
        const otpKey = this.configService.get('OTP_SECRET_KEY');
        const [hashValue, expires] = otpHash.split(".");
        if(Date.now() > parseInt(expires)) throw new UnauthorizedException('expired')
        const enteredHash = crypto.createHmac('sha256', otpKey)
        .update(`${email}.${otp}.${expires}`)
        .digest('hex');
        if(hashValue != enteredHash) throw new UnauthorizedException('wrong credentials')
    }
}