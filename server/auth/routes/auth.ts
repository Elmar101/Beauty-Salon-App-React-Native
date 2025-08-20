import { Router } from "express";
import { upload } from "../utils/uploadFile";
import {
  forgotPasswordController,
  loginController,
  logoutController,
  refreshTokenController,
  registerContoller,
  resetPasswordController,
  verifyController,
  verifyForgotPasswordController,
} from "../controllers/authController";

const router = Router();

router.post("/register", upload.single("photo"), registerContoller);
router.post("/verify", verifyController);
router.post("/login", loginController);
router.post("/refresh-token", refreshTokenController);
router.post("/logout", logoutController);
router.post("/forgot-password", forgotPasswordController);
router.post("/verify-forgot-password", verifyForgotPasswordController);
router.post("/reset-password", resetPasswordController);

export default router;
