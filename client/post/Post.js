import React, { Component } from "react";
import auth from "./../auth/auth-helper";
import Card, { CardHeader, CardContent, CardActions } from "material-ui/Card";
import Typography from "material-ui/Typography";
import Avatar from "material-ui/Avatar";
import IconButton from "material-ui/IconButton";
import MoreHoriz from "material-ui-icons/MoreHoriz";
import Divider from "material-ui/Divider";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import { Link } from "react-router-dom";
import { remove, like, unlike, poll, repost } from "./api-post.js";
import Comments from "./Comments";
import Preview from "./../common/Preview";
import Button from "material-ui/Button";
import AttachFile from "material-ui-icons/AttachFile";
import Popper from "@material-ui/core/Popper";
import Fade from "@material-ui/core/Fade";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import CustomButton from "./../common/CustomButton";
import DeletePost from "./DeletePost";
import ReportPost from "./ReportPost";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon
} from "react-share";
import Poll from "./poll/Post";
import Image from "./image/Post";
import Text from "./text/Post";
import Audio from "./audio/Post";
import Video from "./video/Post";
import PostLink from "./link/Post";
import Article from "./article/Post";
import TipsModal from "././Tips/TipsModal";
import Snackbar from "material-ui/Snackbar";
import { SITE_URL } from "../common/Constants";
import config from "../../config/config";

const styles = theme => ({
  cardContent: {
    backgroundColor: "white",
    padding: `${theme.spacing.unit * 2}px 0px`
  },
  text: {
    margin: theme.spacing.unit * 2
  },
  snack: {
    color: theme.palette.protectedTitle
  },
  pop_positon: {
    marginTop: "11px"
  },
  pop_positon_mob: {
    marginTop: "6px"
  }

  // typography: {
  //   marginTop: "11px",
  // }
});

const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

var planInfo = 0;
class Post extends Component {
  state = {
    like: false,
    likes: 0,
    comments: [],
    read: true,
    hide: false,
    show: false,
    poll: [],
    option: "",
    total1: "",
    total2: "",
    total3: "",
    total4: "",
    openid: "",
    popanchor: null,
    popopen: false,
    id: undefined,
    pid: undefined,
    share: false,
    deleteClick: false,
    reportClick: false,
    totalTipsAmount: 0,
    tipStatus: 0,
    displaypost: false,
    postedByName: "",
    repostBy: 0,
    reposted: false,
    clicked: false,
    isReported: false,
    isMobile: false
  };

  postListData = () => {
    let tipsData = this.props.post.tips;
    let totalTipsAmount = 0;
    tipsData.forEach(tip => {
      totalTipsAmount += tip.amount;
      if (tip.userId == auth.isAuthenticated().user._id) {
        this.setState({ tipStatus: 1 });
      }
    });
    this.postData = new FormData();
    this.setState({
      like: this.checkLike(this.props.post.likes),
      likes: this.props.post.likes.length,
      comments: this.props.post.comments.reverse(),
      read: true,
      totalTipsAmount: totalTipsAmount,
      postedByName: this.props.post.postedBy.name,
      repostBy: this.props.post.repostBy
        ? this.props.post.repostBy.length
        : this.state.repostBy,
      reposted: this.props.post.repostBy.includes(
        auth.isAuthenticated().user._id
      )
        ? true
        : false
    });
    if (this.props.post.polled != "") {
      this.setState({ option: this.checkPoll(this.props.post.polled) });
    }
  };

  componentDidMount = () => {
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      this.setState({ isMobile: true });
    }
    this.postListData();
    var displaypostvalue = false;
    if (this.props.post.viewtype == "public") {
      displaypostvalue = true;
    }
    if (this.props.post.postedBy._id === auth.isAuthenticated().user._id) {
      displaypostvalue = true;
    }
    if (
      this.props.post.postedBy.stan == null &&
      typeof this.props.post.postedBy.stan != "undefined"
    ) {
      if (this.props.post.viewtype == "stans") {
        displaypostvalue = true;
      }
    }
    //console.log("(this.props.top" + this.props.top)
    // if (this.props.top) {
    //   document.body.scrollTop = 0; // For Safari
    //   document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    // }

