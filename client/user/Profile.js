import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Paper from "material-ui/Paper";
import List, {
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText
} from "material-ui/List";
import Avatar from "material-ui/Avatar";
import IconButton from "material-ui/IconButton";
import Button from "material-ui/Button";
import Typography from "material-ui/Typography";
import Edit from "material-ui-icons/Edit";
import Divider from "material-ui/Divider";
import DeleteUser from "./DeleteUser";
import auth from "./../auth/auth-helper";
import {
  read,
  readName,
  stan,
  getEarning,
  profilereport,
  getTransStatementByUser
} from "./api-user.js";
import { Redirect, Link } from "react-router-dom";
import FollowProfileButton from "./../user/FollowProfileButton";
import ProfileTabs from "./../user/ProfileTabs";
import {
  listByUser,
  listProductsByUser,
  countLikesByUser
} from "./../post/api-post.js";
import Card, { CardActions, CardContent, CardMedia } from "material-ui/Card";
import Grid from "material-ui/Grid";
import { FormatAlignRight } from "material-ui-icons";
import SuggestedFollower from "./SuggestedFollower";
import StanButton from "./stan/StanButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Stanning from "./Stanning";
import CustomLoader from "./../common/CustomLoader";
import Popover from "@material-ui/core/Popover";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import CustomButton from "../common/CustomButton";
import TextField from "material-ui/TextField";
import SideLoader from "./../common/SideLoader";
import Fourzerofour from "./../common/404";
import config from "../../config/config";
import Snackbar from "material-ui/Snackbar";
import { SITE_URL } from "../common/Constants";

const stanstatus = false;
var photoUrl = "";
var bannerUrl = "";
var counter = 0,
  countlikes = 0,
  countstan = 0;
