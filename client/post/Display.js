import React, { Component } from "react";
import auth from "./../auth/auth-helper";
import Card, { CardHeader, CardContent, CardActions } from "material-ui/Card";
import Typography from "material-ui/Typography";
import Avatar from "material-ui/Avatar";
import IconButton from "material-ui/IconButton";
import DeleteIcon from "material-ui-icons/Delete";
import AudiotrackIcon from "material-ui-icons/Audiotrack";
import FavoriteIcon from "material-ui-icons/Favorite";
import FavoriteBorderIcon from "material-ui-icons/FavoriteBorder";
import CommentIcon from "material-ui-icons/Comment";
import Divider from "material-ui/Divider";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import { Link } from "react-router-dom";
import { remove, like, unlike } from "./api-post.js";
import Comments from "./Comments";
import Edit from "material-ui-icons/Edit";
import DeletePost from "./DeletePost";
import Preview from "./../common/Preview";
import Moment from "react-moment";
import config from "../../config/config";

const styles = theme => ({
  card: {
    maxWidth: "700px",
    margin: "auto",
    marginBottom: theme.spacing.unit * 3,
    backgroundColor: "#fff",
    boxShadow: "none",
    border: "1px solid #D6D6D6",
    borderRadius: "8px",
    display: "flex",
    padding: "10px"
  },
  audiocontainer: {
    width: "100px"
  },
  postparag: {
    margin: "10px"
  },

  cardHeader: {
    paddingTop: "0px",
    paddingBottom: "0px"
  },
  text: {
    margin: "0px 8px 0px 8px",
    fontSize: "18px",
    lineHeight: "22px",
    color: "#000",
    fontFamily: "Helvetica-Bold",
    fontWeight: "normal",
    wordWrap: "break-word",
  },

  text1: {
    fontSize: "16px ",
    lineHeight: "22px",
    margin: "5px 8px",
    color: "#000",
    fontFamily: "Helvetica",
    fontWeight: "normal"
  },

  button: {
    margin: theme.spacing.unit
  },
  displayaction: {
    textAlign: "right",
    color: "#000 !important",
    paddingTop: "15px"
  }
});

class Display extends Component {
  state = {
    like: false,
    likes: 0,
    comments: []
  };

  componentDidMount = () => {
    this.setState({
      like: this.checkLike(this.props.post.likes),
      likes: this.props.post.likes.length,
      comments: this.props.post.comments
    });
  };
  componentWillReceiveProps = props => {
    this.setState({
      like: this.checkLike(props.post.likes),
      likes: props.post.likes.length,
      comments: props.post.comments
    });
  };

  checkLike = likes => {
    const jwt = auth.isAuthenticated();
    let match = likes.indexOf(jwt.user._id) !== -1;
    return match;
  };

