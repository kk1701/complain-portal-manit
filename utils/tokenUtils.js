import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
}

export { generateToken, verifyToken };