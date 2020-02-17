import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./core/Home";
import Users from "./user/Users";
import Signup from "./user/Signup";
import Join from "./user/Join";
import Signin from "./auth/Signin";
import EditProfile from "./user/EditProfile";
import Profile from "./user/Profile";
import userProfile from "./user/userProfile";
import PrivateRoute from "./auth/PrivateRoute";
import Menu from "./core/Menu";
import Create from "./post/Create";
import Text from "./post/text/Text";
import Article from "./post/article/Article";
import Image from "./post/image/Image";
import Audio from "./post/audio/Audio";
import Link from "./post/link/Link";
import Video from "./post/video/Video";
import Product from "./post/product/Product";
import ProductDetails from "./post/product/ProductDetails";
import Poll from "./post/poll/Poll";
//import Shop from './user/Shop'
//import EditProduct from './user/EditProduct'
import Setting from "./user/Settings";
import LinkActivation from "./user/LinkActivation";
import EmailActivation from "./user/EmailActivation";
import ViewCreatorSpace from "./user/ViewCreatorSpace";
import Following from "./user/Following";
import Followers from "./user/Followers";
import Messages from "./chat/Chat";
import Liked from "./user/Liked";
import SinglePost from "./post/SinglePost";
import Notifications from "./notification/Notifications";
import CreatorSpace from "./user/creator-space/CreatorSpace";
import Search from "./search/Search";

import CheckoutForm from "./user/payment/CheckoutForm";
import StanProfile from "./user/stan/Stanprofile";
import BecomeCreator from "../client/creator/Creator";
import Wallet from "./user/wallet/Wallet";
import Payments from "./user/wallet/Payments";
import ForgetEmail from "./user/ForgetEmail";
import ForgetPassword from "./user/ForgetPassword";
import AllActivity from "./user/AllActivity";
import auth from "./auth/auth-helper";
import MyOrders from "./user/wallet/MyOrders";
import Refer from "./user/Refer";
import DownloadDigiFiles from "./post/product/DownloadDigiFiles";
import { Redirect } from 'react-router-dom'
import Fourzerofour from "./common/404";
import { SITE_URL } from './common/Constants';
import Feedback from "./user/Feedback";
import CustomLoader from './common/CustomLoader';
var menu = ''
class MainRouter extends Component {
  // Removes the server-side injected CSS when React component mounts

  constructor() {
    super();
    this.state = {
      menu: '',
      isMount: false
    };
  }

  componentDidMount() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    const jssStyles = document.getElementById("jss-server-side");
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
    if (auth.isAuthenticated()) {
      var elmnt = document.getElementById("after");
      if (elmnt) {
        elmnt.classList.add("navmain");
      }
      var elmnt = document.getElementById("before");
      if (elmnt) {
        elmnt.classList.add("navmain");
      }
    } else {
      var elmnt = document.getElementById("before");
      if (elmnt) {
        elmnt.classList.add("navmain_before");
      }
    }
    const search = window.location.search;
    if (search != "") {
      const params = new URLSearchParams(search);
      var codeId = params.get("code");
      var isFlag = params.get("isFlag");
      if (isFlag === "true") {
        if (codeId != "") {
          isCallRedirect = true;
          window.location.href = SITE_URL + "viewcreator/" + codeId;
        }
      }
    }
    var url = window.location.pathname
    url = url.split("/");
    menu = url[1]
    this.setState({ menu: menu })
  }

  componentWillUpdate() {
    var url = window.location.pathname
    url = url.split("/");
    menu = url[1]
    if (this.state.menu != menu) {
      this.setState({ menu: menu })
    }

  }

  isMount = () => {

    this.setState({ isMount: true })
  }

  render() {
    // console.log(auth.isAuthenticated())
    // if (!auth.isAuthenticated()) {
    //   auth.signout();
    // }

    return (
      <div>

        <Menu menu={menu} isMount={this.isMount} />
        {!this.state.isMount && <CustomLoader height={30} width={30} />}
        {this.state.isMount &&
          <Switch>
            <Route exact path="/" component={Home} />
            <PrivateRoute path="/users" component={Users} />
            <Route path="/signup/" component={Signup} />
            <Route path="/signin" component={Signin} />
            <PrivateRoute path="/user/edit/:userId" component={EditProfile} />
            <PrivateRoute path="/profile/:userName" component={Profile} />

            <PrivateRoute path="/createpost" component={Create} />
            <PrivateRoute path="/text/" component={Text} />
            <PrivateRoute path="/textedit/:postId" component={Text} />
            <PrivateRoute path="/article/" component={Article} />
            <PrivateRoute path="/articleedit/:postId" component={Article} />
            <PrivateRoute path="/image/" component={Image} />
            <PrivateRoute path="/imageedit/:postId" component={Image} />
            <PrivateRoute path="/audio/" component={Audio} />
            <PrivateRoute path="/audioedit/:postId" component={Audio} />
            <PrivateRoute path="/link/" component={Link} />
            <PrivateRoute path="/linkedit/:postId" component={Link} />
            <PrivateRoute path="/video/" component={Video} />
            <PrivateRoute path="/videoedit/:postId" component={Video} />
            <PrivateRoute path="/product/:subtype" component={Product} />
            <PrivateRoute path="/productedit/:postId" component={Product} />
            <PrivateRoute
              path="/productdetails/:productId"
              component={ProductDetails}
            />
            <PrivateRoute path="/poll/" component={Poll} />
            <PrivateRoute path="/polledit/:postId" component={Poll} />
            <PrivateRoute path="/setting/:userId" component={Setting} />
            <Route path="/activation/:userId" component={LinkActivation} />
            <Route path="/emailactivation/:userId" component={EmailActivation} />

            <PrivateRoute path="/viewcreator/:codeId" component={ViewCreatorSpace} />
            <PrivateRoute exact path="/messages(/user)?/:user?" component={Messages} />
            <PrivateRoute exact path="/messagesi" component={Messages} />
            <PrivateRoute exact path="/liked/:userId" component={Liked} />
            <PrivateRoute exact path="/post/:postId" component={SinglePost} />
            <PrivateRoute path="/following/:userId" component={Following} />
            <PrivateRoute path="/followers/:userId" component={Followers} />
            <PrivateRoute path="/search" component={Search} />
            <PrivateRoute path="/notifications" component={Notifications} />
            <PrivateRoute path="/notificationsi" component={Notifications} />
            <PrivateRoute path="/becomestan/:userId" component={StanProfile} />
            <PrivateRoute path="/checkout" component={CheckoutForm} />

            <PrivateRoute path="/creatorspace/:tab?" component={CreatorSpace} />
            <PrivateRoute path="/becomecreator/:userId" component={BecomeCreator} />
            <PrivateRoute path="/wallet_earnings/:userId" component={Wallet} />
            <PrivateRoute path="/payments_transaction/:userId/:tab?" component={Payments} />
            <Route path="/forgotpwd" component={ForgetEmail} />
            <Route path="/reset/:token" component={ForgetPassword} />
            <PrivateRoute path="/allactivity/:userId/:tab" component={AllActivity} />
            <PrivateRoute path="/myorders/:userId" component={MyOrders} />
            {/* <Route path="/user/:username" component={userProfile} /> */}
            <PrivateRoute path="/refer/" component={Refer} />
            <Route path="/join/:userName" component={Join} />
            <PrivateRoute path="/download_digifiles/:orderId" component={DownloadDigiFiles} />
            <PrivateRoute path="/feedback" component={Feedback} />
            <Route component={Fourzerofour} />
          </Switch>
        }
      </div>
    );
  }
}

export default MainRouter;
