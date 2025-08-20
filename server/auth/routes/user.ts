import { Router } from "express";
import { deleteAllUsers, deleteUserById, getAllUsers, getUserById, updateUser } from "../controllers/userController";
import { upload } from "../utils/uploadFile";

export const router = Router();

router.get("/:id", getUserById);
router.get("/", getAllUsers);
router.put("/:id", upload.single("photo"), updateUser);
router.delete("/:id", deleteUserById);
router.delete("/", deleteAllUsers);

export default router;