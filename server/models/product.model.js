import mongoose from 'mongoose'
import crypto from 'crypto'
const ProductSchema = new mongoose.Schema({
  text: {
    type: String,
    //required: 'Title is required'
  },
  description:{
    type:String,
  },
  photo: {
    data: Buffer,
    contentType: String
  },
  likes: [{type: mongoose.Schema.ObjectId, ref: 'User'}],
  comments: [{
    text: String,
    created: { type: Date, default: Date.now },
    postedBy: { type: mongoose.Schema.ObjectId, ref: 'User'}
  }],
  postedBy: {type: mongoose.Schema.ObjectId, ref: 'User'},
  created: {
    type: Date,
    default: Date.now
  },
  
  posttype:{
    type:String,
  },
  viewtype:{
    type:String,
  },
  categories:{
    type:String,
  },
  scheduled_datetime:{
    type:Date,
    default: Date.now,
    // required: 'Scheduled Date Time is required'
  },
  price:{
    type:String
  }
})

export default mongoose.model('Product', ProductSchema)
