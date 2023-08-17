import * as nodemailer from "nodemailer";
import { Request, Response } from "express";
import { MailOptions } from "nodemailer/lib/json-transport";

export class Emailer {
  private readonly transporter: nodemailer.Transporter;

  constructor() {
    const options = {
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_ACCOUNT,
        pass: process.env.EMAIL_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    };
    this.transporter = nodemailer.createTransport(options);
  }

  public async sendEmail(req: Request, res: Response) {
    const mailOptions: MailOptions = {
      from: `${process.env.EMAIL_NAME} <${process.env.EMAIL_ACCOUNT}>`,
      to: req.body.email.to,
      subject: req.body.email.subject,
      text: req.body.email.text,
    };
    
    const mail_response = await this.transporter.sendMail(mailOptions)
    
    return res.status(200).json({
      code: 200,
      message: "Success",
      mail_options: mailOptions,
      mail_response
    });
  }
}