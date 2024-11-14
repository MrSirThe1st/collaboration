import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    requirements: [
      {
        type: String,
        required: true,
      },
    ],
    logo: {
      type: String,
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          required: true,
        },
      },
    ],
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    requests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Request",
      },
    ],
    milestones: [
      {
        title: String,
        description: String,
        dueDate: Date,
        completed: Boolean,
      },
    ],
    skills: [String],
    resources: [
      {
        name: String,
        link: String,
        description: String,
      },
    ],
    communication: {
      platform: String,
      link: String,
    },
    category: {
      type: String,
      enum: [
        "Web Development",
        "Mobile Development",
        "UI/UX Design",
        "Data Science",
      ],
      required: true, 
    },
    socialLinks: {
      instagram: String,
      twitter: String,
      linkedin: String,
      github: String,
      website: String,
    },
  },
  { timestamps: true }
);
export const Project = mongoose.model("Project", projectSchema);
