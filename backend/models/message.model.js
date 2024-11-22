// models/message.model.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    channelId: {
      type: mongoose.Schema.Types.Mixed, 
      required: true,
      validate: {
        validator: function (v) {
          return (
            mongoose.Types.ObjectId.isValid(v) ||
            ["general", "announcements"].includes(v)
          );
        },
        message:
          "Channel ID must be a valid ObjectId or one of: general, announcements",
      },
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
    // Message type for different kinds of messages
    type: {
      type: String,
      enum: ["text", "file", "image", "announcement"],
      default: "text",
    },
    // For threaded conversations
    parentMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    // Track replies for easy thread retrieval
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
    // Support for file attachments
    attachments: [
      {
        type: {
          type: String,
          enum: ["file", "image"],
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        filename: String,
        filesize: Number,
        mimetype: String,
      },
    ],
    // Track who has read the message
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
    // Track message edits
    editHistory: [
      {
        content: String,
        editedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // For soft delete
    isDeleted: {
      type: Boolean,
      default: false,
    },
    // For announcements
    isPinned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    // Add a virtual field to check if message is edited
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add indexes for better query performance
messageSchema.index({ channelId: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });

// Virtual field to check if message is edited
messageSchema.virtual("isEdited").get(function () {
  return this.editHistory.length > 0;
});

// Middleware to handle thread updates
messageSchema.pre("save", async function (next) {
  if (this.isNew && this.parentMessage) {
    try {
      // Add this message to parent's replies
      await this.model("Message").findByIdAndUpdate(this.parentMessage, {
        $push: { replies: this._id },
      });
    } catch (error) {
      next(error);
    }
  }
  next();
});

// Method to edit message
messageSchema.methods.edit = function (newContent) {
  // Store the current content in edit history
  this.editHistory.push({
    content: this.content,
    editedAt: Date.now(),
  });
  // Update the content
  this.content = newContent;
  return this.save();
};

// Method to mark message as read by user
messageSchema.methods.markAsRead = function (userId) {
  if (!this.readBy.some((read) => read.user.toString() === userId.toString())) {
    this.readBy.push({ user: userId });
    return this.save();
  }
  return Promise.resolve(this);
};


export const Message = mongoose.model("Message", messageSchema);
