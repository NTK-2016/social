import mongoose from "mongoose";
import crypto from "crypto";
const NotificationSchema = new mongoose.Schema({
  type: { type: String, default: "", required: true },
  fromId: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
  toId: { type: mongoose.Schema.ObjectId, ref: "User" },
  productId: { type: mongoose.Schema.ObjectId, ref: "Post" },
  postId: { type: mongoose.Schema.ObjectId, ref: "Post" },
  amount: { type: String },
  status: { type: Number }, //0-read 1-unread
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model("Notifications", NotificationSchema);
