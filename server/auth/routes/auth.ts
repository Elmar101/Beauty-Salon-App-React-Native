import {  Router } from "express";
import { upload } from "../utils/uploadFile";
import { registerContoller, verifyController } from "../controllers/authController";

const router = Router();

router.post('/register', upload.single('photo'), registerContoller);
router.post('/verify', verifyController)

export default router;