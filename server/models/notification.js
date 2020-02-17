const mongoose = require("mongoose");
import crypto from 'crypto'

const Schema = mongoose.Schema;


const NotificationSchema   = new Schema({
    sender: { type: String, default: "", required: true }, // Notification creator
    receiver: [{ type: String, default: "", required: true }], // Ids of the receivers of the notification
    message: String, // any description of the notification message 
    read_by:[{
     reader:{ type: String, default: "", required: true },
     read_at: {type: Date, default: Date.now}
    }],
    created_at:{type: Date, default: Date.now},
    
});


export default mongoose.model("Notification", NotificationSchema);



