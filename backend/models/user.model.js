import mongoose from "mongoose";
import { type } from "os";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    profession: { type: String, required: true },
    password: {
      type: String,
      required: true,
    },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
    project: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
    profile: {
      bio: { type: String },
      skills: [{ type: String }],
      groups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }],
      profilePhoto: {
        type: String,
        default: "",
      },
      country: {
        code: { type: String },
        name: { type: String },
      },
      socialLinks: {
        github: { type: String, default: "" },
        linkedin: { type: String, default: "" },
        portfolio: { type: String, default: "" },
      },
      role: {
        type: String,
        enum: ["project owner", "member", "Admin"],
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    verificationTokenExpiry: {
      type: Date,
    },
    // status: {
    //   type: String,
    //   enum: ["available", "busy", "away"],
    //   default: "available",
    // },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
