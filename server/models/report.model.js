import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema({
  fromId: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
  toId: { type: mongoose.Schema.ObjectId, ref: "User" },
  postId: { type: mongoose.Schema.ObjectId, ref: "Post" },
  type: { type: String, required: true },
  text: { type: String },
  action: { type: Number, default: 0 }, //0-no action taken , 1-action taken
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model("Report", ReportSchema);
