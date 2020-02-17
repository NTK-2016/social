import Post from '../models/post.model'
import _ from 'lodash'
import errorHandler from './../helpers/dbErrorHandler'
import formidable from 'formidable'
import fs from 'fs'
import profileImage from './../../client/assets/images/profile-pic.png'

const AddProduct = (req, res, next) => {
  const shop = new Shop(req.body)
  shop.save((err, result) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.status(200).json({
      message: "Product added Successfully!"
    })
  })
}

const findProduct = (req, res) => {
  let product = req.shop.productname
  product.push(req.shop._id)
  shops.find({ _id: _id }, (err, shops) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.json(users)
  }).select('productname')
}

const productByID = (req, res, next, id) => {
  Shop.findById(id)
    //.populate('shops', '_id productname description price created')
    .exec((err, shop) => {
      if (err || !shop) return res.status('400').json({
        error: "Product Not Found"
      })
      req.shop = shop
      next()
    })
}

const ProductList = (req, res) => {
  Post.find((err, shop) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.json(shop)
  }).select('_id productname description price created')
}

const ProductUpdate = (req, res, next) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Photo could not be uploaded"
      })
    }
    let shop = req.shop
    shop = _.extend(shop, fields)
    shop.updated = Date.now()
    if (files.photo) {
      shop.photo.data = fs.readFileSync(files.photo.path)
      shop.photo.contentType = files.photo.type
    }
    shop.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        })
      }

      res.json(shop)
    })
  })
}


const ProductRemove = (req, res, next) => {
  let shop = req.shop
  shop.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.json(deletedProduct)
  })
}
const ReadProductById = (req, res) => {
  req.shop.description = undefined
  req.shop.price = undefined
  return res.json(req.shop)
}


export default {
  AddProduct,
  ProductList,
  ProductUpdate,
  ProductRemove,
  findProduct,
  productByID,
  ReadProductById
}
