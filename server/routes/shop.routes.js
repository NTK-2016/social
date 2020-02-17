import express from 'express'
import shopCtrl from '../controllers/shop.controller'
import authCtrl from '../controllers/auth.controller'

const router = express.Router()
router.route('/api/shop/')
  .post(shopCtrl.AddProduct)
  .get(shopCtrl.ProductList)

  router.route('/api/shop/:productId')
  .put(authCtrl.requireSignin, shopCtrl.ProductUpdate)
  .delete(authCtrl.requireSignin, shopCtrl.ProductRemove)

  router.route('/api/shop/findproduct/:productId')
  .get(authCtrl.requireSignin, shopCtrl.findProduct)

  router.route('/api/shop/:productId')
  .get(authCtrl.requireSignin, shopCtrl.ReadProductById)

  router.param('productId', shopCtrl.productByID)
  
  export default router