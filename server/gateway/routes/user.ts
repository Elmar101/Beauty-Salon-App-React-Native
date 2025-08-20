import { Router} from "express";
import { deleteAllUsersController, deleteUserController, getUserController, getUsersController, updateUserController } from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.use(authMiddleware)
router.get('/', getUsersController);
router.get('/:id', getUserController);
router.put("/:id",  updateUserController);
router.put("/:id/delete", deleteUserController);
router.delete("/", deleteAllUsersController);


export default router;