import { Request, Response } from "express";
import { NodeMailgun } from "ts-mailgun";

export class Emailer {
  private readonly transporter: NodeMailgun;

  constructor() {
    this.transporter = new NodeMailgun(
      `${process.env.MAILGUN_API_KEY}`,
      `${process.env.MAILGUN_DOMAIN}`
    );
    this.transporter.fromEmail = `${process.env.MAILGUN_EMAIL_ACCOUNT}`
    this.transporter.fromTitle = `${process.env.MAILGUN_EMAIL_NAME}`
    this.transporter.init();
  }

  public sendEmail(req: Request, res: Response) {
    this.transporter.send(
      req.body.email.to,
      req.body.email.subject,
      req.body.email.text,
    ).then((data) => {
      return res.status(200).json({
        code: 200,
        message: "Success",
        data
      })
    }).catch((error) => {
      console.log(error);
      return res.status(500).json({
        code: error.statusCode,
        message: "Failed",
        error,
      })
    });
  }
}