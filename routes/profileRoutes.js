import { Router } from "express";
import { getProfileDetails } from "../controllers/profileController.js";
import { protect } from "../middleware/protect.js";
const router = Router();

router.get("/",protect,getProfileDetails);

export default router;