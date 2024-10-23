import Complaints from "../models/complainModel.js";
import appError from "../utils/appError.js";

const registerComplain = async (req, res, next) => {
    const { complainType, complainDescription, attachments } = req.body

    console.log(req.body);
    if (complainType == null || complainDescription == null || attachments == null) {
        return next(new appError('Please enter all details!', 400))
    }

    const complain = await Complaints.create({
        complainType,
        complainDescription,
        attachments
    })

    if (!complain) {
        return next(new appError('Complaint registration failed, please try again!', 400))
    }

    await complain.save()

    res.status(200).json({
        success: true,
        message: "Complain registered successfully!"
    })
}

export default registerComplain;