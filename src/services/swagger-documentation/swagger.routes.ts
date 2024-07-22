import requestNewApiKey from "./docs/apiKey/clientApiKey.doc";
import authDoc from "./docs/auth/auth.doc";
import { requestPasswordReset, resetPassword } from "./docs/auth/authPasswordReset.doc";
import login from "./docs/auth/clientLogin.doc";
import { loginUser, registerNewUser, requestResetPassword, resetUserPassword, sendOTP, updatePassword, verifyOTP } from "./docs/userAuth/userAuth.doc";

export const paths = {
  "/api/user/signup": {
    post: registerNewUser
  },
  "/api/user/login": {
    post: loginUser
  },
  "/api/user/request-reset-pass": {
    post: requestResetPassword
  },
  "/api/user/reset-pass": {
    post: resetUserPassword
  },
  "/api/user/otp": {
    post: sendOTP
  },
  "/api/user/verify-otp": {
    post: verifyOTP
  },
  "/api/user/update-password": {
    post: updatePassword
  }
};
