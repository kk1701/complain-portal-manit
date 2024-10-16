import Complains from "../models/complainModel.js";

const cookieOptions = {
    secret: true,
    maxAge: 1*24*60*60*1000,   //1 day
    httpOnly: true
}

const registerComplain = async (req, res, next) => {
    const { studentID, studentName, hostelNumber, complainType, complainDescription, }
}