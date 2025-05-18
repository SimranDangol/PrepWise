import nodemailer from 'nodemailer';
import dotenv from "dotenv"

dotenv.config()

export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587, // Use TLS port
  secure: false, // Use TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  requireTLS: true,
});

export const sendVerificationEmail = async (to: string, code: string): Promise<void> => {
  try {
    await transporter.sendMail({
      from: `"Prepwise - Verify your email" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Email Verification Code',
      html: `
        <p>Your verification code is: <strong>${code}</strong></p>
        <p>This code will expire in 10 minutes.</p>
      `,
    });
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send verification email');
  }
};


export const sendResetPasswordEmail = async (to: string, token: string): Promise<void> => {
  try {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await transporter.sendMail({
      from: `"Prepwise - Reset your password" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Password Reset Request',
      html: `
        <p>You requested to reset your password.</p>
        <p>Click the link below to reset it:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 10 minutes.</p>
      `,
    });
  } catch (error) {
    console.error('Reset email error:', error);
    throw new Error('Failed to send password reset email');
  }
};
