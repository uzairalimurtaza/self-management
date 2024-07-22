import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { userService } from "./user.service";
import { IUserDocument } from "../../interfaces/IUser";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../../config/config";
import { otpdMail, resetPasswordMail } from "../../services/mail";
import { generateOTP } from "../../utils/generateOtp";

export class UserController {
    private userServiceManager;
    constructor() {
        this.userServiceManager = new userService();
    }
    public registerNewUser = async (req: Request, res: Response) => {
        try {
            const { username, password, user_email } = req.body;
            if (!username || !password || !user_email) {
                return res.status(403).json({ status: false, message: 'Missing email, username or password' });
            }

            if (await this.userServiceManager.findUserByUsername(username)) {
                return res.status(403).json({ status: false, message: 'Username already exists' });
            }

            if (await this.userServiceManager.findUserByEmail(user_email)) {
                return res.status(403).json({ status: false, message: 'Email already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const userDoc: Partial<IUserDocument> = {
                username,
                password: hashedPassword,
                user_email
            }
            const newUser = await this.userServiceManager.saveUserRecord(userDoc);
            if (!newUser) {
                return res.status(403).json({ status: false, message: 'User registration failed' });
            }
            const token = jwt.sign({ client_id: newUser._id }, JWT_SECRET, {
                expiresIn: JWT_EXPIRES_IN,
            });

            res.status(200).json({
                status: true,
                token,
                message: 'User registered successfully',
            });
        } catch (err: Error | any) {
            res.status(400).json({ status: false, message: err.message });
        }
    }
    public loginUser = async (req: Request, res: Response) => {
        try {
            const { username, password } = req.body;
            if (!username || !password)
                return res.status(403).json({ status: false, message: 'Missing username or password' });

            const user = await this.userServiceManager.findUserByUsername(username);
            if (!user)
                return res.status(403).json({ status: false, message: 'Invalid username or password' });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch)
                return res.status(403).json({ status: false, message: 'Invalid username or password' });

            const token = jwt.sign({ client_id: user._id }, JWT_SECRET, {
                expiresIn: JWT_EXPIRES_IN
            });
            res.status(200).json({
                status: true,
                token,
                message: 'Logged in successfully',
            });
        } catch (err: Error | any) {
            res.status(400).json({ status: false, message: err.message });
        }
    }
    public requestResetPassword = async (req: Request, res: Response) => {
        try {
            const { username, user_email } = req.body;
            let property_value = username ? username : user_email
            if (!property_value) {
                return res.status(403).json({ status: false, message: 'Missing username or email' });
            }
            let property_name = username ? 'username' : 'user_email';
            const user = await this.userServiceManager.dynamicUserSearch(property_name, property_value);
            if (!user) {
                return res.status(403).json({ status: false, message: 'Invalid username or email' });
            }

            const resetToken = crypto.randomBytes(32).toString('hex');
            const resetTokenExpiry = Date.now() + 3600000; // 1 hour

            user.reset_password_token = resetToken;
            user.reset_password_expires = new Date(resetTokenExpiry);
            await user.save();

            await resetPasswordMail(user.user_email, resetToken)

            res.status(200).json({
                status: true,
                message: 'Recovery email sent.'
            });
        } catch (err: Error | any) {
            res.status(400).json({ status: false, message: err.message });
        }
    }
    public resetUserPassword = async (req: Request, res: Response) => {
        try {

            const { token, newPassword } = req.body;
            if (!token || !newPassword) {
                return res.status(403).json({ status: false, message: 'Missing token or new password' });
            }

            const user = await this.userServiceManager.dynamicUserSearch('reset_password_token', token);
            console.log(user);
            if (!user) {
                return res.status(403).json({ status: false, message: 'Invalid token' });
            }

            if (user && user.reset_password_expires && user.reset_password_expires < new Date) {
                return res.status(403).json({ status: false, message: 'Token expired' });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            user.reset_password_token = undefined;
            user.reset_password_expires = undefined;
            await user.save();

            res.status(200).json({
                status: true,
                message: 'Password updated successfully'
            });
        } catch (err: Error | any) {
            res.status(400).json({ status: false, message: err.message });
        }
    }
    public saveUserWalletAddress = async (req: Request, res: Response) => {
        try {
            const { user_wallet_address } = req.body;
            if (!user_wallet_address) {
                return res.status(403).json({ status: false, message: 'Missing user wallet address' });
            }
            if (await this.userServiceManager.findUserByWalletAddress(user_wallet_address)) {
                return res.status(400).json({ status: false, message: 'User already exists with this wallet address' });
            }
            const apiClientPayload: Partial<IUserDocument> = {
                user_wallet_address,
            };
            await this.userServiceManager.saveNewUserWallet(apiClientPayload);
            res.status(200).json({
                status: true,
                message: 'User wallet address saved',
            });
        } catch (err: Error | any) {
            res.status(400).json({ status: false, message: err.message });
        }
    }
    public sendVerificationOTP = async (req: Request, res: Response) => {
        try {
            const { user_email } = req.body;
            if (!user_email) {
                return res.status(403).json({ status: false, message: 'Missing email address' });
            }
            const user = await this.userServiceManager.dynamicUserSearch('user_email', user_email);
            if (!user) {
                return res.status(403).json({ status: false, message: 'Invalid email address' });
            }
            const otp = await generateOTP();
            await otpdMail(user.user_email, otp);
            await this.userServiceManager.saveOTP(user.id, otp);
            res.status(200).json({
                status: true,
                message: 'OTP Sent successfully'
            });   

        } catch (err: Error | any) {
            console.log(err);
            res.status(400).json({ status: false, message: err.message });
        }
    }
    public verifyOTP = async (req: Request, res: Response) => {
        try {
            const { user_email, otp } = req.body;
            console.log(req.body)
            if (!user_email) {
                return res.status(403).json({ status: false, message: 'Missing email address' });
            }
            const user = await this.userServiceManager.dynamicUserSearch('user_email', user_email);
            if (!user) {
                return res.status(403).json({ status: false, message: 'Invalid email address' });
            }
            const matched = await this.userServiceManager.verifyOTP(user.id, otp);
            if(matched){
                return res.status(200).json({
                    status: true,
                    message: 'OTP verified successfully'
                });
            }
            res.status(200).json({
                status: false,
                message: 'Invalid OTP'
            });   

        } catch (err: Error | any) {
            console.log(err);
            res.status(400).json({ status: false, message: err.message });
        }
    }
    public saveNewPassword = async (req: Request, res: Response) => {
        try {
            const { user_email, password } = req.body;
            if (!user_email) {
                return res.status(403).json({ status: false, message: 'Missing email address' });
            }
            const user = await this.userServiceManager.dynamicUserSearch('user_email', user_email);
            if (!user) {
                return res.status(403).json({ status: false, message: 'Invalid email address' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const matched = await this.userServiceManager.saveUserPassword(user.id, hashedPassword);
            if(matched){
                return res.status(200).json({
                    status: true,
                    message: 'Password changed successfully'
                });
            }
            res.status(200).json({
                status: false,
                message: 'Error while updating password'
            });   

        } catch (err: Error | any) {
            console.log(err);
            res.status(400).json({ status: false, message: err.message });
        }
    }
}