import multer from "multer";
import path from "path";
import appError from "../utils/appError.js";


// Configure Multer for local storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // Create a unique filename
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
}).array('attachments', 5); 

// Middleware for handling file uploads
const handleFileUpload = (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            return next(new appError("File upload failed!", 400));
        }
        
        // If upload is successful, attach file paths to the request
        req.filePaths = req.files.map(file => file.path);
        next();
    });
};

export default handleFileUpload;