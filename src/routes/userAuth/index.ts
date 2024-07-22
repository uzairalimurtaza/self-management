import express, { Router } from "express";
import { UserController } from "../../controllers/users";
const router: Router = express.Router();


const userAuthController = new UserController()
router.post('/signup', userAuthController.registerNewUser);
router.post('/login', userAuthController.loginUser);
router.post('/request-reset-pass', userAuthController.requestResetPassword);
router.post('/reset-pass', userAuthController.resetUserPassword);
router.post('/otp', userAuthController.sendVerificationOTP);
router.post('/verify-otp', userAuthController.verifyOTP);
router.post('/update-password', userAuthController.saveNewPassword);

export default router;