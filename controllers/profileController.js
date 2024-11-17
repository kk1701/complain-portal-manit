import appError from "../utils/appError.js";
import dataService from "../utils/dataService.js";
import validator from "validator";
import dotenv from "dotenv";
dotenv.config();

const dataServiceInstance = new dataService();

const getProfileDetails = async (req, res, next) => {
    if (process.env.NODE_ENV === "production") {
        try {
            // Extract the scholar number set by the auth middleware
            const scholarNumber = validator.escape(req.sn);
            const ProfileDetails = await dataServiceInstance.getUserProfileDetails(
                scholarNumber
            );
            if (!ProfileDetails) {
                return next(new appError("User not found!", 404));
            }
            res.status(200).json({
                success: true,
                message: "User details fetched successfully",
                data: ProfileDetails,
            });
        } catch (error) {
            console.error("Internal error:", error);
            return next(new appError("Internal server error!", 500));
        }
    } else {
        res.status(200).json({
            success: true,
            data: {
                user: {
                    "0": {
                        type: "mail",
                        values: ["vynr1504@gmail.com"]
                    },
                    "1": {
                        type: "mobile",
                        values: ["7671050452"]
                    },
                    "2": {
                        type: "uid",
                        values: ["2211201152"]
                    },
                    "3": {
                        type: "cn",
                        values: ["Velpucherla Yogananda Reddy"]
                    },
                    "4": {
                        type: "sn",
                        values: ["Velpucherla"]
                    },
                    "5": {
                        type: "departmentNumber",
                        values: ["Computer Science and Engineering"]
                    },
                    "6": {
                        type: "roomNumber",
                        values: ["H5-C062"]
                    },
                    "7": {
                        type: "hostel",
                        values: ["H5"]
                    },
                    role: "student",
                    complaintsRegistered: 0,
                    complaintsResolved: 0,
                    complaintsUnresolved: 0
                }
            }
        });
    }
};

export { getProfileDetails };
