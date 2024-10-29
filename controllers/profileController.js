import Complaints from "../models/complainModel.js";
import appError from "../utils/appError.js";
import dataService from "../utils/dataService.js";
import validator from "validator";
import dotenv from "dotenv";
dotenv.config();

const dataServiceInstance = new dataService();

const getProfileDetails = async (req, res, next) => {
	try {
		// Extract the scholar number set by the auth middleware
		const scholarNumber = validator.escape(req.sn);
		const ProfileDetails = await dataServiceInstance.getUserProfileDetails(scholarNumber);
        if (!ProfileDetails) {
            return next(new appError("User not found!", 404));
        }
        res.status(200).json({
            success: true,
            message: "User details fetched successfully",
            data: ProfileDetails,
        });
		
	} catch (error) {
		console.error("Internal error:", error);
		return next(new appError("Internal server error!", 500));
	}
};

export { getProfileDetails };
