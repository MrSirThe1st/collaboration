import mongoose from "mongoose";

const folderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    parentId: {
      type: String,
      default: "root",
    },
    path: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Create indexes
folderSchema.index({ projectId: 1, parentId: 1 });
folderSchema.index({ projectId: 1, path: 1 });

// Pre-save middleware to construct path
folderSchema.pre("save", async function (next) {
  if (this.isModified("parentId") || this.isModified("name")) {
    if (this.parentId === "root") {
      this.path = `/${this.name}`;
    } else {
      // Find parent folder to construct full path
      const parentFolder = await mongoose
        .model("Folder")
        .findById(this.parentId);
      if (parentFolder) {
        this.path = `${parentFolder.path}/${this.name}`;
      } else {
        this.path = `/${this.name}`;
      }
    }
  }
  next();
});

export const Folder = mongoose.model("Folder", folderSchema);
