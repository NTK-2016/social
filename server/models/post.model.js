import mongoose from 'mongoose'
import crypto from 'crypto'
const PostSchema = new mongoose.Schema({
  text: {
    type: String,
    //required: 'Title is required'
  },
  photo: {
    type: String,
    // data: Buffer,
    // contentType: String
  },
  audio: {
    type: String,
    // data: Buffer,
    // contentType: String
  },
  attach: {
    type: String
  },
  video: {
    // data: Buffer,
    // contentType: String
    type: String
  },
  likes: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  comments: [{
    text: String,
    created: { type: Date, default: Date.now },
    postedBy: { type: mongoose.Schema.ObjectId, ref: 'User' }
  }],
  postedBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
  repost: { type: Boolean, default: false },
  repostedBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
  repostBy: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  actualPostId: { type: mongoose.Schema.ObjectId, ref: 'Post' },
  isUploaded: { type: Boolean, default: true },
  created: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
  },
  posttype: {
    type: String,
  },
  viewtype: {
    type: String,
  },
  categories: {
    type: String,
  },
  postname: {
    type: String,
  },
  subtype: {
    type: String,
  },
  scheduled_datetime: {
    type: Date,
    default: Date.now,
    // required: 'Scheduled Date Time is required'
  },
  subheading: {
    type: String
  },
  url: {
    type: String
  },
  price: {
    type: String
  },
  producttype: {
    type: String
  },
  shippinginfo: [
    {
      country: { type: String, trim: true },
      charges: { type: Number }
    }
  ],
  attributeNames: [
    {
      attributeName: { type: String, trim: true },
      attributeValue: { type: String, trim: true }
    }
  ],
  options: {
    option1: { type: String },
    option2: { type: String },
    option3: { type: String },
    option4: { type: String }
  },
  polled: [{
    option: String,
    created: { type: Date, default: Date.now },
    postedBy: { type: mongoose.Schema.ObjectId, ref: 'User' }
  }],
  rated: [{
    rate: String,
    created: { type: Date, default: Date.now },
    postedBy: { type: mongoose.Schema.ObjectId, ref: 'User' }
  }],
  tips: [{
    userId: { type: mongoose.Schema.ObjectId, ref: 'User' },
    amount: { type: Number },
    transactionId: { type: String },
    date: { type: Date, default: Date.now }
  }],
  sales: [{
    orederedBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
    productId: { type: mongoose.Schema.ObjectId, ref: 'Post' },
    amount: { type: Number },
    transaction_id: { type: String },
    date: { type: Date, default: Date.now }
  }],
  tipsEnabled: { type: Boolean, default: false },
  report: [{ type: mongoose.Schema.ObjectId, ref: 'User' }]
})

export default mongoose.model('Post', PostSchema)
