/**
 * @file Token Utilities module.
 * @module utils/tokenUtils
 */

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Generates a JWT token.
 * @param {Object} payload - The payload to encode in the token.
 * @returns {string} The generated JWT token.
 * @throws {Error} If JWT_EXPIRES_IN is not set or invalid.
 */
const generateToken = (payload) => {
    const expiresIn = process.env.JWT_EXPIRES_IN;
    if (!expiresIn || typeof expiresIn !== 'string') {
        throw new Error('Invalid JWT_EXPIRES_IN value');
    }
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

/**
 * Verifies a JWT token.
 * @param {string} token - The token to verify.
 * @returns {Object} The decoded token payload.
 * @throws {Error} If the token is invalid.
 */
const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
}

export { generateToken, verifyToken };