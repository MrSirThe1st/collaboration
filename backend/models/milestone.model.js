// milestone.model.js
import mongoose from "mongoose";

const milestoneSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed"],
      default: "pending",
    },
    dueDate: {
      type: Date,
      required: true,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    order: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, // Enable virtuals in JSON
    toObject: { virtuals: true }, // Enable virtuals in Objects
  }
);

// Define the tasks virtual BEFORE creating the model
milestoneSchema.virtual("tasks", {
  ref: "Task", // The model to use
  localField: "_id", // Find tasks where `localField`
  foreignField: "milestone", // is equal to this milestone's `_id`
});

// Static method to update milestone progress
milestoneSchema.statics.updateMilestoneProgress = async function (milestoneId) {
  const Task = mongoose.model("Task");
  const tasks = await Task.find({ milestone: milestoneId });

  if (!tasks.length) return;

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;
  const progress = Math.round((completedTasks / tasks.length) * 100);

  await this.findByIdAndUpdate(milestoneId, {
    progress,
    status:
      progress === 100 ? "completed" : progress > 0 ? "in_progress" : "pending",
  });
};

// Create and export the model
export const Milestone = mongoose.model("Milestone", milestoneSchema);
