import jwt from 'jsonwebtoken';
import appError from '../utils/appError.js';
import dotenv from 'dotenv';
dotenv.config();

// The protect is middleware function to protect the routes in the backend such that once the user is authenticated the request will contain the jwt cookie
// This cookie is needed to get the access to the protected routes

const protect = async (req, res, next) => {
    try {
        // Extract the token from the req
        const token = req.cookies.jwt; // Corrected from req.cookie.jwt to req.cookies.jwt
        if (!token) {
            return next(new appError('You are not logged in!', 401));
        }

        // Verify the token and extract the scholar number
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return next(new appError('Invalid token. Please log in again!', 401));
        }

        // Grant access to protected route
        req.sn = decoded.scholarNumber; // Attach the scholar number of the student to the request
        next();
    } catch (err) {
        return next(new appError('Invalid token. Please log in again!', 401));
    }
};

export { protect };