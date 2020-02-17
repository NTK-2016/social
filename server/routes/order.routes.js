import express from "express";
import orderCtrl from "../controllers/order.controller";
import userCtrl from "../controllers/user.controller";
import authCtrl from "../controllers/auth.controller";
const router = express.Router();
/** */
router
  .route("/api/orders/sendMessage/:orderId")
  .put(orderCtrl.sendPurchaseNote);

router.route("/api/orders/new/").post(orderCtrl.placeOrder);
// get tip by user and shop data from  post
router.route("/api/orders/totalSales/:userId").get(orderCtrl.productsales);
// get manage order data from order.model

router.param("userId", userCtrl.userByID);
export default router;
