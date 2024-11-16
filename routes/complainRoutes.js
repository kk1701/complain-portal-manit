import { Router } from "express";
import {
	registerComplain,
	updateComplaints,
	getComplaints,
	deleteComplaints,
} from "../controllers/complainControllers.js";
import { protect } from "../middleware/protect.js";
import handleFileUpload from "../middleware/uploadFile.js";
import csurf from "csurf";

const csrfProtection = csurf({ cookie: true });
const router = Router();

// Apply the csrf protection middleware globally
router.use(csrfProtection);

// Generate the csrf token and send it to the client
router.get("/register", protect, (req, res) => {
	
	res.json({ csrfToken: req.csrfToken() }).status(200);
});

// Apply the csrf protection only to the routes which perform the state modification

// Create
router.post("/register", protect, csrfProtection,handleFileUpload, registerComplain);
// Read
router.get("/get-complaints", protect, getComplaints);
// Update
router.post("/update-complaints", protect, updateComplaints);
// Delete
router.delete("/delete-complaints", protect, deleteComplaints);

export default router;
