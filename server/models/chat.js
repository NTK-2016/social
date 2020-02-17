const mongoose = require("mongoose");
import crypto from 'crypto'

const Schema = mongoose.Schema;
const chatSchema = new Schema({
  msgFrom: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  msgTo: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  msg: { type: String, default: "", required: true },
  room: { type: mongoose.Schema.ObjectId, ref: 'Room', required: true },
  createdOn: { type: Date, default: Date.now },
  msgreadfrom: { type: Number, default: 1, required: true },
  msgreadto: { type: Number, default: 1, required: true },
});

export default mongoose.model("Chat", chatSchema);