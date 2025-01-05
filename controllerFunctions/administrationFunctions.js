/**
 * @module controllerFunctions/AdministrationFunctions
 */
import AdministrationComplaint from "../models/AdministrationComplaint.js";
import appError from "../utils/appError.js";
import validator from "validator";
import { automateEmail } from "../utils/email_automator.js";
/**
 * Registers a new administration complaint.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const registerAdministrationComplaint = async (req, res, next) => {
	try {
		const {
			complainType,
			complainDescription,
			studentName,
			scholarNumber,
			department,
			stream,
			year
		} = req.body;

		const attachments = req.filePaths || [];
		const scholarNumber2 = req.sn;
		const useremail = req.em;

		if (scholarNumber2 !== scholarNumber) {
			return next(new appError("Invalid scholar number", 400));
		}
		if (!validator.isEmail(useremail)) {
			return next(new appError("Invalid email", 400));
		}
		if (scholarNumber2 !== scholarNumber) {
			return next(new appError("Invalid scholar number", 400));
		}

		if (
			!complainType ||
			!complainDescription ||
			!studentName ||
			!scholarNumber ||
			!department ||
			!useremail
		) {
			return next(new appError("Please enter all details!", 400));
		}

		const complaint = await AdministrationComplaint.create({
			complainType,
			complainDescription,
			attachments,
			scholarNumber,
			studentName,
			department,
			useremail,
			stream,
			year
		});

		res.status(201).json({
			success: true,
			message: "Complaint registered successfully!",
		});

		await automateEmail({ category: "Administration", complaint });
	} catch (error) {
		next(error);
	}
};

/**
 * Retrieves all administration complaints for a specific scholar number.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const getAdministrationComplaints = async (req, res, next) => {
	try {
		const scholarNumber = validator.escape(req.sn);

		if (!scholarNumber) {
			return next(new appError("Scholar number is required!", 400));
		}

		const complaints = await AdministrationComplaint.find({ scholarNumber });
		let attachments;
		const complaintsWithUrls = complaints.map((complaint) => ({
			...complaint._doc,
			attachments: complaint.attachments.map((filePath) => ({
				url: `${req.protocol}://${req.get("host")}/${filePath}`,
			})),
			AdminAttachments: complaint.AdminAttachments.map((filePath) => ({
				url: `${req.protocol}://${req.get("host")}/${filePath}`,
			})),
			category: "Administration",
		}));

		res.status(200).json({ complaints: complaintsWithUrls });
	} catch (error) {
		next(error);
	}
};

/**
 * Retrieves administration complaints for a specific scholar number within a date range.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const getAdministrationComplaintsByDate = async (req, res, next) => {
	try {
		const scholarNumber = validator.escape(req.sn);
		const { startDate, endDate } = req.query;

		if (!scholarNumber) {
			return next(new appError("Scholar number is required!", 400));
		}

		const dateFilter = {};
		if (startDate) {
			dateFilter.$gte = new Date(startDate);
		}
		if (endDate) {
			dateFilter.$lte = new Date(endDate);
		}

		const complaints = await AdministrationComplaint.find({
			scholarNumber,
			...(startDate || endDate ? { createdAt: dateFilter } : {}),
		});

		if (!complaints || complaints.length === 0) {
			return res.status(404).json({ message: "No complaints found." });
		}

		const complaintsWithUrls = complaints.map((complaint) => ({
			...complaint._doc,
			attachments: complaint.attachments.map((filePath) => ({
				url: `${req.protocol}://${req.get("host")}/${filePath}`,
			})),
			category: "Administration",
		}));

		res.status(200).json({ complaints: complaintsWithUrls });
	} catch (error) {
		next(error);
	}
};

/**
 * Updates an existing administration complaint.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const updateAdministrationComplaint = async (req, res, next) => {
	try {
		const { complainId, updates } = req.body;

		if (!updates) {
			return next(new appError("Please provide updates!", 400));
		}

		const { updateFields } = updates;

		if (!complainId) {
			return next(new appError("Complain ID is required!", 400));
		}

		const updatedComplaint = await AdministrationComplaint.findByIdAndUpdate(
			complainId,
			{ $set: updateFields },
			{ new: true }
		);

		if (!updatedComplaint) {
			return next(new appError("Complaint not found!", 404));
		}

		res.status(200).json({
			success: true,
			message: "Complaint updated successfully!",
			data: updatedComplaint,
		});
	} catch (error) {
		next(error);
	}
};

/**
 * Deletes an existing administration complaint.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const deleteAdministrationComplaint = async (req, res, next) => {
	try {
		const { complainId } = req.query;

		if (!complainId) {
			return next(new appError("Complain ID is required!", 400));
		}

		const deletedComplaint = await AdministrationComplaint.findByIdAndDelete(
			complainId
		);

		if (!deletedComplaint) {
			return next(new appError("Complaint not found!", 404));
		}

		res.status(200).json({
			success: true,
			message: "Complaint deleted successfully!",
		});
	} catch (error) {
		next(error);
	}
};

export {
	registerAdministrationComplaint,
	getAdministrationComplaints,
	updateAdministrationComplaint,
	deleteAdministrationComplaint,
	getAdministrationComplaintsByDate,
};