    this.setState({ displaypost: displaypostvalue });
    if (this.props.post.report.length > 0) {
      this.props.post.report.map((item, i) => {
        if (item == auth.isAuthenticated().user._id) {
          this.setState({ isReported: true });
        }
      });
    }
  };

  componentWillReceiveProps = props => {
    this.postListData();
    var displaypostvalue = false;
    if (this.props.post.viewtype == "public") {
      displaypostvalue = true;
    }
    if (this.props.post.postedBy._id === auth.isAuthenticated().user._id) {
      displaypostvalue = true;
    }
    if (
      this.props.post.postedBy.stan == null &&
      typeof this.props.post.postedBy.stan != "undefined"
    ) {
      if (this.props.post.viewtype == "stans") {
        displaypostvalue = true;
      }
    }

    this.setState({ displaypost: displaypostvalue });
    this.setState({
      like: this.checkLike(props.post.likes),
      likes: props.post.likes.length,
      comments: props.post.comments.reverse()
    });
  };

  checkLike = likes => {
    const jwt = auth.isAuthenticated();
    let match = likes.indexOf(jwt.user._id) !== -1;
    return match;
  };

  checkPoll = polls => {
    // console.log(polls) // submitted by other user
    const jwt = auth.isAuthenticated();
    var totalpolled = polls.length;
    var myoption = "";
    var polled = [];
    for (var i = 0; i < totalpolled; i++) {
      if (polls[i].postedBy == jwt.user._id) {
        myoption = polls[i].option;
      } else {
        console.log("not found");
      }
      polled.push(polls[i].option); // only option chossed by other person
    }
    const result = Object.values(this.props.post.options); // options given by creator
    var counter = result.length;
    var totaloptions = 0;

    var uniqueNames = []; //this.getUnique(polled)
    polled.sort();
    var current = null;
    var cnt = 0;
    var totaloptionpolled = [];
    for (var i = 0; i <= polled.length; i++) {
      if (polled[i] != current) {
        if (cnt > 0) {
          totaloptionpolled.push(cnt);
          uniqueNames.push(current);
          //document.write(current + ' comes --> ' + cnt + ' times<br>');
        }
        current = polled[i];
        cnt = 1;
      } else {
        cnt++;
      }
    }
    for (var i = 0; i < counter; i++) {
      if (result[i] != "") {
        totaloptions++;
      }
    }

    var index = "";
    if (this.postData.get("option") != null || myoption != "") {
      for (var i = 0; i < totaloptions; i++) {
        var optionresult = (totaloptionpolled[i] / totalpolled) * 100;
        optionresult = Math.round(optionresult);
        if (result.includes(uniqueNames[i])) {
          index = result.indexOf(uniqueNames[i]);
        }
        if (optionresult && index == 0) this.setState({ total1: optionresult });
        if (optionresult && index == 1) this.setState({ total2: optionresult });
        if (optionresult && index == 2) this.setState({ total3: optionresult });
        if (optionresult && index == 3) this.setState({ total4: optionresult });
      }
    }
    return myoption;
  };

  getUnique(array) {
    var uniqueArray = [];

    // Loop through array values
    for (var i = 0; i < array.length; i++) {
      if (uniqueArray.indexOf(array[i]) === -1) {
        uniqueArray.push(array[i]);
      }
    }
    return uniqueArray;
  }

  like = () => {
    let callApi = this.state.like ? unlike : like;
    const jwt = auth.isAuthenticated();
    this.setState({ clicked: true });
    callApi(
      {
        userId: jwt.user._id
      },
      {
        t: jwt.token
      },
      this.props.post._id
    ).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.props.post.likes.push(jwt.user._id);
        this.setState({
          like: !this.state.like,
          likes: data.likes.length,
          clicked: false
        });
      }
    });
  };
  expandedText = () => {
    this.setState({ show: true });
    this.setState({ hide: true });
    this.setState({ read: false });
  };
  LessText = () => {
    this.setState({ show: false });
    this.setState({ hide: false });
    this.setState({ read: true });
  };

  updateComments = comments => {
    console.log(comments);
    this.props.post.comments = comments;
    this.setState({ comments: comments });
    //this.props.updateComments(comments)
  };

  deletePost = () => {
    const jwt = auth.isAuthenticated();
    remove(
      {
        postId: this.props.post._id
      },
      {
        t: jwt.token
      }
    ).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        //console.log(this.state.openid)
        //this.setState({openid: -1})
        //sleep(500).then(() => {
        this.props.onRemove(this.props.post);
        //})
        // console.log(this.state.openid)
      }
    });
  };

  onReport = () => {
    console.log("here for on report");
    sleep(100).then(() => {
      this.setState({ reportClick: false, isReported: true, openid: -1 });
    });
  };

  handlePollChange = name => event => {
    const value = event.target.value;
    this.postData.set("option", value);
    this.setState({ option: value });
    setTimeout(
      function() {
        this.submitPoll();
      }.bind(this),
      100
    );
    var json = { option: value };
    this.props.post.polled.push(json);
    this.checkPoll(this.props.post.polled);
  };

  submitPoll = () => {
    const jwt = auth.isAuthenticated();
    poll(
      {
        userId: jwt.user._id
      },
      {
        t: jwt.token
      },
      this.props.post._id,
      { option: this.state.option }
    ).then(data => {
      if (data.error) {
        this.setState({ error: data.error });
      } else {
        console.log("done");
      }
    });
  };

  copyToClipboard = postId => {
    var textField = document.createElement("textarea");
    textField.innerText = SITE_URL + "post/" + postId;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
    this.setState({
      open: true,
      successMessage: "copied to clipboard !!",
      openid: -1
    });
  };

  handleRequestClose = (event, reason) => {
    this.setState({ open: false });
  };

  handleMore = (event, openid) => {
    if (this.state.popopen) {
      this.setState({
        openid: openid,
        popanchor: event.currentTarget,
        popopen: true,
        pid: "simple-popper"
      });
      // console.log("openid"+openid)
      // this.setState({openid: openid})
      // this.setState({popanchor: event.currentTarget})
      // this.setState({popopen: true})
      // //this.setState({id: 'simple-popover'})
      // this.setState({pid: 'simple-popper'})
    } else {
      this.setState({ openid: openid });
      this.setState({ popanchor: event.currentTarget });
      this.setState({ popopen: true });
      //this.setState({id: 'simple-popover'})
      this.setState({ pid: "simple-popper" });
    }
  };

  repost = postId => {
    document.getElementById("repost").removeAttribute("onClick");
    const jwt = auth.isAuthenticated();
    repost(
      {
        userId: jwt.user._id,
        postId: postId
      },
      {
        t: jwt.token
      }
    ).then(data => {
      if (data.error) {
        this.setState({ error: data.error });
      } else {
        this.props.post.repostBy.push(jwt.user._id);
        //this.props.post.repostedBy = jwt.user._id
        //this.props.post.repost = true
        this.setState({
          repostBy: this.state.repostBy + 1,
          reposted: true
          //open: true,
          //successMessage: "Reposted Successfully !!"
        });
      }
    });
  };

  handleClose = event => {
    console.log(
      "deleteClick" +
        this.state.deleteClick +
        "  reportClick  " +
        this.state.reportClick
    );
    if (!this.state.isMobile) {
      console.log("here");
      if (
        this.state.popanchor.current &&
        this.state.popanchor.current.contains(event.target)
      ) {
        return;
      }

      if (!this.state.deleteClick) {
        console.log("here 2");
        this.setState({
          openid: -1
          // popanchor: null,
          // popopen: false,
          // pid: undefined,
          // share:false,
        });
      }
      this.setState({ deleteClick: false });
      // if (!this.state.reportClick) {
      //   this.setState({
      //    // openid: -1
      //   });
      // }
      this.setState({ reportClick: false });
      //this.setState({openid: -1})

      //    this.setState({openid: ''})
      //    this.setState({popanchor: null})
      //    this.setState({popopen: false})
      //   // this.setState({id: undefined})
      //    this.setState({pid: undefined})
      //    this.setState({share:false})
    } else if (!this.state.deleteClick && !this.state.reportClick) {
      this.setState({ openid: -1 });
    }
  };

  handleClosee = event => {
    // this.setState({openid: ''})
    //    this.setState({popanchor: null})
    //    this.setState({popopen: false})
    //   // this.setState({id: undefined})
    //    this.setState({pid: undefined})
    //    this.setState({share:false})
  };

  showShare = () => {
    if (!this.state.share) this.setState({ share: true });
    else this.setState({ share: false });
  };

  deleteClick = () => {
    console.log("deleteClick called");
    this.setState({ deleteClick: true });
  };

  reportClick = () => {
    console.log("reported called");
    this.setState({ reportClick: true });
  };

  clickChanged = () => {
    alert("bib");
  };

  //   shouldComponentUpdate(nextProps) {
  //   if(this.state.popopen)
  //   {
  //     console.log("popopen "+this.state.popopen)
  //     return false;
  //   }
  //   else
  //   {
  //     //console.log("true 1"+this.state.open)
  //     return true;
  //   }
  // }

  onRemove = () => {
    this.setState({ openid: -1, deleteClick: false });
    this.props.onRemove(this.props.post);
  };

  onClose = () => {
    sleep(100).then(() => {
      this.setState({ deleteClick: false, reportClick: false });
    });
  };

  render() {
    const { classes } = this.props;
    var postId = this.props.post._id;
    const shareUrl = SITE_URL + "post/" + postId;
    //    console.log(this.state.openid)
    // console.log(this.props.post.postedBy._id+"==="+ auth.isAuthenticated().user._id)
    if (Array.isArray(this.props.matches)) {
      var videoUrl = this.props.matches[0];
      if (
        videoUrl.includes("youtube") ||
        videoUrl.includes("youtu.be") ||
        videoUrl.includes("vimeo")
      ) {
        let VID_REGEX = /(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/;
        var videoId = videoUrl.match(VID_REGEX);
        videoId = videoId[6];
      }
    }
    var newtext = this.props.post.text;
    if (Array.isArray(this.props.matches)) {
      if (
        this.props.post.text.includes("youtube") ||
        this.props.post.text.includes("youtu.be") ||
        this.props.post.text.includes("vimeo") ||
        this.props.post.text.includes("stan.me")
      ) {
        newtext = this.props.post.text.replace(this.props.matches[0], "");
      }
    }
    var posterId =
      this.props.post.repost && this.props.post.actualPostId
        ? this.props.post.actualPostId
        : this.props.post._id;
    var profileId = this.props.post.postedBy._id;
    var profileImage = this.props.post.postedBy.photo;
    var profileName = this.props.post.postedBy.name;
    var profileUsername = this.props.post.postedBy.username;
    if (this.props.post.repost) {
      profileId = this.props.post.repostedBy._id;
      profileImage = this.props.post.repostedBy.photo;
      profileName = this.props.post.repostedBy.name;
      profileUsername = this.props.post.repostedBy.username;
    }

    return (
      <Card className={"postpage-card"}>
        <CardHeader
          avatar={
            <Avatar
              src={
                profileImage
                  ? config.profileImageBucketURL + profileImage
                  : config.profileDefaultPath
              }
              className={"postheader-img"}
            />
          }
          action={
            <div className={"post-share-head"}>
              {this.state.displaypost &&
                this.props.post.viewtype == "stans" && (
                  <i className="fal fa-lock-open-alt"></i>
                )}
              <IconButton
                onClick={e => this.handleMore(e, this.props.popid)}
                disabled={!this.state.displaypost}
              >
                <MoreHoriz
                  aria-describedby={this.state.pid}
                  variant="contained"
                />
              </IconButton>
              <Popper
                id={this.state.pid}
                open={this.state.openid === this.props.popid}
                anchorEl={this.state.popanchor}
                placement={"bottom-end"}
                className={
                  this.state.isMobile
                    ? classes.pop_positon_mob
                    : classes.pop_positon
                }
                // className={"home-popper"}
                transition
              >
                {({ TransitionProps }) => (
                  <Fade {...TransitionProps} timeout={350}>
                    <Paper className={"post-menu"}>
                      <ClickAwayListener onClickAway={this.handleClose}>
                        <MenuList>
                          {/* <MenuItem onClick={this.showShare}>Share</MenuItem> */}
                          {/*postId*/}
                          {/* {this.state.share && ( */}
                          <MenuItem className={"post-share"}>
                            <FacebookShareButton
                              url={shareUrl}
                              quote={this.props.post.text}
                              className="Demo__some-network__share-button"
                            >
                              <FacebookIcon size={32} round />
                            </FacebookShareButton>
                            <TwitterShareButton
                              url={shareUrl}
                              title={this.props.post.text}
                              className="Demo__some-network__share-button"
                            >
                              <TwitterIcon size={32} round />
                            </TwitterShareButton>
                          </MenuItem>
                          {/* )} */}
                          <MenuItem
                            onClick={() => this.copyToClipboard(postId)}
                          >
                            Copy Link
                          </MenuItem>
                          {(this.props.post.postedBy._id !=
                            auth.isAuthenticated().user._id ||
                            (this.props.post.repost &&
                              this.props.post.repostedBy._id !=
                                auth.isAuthenticated().user._id)) &&
                            !this.state.isReported && (
                              <MenuItem onClick={this.reportClick}>
                                <ReportPost
                                  postId={postId}
                                  onReport={this.onReport}
                                  type="Post"
                                  onClose={this.onClose}
                                />
                              </MenuItem>
                            )}
                          {(this.props.post.postedBy._id ==
                            auth.isAuthenticated().user._id ||
                            (this.props.post.repost &&
                              this.props.post.repostedBy._id ==
                                auth.isAuthenticated().user._id)) && (
                            <MenuList>
                              {this.props.post.postname != "thought" &&
                                !this.props.post.repost && (
                                  <MenuItem>
                                    <Link
                                      to={
                                        "/" +
                                        this.props.post.postname +
                                        "edit/" +
                                        postId
                                      }
                                    >
                                      Edit
                                    </Link>
                                  </MenuItem>
                                )}
                              <MenuItem onClick={this.deleteClick}>
                                <DeletePost
                                  postId={postId}
                                  post={this.props.post}
                                  onDelete={this.onRemove}
                                  onClose={this.onClose}
                                  display="text"
                                  type="post"
                                />
                              </MenuItem>
                            </MenuList>
                          )}
                        </MenuList>
                      </ClickAwayListener>
                      {/** <Divider />**/}
                      {/* {(this.props.post.postedBy._id ==
                        auth.isAuthenticated().user._id || (this.props.post.repost && this.props.post.repostedBy._id ==
                          auth.isAuthenticated().user._id)) && (
                          <ClickAwayListener onClickAway={this.handleClose}>
                            <MenuList>
                              {this.props.post.postname != "thought" &&
                                !this.props.post.repost && (
                                  <MenuItem>
                                    <Link
                                      to={
                                        "/" +
                                        this.props.post.postname +
                                        "edit/" +
                                        postId
                                      }
                                    >
                                      Edit
                                  </Link>
                                  </MenuItem>
                                )}
                              <MenuItem onClick={this.deleteClick}>
                                <DeletePost
                                  postId={postId}
                                  post={this.props.post}
                                  onDelete={this.props.onRemove}
                                  display="text"
                                  type="post"
                                />
                              </MenuItem>
                            </MenuList>
                          </ClickAwayListener>
                        )} */}
                    </Paper>
                  </Fade>
                )}
              </Popper>
            </div>
          }
          title={
            <p>
              <Link to={"/profile/" + profileUsername} variant="body2">
                {profileName}
              </Link>{" "}
              {this.props.post.repost && (
                <span className={"repost-span"}>
                  <i className={"far fa-retweet"} aria-hidden="true"></i>{" "}
                  Reposted
                  {/* by 
                  <Link
                    to={"/profile/" + this.props.post.repostedBy.username}
                    variant="body2"
                  >
                    {this.props.post.repostedBy.name}
                  </Link> */}
                </span>
              )}
            </p>
          }
          subheader={new Date(this.props.post.created).toDateString()}
          className={"post-cardheader"}
        />
        {this.state.displaypost && (
          <CardContent className={"postpage-content"}>
            {/* photo for all start }
              {this.props.post.photo && this.props.post.postname != "image" && 
                (<div className={"post-photo"}>
                  <img
                    className={classes.media}
                    src={'/dist/uploads/photos/'+this.props.post.photo}
                    />
                </div>)}
              {/* photo for all end */}
            {this.props.post.repost && (
              <Typography component="div" className={"logo_content"}>
                <Link to={"/profile/" + this.props.post.postedBy.username}>
                  <img
                    className={"tool_work3_img tool_img"}
                    src={
                      this.props.post.postedBy.photo
                        ? config.profileImageBucketURL +
                          this.props.post.postedBy.photo
                        : config.profileDefaultPath
                    }
                    alt="profile Image"
                  />
                  <span>{this.props.post.postedBy.name}</span>
                </Link>
              </Typography>
            )}
            {this.props.post.postname === "text" && (
              <Text post={this.props.post} />
            )}
            {this.props.post.postname === "image" && (
              <Image post={this.props.post} />
            )}
            {this.props.post.postname === "audio" && (
              <Audio
                post={this.props.post}
                checkPlay={this.props.checkingPlay}
                {...this.props}
              />
            )}
            {this.props.post.postname === "video" && (
              <Video post={this.props.post} />
            )}
            {this.props.post.postname === "article" && (
              <Article post={this.props.post} />
            )}
            {this.props.post.postname == "poll" && (
              <Poll post={this.props.post} />
            )}
            {this.props.post.postname == "link" && (
              <PostLink post={this.props.post} />
            )}
            {this.props.post.postname == "thought" && (
              <div>
                {newtext && newtext != "" && (
                  <div className={"new-post-hold homefeed-firstpost"}>
                    <div className={"post-image-text"}>
                      <Typography component="p" className={"post-title-header"}>
                        {newtext}
                      </Typography>
                    </div>
                  </div>
                )}
                {this.props.post.photo && (
                  <div className={"postpage-photo post-img-sec"}>
                    <img
                      className={classes.media}
                      src={config.photoBucketURL + this.props.post.photo}
                    />
                  </div>
                )}
                {Array.isArray(this.props.matches) && (
                  <div
                    className={
                      this.props.matches[0].includes("youtube") ||
                      this.props.matches[0].includes("youtu.be") ||
                      this.props.matches[0].includes("vimeo") ||
                      this.props.matches[0].includes("soundcloud")
                        ? "youtubevideo"
                        : ""
                    }
                  >
                    {Array.isArray(this.props.matches) && (
                      <Typography
                        component="div"
                        className={
                          this.props.matches[0].includes("youtube") ||
                          this.props.matches[0].includes("youtu.be") ||
                          this.props.matches[0].includes("vimeo") ||
                          this.props.matches[0].includes("soundcloud")
                            ? "videoWrapper"
                            : ""
                        }
                      >
                        {/* {!this.props.matches[0].includes("soundcloud") && !this.props.matches[0].includes("youtube") && !this.props.matches[0].includes("vimeo") &&
                        (
                          <Preview url={this.props.matches[0]} />
                        )} */}
                        {(this.props.matches[0].includes("youtube") ||
                          this.props.matches[0].includes("youtu.be")) && (
                          <iframe
                            src={"https://www.youtube.com/embed/" + videoId}
                          ></iframe>
                        )}
                        {this.props.matches[0].includes("vimeo") && (
                          <iframe
                            src={"https://player.vimeo.com/video/" + videoId}
                          ></iframe>
                        )}

                        {this.props.matches[0].includes("soundcloud") && (
                          <iframe
                            width="100%"
                            height="100"
                            scrolling="no"
                            frameborder="no"
                            allow="autoplay"
                            src={
                              "https://w.soundcloud.com/player/?url=" +
                              this.props.matches[0] +
                              "&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
                            }
                          ></iframe>
                        )}
                      </Typography>
                    )}
                    {/*<iframe width="100%" height="300" scrolling="no" frameborder="no" allow="autoplay" 
                      src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/679809245&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"></iframe>*/}
                  </div>
                )}
                {Array.isArray(this.props.matches) && (
                  <div
                    className={
                      !this.props.matches[0].includes("soundcloud") &&
                      (!this.props.matches[0].includes("youtube") ||
                        !this.props.matches[0].includes("youtu.be")) &&
                      !this.props.matches[0].includes("vimeo") &&
                      this.props.matches[0].includes("stan.me")
                        ? "linkwrapper"
                        : ""
                    }
                  >
                    {!this.props.matches[0].includes("soundcloud") &&
                      (!this.props.matches[0].includes("youtube") ||
                        !this.props.matches[0].includes("youtu.be")) &&
                      !this.props.matches[0].includes("vimeo") &&
                      this.props.matches[0].includes("stan.me") && (
                        <Preview url={this.props.matches[0]} />
                      )}
                  </div>
                )}

                <div className={"video-controls"}>
                  {this.props.post.url && this.props.post.video && (
                    <video
                      key={this.props.post.url}
                      controls
                      controlsList="nodownload"
                      className={"video-second"}
                      poster={
                        config.videoThumbnailBucketURL + posterId + "_1.jpg"
                      }
                    >
                      <source src={this.props.post.url} type="video/mp4" />
                      Your browser does not support HTML5 video.
                    </video>
                  )}
                </div>
              </div>
            )}
            {/* (this.props.post.postname === "link" || this.props.post.postname === "video") &&
                 <Preview url={this.props.post.url} />
              */}
          </CardContent>
        )}
        {this.state.displaypost && this.props.attach.length > 0 && (
          <div className={"post-attachment"}>
            <IconButton
              color="secondary"
              className={"post-attbtn"}
              component="span"
            >
              <AttachFile />
            </IconButton>
            <Typography component="p">
              {this.props.attach.map((item, i) => {
                return (
                  <a key={i} href={config.attachmentBucketURL + item} download>
                    Attachment {i + 1}
                  </a>
                );
              })}
            </Typography>
          </div>
        )}
        {this.props.categories.length > 0 && (
          <div className={"post-tag"}>
            <Typography component="p" className={classes.text}>
              {this.props.categories.map((item, i) => {
                return (
                  <a href={item} key={i}>
                    {item}
                  </a>
                );
              })}
            </Typography>
          </div>
        )}

        {!this.state.displaypost && (
          <div>
            {this.props.post.text && (
              <div className={"post-image-text unlock-title"}>
                <Typography component="h1" className={"post-title-header"}>
                  {this.props.post.text}
                </Typography>
              </div>
            )}
            <CardContent className={"unlock-img"}>
              <i className="fal fa-lock-alt"></i>
              <Typography component="h1" className={classes.text}>
                <span className={"unlock-img-title"}>
                  Stan {this.props.post.postedBy.name} to unlock this post and
                  more exclusive content
                </span>{" "}
                <br />
              </Typography>
              <Link
                to={"/becomestan/" + this.props.post.postedBy._id}
                className={"post-unlockimg"}
              >
                {this.props.post.postedBy.subscriptionpitch.planInfo.forEach(
                  res => {
                    if (res.status == 1) {
                      planInfo = res.amount;
                    }
                  }
                )}
                <CustomButton
                  label={"Stan for  " + planInfo + "$ / month"}
                  onClick={this.clickPost}
                  className={"Primary_btn"}
                />
              </Link>
            </CardContent>
          </div>
        )}
        {this.state.displaypost && (
          <div>
            <CardActions className={"postpage-action"}>
              <div className={"postpage-actinner"}>
                <span>
                  <i className={"fal fa-comment"}></i>
                </span>
                <span className={"post-action-title"}>
                  {this.state.comments.length}
                </span>
              </div>
              <div className={"postpage-actinner"}>
                {this.state.like ? (
                  <span
                    onClick={this.like}
                    className={classes.button}
                    aria-label="Like"
                    color="secondary"
                    disabled={this.state.clicked}
                  >
                    <i className={"fas fa-heart"}></i>
                  </span>
                ) : (
                  <span
                    onClick={this.like}
                    className={classes.button}
                    aria-label="Unlike"
                    color="secondary"
                    disabled={this.state.clicked}
                  >
                    <i className={"far fa-heart"}></i>
                  </span>
                )}
                <span className={"post-action-title"}>{this.state.likes}</span>
              </div>
              {this.props.post.viewtype == "public" && !this.props.post.repost && (
                <div className={"postpage-actinner"}>
                  {!this.state.reposted && (
                    <span
                      onClick={() => this.repost(postId)}
                      className={classes.button}
                      aria-label="Repost"
                      color="secondary"
                      id="repost"
                    >
                      <i className={"far fa-retweet"}></i>
                    </span>
                  )}
                  {this.state.reposted && (
                    <span
                      className={"retweet-post"}
                      aria-label="Repost"
                      color="secondary"
                    >
                      <i className={"far fa-retweet"}></i>
                    </span>
                  )}
                  <span className={"post-action-title"}>
                    {this.state.repostBy}
                  </span>
                </div>
              )}
              {this.props.post.postedBy.creater.status > 0 &&
                this.props.post.tipsEnabled &&
                !this.props.post.repost && (
                  <div className={"postpage-actinner"}>
                    {/** <IconButton className={classes.button} aria-label="Money" color="secondary">
             <AttachMoney/>
           </IconButton> **/}

                    <TipsModal
                      postId={this.props.post._id}
                      tipAmount={this.state.totalTipsAmount}
                      postedBy={this.props.post.postedBy._id}
                      tipStatus={this.state.tipStatus}
                      postedByName={this.state.postedByName}
                    />
                  </div>
                )}
            </CardActions>
            <Comments
              postId={this.props.post._id}
              comments={this.state.comments}
              updateComments={this.updateComments}
            />
          </div>
        )}
        {!this.state.displaypost && (
          <div>
            <CardActions className={"postpage-action blur-actions"}>
              <div className={"postpage-actinner"}>
                <span>
                  <i className={"fal fa-comment"}></i>
                </span>
                <span className={"post-action-title"}>
                  {this.state.comments.length}
                </span>
              </div>
              <div className={"postpage-actinner"}>
                {this.state.like ? (
                  <span
                    className={classes.button}
                    aria-label="Like"
                    color="secondary"
                    disabled={this.state.clicked}
                  >
                    <i className={"fas fa-heart"}></i>
                  </span>
                ) : (
                  <span
                    className={classes.button}
                    aria-label="Unlike"
                    color="secondary"
                    disabled={this.state.clicked}
                  >
                    <i className={"far fa-heart"}></i>
                  </span>
                )}
                <span className={"post-action-title"}>{this.state.likes}</span>
              </div>
            </CardActions>
          </div>
        )}
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right"
          }}
          className={"snack-class"}
          open={this.state.open}
          onClose={this.handleRequestClose}
          autoHideDuration={600}
          message={
            <span className={classes.snack}>{this.state.successMessage}</span>
          }
        />
      </Card>
    );
  }
}

Post.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Post);
