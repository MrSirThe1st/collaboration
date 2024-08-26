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

    profession: {
      type: String,
      required: true,
    },
    role: {
      type: String,
    },
    profile: {
      bio: { type: String },
      skills: [{ type: String }],
      groups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }],
      profilePhoto: {
        type: String,
        default: "",
      },
      socialLinks: {
        github: String,
        linkedin: String,
        portfolio: String,
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
