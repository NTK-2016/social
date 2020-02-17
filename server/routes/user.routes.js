import express from "express";
import userCtrl from "../controllers/user.controller";
import authCtrl from "../controllers/auth.controller";

const router = express.Router();

router
  .route("/api/users")
  .get(userCtrl.list)
  .post(userCtrl.create);

router
  .route("/api/users/photo/:userId")
  .get(userCtrl.photo, userCtrl.defaultPhoto);
router.route("/api/users/defaultphoto").get(userCtrl.defaultPhoto);

router
  .route("/api/users/follow/:userId")
  .put(authCtrl.requireSignin, userCtrl.addFollowing, userCtrl.addFollower);

router
  .route("/api/users/unfollow")
  .put(
    authCtrl.requireSignin,
    userCtrl.removeFollowing,
    userCtrl.removeFollower
  );

router
  .route("/api/users/findpeople/:userId")
  .get(authCtrl.requireSignin, userCtrl.findPeople);

/* Find the stanning user 2019-10-04 */
router
  .route("/api/users/findstanning/:userId")
  .get(authCtrl.requireSignin, userCtrl.findStanning);
/* End the find stanning users */
router
  .route("/api/username/:userName")
  .get(authCtrl.requireSignin, userCtrl.readName)

router
  .route("/api/users/:userId")
  .get(authCtrl.requireSignin, userCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.remove);




/** Route for banner image update */
router
  .route("/api/users/:userId")
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.bannerimg);

/** Route for  notification  */
router
  .route("/api/users/notification1/:userId")
  .put(authCtrl.requireSignin, userCtrl.notification);
/** End here */
router.route("/api/users/forgetpassword/").post(userCtrl.forgetpassword);
/** Forget Password */

/*End Here*/
/** Route For Privacy */
router
  .route("/api/users/privacy/:userId")
  .put(authCtrl.requireSignin, userCtrl.privacy);
/** End Here */

/** Route For Link Activation */
router.route("/api/users/activation/:userId").put(userCtrl.linkactivation);
/** End Here */

/** Route For Payment */
router
  .route("/api/users/payment/:userId")
  .put(authCtrl.requireSignin, userCtrl.payment);
/** End Here */
/** Route for Creater */
router
  .route("/api/users/creater/:userId")
  .put(authCtrl.requireSignin, userCtrl.becomecreater);
/** End here */

/** Route for Stan */
router
  .route("/api/users/stan/:userId")
  .put(authCtrl.requireSignin, userCtrl.stan);
/** End here */

/** Route to get stan count */
router
  .route("/api/users/stanCount/:userId")
  .get(authCtrl.requireSignin, userCtrl.stanCount);
/** End */

/** Route to get follower count */
router
  .route("/api/users/followerCount/:userId")
  .get(authCtrl.requireSignin, userCtrl.followerCount);
/** End */

/** Route for Creater Category */

/**End here  */
/** Banner Image */

/** Route for  subscriptionpitch  */
router
  .route("/api/users/subscriptionpitch/:userId")
  .put(authCtrl.requireSignin, authCtrl.validateToken, userCtrl.subscriptionAndPitch);
router.route("/api/shippingprice/").put(userCtrl.shippingprice);

router
  .route("/api/users/enableStanBtn/:userId")
  .get(authCtrl.requireSignin, userCtrl.enableStanBtn);
// enable disable shop
router
  .route("/api/users/enableShop/:userId")
  .put(authCtrl.requireSignin, userCtrl.enableShop);
// get shop enable disable
router
  .route("/api/users/enableShopbtn/:userId")
  .get(authCtrl.requireSignin, userCtrl.enableShopbtn);
// get tip by user and shop data from  post
router.route("/api/users/tipByUser/:userId").get(userCtrl.tipsByUser);
// get manage order data from order.model
router
  .route("/api/users/manageOrders/:userId")
  .get(authCtrl.requireSignin, userCtrl.manageOrders);
/** End here */

router
  .route("/api/users/banner/:userId")
  .get(userCtrl.banner, userCtrl.defaultbanner);

//router.route("/api/users/defaultbanner").get(userCtrl.defaultbanner);

router.route("/api/users/chat/").post(userCtrl.chat);

/** country list for shop */
router.route("/api/countrieslist/").get(userCtrl.countriesList);
/** End Here */
router
  .route("/api/creatorcategory/")
  .get(authCtrl.requireSignin, userCtrl.creatorCategory);

router
  .route("/api/find/")
  .post(authCtrl.requireSignin, userCtrl.userNameById);

router
  .route("/api/topcreatorcategory/")
  .get(authCtrl.requireSignin, userCtrl.topCreatorCategory);

router
  .route("/api/categoryuser/")
  .post(authCtrl.requireSignin, userCtrl.categoryuser);
/* Insert and find category */
router
  .route("/api/insertcategory/")
  .post(authCtrl.requireSignin, userCtrl.insertCategory);
/* End Insert and category */
router
  .route("/api/searchuser/")
  .post(authCtrl.requireSignin, userCtrl.searchuser);

