import { model, Schema } from 'mongoose'

const complainSchema = new Schema({
    // studentID: {
    //     type: String,
    //     required: [true, "Student ID is required!"],
    // },
    // studentName: {
    //     type: String,
    //     required: [true, "Student name is required!"],
    //     trim: true
    // },
    // hostelNumber: {
    //     type: Intl,
    //     required: [true, "Hostel number is required!"],
    // },
    complainType: {
        type: String
    },
    complainDescription: {
        type: String,
        trim: true,
        // required: [true, "Description is required!"]
    },
    dateReported: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['Pending', 'Resolved'],
        default: 'Pending'
    },
    assignedTo: {
        type: String
    },
    attachments: {
        type: String
    },
    lastUpdated: {
        type: Date
    },
}, {
    timestamps: true
})

const Complains = new model('Complains', complainSchema)

export default Complains;