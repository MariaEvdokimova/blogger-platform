import nodemailer from 'nodemailer';
import { appConfig } from '../../core/config/config';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export const nodemailerService = {
  async sendEmail(
    email: string,
    code: string,
    template: (code: string) => string
  ): Promise<boolean> {

    let transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options>;

/*    if (!appConfig.EMAIL || !appConfig.EMAIL_PASS) {
      const testAccount = await nodemailer.createTestAccount();

      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
     
    } else { */

      transporter = nodemailer.createTransport({
        host: "smtp.yandex.com",
        port: 465,
        secure: true,
        auth: {
          user: appConfig.EMAIL,
          pass: appConfig.EMAIL_PASS,
        },
      });
    //}

    let info = await transporter.sendMail({
      from: `"Blogger platform" <${appConfig.EMAIL}>`,
      to: email,
      subject: 'Your code is here',
      html: template(code),
    });

    //console.log('🔗 Preview URL: %s', nodemailer.getTestMessageUrl(info));

    return !!info;
  },
};
