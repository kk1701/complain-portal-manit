import appError from "../utils/appError.js";
import { generateToken } from "../utils/tokenUtils.js";
import dotenv from "dotenv";
import Ldap_authenticator from "../utils/Ldap_authenticator.js";

dotenv.config();

const authenticator = new Ldap_authenticator(
	process.env.LDAP_BASE_DN || "dc=dev,dc=com"
);

const authController = async (req, res, next) => {
	try {
		console.log("Request body:", req.body);
		const { username, password } = req.body;

		if (!username || !password) {
			return next(new appError("Username and password are required", 401));
		}

		// Authenticate the user using LDAP
		const status = await authenticator.authenticate(username, password);

		if (!status) {
			return next(new appError("Invalid scholar number or password", 401));
		} else {
			// Create the JWT token for the user
			const token = generateToken({ username });

			// Set the token as a secure, HTTP-only cookie
			res.cookie("jwt", token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
			});

			// Send response
			res.status(200).json({
				success: true,
				message: "User authenticated successfully",
				user: {
					email: "vynr1504@gmail.com",
					mobile: "7671050452",
					uid: "2211201152",
					name: "Velpucherla Yogananda Reddy",
					lastName: "Velpucherla",
					department: "Computer Science and Engineering",
					room: "H5-C062",
					hostel: "H5",
					role: "student",
					complaints: {
						registered: 0,
						resolved: 0,
						unresolved: 0
					}
				}
			});
		}
	} catch (err) {
		console.log(err);
		return next(new appError("Error in authenticating user", 500));
	}
};

export default authController;
