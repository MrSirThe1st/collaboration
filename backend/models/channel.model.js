import mongoose from "mongoose";

const channelSchema = new mongoose.Schema(
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
    type: {
      type: String,
      enum: ["default", "announcement", "role-based"],
      required: true,
    },
    role: {
      type: String,
      required: function () {
        return this.type === "role-based"; 
      },
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

channelSchema.methods.addMember = async function (userId) {
  if (!this.members.includes(userId)) {
    this.members.push(userId);
    await this.save();
  }
};

// Remove member from channel
channelSchema.methods.removeMember = async function (userId) {
  this.members = this.members.filter(
    (member) => member.toString() !== userId.toString()
  );
  await this.save();
};

// Static method to sync project members with default channels
channelSchema.statics.syncDefaultChannels = async function (projectId, userId) {
  const defaultChannels = await this.find({
    projectId,
    isDefault: true,
    isDeleted: false,
  });

  for (const channel of defaultChannels) {
    await channel.addMember(userId);
  }
};

export const Channel = mongoose.model("Channel", channelSchema);
