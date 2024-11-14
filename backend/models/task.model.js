import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["todo", "in_progress", "in_review", "completed"],
      default: "todo",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    milestone: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Milestone",
    },
    assignees: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        role: String,
      },
    ],
    assignedRole: {
      type: String,
    },
    dueDate: Date,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    attachments: [
      {
        name: String,
        url: String,
        type: String,
      },
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        content: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    labels: [String],
    estimatedHours: Number,
    actualHours: Number,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for completion percentage based on subtasks
taskSchema.virtual("completionPercentage").get(function () {
  if (!this.subtasks || this.subtasks.length === 0) {
    return this.status === "completed" ? 100 : 0;
  }
  const completedSubtasks = this.subtasks.filter(
    (subtask) => subtask.completed
  ).length;
  return Math.round((completedSubtasks / this.subtasks.length) * 100);
});

// Middleware to update milestone progress when task status changes
taskSchema.pre("save", async function (next) {
  if (this.isModified("status") && this.milestone) {
    const Milestone = mongoose.model("Milestone");
    await Milestone.updateMilestoneProgress(this.milestone);
  }
  next();
});

export const Task = mongoose.model("Task", taskSchema);
