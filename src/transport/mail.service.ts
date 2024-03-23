import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import {  ConfigService } from '@nestjs/config';
import { MailSubjectEnum } from "./interfaces/mail-subject.enum";

const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const Email = require('email-templates');
const ejs = require('ejs')
@Injectable()
export class MailService {
  constructor(
    private configService: ConfigService
  ) {}
  logger  = new Logger('MailService');
  OAuth2 = google.auth.OAuth2;
  createTransporter = async () => {
      const oauth2Client = new this.OAuth2(
        this.configService.get('MAIL_CLIENT_ID'),
        this.configService.get('MAIL_CLIENT_SECRET'),
        "https://developers.google.com/oauthplayground"
      );
    
      await oauth2Client.setCredentials({
        refresh_token: this.configService.get('MAIL_REFRESH_TOKEN'),
      });

      const accessToken = await new Promise((resolve, reject) => {
        oauth2Client.getAccessToken((err, token) => {
          if (err) {
            reject(`Failed to create access token :( , ${err}`);
          }
          resolve(token);
        });
      });
    
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: this.configService.get('MAIL_SERVER_ID'),
          accessToken,
          clientId: this.configService.get('MAIL_CLIENT_ID'),
          clientSecret: this.configService.get('MAIL_CLIENT_SECRET'),
          refreshToken: this.configService.get('MAIL_REFRESH_TOKEN'),
        }
      });
    
      return transporter;
  };
  

  async sendMail(
    mailAddress: string,
    data,
    subject: string,
    mailSubject: MailSubjectEnum
  ){ 
    try{

      var tmp = await ejs.renderFile(`./emails/${mailSubject}.ejs`,data);
      let emailTransporter = await this.createTransporter();
      const messageOptions = {
        subject,
        to: mailAddress,
        // cc:this.configService.get('MAIL_CC') ,
        // bcc:this.configService.get('MAIL_BCC'),
        from: this.configService.get('MAIL_SERVER_ID'),
        html: tmp
      };
      const email = new Email({
        message: messageOptions,
        transport: emailTransporter,
        send:true
      })
      email.send({
        message: messageOptions,
        locals: data
      })
      .then(
        console.log(`EmailSent|${mailSubject}|${mailAddress}`)
      )
      .catch((e) => {
        console.error(e)
        console.log(`EmailFailed|${mailSubject}|${mailAddress}`)
      });      
    }catch(e){
      this.logger.error(e);
    } 
  }
}