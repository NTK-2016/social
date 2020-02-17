import mongoose from 'mongoose'
import crypto from 'crypto'
const CategorySchema = new mongoose.Schema({
  "name":{type:String, trim:true},
  "created_at": { type: Date, default: Date.now },
  "updated_at": { type: Date, default: Date.now }
})

export default mongoose.model('Category', CategorySchema)
