import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
    },
    status: {
      type: String,
      enum: ["thinking", "accepted", "rejected"],
      default: "thinking",
    },
  },
  { timestamps: true }
);
export const Request = mongoose.model("Request", requestSchema);
