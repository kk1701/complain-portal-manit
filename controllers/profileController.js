import appError from "../utils/appError.js";
import { generateToken } from "../utils/tokenUtils.js";
import dotenv from "dotenv";
import Ldap_authenticator from "../utils/Ldap_authenticator.js";

dotenv.config();

const authenticator = new Ldap_authenticator(
	process.env.LDAP_BASE_DN || "dc=dev,dc=com"
);

/**
 * Get profile details of a user.
 * @file ./controllers/profileController.js
 * @module controllers/profileController
 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const getProfileDetails = async (req, res, next) => {
	
		try {
			// Extract the scholar number set by the auth middleware
			const scholarNumber = validator.escape(req.sn);
			const complaintStats = await dataServiceInstance.getComplaintDetails(
				scholarNumber
			);
			console.log(complaintStats);
			if (!complaintStats) {
				return next(new appError("User not found!", 404));
			}
			
			res.status(200).json({
				success: true,
				...complaintStats,
			});
		} catch (error) {
			console.error("Internal error:", error);
			return next(new appError("Internal server error!", 500));
		}

};

export default authController;
