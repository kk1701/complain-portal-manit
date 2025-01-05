import HostelComplaint from "../models/HostelComplaint.js";
import AcademicComplaint from "../models/AcademicComplaint.js";
import AdministrationComplaint from "../models/AdministrationComplaint.js";
import InfrastructureComplaint from "../models/InfrastructureComplaint.js";
import MedicalComplaint from "../models/MedicalComplaint.js";
import RaggingComplaint from "../models/RaggingComplaint.js";

export const searchController = async (req, res) => {
    const category = req.params.type;
    const id = req.query.complainId;
    let complaint;

    try {
        switch(category) {
            case "hostel":
                complaint = await HostelComplaint.findById(id);
                break;
            case "academic":
                complaint = await AcademicComplaint.findById(id);
                break;
            case "administration":
                complaint = await AdministrationComplaint.findById(id);
                break;
            case "infrastructure":
                complaint = await InfrastructureComplaint.findById(id);
                break;
            case "medical":
                complaint = await MedicalComplaint.findById(id);
                break;
            case "ragging":
                complaint = await RaggingComplaint.findById(id);
                break;
            default:
                return res.status(400).json({ status: "error", message: "Invalid category" });
        }

        if (!complaint) {
            return res.status(404).json({ status: "error", message: "Complaint not found" });
        }

        // Transform the single complaint document
        const transformedComplaint = {
            ...complaint._doc,
            attachments: complaint.attachments.map(filePath => ({
                url: `${req.protocol}://${req.get("host")}/${filePath}`
            })),
            AdminAttachments: complaint.AdminAttachments.map(filePath => ({
                url: `${req.protocol}://${req.get("host")}/${filePath}`
            })),
            category: category.charAt(0).toUpperCase() + category.slice(1)
        };

        return res.status(200).json({
            status: "success",
            statusCode: 200,
            message: "success",
            complaint: transformedComplaint
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};
