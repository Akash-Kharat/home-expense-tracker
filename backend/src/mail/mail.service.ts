import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;
  private isConfigured = false;

  constructor(private configService: ConfigService) {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
      this.isConfigured = true;
      this.logger.log(`Mail transport configured: ${host}:${port}`);
    } else {
      this.logger.warn(
        'SMTP not configured (missing SMTP_HOST/SMTP_USER/SMTP_PASS). Emails will be logged to console instead.',
      );
    }
  }

  async sendInvitationEmail(
    to: string,
    inviterName: string,
    familyName: string,
    token: string,
  ): Promise<boolean> {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const acceptUrl = `${frontendUrl}/register?invite=${token}`;

    const subject = `${inviterName} invited you to join "${familyName}" on HomeExpense`;

    const html = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f0f23; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 32px 24px; text-align: center;">
          <h1 style="margin: 0; color: white; font-size: 24px; font-weight: 700;">🏠 HomeExpense</h1>
          <p style="margin: 8px 0 0; color: rgba(255,255,255,0.85); font-size: 14px;">Family Financial Management</p>
        </div>

        <!-- Body -->
        <div style="padding: 32px 24px;">
          <h2 style="color: #e2e8f0; font-size: 20px; margin: 0 0 16px;">You're invited!</h2>
          <p style="color: #94a3b8; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
            <strong style="color: #c7d2fe;">${inviterName}</strong> has invited you to join the family
            <strong style="color: #c7d2fe;">"${familyName}"</strong> on HomeExpense — a collaborative
            household expense tracker.
          </p>

          <!-- CTA Button -->
          <div style="text-align: center; margin: 32px 0;">
            <a href="${acceptUrl}" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 14px 36px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 16px;">
              Accept Invitation
            </a>
          </div>

          <!-- Token fallback -->
          <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px; margin: 24px 0;">
            <p style="color: #94a3b8; font-size: 13px; margin: 0 0 8px;">Or use this invite token during registration:</p>
            <p style="color: #a5b4fc; font-size: 14px; font-family: monospace; word-break: break-all; margin: 0; background: rgba(99,102,241,0.1); padding: 8px 12px; border-radius: 8px;">
              ${token}
            </p>
          </div>

          <p style="color: #64748b; font-size: 13px; margin: 24px 0 0;">
            ⏰ This invitation expires in <strong style="color: #94a3b8;">7 days</strong>.
          </p>
        </div>

        <!-- Footer -->
        <div style="padding: 20px 24px; border-top: 1px solid rgba(255,255,255,0.05); text-align: center;">
          <p style="color: #475569; font-size: 12px; margin: 0;">
            If you didn't expect this invitation, you can safely ignore this email.
          </p>
        </div>
      </div>
    `;

    const text = `
${inviterName} invited you to join "${familyName}" on HomeExpense!

Accept here: ${acceptUrl}

Or use this invite token during registration: ${token}

This invitation expires in 7 days.
    `.trim();

    if (!this.isConfigured) {
      this.logger.log('──────────────────────────────────────────');
      this.logger.log(`📧 INVITATION EMAIL (console mode)`);
      this.logger.log(`   To:      ${to}`);
      this.logger.log(`   Subject: ${subject}`);
      this.logger.log(`   Token:   ${token}`);
      this.logger.log(`   Link:    ${acceptUrl}`);
      this.logger.log('──────────────────────────────────────────');
      return true;
    }

    try {
      const info = await this.transporter.sendMail({
        from: process.env.SMTP_FROM || `"HomeExpense" <${process.env.SMTP_USER}>`,
        to,
        subject,
        text,
        html,
      });

      this.logger.log(`Email sent to ${to}: ${info.messageId}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}:`, error);
      return false;
    }
  }
}
