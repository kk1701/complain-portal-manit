import Complaints from "../models/complainModel.js";
import appError from "../utils/appError.js";
import dotenv from "dotenv";
import validator from "validator";
dotenv.config();

export const registerComplain = async (req, res,next) => {
    try {
        const { complainType, complainDescription, attachments, hostelNumber, studentName, scholarNumber, room } = req.body;
        console.log("Request body:", req.body);
        
        if (
            complainType == null ||
            complainDescription == null ||
            attachments == null ||
            hostelNumber == null ||
            studentName == null ||
            scholarNumber == null
        ) {
            return next(new appError("Please enter all details!", 400));
        }

        const complain = await Complaints.create({
            complainType,
            complainDescription,
            attachments,
            scholarNumber,
            hostelNumber,
            studentName,
            room
        });

        if (!complain) {
            return next(
                new appError("Complaint registration failed, please try again!", 400)
            );
        }

        await complain.save();

        res.status(200).json({
            success: true,
            message: "Complain registered successfully!",
        });
    } catch (error) {
        next(new appError("Internal server error!", 500));
    }
};

export const getComplaints = async (req,res,next) => {
     try{
         const scholarNumber = validator.escape(req.sn);
         const complaints = await Complaints.find({scholarNumber});
         return res.status(200).json({complaints});
     }catch(error){
        console.error("Internal error:", error);
        next(new appError("Internal server error!", 500));
     }
} 


//It receives the array of modified compliants data along with their compliant datas and we perform the bulk update
export const updateComplaints = async (req, res, next) => {
    try {
        const { updates } = req.body;

        if (!Array.isArray(updates) || updates.length === 0) {
            return next(new appError("Zero Updates", 400));
        }

        const bulkUpdatePromises = updates.map(update => {
            const { complainId, ...updateFields } = update;

            if (!complainId) {
                throw new appError("Complain ID is required for each update!", 400);
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
            data: updatedComplaints
        });

    } catch (err) {
        next(new appError("Internal server error!", 500));
    }
}


export const deleteComplaints = async (req, res, next) => {
    try {
        const {complainId}  = req.query;
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