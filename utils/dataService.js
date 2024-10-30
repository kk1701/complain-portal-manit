import Complaints from "../models/complainModel.js";
import appError from "./appError.js";
import validator from "validator";
import dotenv from "dotenv";
import ldap from "ldapjs";

dotenv.config();

class dataService {
	constructor() {
		this.client = ldap.createClient({
			url: process.env.LDAP_URL || "ldaps://localhost:389",
		});
		this.bindDn = process.env.LDAP_BIND_DN || "cn=admin,dc=dev,dc=com";
		this.bindPassword = process.env.LDAP_BIND_PASSWORD || "yoga";
	}

	async getGenericDetails(username) {
		return new Promise((resolve, reject) => {
			const scholarNumber = validator.escape(username);

			this.client.bind(this.bindDn, this.bindPassword, (err) => {
				if (err) {
					console.error("LDAP bind failed!", err);
					return reject(new appError("LDAP authentication failed!", 500));
				}

				console.log(
					"Initiated searching for the scholar number:",
					scholarNumber
				);

				const opts = {
					filter: `(uid=${scholarNumber})`,
					scope: "sub",
					attributes: [
						"cn",
						"sn",
						"uid",
						"mail",
						"mobile",
						"roomNumber",
						"departmentNumber",
					],
				};

				this.client.search(
					"ou=Students,dc=dev,dc=com",
					opts,
					(err, searchRes) => {
						if (err) {
							console.error("Search error:", err);
							this.client.unbind();
							return reject(
								new appError("Error searching for user data!", 500)
							);
						}

						let userData = null;

						searchRes.on("searchEntry", (entry) => {
							userData = entry.pojo.attributes;
							console.log("User data found:", userData);
						});

						searchRes.on("end", (result) => {
							this.client.unbind();

							if (result.status !== 0 || !userData) {
								return reject(new appError("User not found!", 404));
							}

							resolve(userData);
						});

						searchRes.on("error", (error) => {
							console.error("Search error:", error);
							this.client.unbind();
							reject(new appError("Error occurred during LDAP search!", 500));
						});
					}
				);

				console.log("LDAP bind successful");
			});
		});
	}

	async getComplaintDetails(scholarNumber) {
		try {
			const complaints = await Complaints.find({
				scholarNumber: scholarNumber,
			});

			const resolvedComplaints = complaints.filter(
				(complaint) => complaint.status === "resolved"
			).length;
			const unresolvedComplaints = complaints.filter(
				(complaint) => complaint.status !== "resolved"
			).length;

			return {
				complaintsRegistered: complaints.length,
				complaintsResolved: resolvedComplaints,
				complaintsUnresolved: unresolvedComplaints,
			};
		} catch (error) {
			console.error("Error fetching complaints:", error);
			throw new appError("Error fetching complaints data!", 500);
		}
	}

	async getUserProfileDetails(username) {
		try {
			const scholarNumber = validator.escape(username);
			const userData = await this.getGenericDetails(scholarNumber);
			const complaintDetails = await this.getComplaintDetails(scholarNumber);

			return {
				user: {
					...userData,
					...complaintDetails,
				},
			};
		} catch (error) {
			throw error;
		}
	}
}

export default dataService;
