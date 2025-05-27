import nodemailer from 'nodemailer';
import { appConfig } from '../../core/config/config';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

const MAIL_FROM = `"Blogger platform" <${appConfig.EMAIL}>`;

export const nodemailerService = {
  async sendEmail(
    email: string,
    code: string,
    template: (code: string) => string
  ) {

    let transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options>;

    transporter = nodemailer.createTransport({
        host: appConfig.EMAIL_HOST,
        port: appConfig.EMAIL_PORT,
        secure: true,
        auth: {
          user: appConfig.EMAIL,
          pass: appConfig.EMAIL_PASS,
        },
      });

    await transporter.sendMail({
      from: MAIL_FROM,
      to: email,
      subject: 'Your code is here',
      html: template(code),
    });

  },
};
