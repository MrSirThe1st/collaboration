import mongoose from "mongoose";

const documentationSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      trim: true,
    },
    link: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ["doc", "link"],
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for faster queries
documentationSchema.index({ projectId: 1, type: 1 });
documentationSchema.index({ projectId: 1, createdBy: 1 });

// Add any virtual fields if needed
documentationSchema.virtual("creator", {
  ref: "User",
  localField: "createdBy",
  foreignField: "_id",
  justOne: true,
});

// Add methods if needed
documentationSchema.methods.archive = async function () {
  this.isArchived = true;
  return this.save();
};

// Add statics if needed
documentationSchema.statics.findByProject = function (projectId) {
  return this.find({
    projectId,
    isArchived: false,
  })
    .populate("createdBy", "username profile.profilePhoto")
    .sort("-createdAt");
};

export const Documentation = mongoose.model(
  "Documentation",
  documentationSchema
);
