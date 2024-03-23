import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import Strategy from 'passport-headerapikey';

@Injectable()
export class apiKeyStrategy extends PassportStrategy(Strategy, 'api-key') {
    constructor(
        private configService: ConfigService
    ) {
        super({ header: 'api-key', prefix: '' },
        true,
        async (apiKey, done, req) => {
            return this.validate(apiKey, done, req);
        });
    }

    public validate = async (apiKey: string, done: (error: Error, data) => {},req) => {
        if (apiKey === this.configService.get('MERCHANT-APIKEY'))
            done(null, 'MERCHANT');
        else
            done(new UnauthorizedException(), null);
    }
}