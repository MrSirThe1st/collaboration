import mongoose from "mongoose";

const projectMessageSchema = new mongoose.Schema(
  {
    channelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["message", "announcement"],
      default: "message",
    },
    attachments: [
      {
        name: String,
        url: String,
        type: String,
      },
    ],
    isPinned: {
      type: Boolean,
      default: false,
    },
    readBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        readAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
     isEdited: {
      type: Boolean,
      default: false
    },
    editHistory: [{
      content: String,
      editedAt: Date
    }],
    isDeleted: {
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

projectMessageSchema.pre("save", function (next) {
  // Add sender to readBy if not already present
  if (
    !this.readBy.some((read) => read.user.toString() === this.sender.toString())
  ) {
    this.readBy.push({ user: this.sender });
  }
  next();
});

// Add index for better query performance
projectMessageSchema.index({ channelId: 1, createdAt: -1 });
projectMessageSchema.index({ channelId: 1, type: 1 });

export const ProjectMessage = mongoose.model(
  "ProjectMessage",
  projectMessageSchema
);
