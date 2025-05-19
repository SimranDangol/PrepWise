import { Router } from "express";
import {
  forgotPassword,
  getCurrentUser,
  login,
  logout,
  refreshAccessToken,
  register,
  resendVerificationCode,
  resetPassword,
  verifyEmail,
} from "../controllers/auth.controller";
import { upload } from "../middlewares/multer.middleware";
import { authenticateUser } from "../middlewares/auth.middleware";

const router = Router();

router.post(
  "/register",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  register
);
router.route("/verify-email").post(verifyEmail);
router.route("/resend-verification").post(resendVerificationCode);
router.route("/login").post(login);
router.route("/refresh").post(refreshAccessToken);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);
router.route("/current-user").get(authenticateUser, getCurrentUser);
router.route("/logout").post(authenticateUser, logout);

export default router;