const styles = theme => ({
  root: theme.mixins.gutters({
    maxWidth: 800,
    margin: "auto",
    padding: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit * 5
  }),
  title: {
    margin: `${theme.spacing.unit * 2}px ${theme.spacing.unit}px 0`,
    color: theme.palette.protectedTitle,
    fontSize: "1em"
  },
  headtitle: {
    fontSize: "18px",
    fontWeight: "normal",
    lineHeight: "22px",
    fontFamily: "Helvetica-bold",
    color: "#000",
    padding: "20px 25px",
    borderBottom: "1px solid #d6d6d6"
  },
  textFieldforms: {
    border: "1px solid #d6d6d6",
    padding: "10px",
    borderRadius: "8px",
    margin: "15px 0"
  },
  bigAvatar: {
    width: 180,
    height: 180
  },
  grid: {
    flexGrow: 1,
    margin: 30,
    float: "screenLeft",
    width: 1250
  },
  card: {
    maxWidth: 600,
    margin: "auto",
    marginTop: theme.spacing.unit * 5
  },
  title: {
    padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 2.5}px ${theme
      .spacing.unit * 2}px`,
    color: theme.palette.text.secondary
  },
  media: {
    minHeight: 450
  },
  stanbtn: {
    backgroundColor: "#5907FF"
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  parasec1: {
    fontSize: "14px",
    fontWeight: "normal",
    lineHeight: "18px",
    fontFamily: "Helvetica",
    color: "#000"
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: "8px 8px 0 0",
    boxShadow: "none",
    position: "relative",
    maxWidth: "390px",

    padding: "30px 20px",
    boxSizing: "border-box"
  },

  parasection: {
    padding: "20px 25px"
  },
  submitsuccess: {
    fontFamily: "Helvetica-bold",
    textAlign: "center",
    fontSize: "20px",
    padding: "10px 0 20px 0",
    color: "green"
  },
  btnsection: {
    padding: "0px",
    display: "flex",
    margin: "30px 0 15px 0"
  },
  reporttitle: {
    fontSize: "14px",
    fontWeight: "normal",
    lineHeight: "18px",
    fontFamily: "Helvetica-Bold",
    margin: "30px 0 10px 0",
    color: "#000"
  },
  close1: {
    position: "absolute",
    right: "20px",
    top: "10px",
    fontSize: "25px",
    cursor: "pointer"
  }
});
const BootstrapButton = withStyles({
  root: {
    boxShadow: "none",
    textTransform: "none",
    fontSize: "16px",
    margin: "0 7px",
    minHeight: "28px",
    padding: "0",
    minWidth: "95px",
    border: "1px solid",
    borderRadius: "8px",
    color: "#fff",
    lineHeight: "16px",
    backgroundColor: "#000",
    borderColor: "#000",
    fontFamily: ['"Helvetica"', "Arial"].join(","),
    "&:hover": {
      backgroundColor: "#fff",
      borderColor: "#000",
      color: "#000",
      border: "1px solid #000"
    },
    "&:active": {
      boxShadow: "none",
      backgroundColor: "#fff",
      borderColor: "#000"
    },
    "&:focus": {
      boxShadow: "0 0 0 0rem rgba(0,123,255,.5)"
    }
  }
})(Button);

var init = true;
const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};
class Profile extends Component {
  constructor(props) {
    super(props);
    this.INITIAL = {
      user: { following: [], followers: [] },
      redirectToSignin: false,
      following: false,
      posts: [],
      shop: [],
      stan: false,
      count: 0,
      location: "",
      nofstan: "",
      nofstan: "",
      noffollowing: "",
      noffollowers: "",
      income: "",
      goal: "",
      liked: 0,
      amount: 15,
      status: 1,
      isCreator: false,
      stanStatus: false,
      stanRemoved: "",
      isStanBtn: "",
      IsNofstan: "",
      IsIncome: "",
      isShop: false,
      limit: 10,
      skip: 0,
      loader: false,
      counter: 0,
      totalEarning: 0,
      menuanchor: null,
      menuopen: false,
      menuid: undefined,
      open: false,
      fromId: auth.isAuthenticated().user._id,
      toId: "",
      reporttext: "",
      reportbuttondisable: true,
      reportLoader: false,
      success: false,
      isCreator: false,
      isCreatorOtherUser: false,
      amfollowing: false,
      amstanning: false,
      showstanbutton: true,
      showaction: false,
      followingcount: 0,
      followerscount: 0,
      profileLoader: true,
      photoUrl: "",
      bannerUrl: "",
      postloader: true,
      isMobile: false,
      showMore: false,
      showText: "Show More Info ",
      init: true,
      response: true,
      buttonloader: true
    };
    this.state = this.INITIAL;
    this.match = this.props.match;
  }

  handleMore = event => {
    this.setState({
      menuanchor: event.currentTarget,
      menuopen: true,
      menuid: "simple-popper"
    });
  };

  handleClose = () => {
    this.setState({ menuanchor: null, menuopen: false, menuid: undefined });
  };

  handlePopClose = () => {
    this.setState({
      open: false,
      reportLoader: false,
      reporttext: "",
      success: false
    });
  };

  showReportForm = () => {
    this.setState({ open: true });
  };

  handleChange = name => event => {
    const value = event.target.value;
    if (value != "") {
      this.setState({
        [name]: value,
        toId: this.state.user._id,
        reportbuttondisable: false
      });
    } else {
      this.setState({ [name]: "", reportbuttondisable: true });
    }
  };

  reportuser = () => {
    this.setState({ reportLoader: true });
    const jwt = auth.isAuthenticated();
    profilereport(
      {
        fromId: this.state.fromId,
        toId: this.state.toId,
        text: this.state.reporttext,
        type: "Profile"
      },
      { t: jwt.token }
    ).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        sleep(200).then(() => {
          this.setState({
            reportLoader: false,
            reporttext: "",
            reportbuttondisable: true,
            success: true
          });
        });
      }
    });
  };

  init = userName => {
    if (init) {
      init = false;
      const jwt = auth.isAuthenticated();
      sleep(100).then(() => {
        readName(
          {
            userName: userName
          },
          { t: jwt.token }
        ).then(data => {
          if (data.error) {
            this.setState({ redirectToSignin: true });
          } else {
            if (data.length > 0) {
              data = data[0];
              /* Get Post Count by UserId */
              this.postCountByUserId(data._id);
              /* End Get Post Count by UserId */

              let following = this.checkFollow(data);
              let amfollowing = this.checkFollowing(data);
              this.setState({
                user: data,
                following: following,
                amfollowing: amfollowing,
                location: data.location,
                nofstan: data.privacy.nofstan,
                noffollowing: data.privacy.noffollowing,
                noffollowers: data.privacy.noffollowers,
                income: data.privacy.income,
                goal: data.privacy.goal,
                init: false
              });
              if (data.creater.status == 1) {
                this.setState({ isCreator: true });
              }
              data.stan.forEach(res => {
                if (
                  res.ref_id == auth.isAuthenticated().user._id &&
                  res.status == 1
                ) {
                  var dt = new Date(res.stan_date);
                  dt.setMonth(dt.getMonth() + 1);
                  this.setState({
                    stanStatus: true,
                    stanRemoved: dt
                  });
                } else if (
                  res.ref_id == auth.isAuthenticated().user._id &&
                  res.status == 0
                ) {
                  var today = new Date();
                  var stan_date = new Date(res.stan_date);
                  stan_date.setMonth(stan_date.getMonth() + 1);
                  const date1 = today;
                  const date2 = new Date(res.periodEnd); //new Date(stan_date);
                  const diffTime = Math.abs(date2 - date1);
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  if (date2 > date1) {
                    this.setState({ showstanbutton: false });
                  }

                  // if (res.stan_lost_date) {
                  //   var stan_lost_date = res.stan_lost_date
                  //   const date1 = new Date(stan_lost_date);
                  //   const date2 = new Date(stan_date);
                  //   const diffTime = Math.abs(date2 - date1);
                  //   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  //   if (diffDays > 0) {
                  //     this.setState({ showstanbutton: false });
                  //   }
                  // }
                }
              });

              data.stanning.forEach(res => {
                if (
                  res.creatorId == auth.isAuthenticated().user._id &&
                  res.status == 1
                ) {
                  this.setState({ amstanning: true });
                }
              });
              this.setState({
                isStanBtn: data.subscriptionpitch.stanbtn,
                IsNofstan: data.privacy.nofstan,
                IsIncome: data.privacy.income
              });
              if (data.shopenable.shopstatus === true) {
                this.setState({ isShop: true });
              }
              // if (data.creater.status == 1) {
              //   this.setState({ isCreator: true });
              // }
              var following = [];
              if (data.following.length > 0) {
                data.following.forEach(element => {
                  if (element._id && element.isDeleted == 0) {
                    following.push(element);
                  }
                });
              }
              var followingcount = following.length;
              var followerscount = 0;
              if (data.followers.length > 0) {
                data.followers.forEach(res => {
                  if (res.status == 1 && res.followers_id.isDeleted == 0) {
                    followerscount++;
                  }
                });
              }
              this.setState({
                followingcount: followingcount,
                followerscount: followerscount
              });
              photoUrl = data.photo
                ? config.profileImageBucketURL + data.photo
                : config.profileDefaultPath;
              // data._id
              //   ? `/api/users/photo/${data._id}?${new Date().getTime()}`
              //   : "/api/users/defaultphoto";

              bannerUrl = data.banner
                ? config.bannerImageBucketURL + data.banner
                : config.bannerDefaultPath;
              //  data._id
              //   ? `/api/users/banner/${data._id}?${new Date().getTime()}`
              //   : "/api/users/defaultbanner";
              this.setState({
                photoUrl: photoUrl,
                bannerUrl: bannerUrl
              });
              countstan = data.stan.length;
              this.loadPosts(data._id);
              this.setState({ profileLoader: false });
              this.loadEarnings(data._id);
              this.loadProducts(data._id);
              this.countLikes(data._id);
              /* Check other user creator status */
              if (jwt.user._id != data._id && data.creater.status == 1) {
                this.setState({ isCreatorOtherUser: true });
              }
              if (auth.isAuthenticated().user._id != data._id) {
                this.setState({ showaction: true });
              }
              /*End check user creator status */
              sleep(100).then(() => {
                this.setState({ buttonloader: false });
              });
            } else {
              this.setState({
                redirectToSignin: true,
                profileLoader: false
              });
            }
          }
        });
      });
      /* Start Fetch Total Earning of User */
      // getEarning(
      //   {
      //     userId: jwt.user._id
      //   },
      //   { t: jwt.token }
      // ).then(data => {
      //   if (data.error) {
      //     this.setState({ redirectToSignin: true });
      //   } else {
      //     //totalEarning
      //     data.forEach(element => {
      //       let orderAmount = 0;
      //       if (element.orders.length > 0 && element.orders[0] != null) {
      //         element.orders.forEach(element1 => {
      //           orderAmount = orderAmount + element1.price;
      //         });
      //       }
      //       let tipAmount = 0;
      //       if (element.posts.length > 0) {
      //         element.posts.forEach(element1 => {
      //           element1.tips.forEach(element2 => {
      //             tipAmount = tipAmount + element2.amount;
      //           });
      //         });
      //       }
      //       let stanAmount = 0;
      //       if (element.stan.length > 0) {
      //         element.stan.forEach(element1 => {
      //           stanAmount = stanAmount + element1.amount;
      //         });
      //       }
      //       let totalEarning = orderAmount + tipAmount + stanAmount;
      //       this.setState({ totalEarning: totalEarning });
      //     });
      //   }
      // });

      /* End Fetch Total Earning of User */
      init = true;
    }
  };
  loadEarnings = user => {
    const jwt = auth.isAuthenticated();

    getTransStatementByUser(
      {
        userId: user
      },
      {
        t: jwt.token
      }
    ).then(data => {
      if (data.error) {
      } else {
        var totalEarning = 0;
        var totalWithdrawal = 0;
        var remainingTotalEarning = 0;
        data.forEach(element => {
          if (element.tranStatus == 0) {
            totalEarning = totalEarning + element.amount;
          } else {
            totalWithdrawal = totalWithdrawal + element.amount;
          }
        });
        remainingTotalEarning = totalEarning - totalWithdrawal;
        this.setState({ totalEarning: remainingTotalEarning });
      }
    });
  };

  componentWillReceiveProps = props => {
    // this.setState({
    //   ...this.INITIAL
    //  });
    this.setState({
      ...this.INITIAL
    });
    this.match = props.match;
    //   if (init) {
    this.init(props.match.params.userName);
    // }

    var isMobile = screen.width <= config.maxMobileWidth ? true : false; //   /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      this.setState({ isMobile: true });
    }
  };
  componentDidMount = () => {
    //console.log(" hello com ", this.match.params);
    init = true;
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    this.reportData = new FormData();
    //  if (init) {
    this.init(this.match.params.userName);
    // }
    document.addEventListener("scroll", this.trackScrolling);
  };
  postCountByUserId = userId => {
    // console.log("inside postCountByUserId ", userId);
    /* Count Posts by User */
    const jwt = auth.isAuthenticated();
    listByUser(
      {
        userId: userId,
        id: jwt.user._id,
        postcount: true
      },
      {
        t: jwt.token
      }
    ).then(data => {
      if (data.error) {
        this.setState({ loader: false });
      } else {
        var postCount = 0;
        if (data > 0) {
          // console.log(" posts count :" + data);
          postCount = data;
        }
        this.setState({ counter: postCount });
      }
    });
    /* End Count by User */
  };
  componentWillUnmount() {
    init = true;
  }
  componentWillUnmount() {
    document.removeEventListener("scroll", this.trackScrolling);
  }
  isBottom(el) {
    return el.getBoundingClientRect().bottom <= window.innerHeight;
  }
  trackScrolling = () => {
    const wrappedElement = document.getElementById("profilefeed");
    if (this.isBottom(wrappedElement) && this.state.response) {
      if (!this.state.loader) {
        this.setState({ loader: true });
        this.loadPosts(this.state.user._id);
      }

      document.removeEventListener("scroll", this.trackScrolling);
    }
  };

  showMore = () => {
    if (this.state.showMore) {
      this.setState({ showMore: false, showText: "Show More Info " });
    } else {
      this.setState({ showMore: true, showText: "Show Less" });
    }
  };

  checkFollow = user => {
    let followStatus = false;
    const jwt = auth.isAuthenticated();
    user.followers.find(follower => {
      if (follower.followers_id._id == jwt.user._id && follower.status == 1) {
        followStatus = true;
      }
      //followStatus = follower.followers_id._id == jwt.user._id && follower.status == 1;
    });
    return followStatus;
  };
  checkFollowing = user => {
    let followStatus = false;
    const jwt = auth.isAuthenticated();
    user.following.find(following => {
      if (following._id == jwt.user._id) {
        followStatus = true;
      }
      //followStatus = follower.followers_id._id == jwt.user._id && follower.status == 1;
    });
    return followStatus;
  };
  clickFollowButton = callApi => {
    const jwt = auth.isAuthenticated();
    callApi(
      {
        userId: jwt.user._id
      },
      {
        t: jwt.token
      },
      this.state.user._id
    ).then(data => {
      if (data.error) {
        this.setState({ error: data.error });
      } else {
        this.setState({ following: !this.state.following });
      }
    });
  };
  clickSubmit = () => {
    const jwt = auth.isAuthenticated();
    const user = {
      status: this.state.status || undefined,
      ref_id: this.match.params.userId || undefined,
      amount: this.state.amount || undefined
    };
    stan(
      {
        userId: this.match.params.userId
      },
      {
        t: jwt.token
      },
      user
    ).then(data => {
      if (data.error) {
        this.setState({ error: data.error });
      }
    });
  };
  loadPosts = user => {
    if (this.state.response) {
      this.setState({ response: false });
      const jwt = auth.isAuthenticated();

      listByUser(
        {
          userId: user,
          id: jwt.user._id,
          limit: this.state.limit,
          skip: this.state.skip
        },
        {
          t: jwt.token
        }
      ).then(data => {
        if (data.error) {
          this.setState({ loader: false });
        } else {
          if (this.state.skip == 0) {
            this.setState({
              posts: data,
              skip: this.state.skip + 10,
              // counter: this.state.counter + data.length,
              postloader: false,
              response: true
            });
          } else {
            var joined = this.state.posts.concat(data);
            sleep(200).then(() => {
              this.setState({
                posts: joined,
                skip: this.state.skip + 10,
                loader: false,
                //  counter: this.state.counter + data.length,
                postloader: false,
                response: true
              });
            });
            if (data.length == 10) {
              document.addEventListener("scroll", this.trackScrolling);
            }
          }
          // this.setState({ posts: data })
          // const result = Object.values(data)
          // counter = result.length
          //  const postdata  = JSON.stringify(result)
          // data.forEach((function(entry) {
          //   if(entry.likes===user)
          //     countlikes = entry.likes.length
          //    }))
        }
      });
    }
  };

  loadProducts = user => {
    const jwt = auth.isAuthenticated();
    listProductsByUser(
      {
        userId: user
      },
      {
        t: jwt.token
      }
    ).then(data => {
      if (data.error) {
      } else {
        this.setState({ shop: data });
      }
    });
  };
  countLikes = user => {
    const jwt = auth.isAuthenticated();
    countLikesByUser(
      {
        userId: user
      },
      {
        t: jwt.token
      }
    ).then(data => {
      if (data.error) {
      } else {
        const result = Object.values(data);
        countlikes = result.length;
        this.setState({ liked: countlikes });
      }
    });
  };
  removePost = post => {
    const updatedPosts = this.state.posts;
    const index = updatedPosts.indexOf(post);
    updatedPosts.splice(index, 1);
    this.setState({ posts: updatedPosts });
  };

  removeScroll = () => {
    document.removeEventListener("scroll", this.trackScrolling);
  };
  addScroll = () => {
    document.addEventListener("scroll", this.trackScrolling);
  };

  removeProduct = post => {
    const updatedPosts = this.state.shop;
    const index = updatedPosts.indexOf(post);
    updatedPosts.splice(index, 1);
    this.setState({ shop: updatedPosts });
  };

  copyLinkToClipboard = username => {
    var textarea = document.createElement("textarea");
    textarea.textContent = SITE_URL + "profile/" + username;
    document.body.appendChild(textarea);

    var selection = document.getSelection();
    var range = document.createRange();
    //  range.selectNodeContents(textarea);
    range.selectNode(textarea);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("copy");
    selection.removeAllRanges();

    document.body.removeChild(textarea);

    // var textField = document.createElement("textarea");
    // textField.innerText = SITE_URL + "profile/" + username;
    // document.body.appendChild(textField);
    // textField.select();
    // document.execCommand("copy");
    // textField.remove();
    this.setState({
      snackopen: true,
      successMessage: "copied to clipboard !!",
      openid: -1
    });
  };

  handleRequestClose = (event, reason) => {
    this.setState({ snackopen: false });
  };

  handleStanStatus = () => {
    this.setState({ showstanbutton: true });
  };

  render() {
    if (this.state.profileLoader) {
      return <CustomLoader height={50} width={50} />;
    } else {
      const { classes } = this.props;

      const redirectToSignin = this.state.redirectToSignin;
      if (redirectToSignin) {
        return <Fourzerofour />;
      }
      return (
        <section>
          <div
            className={classes.grid}
            className={"profile-cover-container-outer"}
          >
            <Grid className={"profile-cover-container"}>
              {/* <Typography type="title" className={classes.title}>
           Profile
         </Typography> */}

              <CardMedia
                className={"profile-cover-container-image"}
                image={this.state.bannerUrl}
                title="banner image"
              />
              {auth.isAuthenticated().user._id == this.state.user._id && (
                <Link
                  to={"/setting/" + this.state.user._id}
                  className={"edit-profile"}
                >
                  <IconButton aria-label="Edit" color="primary">
                    <i className={"fal fa-pen"}></i>
                    Edit Profile
                  </IconButton>
                </Link>
              )}

              <List className={"profile-cover-container-list"}>
                <ListItem className={"profile-picture-box"}>
                  <div className={"profile-picture-box-inner"}>
                    <ListItemAvatar className={"profile-picture-image"}>
                      <Avatar
                        src={this.state.photoUrl}
                        className={classes.bigAvatar}
                      />
                    </ListItemAvatar>

                    {auth.isAuthenticated().user._id == this.state.user._id &&
                      auth.isAuthenticated().user.creator > 0 && (
                        <div className={"profile-verified"}>
                          {/** <img src="/dist/create/certified.svg" />**/}
                          <div className={"creator-img-div"}>c</div>
                        </div>
                      )}
                    {this.state.isCreatorOtherUser && (
                      <div className={"profile-verified"}>
                        <div className={"creator-img-div"}>c</div>
                      </div>
                    )}
                  </div>
                  <ListItemText
                    className={"profile-name"}
                    primary={this.state.user.name}
                    secondary={this.state.user.email}
                  />{" "}
                  {auth.isAuthenticated().user ? (
                    <ListItemSecondaryAction className={"own-profile-listing"}>
                      <CardContent className={"own-profile-listing-card"}>
                        {/**   {(!this.state.nofstan || auth.isAuthenticated().user._id == this.state.user._id)  ?
                    (<Typography>STAN:0</Typography>):
                      (null)
                       }**/}
                        <ul>
                          <li>
                            {" "}
                            <Grid className={"txt"}>
                              Posts{" "}
                              <span className={"profile-counter"}>
                                {this.state.counter}{" "}
                              </span>{" "}
                            </Grid>{" "}
                          </li>
                          <li>
                            {" "}
                            {!this.state.noffollowing ||
                            auth.isAuthenticated().user._id ==
                              this.state.user._id ? (
                              <Link
                                to={
                                  "/allactivity/" + this.state.user._id + "/0"
                                }
                              >
                                <Grid>
                                  Following{" "}
                                  <span className={"profile-counter"}>
                                    {this.state.followingcount}
                                  </span>
                                </Grid>
                              </Link>
                            ) : null}
                          </li>
                          <li>
                            {" "}
                            {!this.state.noffollowers ||
                            auth.isAuthenticated().user._id ==
                              this.state.user._id ? (
                              <Link
                                to={
                                  "/allactivity/" + this.state.user._id + "/1"
                                }
                              >
                                {" "}
                                <Typography>
                                  Followers{" "}
                                  <span className={"profile-counter"}>
                                    {this.state.followerscount}
                                  </span>
                                </Typography>
                              </Link>
                            ) : null}{" "}
                          </li>
                          {/**  {(!this.state.income || auth.isAuthenticated().user._id == this.state.user._id)  ?
                       (<Typography> income: 0</Typography>) : (null)
                       }**/}
                          {/**  {(!this.state.goal || auth.isAuthenticated().user._id == this.state.user._id)  ?
                       (<Typography> Goal: 100</Typography>) : (null)
                       }**/}
                          <li>
                            {" "}
                            <Typography>
                              <Link
                                to={
                                  "/allactivity/" + this.state.user._id + "/2"
                                }
                              >
                                Likes{" "}
                                <span className={"profile-counter"}>
                                  {" "}
                                  {this.state.liked}
                                </span>
                              </Link>
                            </Typography>{" "}
                          </li>{" "}
                        </ul>
                      </CardContent>
                      {this.state.showaction && (
                        <div className={"profile-message-menu"}>
                          <ul>
                            <li>
                              <Link
                                to={"/messages/user/" + this.state.user._id}
                              >
                                <i
                                  className="far fa-envelope"
                                  aria-hidden="true"
                                ></i>
                              </Link>
                              {/* <a href="#">
                              <i
                                className="fa fa-envelope-o"
                                aria-hidden="true"
                              ></i>
                            </a> */}
                            </li>
                            <li onClick={this.handleMore}>
                              <a>
                                <i className="far fa-ellipsis-v"></i>
                              </a>
                            </li>
                          </ul>
                          <Popover
                            id={this.state.menuid}
                            open={this.state.menuopen}
                            anchorEl={this.state.menuanchor}
                            onClose={this.handleClose}
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "right"
                            }}
                            transformOrigin={{
                              vertical: "top",
                              horizontal: "right"
                            }}
                          >
                            <MenuList className={"menu-popup profilepopup"}>
                              <MenuItem
                                onClick={() =>
                                  this.copyLinkToClipboard(
                                    this.state.user.username
                                  )
                                }
                              >
                                Copy Profile Link
                              </MenuItem>
                              <MenuItem onClick={this.showReportForm}>
                                Report
                              </MenuItem>
                            </MenuList>
                          </Popover>
                          <Modal
                            aria-labelledby="transition-modal-title"
                            aria-describedby="transition-modal-description"
                            className={classes.modal}
                            open={this.state.open}
                            onClose={this.handlePopClose}
                            closeAfterTransition
                            BackdropComponent={Backdrop}
                            BackdropProps={{
                              timeout: 500
                            }}
                          >
                            <Fade in={this.state.open}>
                              <div className={"report-container"}>
                                <Typography
                                  component="h2"
                                  className={classes.headtitle}
                                >
                                  Report {this.state.user.name}
                                </Typography>
                                <Typography
                                  component="div"
                                  className={classes.close1}
                                >
                                  {" "}
                                  <i
                                    className="fal fa-times-circle"
                                    onClick={this.handlePopClose}
                                  ></i>{" "}
                                </Typography>
                                <Typography
                                  component="div"
                                  className={classes.parasection}
                                >
                                  <Typography
                                    component="p"
                                    className={classes.parasec1}
                                  >
                                    We take reports of harm, abuse, bullying or
                                    explicit content seriously. Please let us
                                    know why you would like to report this user.
                                  </Typography>
                                  <Typography
                                    component="p"
                                    className={classes.reporttitle}
                                  >
                                    Why are you reporting {this.state.user.name}
                                    ? (Optional)
                                  </Typography>
                                  <TextField
                                    id="standard-full-width"
                                    placeholder="Write Something.."
                                    fullWidth
                                    multiline
                                    rows="6"
                                    value={this.state.reporttext}
                                    onChange={this.handleChange("reporttext")}
                                    className={"report-textfield "}
                                    margin="normal"
                                    InputLabelProps={{
                                      shrink: true
                                    }}
                                    InputProps={{
                                      disableUnderline: true,
                                      classes: {
                                        input: this.props.classes["input"]
                                      },
                                      style: {
                                        padding: 0
                                      }
                                    }}
                                  />
                                  <Typography
                                    component="div"
                                    className={classes.btnsection}
                                  >
                                    {this.state.reportLoader && (
                                      <CustomLoader height={30} width={30} />
                                    )}
                                    {!this.state.reportLoader && (
                                      <CustomButton
                                        label="Cancel"
                                        onClick={this.handlePopClose}
                                        className={"Secondary_btn can-btn"}
                                      />
                                    )}
                                    {!this.state.reportLoader && (
                                      <CustomButton
                                        label="Report User"
                                        disabled={
                                          this.state.reportbuttondisable
                                        }
                                        onClick={this.reportuser}
                                        className={"Primary_btn_blk rep-btn"}
                                      />
                                    )}
                                  </Typography>
                                </Typography>
                                {this.state.success && (
                                  <Typography className={classes.submitsuccess}>
                                    Submitted Successfully !!
                                  </Typography>
                                )}
                              </div>
                            </Fade>
                          </Modal>
                        </div>
                      )}
                      {/** <DeleteUser userId={this.state.user._id}/>**/}
                    </ListItemSecondaryAction>
                  ) : null}
                </ListItem>
              </List>
            </Grid>
            <Grid className={"profile-bio-container"} container>
              <Grid item xs={12} sm={4} className={"profile-bio"}>
                <Typography component="h2" className={"profile-name title_30"}>
                  {" "}
                  {this.state.user.name}{" "}
                </Typography>
                <Typography component="div" className={"profile-username"}>
                  <div className={"user-add"}>@{this.state.user.username}</div>
                  {this.state.user._id != auth.isAuthenticated().user._id && (
                    <div>
                      <div className={"follow-profile"}>
                        {this.state.amfollowing && !this.state.amstanning && (
                          <Typography component="div" className={"gray-bg"}>
                            <Typography component="p">Follows you</Typography>
                          </Typography>
                        )}
                      </div>
                      <div className={"stanning-profile"}>
                        {this.state.amstanning && (
                          <Typography component="div" className={"gray-bg"}>
                            <Typography component="p">Stanning you</Typography>
                          </Typography>
                        )}
                      </div>
                    </div>
                  )}
                </Typography>

                {this.state.user.creatorcategory && (
                  <div className={"profile-category-block"}>
                    {this.state.user.creatorcategory.map(
                      (singlecategory, j) => {
                        return (
                          <BootstrapButton
                            key={j}
                            size="small"
                            className={"profile-category"}
                          >
                            {" "}
                            {singlecategory.name}{" "}
                          </BootstrapButton>
                        );
                      }
                    )}
                  </div>
                )}
                {(this.state.user.about || this.state.location) &&
                  (!this.state.isMobile || this.state.showMore) && (
                    <div className={"profile-bio-add"}>
                      <Typography component="p" className={"profile-data"}>
                        {this.state.user.about}
                      </Typography>

                      {auth.isAuthenticated().user &&
                      auth.isAuthenticated().user._id == this.state.user._id ? (
                        <Link
                          to={"/setting/" + this.state.user._id}
                          className={"edit-bio"}
                        >
                          Edit bio
                        </Link>
                      ) : null}

                      {/**<ListItem>
              <ListItemText primary={this.state.user.about} secondary={"Joined: " + (
                new Date(this.state.user.created)).toDateString()} />
              </ListItem>  **/}
                      {this.state.location && (
                        <div className={"user-location"}>
                          <i
                            className="fal fa-map-marker-alt"
                            aria-hidden="true"
                          ></i>{" "}
                          {this.state.location}
                        </div>
                      )}
                    </div>
                  )}
                {(!this.state.isMobile || this.state.showMore) && (
                  <Grid className={"stan-price"}>
                    {this.state.isStanBtn === true &&
                      (this.state.IsNofstan || this.state.IsIncome) && (
                        <Table className={"tabledata"}>
                          <TableBody>
                            {this.state.IsNofstan && (
                              <TableRow>
                                <TableCell align="left">Stans</TableCell>
                                <TableCell align="left" className={"sp-value"}>
                                  {countstan}
                                </TableCell>
                              </TableRow>
                            )}

                            {this.state.IsIncome && (
                              <TableRow>
                                <TableCell align="left">Earnings</TableCell>
                                <TableCell align="left" className={"sp-value"}>
                                  {Number(this.state.totalEarning.toFixed(2))} $
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      )}
                  </Grid>
                )}
                {this.state.isMobile &&
                  (this.state.user.about != "" ||
                    this.state.location != "" ||
                    this.state.IsNofstan ||
                    this.state.IsIncome) && (
                    <div className={"data-show"} onClick={this.showMore}>
                      {this.state.showText}
                      {!this.state.showMore && (
                        <i className="fal fa-chevron-down"></i>
                      )}
                      {this.state.showMore && (
                        <i className="fal fa-chevron-up left"></i>
                      )}
                    </div>
                  )}
                {auth.isAuthenticated().user &&
                auth.isAuthenticated().user._id != this.state.user._id &&
                this.state.isCreator &&
                this.state.showstanbutton &&
                this.state.isStanBtn &&
                !this.state.buttonloader ? (
                  <StanButton
                    className={"classes.stanbtn"}
                    userId={this.state.user._id}
                    stanRemoved={this.state.stanRemoved}
                    stan={this.state.stan}
                    onStanButtonClick={this.clickFollowButton}
                    name={this.state.user.name}
                    handleStanStatus={this.handleStanStatus}
                  />
                ) : null}

                {/**< <CardContent>
              {auth.isAuthenticated().user ?
                (<Grid>
                  <CardContent>
                    {(auth.isAuthenticated().user._id == this.state.user._id) ? (null) :
                      (
                        <Button variant="raised" color="primary" component="span" id="payment-request-button" onClick={this.clickSubmit}>Stan $10</Button>)}
                  </CardContent>
                </Grid>) : (null)}

                      </CardContent>  **/}

                {/* <h2>Stanning </h2>
          <CardContent type="headline" component="h2" className={classes.title}>
          You are not stanning<br/> anyone at the moment.<br/>
          Discover and explore
          </CardContent> */}

                {/* <h2>Following </h2> */}
                <Grid item xs={12}>
                  {auth.isAuthenticated().user &&
                  auth.isAuthenticated().user.username !=
                    this.match.params.userName &&
                  !this.state.stanStatus &&
                  this.state.showstanbutton &&
                  !this.state.buttonloader ? (
                    <div className={"suggested-followers"}>
                      <FollowProfileButton
                        following={this.state.following}
                        onButtonClick={this.clickFollowButton}
                      />
                    </div>
                  ) : null}
                  {this.state.buttonloader && (
                    <CustomLoader
                      customclass={"loader_bottom"}
                      width="30px"
                      height="30px"
                    />
                  )}
                  {/* Become a stan for following creators and see posts<br/>
          in feed. */}

                  {/* {auth.isAuthenticated().user && auth.isAuthenticated().user._id == this.state.user._id &&
                  < Grid >
                    <SuggestedFollower />
                  </Grid>
                } */}
                  {/* {auth.isAuthenticated().user &&
                    auth.isAuthenticated().user._id == this.state.user._id && (
                      <Grid>
                        <Stanning />
                      </Grid>
                    )} */}
                  {/* <div
                      className={"explore-more"}
                      variant="raised"
                      color="default"
                    > */}
                  {/* <Link to={"/users/findpeople/" + this.state.user._id} >Explore more</Link> */}
                  {/* <Link to={"/search"}>Explore more</Link> */}
                  {/* </div> */}
                </Grid>
              </Grid>
              <Grid
                item
                xs={12}
                sm={8}
                id={"profilefeed"}
                className={"profile-right"}
              >
                <ProfileTabs
                  isShop={this.state.isShop}
                  isCreator={this.state.isCreator}
                  user={this.state.user}
                  shop={this.state.shop}
                  posts={this.state.posts}
                  removePostUpdate={this.removePost}
                  removeProductUpdate={this.removeProduct}
                  removeScroll={this.removeScroll}
                  addScroll={this.addScroll}
                  userId={this.state.user._id}
                  postloader={this.state.postloader}
                />
                {this.state.loader && (
                  <CustomLoader
                    customclass={"loader_bottom"}
                    width="30px"
                    height="30px"
                  />
                )}
              </Grid>
            </Grid>
          </div>
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right"
            }}
            className={"snack-class"}
            open={this.state.snackopen}
            onClose={this.handleRequestClose}
            autoHideDuration={600}
            message={
              <span className={classes.snack}>{this.state.successMessage}</span>
            }
          />
        </section>
      );
    }
  }
}
Profile.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(Profile);
