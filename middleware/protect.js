const jwt = require('jsonwebtoken');
const appError = require('../utils/appError');


//The protect is middleware function to protect the routes in the backend such that once the user is authenticated the request will contain the jwt cookie
//This cookie is neeeded to get the acesses to the protected routes
//Hence the protect function will check if the jwt cookie is valid or invalid 
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
        req.sn = decoded.scholarNumber; //Attach the scholarnumber of the student to the request
        next();
    } catch (err) {
        return next(new appError('Invalid token. Please log in again!', 401));
    }
};

module.exports = protect;