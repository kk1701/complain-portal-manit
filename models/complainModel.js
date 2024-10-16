import { model, Schema } from 'mongoose';

const complainSchema = new Schema({
    studentID: {
        type: String,
        required: [true, "Student ID is required!"],
    },
    studentName: {
        type: String,
        required: [true, "Student name is required!"],
        trim: true
    },
    hostelNumber: {
        type: Number,
        required: [true, "Hostel number is required!"],
    },
    complainType: {
        type: String,
        trim: true
    },
    complainDescription: {
        type: String,
        trim: true,
        required: [true, "Description is required!"]
    },
    dateReported: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Pending', 'Resolved'],
        default: 'Pending'
    },
    assignedTo: {
        type: String,
        trim: true
    },
    attachments: {
        type: String,
        validate: {
            validator: function(v) {
                return /^https?:\/\/.+$/.test(v); // Example URL validation
            },
            message: props => `${props.value} is not a valid URL!`
        }
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
}, {
    timestamps: true
});

complainSchema.index({ studentID: 1 }); // Adding an index on studentID

const Complaints = model('Complaints', complainSchema);

export default Complaints;
