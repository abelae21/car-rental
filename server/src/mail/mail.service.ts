import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get<string>('mail.host'),
      port: this.config.get<number>('mail.port'),
      secure: false,
      auth: {
        user: this.config.get<string>('mail.user'),
        pass: this.config.get<string>('mail.pass'),
      },
    });
  }

  private async send(to: string, subject: string, html: string) {
    try {
      await this.transporter.sendMail({
        from: this.config.get<string>('mail.from'),
        to,
        subject,
        html,
      });
    } catch (err) {
      // Email failures should never crash a request flow (e.g. registration);
      // log and move on so the caller's business logic still completes.
      this.logger.error(`Failed to send email to ${to}: ${(err as Error).message}`);
    }
  }

  async sendVerificationEmail(to: string, firstName: string, verifyUrl: string) {
    await this.send(
      to,
      'Verify your email — Car Rental',
      `<div style="font-family:sans-serif;max-width:480px;margin:auto">
        <h2>Welcome, ${firstName} 👋</h2>
        <p>Please confirm your email address to activate your account.</p>
        <p><a href="${verifyUrl}" style="background:#111827;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;display:inline-block">Verify Email</a></p>
        <p>If you didn't create this account, you can ignore this email.</p>
      </div>`,
    );
  }

  async sendPasswordResetEmail(to: string, firstName: string, resetUrl: string) {
    await this.send(
      to,
      'Reset your password — Car Rental',
      `<div style="font-family:sans-serif;max-width:480px;margin:auto">
        <h2>Hi ${firstName},</h2>
        <p>We received a request to reset your password. This link expires in 1 hour.</p>
        <p><a href="${resetUrl}" style="background:#111827;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;display:inline-block">Reset Password</a></p>
        <p>If you didn't request this, you can safely ignore this email.</p>
      </div>`,
    );
  }

  async sendBookingConfirmationEmail(to: string, firstName: string, bookingRef: string) {
    await this.send(
      to,
      `Booking Confirmed — ${bookingRef}`,
      `<div style="font-family:sans-serif;max-width:480px;margin:auto">
        <h2>You're all set, ${firstName}!</h2>
        <p>Your booking <strong>${bookingRef}</strong> is confirmed. We'll see you at pickup.</p>
      </div>`,
    );
  }

  async sendBookingCancellationEmail(to: string, firstName: string, bookingRef: string) {
    await this.send(
      to,
      `Booking Cancelled — ${bookingRef}`,
      `<div style="font-family:sans-serif;max-width:480px;margin:auto">
        <h2>Hi ${firstName},</h2>
        <p>Your booking <strong>${bookingRef}</strong> has been cancelled.</p>
      </div>`,
    );
  }

  async sendPaymentConfirmationEmail(to: string, firstName: string, invoiceNumber: string, amount: string) {
    await this.send(
      to,
      `Payment Received — ${invoiceNumber}`,
      `<div style="font-family:sans-serif;max-width:480px;margin:auto">
        <h2>Thanks, ${firstName}!</h2>
        <p>We've received your payment of <strong>${amount}</strong>. Invoice: ${invoiceNumber}.</p>
      </div>`,
    );
  }
}
