import mongoose from "mongoose";

const channelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    type: {
      type: String,
      enum: ["public", "private", "role-based"],
      default: "public",
    },
    allowedRoles: [
      {
        type: String,
      },
    ],
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        role: String,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastMessage: {
      content: String,
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      timestamp: Date,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Channel = mongoose.model("Channel", channelSchema);
