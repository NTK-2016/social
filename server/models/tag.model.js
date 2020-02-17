import mongoose from 'mongoose'
import crypto from 'crypto'
const TagSchema = new mongoose.Schema({
  "name":{
  	type:String, trim:true}
})

export default mongoose.model('Tag', TagSchema)