/* Check Username on Singup */
router.route("/api/checkusername/").post(userCtrl.checkusername);
/* End Check Username */
/* Check email on forgot */
router.route("/api/checkemail/").post(userCtrl.checkemail);
/* End email on forgot */
/* Check email by id on update email */
router.route("/api/checkEmailById/:userId").post(userCtrl.checkEmailById);
/* End Check email by id on update email */
/* Check token on forgot */
router.route("/api/checkreset/").post(userCtrl.checkresettoken);
/* End token on forgot */
/* reset */
router.route("/api/reset/").post(userCtrl.reset);
/* reset */
/* Check Category name */
router.route("/api/checkcategory/").post(userCtrl.checkcategory);
/* End Check category */

router.param("userId", userCtrl.userByID);

router.param("userName", userCtrl.userByName);

//router.route("/api/users/becomeStan/").post(userCtrl.becomeStan);
router.route("/api/users/becomeStan/").post(userCtrl.becomeStan, userCtrl.addFollowing, userCtrl.addFollower);

router.route("/api/users/removeStan/").post(userCtrl.removeStan);
//userCtrl.removeFollowing, userCtrl.removeFollower

router
  .route("/api/users/readnotification/:userId/:status")
  .get(authCtrl.requireSignin, userCtrl.readnotification);
/** api to show all payment transactions */
router
  .route("/api/users/transaction/:userId/")
  .get(authCtrl.requireSignin, userCtrl.paymenttransaction);
router
  .route("/api/users/tippedByMe/:userId")
  .get(authCtrl.requireSignin, userCtrl.tippedByMe);
router
  .route("/api/users/staningtransaction/:userId")
  .get(authCtrl.requireSignin, userCtrl.stanningtransaction);

router.route("/api/users/StantoMe/:userId").get(userCtrl.StantoMe);
router.route("/api/users/myShopOrder/:userId").get(userCtrl.myShopOrder);

// /* Start make withdrawal Request */
// router.route("/api/withdrawalEarning/").put(userCtrl.withdrawalEarning);
// /* End Make Withdrawal Request */

/* Start get Total withdrawal Request */
router
  .route("/api/gettotalwithdrawal/:userId")
  .get(userCtrl.gettotalwithdrawal);
/* End Get Total Withdrawal Request */

/* Start get earning filteration  */
router
  .route("/api/users/earningStmtFilter/:userId")
  .post(authCtrl.requireSignin, userCtrl.earningStmtFilter);
/* End get earning filteration */

// router
//   .route("/api/users/transaction/:userId/")
//   .get(userCtrl.paymenttransaction);
// router.route("/api/users/tippedByMe/:userId").get(userCtrl.tippedByMe);
// router
//   .route("/api/users/staningtransaction/:userId")
//   .get(userCtrl.stanningtransaction);
// router.route('/api/users/checkStan')
//   .get(authCtrl.requireSignin, userCtrl.checkStan)
router
  .route("/api/getearning/:userId")
  .get(authCtrl.requireSignin, userCtrl.getEarning);
router
  .route("/api/users/reviewsubmit/:userId/")
  .get(authCtrl.requireSignin, userCtrl.reviewsubmit);
router
  .route("/api/users/getTransStatementByUser/:userId/")
  .get(authCtrl.requireSignin, userCtrl.getTransStatementByUser);

router
  .route("/api/users/getTransDebitStmtByUser/:userId/")
  .get(authCtrl.requireSignin, userCtrl.getTransDebitStmtByUser);

router
  .route("/api/users/getVatByCountry/")
  .post(authCtrl.requireSignin, userCtrl.getVatByCountry);
/** Route For Email  Activation */
router
  .route("/api/users/emailactivatelink/:userId")
  .put(userCtrl.emailactivatelink);
/** End Here */
/** Route to check creator and redirect to view creator space page */
router
  .route("/api/users/getAccountIdByCodeId/:codeId")
  .post(authCtrl.requireSignin, userCtrl.getAccountIdByCodeId);
/** End Route to check creator and redirect to view creator space page */

/*Start To Withdrawal money by given Stripe Acc Id */
router
  .route("/api/users/makeWithDrawalByStripeId")
  .post(authCtrl.requireSignin, userCtrl.makeWithDrawalByStripeId);
/*End To Withdrawal money by given Stripe Acc Id */
/* Start Calculate Process Fee */
router
  .route("/api/users/calculateProcessFee")
  .post(authCtrl.requireSignin, userCtrl.calculateProcessFee);
/* End Calculate Process Fee */
/* Start of Report */
router.route("/api/users/report").post(authCtrl.requireSignin, userCtrl.report);
/* End of Report */
/* Start Send Referal Invitation */
router.route("/api/sendreferinvitation/").post(userCtrl.sendreferinvitation);
/* End Send Referal Invitation */
/* End Send Feedback */
router.route("/api/sendfeedback/").post(userCtrl.sendfeedback);
/* End Send Feedback */

/* Start Send Webhookendpoint */
//router.route("/api/webhook").post(userCtrl.webhook);
/* End Send Webhookendpoint */

// router.route("/api/updateplans/").post(userCtrl.updateplans);

export default router;
