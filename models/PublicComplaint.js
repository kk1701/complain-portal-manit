import mongoose, { Schema } from "mongoose";

const publicComplaintSchema = new Schema(
  {
    // Core complaint fields
    scholarNumber: {
      type: String,
      required: [true, "Student ID is required!"],
      index: true,
    },
    authorName: {
      type: String,
      required: [true, "Author name is required!"],
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Academic",
        "Hostel",
        "Infrastructure",
        "Administration",
        "Medical",
        "Other",
      ],
    },
    title: {
      type: String,
      required: [true, "Title is required!"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required!"],
      trim: true,
    },
    attachments: {
      type: [String],
      default: [],
    },

    // Status tracking
    readStatus: {
      type: String,
      default: "Not viewed",
      enum: ["Not viewed", "Viewed"],
    },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Resolved"],
    },
    reviewedBy: {
      type: String, // Admin's scholar number
      default: null,
    },

    // Social features
    upvotes: {
      count: { type: Number, default: 0 },
      users: [{ type: String, unique: true }], // Prevent duplicate user IDs
    },
    downvotes: {
      count: { type: Number, default: 0 },
      users: [{ type: String, unique: true }], // Prevent duplicate user IDs
    },
    reactions: [
      {
        type: { type: String, enum: ["support", "agree", "important", "disagree"] },
        user: { type: String, unique: true }, // scholar number
      },
    ],

    // Responses
    responses: [
      {
        responseId: {
          type: String,
          required: true,
          default: () => new mongoose.Types.ObjectId().toString(),
        },
        text: {
          type: String,
          required: true,
        },
        author: {
          type: String,
          required: true, // scholar number
        },
        authorName: {
          type: String,
          required: true,
        },
        isAdmin: {
          type: Boolean,
          default: false,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Complaint priority for triaging
    priority: {
      type: String,
      default: "Medium",
      enum: ["High", "Medium", "Low"],
    },

    // Visibility and metadata
    visibility: {
      type: String,
      default: "Public",
      enum: ["Public", "Anonymous"],
    },

    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

export default mongoose.model("PublicComplaint", publicComplaintSchema);
