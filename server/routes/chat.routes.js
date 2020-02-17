import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'
import chatCtrl from '../controllers/chat.controller'


const router = express.Router()



router.route('/api/chat/')
  .get(chatCtrl.listChat)
  .post(chatCtrl.create);

router.route('/api/morechat/')
  .post(chatCtrl.listMoreChat)

router.route('/api/newchat/')
  .get(chatCtrl.listNewChat)

router.route('/api/chat/notification/')
  .get(chatCtrl.notification)
  .post(chatCtrl.createNotification);


router.route('/api/room/')
  .get(chatCtrl.listRoom)
  .post(chatCtrl.createRoom);

router.route('/api/readroom/')
  .post(chatCtrl.readroom);


export default router
