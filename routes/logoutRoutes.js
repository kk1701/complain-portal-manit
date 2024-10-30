import { Router } from "express";
import logoutController from "../controllers/logoutController";
import { protect } from "../middleware/protect";
const router = Router();

router.post("/",protect,logoutController);

export default router;