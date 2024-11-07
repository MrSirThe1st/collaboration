import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    project: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
    profile: {
      bio: { type: String },
      skills: [{ type: String }],
      groups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }],
      profilePhoto: {
        type: String,
        default: "",
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
    status: {
      type: String,
      enum: ["available", "busy", "away"],
      default: "available",
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
