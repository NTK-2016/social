import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'
import postCtrl from '../controllers/post.controller'

const router = express.Router()

router.route('/api/posts/new/:userId')
  .post(authCtrl.requireSignin, postCtrl.create)

router.route('/api/posts/repost/:userId')
  .post(authCtrl.requireSignin, postCtrl.repost)

router.route('/api/posts/photo/:postId')
  .get(postCtrl.photo)

router.route('/api/posts/uploadPhoto')
  .post(postCtrl.uploadPhoto)

router.route('/api/posts/audio/:postId')
  .get(postCtrl.audio)

router.route('/api/posts/by/:userId')
  .post(authCtrl.requireSignin, postCtrl.listByUser)

router.route('/api/posts/product/:userId')
  .get(authCtrl.requireSignin, postCtrl.listProductsByUser)

router.route('/api/posts/scheduleby/:userId')
  .get(authCtrl.requireSignin, postCtrl.listScheduleByUser)

router.route('/api/posts/draftby/:userId')
  .get(authCtrl.requireSignin, postCtrl.listDraftByUser)

router.route('/api/posts/feed/:userId')
  .post(authCtrl.requireSignin, postCtrl.listNewsFeed)

router.route('/api/posts/likedfeed/:userId')
  .get(authCtrl.requireSignin, postCtrl.listLikedFeed)

router.route('/api/posts/like')
  .put(authCtrl.requireSignin, postCtrl.like)
router.route('/api/posts/unlike')
  .put(authCtrl.requireSignin, postCtrl.unlike)

router.route('/api/posts/comment')
  .put(authCtrl.requireSignin, postCtrl.comment)
router.route('/api/posts/uncomment')
  .put(authCtrl.requireSignin, postCtrl.uncomment)

router.route('/api/posts/:postId')
  .delete(authCtrl.requireSignin, postCtrl.isPoster, postCtrl.remove)

router.route('/api/getpost/:getId')
  .post(authCtrl.requireSignin, postCtrl.getDataID)

router.route('/api/readorder/:userId')
  .post(authCtrl.requireSignin, postCtrl.readOrder)

router.route('/api/getcategory/')
  .get(authCtrl.requireSignin, postCtrl.getCategory)
/* Get Tags */
router.route('/api/gettag/')
  .get(authCtrl.requireSignin, postCtrl.getTag)
/* End Get Tags */

router.route('/api/updatepost/:postId')
  .put(authCtrl.requireSignin, postCtrl.update) //, authCtrl.hasAuthorization

router.route('/api/posts/poll/')
  .put(authCtrl.requireSignin, postCtrl.poll)

router.route('/api/posts/rating/')
  .put(authCtrl.requireSignin, postCtrl.rating)

router.route('/api/posts/likes/:userId')
  .get(authCtrl.requireSignin, postCtrl.LikesByUser)

/** Route to get stan count */
router.route('/api/posts/payStripe/')
  .post(postCtrl.payStripe)
/** End */

/* Check order on download */
router.route("/api/checkorder/").post(postCtrl.checkorder);
/* End order on download */

router.route('/api/users/getShippingCharges/:userId/')
  .get(authCtrl.requireSignin, postCtrl.getShippingCharges)

router.param('userId', userCtrl.userByID)
router.param('userName', userCtrl.userByName)
router.param('postId', postCtrl.postByID)
router.param('getId', postCtrl.getDataID)




export default router
