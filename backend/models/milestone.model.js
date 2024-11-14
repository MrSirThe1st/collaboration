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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual to get all tasks associated with this milestone
milestoneSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "milestone",
});

// Static method to update milestone progress based on associated tasks
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

export const Milestone = mongoose.model("Milestone", milestoneSchema);