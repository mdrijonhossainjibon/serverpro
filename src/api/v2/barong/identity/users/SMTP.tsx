import nodemailer, { Transporter } from 'nodemailer';
import path from 'path';
import fs from 'fs';

interface SendEmail { 
    to : string;
    subject : string;
    code ?: string;
    link ?: any;
    text ? : string;
} 

export class SMTP_SERVICE {
  private transporter: Transporter;
  private htmlTemplate : string;
  private  templatePath : string

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "mail.mdrijonhossainjibonyt.xyz",
      port: 587,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: "noreply@mdrijonhossainjibonyt.xyz",
        pass: "noreply@mdrijonhossainjibonyt.xyz", 
      },
      tls: {
        rejectUnauthorized: false, // Disables certificate validation
      }
    });
     
    this.templatePath = ''//path.join(__dirname, 'emailTemplate.html');
    this.htmlTemplate = '' //fs.readFileSync(this.templatePath, 'utf8');
     
  } 

  public async sendVerificationEmail(props : SendEmail): Promise<void> {
   
    const htmlContent =  this.htmlTemplate.replace('{{verificationLink}}', props.link);

    const emailOptions = {
      from: 'noreply@mdrijonhossainjibonyt.xyz',
      html : htmlContent,
      ...props,
    };


    try {
      const info = await this.transporter.sendMail(emailOptions);
      return info
    } catch (error) {
     throw error
    }
  }

  public async InternalTransferCredit(props : SendEmail): Promise<void> {
    this.templatePath = path.join(__dirname, 'InternalTransferCredit.html');
     this.htmlTemplate = fs.readFileSync(this.templatePath, 'utf8');
    

    const emailOptions = {
      from: 'noreply@mdrijonhossainjibonyt.xyz',
      html : this.htmlTemplate,
      ...props,
    };


    try {
      const info = await this.transporter.sendMail(emailOptions);
      return info
    } catch (error) {
     throw error
    }
  }

  public async sendMaintenance(props : SendEmail): Promise<void> {
    this.templatePath = path.join(__dirname, 'maintenance.html');
     this.htmlTemplate = fs.readFileSync(this.templatePath, 'utf8');
    

    const emailOptions = {
      from: 'noreply@mdrijonhossainjibonyt.xyz',
      html : this.htmlTemplate,
      ...props,
    };


    try {
      const info = await this.transporter.sendMail(emailOptions);
      return info
    } catch (error) {
     throw error
    }
  }
}
 