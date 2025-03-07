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
    cover: {
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
        "Web Application",
        "Mobile Application",
        "Desktop Software",
        "Video Game",
        "AI/Machine Learning",
        "Data Analytics",
        "IoT & Embedded Systems",
        "AR/VR Experience",
        "Blockchain Solution",
        "E-Commerce Platform",
        "CRM/ERP System",
        "API/Backend Service",
        "Chatbot/Conversational AI",
        "Cybersecurity Tool",
        "DevOps Tool",
        "Educational Software",
        "Healthcare Solution",
        "FinTech Application",
        "Social Platform",
        "Content Management System",
        "Productivity Tool",
        "Multimedia/Entertainment",
        "SaaS Product",
        "Research Tool",
        "Other",
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
    countryRestriction: {
      isGlobal: { type: Boolean, default: true },
      country: {
        code: String,
        name: String,
      },
    },
  },
  { timestamps: true }
);
projectSchema.index({ title: 1}, { unique: true });

export const Project = mongoose.model("Project", projectSchema);
