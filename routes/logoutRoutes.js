import { Router } from "express";
import logoutController from "../controllers/logoutController.js";
import { protect } from "../middleware/protect.js";
const router = Router();

router.post("/",protect,logoutController);

export default router;