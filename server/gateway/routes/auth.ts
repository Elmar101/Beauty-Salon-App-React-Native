import { Router} from "express";
import { forgotPasswordController, loginController, logoutController, refreshTokenController, registerController, resetPasswordController, verifyForgotPasswordController, verifyTokenController } from "../controllers/authController";

const router = Router();

router.post('/register', registerController);
router.post("/verify", verifyTokenController);
router.post('/login', loginController);
router.post("/refresh-token", refreshTokenController);
router.post('/logout', logoutController);
router.post('/forgot-password', forgotPasswordController);
router.post('/verify-forgot-password', verifyForgotPasswordController);
router.post('/reset-password', resetPasswordController);

export default router;
