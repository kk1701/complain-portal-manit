import multer from "multer";
import path from "path";
import appError from "../utils/appError.js";

// Allowed file types
const allowedFileTypes = /jpeg|jpg|png|pdf/;

// Configure Multer for local storage
const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, "uploads/");
    },
    filename: (_, file, cb) => {
        // Create a unique filename
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

// File filter to validate file types
const fileFilter = (_, file, cb) => {
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedFileTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new appError("Invalid file type! Only JPEG, PNG, and PDF files are allowed.", 400));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
    fileFilter: fileFilter,
}).array("attachments", 5);

// Middleware for handling file uploads
const handleFileUpload = (req, res, next) => {
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return next(new appError(`Multer error: ${err.message}`, 400));
        } else if (err) {
            return next(new appError(`File upload failed: ${err.message}`, 400));
        }

        // If upload is successful, attach file paths to the request
        if (req.files) {
            req.filePaths = req.files.map((file) => file.path);
        }
        next();
    });
};

export default handleFileUpload;