  like = () => {
    let callApi = this.state.like ? unlike : like;
    const jwt = auth.isAuthenticated();
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
        this.setState({ like: !this.state.like, likes: data.likes.length });
      }
    });
  };

  updateComments = comments => {
    this.setState({ comments: comments });
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
        this.props.onRemove(this.props.post);
      }
    });
  };

  render() {
    const { classes } = this.props;
    let attach = [];
    if (this.props.post.postname === "product") {
      if (this.props.post.photo) attach = this.props.post.photo.split(",");
    }

    return (
      <Card className={classes.card}>
        <div className={"displayimgupload"}>
          {this.props.post.postname === "text" && (
            <div className={classes.photo}>
              <img
                className={classes.media}
                src={
                  this.props.post.photo
                    ? config.photoBucketURL + this.props.post._id
                    : "/dist/Default for non-image posted.png"
                }
              />
            </div>
          )}{" "}
          {/* Text Ends here*/}
          {this.props.post.postname === "image" && (
            <div className={classes.photo}>
              <img
                className={classes.media}
                src={
                  this.props.post.url
                    ? this.props.post.url
                    : config.photoBucketURL + this.props.post.photo
                }
              />
            </div>
          )}
          {this.props.post.postname === "audio" && (
            <div className={"display-audio"}>
              <img
                className={classes.media}
                src={
                  this.props.post.photo
                    ? config.photoBucketURL + this.props.post.photo
                    : "/dist/Default for non-image posted.png"
                }
              />
            </div>
          )}
          {this.props.post.postname === "video" && (
            <div className={classes.photo}>
              {/* this.props.post.url &&
                <Preview url={this.props.post.url} />
              */}
              {/* !this.props.post.url &&
                <iframe src={'/dist/uploads/videos/'+this.props.post.video}></iframe>
              */}
              <img
                className={classes.media}
                src={
                  this.props.post.photo
                    ? config.photoBucketURL + this.props.post.photo
                    : "/dist/Default for non-image posted.png"
                }
              />
            </div>
          )}
          {this.props.post.postname === "article" && (
            <div className={classes.photo}>
              <img
                className={classes.media}
                src={
                  this.props.post.photo
                    ? config.photoBucketURL + this.props.post.photo
                    : "/dist/Default for non-image posted.png"
                }
              />
            </div>
          )}
          {this.props.post.postname === "poll" && (
            <div className={classes.photo}>
              <img
                className={classes.media}
                src={
                  this.props.post.photo
                    ? config.photoBucketURL + this.props.post.photo
                    : "/dist/Default for non-image posted.png"
                }
              />
            </div>
          )}
          {this.props.post.postname === "link" && (
            <div className={classes.photo}>
              <img
                className={classes.media}
                src={
                  this.props.post.photo
                    ? config.photoBucketURL + this.props.post.photo
                    : "/dist/Default for non-image posted.png"
                }
              />
            </div>
          )}
          {this.props.post.postname === "product" && (
            <div className={classes.photo}>
              <img
                className={classes.media}
                src={
                  this.props.post.photo
                    ? config.photoBucketURL + attach[0]
                    : ""
                }
              />
            </div>
          )}
          {this.props.post.postname === "thought" && (
            <div className={classes.photo}>
              <img
                className={classes.media}
                src={this.props.post.photo
                  ? config.photoBucketURL + this.props.post.photo
                  : "/dist/Default for non-image posted.png"}
              />
            </div>
          )}
        </div>
        <CardContent className={"displaycardcont"}>
          {this.props.post.posttype == "1" && (
            <div className={"publish-check"}>
              <i className={"fal fa-check-circle"}></i>
            </div>
          )}
          <div className={"display-inner"}>
            {/* (this.props.post.postname === "link") &&
              (<div className={"link-path"}>
                 <a href={this.props.post.url} target="_blank">{this.props.post.url}</a>
              </div>) */}

            {this.props.post.postname === "audio" && (
              <div className={"audio-url"}>
                <audio controls className={"audiocontainer"}>
                  <source
                    src={
                      this.props.post.url
                        ? this.props.post.url
                        : config.audioBucketURL + this.props.post.audio
                    }
                    type="audio/mpeg"
                  />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
            <Typography component="h1" className={classes.text}>
              {this.props.post.text}
            </Typography>

            {this.props.post.price && (
              <Typography component="p" className={classes.text}>
                Price: {this.props.post.price}
              </Typography>
            )}
            {this.props.post.postname == "poll" && (
              <div className={classes.postparag}>
                <Typography component="p" className={"post-poll-para"}>
                  1: {this.props.post.options.option1} <br />
                </Typography>
                <Typography component="p" className={"post-poll-para"}>
                  2: {this.props.post.options.option2}
                </Typography>
                {this.props.post.options.option3 && (
                  <Typography component="p" className={"post-poll-para"}>
                    3: {this.props.post.options.option3}
                  </Typography>
                )}
                {this.props.post.options.option4 && (
                  <Typography component="p" className={"post-poll-para"}>
                    4: {this.props.post.options.option4}
                  </Typography>
                )}
              </div>
            )}
            {(this.props.post.posttype == "1" ||
              this.props.post.posttype == "3") && (
                <Typography component="p" className={classes.text1}>
                  <Moment format="D MMM YYYY HH:mm">
                    {new Date(this.props.post.created).toString()}
                  </Moment>

                  {/* {"Published : " + (new Date(this.props.post.created)).toString()} */}
                </Typography>
              )}
            {this.props.post.posttype == "2" && (
              <Typography component="p" className={classes.text1}>
                <Moment format="D MMM YYYY HH:mm">
                  {new Date(this.props.post.scheduled_datetime).toString()}
                </Moment>
                {/* {"Scheduled : " + (new Date(this.props.post.scheduled_datetime)).toDateString()} */}
              </Typography>
            )}
          </div>
          <div className={"displayaction"}>
            {this.props.post.postedBy._id === auth.isAuthenticated().user._id &&
              this.props.post.postname != "thought" && (
                <Link
                  to={
                    "/" +
                    this.props.post.postname +
                    "edit/" +
                    this.props.post._id
                  }
                >
                  <i className={"fal fa-pen"}></i>
                </Link>
              )}

            {this.props.post.postedBy._id ===
              auth.isAuthenticated().user._id && (
                // <IconButton onClick={this.deletePost}>
                //   <DeleteIcon />
                // </IconButton>

                <DeletePost
                  postId={this.props.post._id}
                  post={this.props.post}
                  onDelete={this.props.onRemove}
                  display="icon"
                  type="post"
                />
              )}
          </div>
        </CardContent>
      </Card>
    );
  }
}

Display.propTypes = {
  classes: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired
};

export default withStyles(styles)(Display);
