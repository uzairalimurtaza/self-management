import nodemailer from 'nodemailer';
import { MAILING_SERVER_URL, SMTP_MAIL, SMTP_MAIL_PASS, SUPPORT_EMAIL } from '../../config/config';

export const resetPasswordMail = async (email: string, resetToken: string) => {
    try {
        const transporter = nodemailer.createTransport({
            service: SMTP_MAIL,
            auth: {
                user: SUPPORT_EMAIL,
                pass: SMTP_MAIL_PASS,
            },
        });

        const mailOptions = {
            to: email,
            from: process.env.EMAIL_USER,
            subject: 'Password Reset',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
            Please click on the following link, or paste this into your browser to complete the process:\n\n
            ${MAILING_SERVER_URL}/reset-password/${resetToken}\n\n
            If you did not request this, please ignore this email and your password will remain unchanged.\n`,
        };

        await transporter.sendMail(mailOptions);
    } catch (err) {
        console.log(err);
        return false;
    }
}
export const otpdMail = async (email: string, otpCode: string) => {
    try {
        const transporter = nodemailer.createTransport({
            service: SMTP_MAIL,
            auth: {
                user: SUPPORT_EMAIL,
                pass: SMTP_MAIL_PASS,
            },
        });

        const mailOptions = {
            to: email,
            from: process.env.EMAIL_USER,
            subject: 'Your One-Time Password (OTP)',
            text: `You are receiving this because you (or someone else) have requested an OTP for verification purposes.\n\n
                   Your One-Time Password is: ${otpCode}\n\n
                   Please enter this code on the verification page to proceed. The OTP is valid for only a few minutes.\n\n
                   If you did not request this, please ignore this email and no changes will be made.\n`,
        };        

        await transporter.sendMail(mailOptions);
    } catch (err) {
        console.log(err);
        return false;
    }
}