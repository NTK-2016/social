const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const roomSchema = new Schema({
  name1: { type: String, default: "", required: true },
  name2: { type: String, default: "", required: true },
  members: [{ type: mongoose.Schema.ObjectId, ref: 'User' }, { type: mongoose.Schema.ObjectId, ref: 'User' }],
  lastActive: { type: Date, default: Date.now },
  createdOn: { type: Date, default: Date.now }
});

export default mongoose.model("Room", roomSchema);
