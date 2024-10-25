import Complaints from "../models/complainModel.js";
import appError from "../utils/appError.js";
import validator from "validator";
import dotenv from "dotenv";
import ldap from "ldapjs";

dotenv.config();

const getProfileDetails = async (req, res, next) => {
	try {
		// Extract the scholar number set by the auth middleware
		const scholarNumber = validator.escape(req.sn);

		// Create LDAP client
		const client = ldap.createClient({
			url: process.env.LDAP_URL || "ldaps://localhost:389",
		});

		const bindDn = process.env.LDAP_BIND_DN || "cn=admin,dc=dev,dc=com";
		const bindPassword = process.env.LDAP_BIND_PASSWORD || "yoga";

		// Bind to the LDAP server
		client.bind(bindDn, bindPassword, (err) => {
			if (err) {
				console.error("LDAP bind failed!", err);
				return next(new appError("LDAP authentication failed!", 500));
			}

			const opts = {
				filter: `(uid=${scholarNumber})`,
				scope: "sub",
				attributes: [
					"cn",
					"mail",
					"uid",
					"roomNumber",
					"mobile",
					"departmentNumber",
				],
			};

			// Search for user data
			client.search(
				process.env.LDAP_BASE_DN || "dc=dev,dc=com",
				opts,
				(err, searchRes) => {
					if (err) {
						console.error("Search error:", err);
						client.unbind();
						return next(new appError("Error searching for user data!", 500));
					}

					let userData = null;

					// Handle search entries
					searchRes.on("searchEntry", (entry) => {
						userData = entry.object; // Capture the user data
						console.log("User data found:", userData);
					});

					// Handle search end
					searchRes.on("end", async (result) => {
						console.log("Search ended with result:", result.status);
						client.unbind();

						if (result.status !== 0 || !userData) {
							return next(new appError("User not found!", 404));
						}

						// Fetch complaints data
						const complaints = await Complaints.find({
							scholarNumber: sanitizedScholarNumber,
						});

						// Process complaints data
						const resolvedComplaints = complaints.filter(
							(complaint) => complaint.status === "resolved"
						).length;
						const unresolvedComplaints = complaints.filter(
							(complaint) => complaint.status !== "resolved"
						).length;

						// Send response
						res.status(200).json({
							success: true,
							data: {
								user: {
									...userData,
									complaintsRegistered: complaints.length,
									complaintsResolved: resolvedComplaints,
									complaintsUnresolved: unresolvedComplaints,
								},
							},
						});
					});

					// Handle search errors
					searchRes.on("error", (error) => {
						console.error("Search error:", error);
						client.unbind();
						return next(
							new appError("Error occurred during LDAP search!", 500)
						);
					});
				}
			);

			console.log("LDAP bind successful");
		});
	} catch (error) {
		console.error("Internal error:", error);
		return next(new appError("Internal server error!", 500));
	}
};

export { getProfileDetails };
