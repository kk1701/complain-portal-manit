import express from 'express';
import complainRoutes from './routes/complainRoutes.js';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import profileRoutes from './routes/profileRoutes.js';
import csrfProtection from './utils/csrf.js';
import csrfMiddleware from './middleware/csrfMiddleware.js';
import appError from './utils/appError.js';
import loginRoutes from './routes/loginRoutes.js';
import logoutRoutes from './routes/logoutRoutes.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config();

const app = express();
app.use(express.json());
app.use(helmet());

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


if (process.env.NODE_ENV === 'production') {
    app.use(csrfProtection);
    app.use(csrfMiddleware); // Apply CSRF middleware to all routes in production
}

app.use('/ping', (req, res) => {
    res.send('pong');
});

// Routes
app.use('/complain', complainRoutes);
app.use('/profile', profileRoutes);
app.use("/login",loginRoutes);
app.use("/logout",logoutRoutes);
// Error handling middleware
app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
        return next(new appError('Invalid CSRF token', 403));
    }
    
    // Handle other errors
    console.error(err); // Log the error for debugging
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message
    });
});

export default app;