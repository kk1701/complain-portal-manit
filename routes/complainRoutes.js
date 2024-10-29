import { Router } from "express";
import { registerComplain } from "../controllers/complainControllers.js";
import { protect } from "../middleware/protect.js";
import { updateComplaints } from "../controllers/complainControllers.js";
import { getComplaints } from "../controllers/complainControllers.js";
import { deleteComplaints } from "../controllers/complainControllers.js";

const router = Router();
//Create
router.post("/register", protect, registerComplain);
//Read
router.get("/get-complaints", protect, getComplaints);
//Update
router.post("/update-complaints", protect, updateComplaints);
//Delete
router.delete("/delete-complaints", protect, deleteComplaints);

export default router;
