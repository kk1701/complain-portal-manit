import { feedbackController } from "../controllers/feedbackController.js";
import handleFileUpload from "../middleware/uploadFile.js";
import { Router } from "express";
const router = Router();

router.post("/",handleFileUpload,feedbackController);

export default router;