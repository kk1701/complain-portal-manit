import Complaints from "../models/complainModel.js";
import appError from "../utils/appError.js";
import dotenv from "dotenv";
import validator from "validator";

// Environment variables
dotenv.config();

export const registerComplain = async (req, res, next) => {
	try {
		const {
			complainType,
			complainDescription,
			hostelNumber,
			studentName,
			scholarNumber,
			room,
		} = req.body;

		// Store file paths instead of filenames
		const attachments = req.filePaths || [];  // req.filePaths is set by the handleFileUpload middleware

		
		console.log("Request body:", req.body);

		// Validate required fields
		if (
			!complainType ||
			!complainDescription ||
			!hostelNumber ||
			!studentName ||
			!scholarNumber
		) {
			return next(new appError("Please enter all details!", 400));
		}

		// Create the complaint
		const complain = await Complaints.create({
			complainType,
			complainDescription,
			attachments, // Store the paths of the uploaded files
			scholarNumber,
			hostelNumber,
			studentName,
			room,
		});

		// Check if complaint was created successfully
		if (!complain) {
			return next(
				new appError("Complaint registration failed, please try again!", 400)
			);
		}

		// Respond to the client
		res.status(201).json({
			success: true,
			message: "Complaint registered successfully!",
		});
	} catch (error) {
		// Log the error for debugging
		console.error("Error during complaint registration:", error);

		// Pass error to the error handling middleware
		next(new appError("Internal server error!", 500));
	}
};


export const getComplaints = async (req, res, next) => {
    try {
        const scholarNumber = validator.escape(req.query.sn); 

        // Validate that scholarNumber is provided and is of expected format
        if (!scholarNumber) {
            return next(new appError("Scholar number is required!", 400));
        }

        // Query for complaints based on scholar number
        const complaints = await Complaints.find({ scholarNumber });

        if (!complaints || complaints.length === 0) {
            return res.status(404).json({ message: "No complaints found." });
        }

        // Generate full URLs for file attachments
        const complaintsWithUrls = complaints.map(complaint => {
            return {
                ...complaint._doc,
                attachments: complaint.attachments.map(filePath => ({
                    url: `${req.protocol}://${req.get('host')}/${filePath}` 
                }))
            };
        });

        
        return res.status(200).json({ complaints: complaintsWithUrls });
    } catch (error) {
        console.error("Error fetching complaints:", error);
        next(new appError("Internal server error!", 500));
    }
};

export const updateComplaints = async (req, res, next) => {
	try {
		const { updates } = req.body;

		if (!Array.isArray(updates) || updates.length === 0) {
			return next(new appError("Zero Updates", 400));
		}

		const bulkUpdatePromises = updates.map((update) => {
			const { complainId, ...updateFields } = update;

			if (!complainId) {
				return Promise.reject(
					new appError("Complain ID is required for each update!", 400)
				);
			}

			return Complaints.findByIdAndUpdate(
				complainId,
				{ $set: updateFields },
				{ new: true }
			);
		});

		const updatedComplaints = await Promise.all(bulkUpdatePromises);

		res.status(200).json({
			success: true,
			message: "Complaints updated successfully!",
			data: updatedComplaints,
		});
	} catch (err) {
		next(new appError("Internal server error!", 500));
	}
};

export const deleteComplaints = async (req, res, next) => {
	try {
		const { complainId } = req.query;
		console.log("Complaint ID:", complainId);
		if (!complainId) {
			return next(new appError("Complain ID is required!", 400));
		}

		const deletedComplaint = await Complaints.findByIdAndDelete(complainId);

		if (!deletedComplaint) {
			return next(new appError("Complaint not found!", 404));
		}

		res.status(200).json({
			success: true,
			message: "Complaint deleted successfully!",
		});
	} catch (error) {
		next(new appError("Internal server error!", 500));
	}
};
