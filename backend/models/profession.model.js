import mongoose from "mongoose";

const professionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  category: {
    type: String,
    trim: true,
  },
  count: {
    type: Number,
    default: 0, 
  },
});

export const Profession = mongoose.model("Profession", professionSchema);
