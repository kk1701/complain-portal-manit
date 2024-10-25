import Complaints from "../models/complainModel.js";
import { client } from '../config/ldapDB.js';
import appError from "../utils/appError.js";
import validator from 'validator';
import dotenv from 'dotenv';
dotenv.config();

// We will be having the connection to the LDAP already. It will fetch the details of the user like:
/*
    - Scholar number, student name, hostel number, room number (if present), email id, phone number.
    - The scholar number will be the unique identifier for the student.
    - Also, we would be fetching the number of complaints registered by the student and how many of them got resolved, how many not got resolved.
    - The student's scholar number would be included in the request as the HTTP-only cookie which has the JWT token generated when the user logs in.
    - Ensure that the JWT token is securely stored and transmitted using HTTPS to prevent interception.
    - Validate and sanitize all inputs to prevent injection attacks.
   
*/
// The profile controller will have the following functions

const getProfileDetails = async (req, res, next) => {
    try {
        // The scholar number would be extracted and added to the request by the protect route which will check the validity of the token 
        //The request will contain the field sn which is Scholar Number

        let scholarNumber = req.sn;

        // Sanitize scholar number
        scholarNumber = validator.escape(scholarNumber);

        // Fetch user details from LDAP
        const opts = {
            filter: `(scholarNumber=${scholarNumber})`,
            scope: 'sub'
        };

        client.search('ou=users,dc=example,dc=com', opts, (err, ldapRes) => {
            if (err) {
                return next(new appError('LDAP search failed!', 500));
            }

            let user = null;
            ldapRes.on('searchEntry', (entry) => {
                user = entry.object;
            });

            ldapRes.on('end', async () => {
                if (!user) {
                    return next(new appError('User not found!', 404));
                }

                // Fetch complaints from MongoDB
                const complaints = await Complaints.find({ scholarNumber });

                // Count resolved and unresolved complaints
                const resolvedComplaints = complaints.filter(c => c.status === 'resolved').length;
                const unresolvedComplaints = complaints.filter(c => c.status !== 'resolved').length;

                // Send response
                res.status(200).json({
                    success: true,
                    data: {
                        user,
                        complaints: {
                            total: complaints.length,
                            resolved: resolvedComplaints,
                            unresolved: unresolvedComplaints
                        }
                    }
                });
            });
        });
    } catch (error) {
        console.log(error);
        return next(new appError('Internal server error!', 500));
    }
};

export { getProfileDetails};