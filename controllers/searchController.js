import HostelComplaint from "../models/HostelComplaint.js";
import AcademicComplaint from "../models/AcademicComplaint.js";
import AdministrationComplaint from "../models/AdministrationComplaint.js";
import InfrastructureComplaint from "../models/InfrastructureComplaint.js";
import MedicalComplaint from "../models/MedicalComplaint.js";
import RaggingComplaint from "../models/RaggingComplaint.js";

export const searchController = async (req,res) => {
    const category = req.params.type;
    console.log(category);
    const id = req.query.complainId;
    //We have the category and id now we will  find the complaint details 
    if(category==="hostel"){
        let complaint = await HostelComplaint.findById(id);
         complaint = complaint.map((complaint) => ({
			...complaint._doc,
			attachments: complaint.attachments.map((filePath) => ({
				url: `${req.protocol}://${req.get("host")}/${filePath}`,
			})),
			category: "Academic",
		}));
        return res.status(200).json({
            status: "success",
            statusCode: 200,
            message: "success",
            data: complaint
        });
    }
    else if(category === "academic"){
        const complaint = await AcademicComplaint.findById(id);
        return res.status(200).json({
            status: "success",
            statusCode: 200,
            message: "success",
            data: complaint
        });
    }
    else if(category === "administration"){
        const complaint = await AdministrationComplaint.findById(id);
        return res.status(200).json({
            status: "success",
            statusCode: 200,
            message: "success",
            data: complaint
        });
    }
    else if(category === "infrastructure"){
        const complaint = await InfrastructureComplaint.findById(id);
        return res.status(200).json({
            status: "success",
            statusCode: 200,
            message: "success",
            data: complaint
        });
    }
    else if(category === "medical"){
        const complaint = await MedicalComplaint.findById(id);
        return res.status(200).json({
            status: "success",
            statusCode: 200,
            message: "success",
            data: complaint
        });
    }
    else if(category === "ragging"){
        const complaint = await RaggingComplaint.findById(id);
        return res.status(200).json({
            status: "success",
            statusCode: 200,
            message: "success",
            data: complaint
        });
    }
}