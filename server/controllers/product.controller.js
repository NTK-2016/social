import Product from '../models/product.model'
import _ from 'lodash'
import errorHandler from './../helpers/dbErrorHandler'
import formidable from 'formidable'
import fs from 'fs'

const create = (req, res, next) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded"
      })
    }
    let post = new Product(fields)
    post.postedBy = req.profile
    if (files.photo) {
      post.photo.data = fs.readFileSync(files.photo.path)
      post.photo.contentType = files.photo.type
    }
    if (files.audio) {
      post.audio.data = fs.readFileSync(files.audio.path)
      post.audio.contentType = files.audio.type
    }
    post.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        })
      }
      res.json(result)
    })
  })
}

const listProductsByUser = (req, res) => { // 1 = published
  //console.log(req);
  Product.find({ $and: [{ postedBy: { $in: req.profile._id } }, { posttype: { $in: "1" } }] }) //{postedBy: req.profile._id}
    .populate('comments', 'text created')
    .populate('comments.postedBy', '_id name username')
    .populate('postedBy', '_id name username')
    .sort('-created')
    .exec((err, posts) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        })
      }
      res.json(posts)
    })
}

const photo = (req, res, next) => {
  res.set("Content-Type", req.post.photo.contentType)
  return res.send(req.post.photo.data)
}

const productByID = (req, res, next, id) => {
  Product.findById(id).populate('postedBy', '_id name username').exec((err, post) => {
    if (err || !post)
      return res.status('400').json({
        error: "Post not found"
      })
    req.post = post
    next()
  })
}

export default {
  create,
  listProductsByUser,
  productByID,
  photo
}