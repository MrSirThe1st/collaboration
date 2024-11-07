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
    maxTeamSize: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
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
    status: {
      type: String,
      enum: ["Planning", "In Progress", "On Hold", "Completed", "Cancelled"],
      default: "Planning",
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    openPositions: [String],
    startDate: Date,
    endDate: Date,
    tags: [String],
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
    budget: {
      estimated: Number,
      current: Number,
      currency: String,
    },
    socialLinks: {
      instagram: String,
      twitter: String,
      linkedin: String,
      github: String,
      website: String,
    },
    startDate: { type: Date, required: false },
    endDate: { type: Date, required: false },
  },
  { timestamps: true }
);
export const Project = mongoose.model("Project", projectSchema);
