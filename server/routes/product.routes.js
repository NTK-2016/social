import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'
import productCtrl from '../controllers/product.controller'

const router = express.Router()

router.route('/api/product/new/:userId')
  .post(authCtrl.requireSignin, productCtrl.create)

router.route('/api/product/by/:userId')
  .get(authCtrl.requireSignin, productCtrl.listProductsByUser)

router.route('/api/product/photo/:productId')
  .get(productCtrl.photo)

router.param('userId', userCtrl.userByID)
router.param('productId', productCtrl.productByID)

export default router