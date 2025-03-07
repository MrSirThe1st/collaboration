import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true, 
  },
  type: {
    type: String,
    enum: ["message", "invitation", "project", "task", "mention"],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: String,
  read: {
    type: Boolean,
    default: false,
    index: true, 
  },
  link: String, 
  relatedDoc: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "docModel",
  },
  docModel: {
    type: String,
    enum: ["Project", "DirectMessage", "Task", "Invitation"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true, 
  },
});


notificationSchema.methods.markAsRead = async function () {
  this.read = true;
  await this.save();
};


notificationSchema.statics.createNotification = async function (data) {
  return await this.create(data);
};

export const Notification = mongoose.model("Notification", notificationSchema);
