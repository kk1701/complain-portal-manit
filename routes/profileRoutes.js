import { Router } from "express";
import { getProfileDetails } from "../controllers/profileController.js";
const router = Router();

router.get("/",protect,getProfileDetails);// Should be protect 