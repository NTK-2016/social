import React, { Component } from "react";
import auth from "./../auth/auth-helper";
import { CardHeader } from "material-ui/Card";
import TextField from "material-ui/TextField";
import Avatar from "material-ui/Avatar";
import Icon from "material-ui/Icon";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import { comment, uncomment } from "./api-post.js";
import { Link } from "react-router-dom";
import Typography from "material-ui/Typography";
import config from "../../config/config";
const styles = theme => ({
  smallAvatar: {
    width: "33px",
    height: "33px"
  }
});

var height2 = 0;
var height3 = 0;

class SinglePostComments extends Component {
  state = { text: "", newheight: "" };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  componentDidMount = () => {
    height2 = this.divElement2.clientHeight;
    height3 = this.divElement3.clientHeight;
    var height = this.props.height;
    console.log(height + "comment height");
    var newheight = height - height3;
    this.setState({ newheight: newheight });
    console.log(height2 + " height2");
    console.log(height3 + " height3");
    console.log(newheight + " newheight");
  };
  addComment = event => {
    if (event.keyCode == 13 && event.target.value) {
      event.preventDefault();
      const jwt = auth.isAuthenticated();
      comment(
        {
          userId: jwt.user._id
        },
        {
          t: jwt.token
        },
        this.props.postId,
        { text: this.state.text }
      ).then(data => {
        if (data.error) {
          console.log(data.error);
        } else {
          this.setState({ text: "" });
          this.props.updateComments(data.comments);
        }
      });
    }
  };

  deleteComment = comment => event => {
    const jwt = auth.isAuthenticated();
    uncomment(
      {
        userId: jwt.user._id
      },
      {
        t: jwt.token
      },
      this.props.postId,
      comment
    ).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.props.updateComments(data.comments);
      }
    });
  };
  render() {
    const { classes } = this.props;
    const commentBody = item => {
      var created_date = "now";
      var date1 = new Date(item.created).getTime();
      var date2 = new Date().getTime();

      var seconds = Math.floor((date2 - date1) / 1000);
      var minutes = Math.floor(seconds / 60);
      var hours = Math.floor(minutes / 60);
      var days = Math.floor(hours / 24);
      var year = Math.floor(days / 365);
      hours = hours - days * 24;
      minutes = minutes - days * 24 * 60 - hours * 60;
      seconds =
        seconds - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60;
      created_date =
        year > 0
          ? year + "y"
          : days > 0
            ? days + "d"
            : hours > 0
              ? hours + "h"
              : minutes > 0
                ? minutes + "m"
                : seconds > 0
                  ? seconds + "s"
                  : created_date;
      return (
        <div className={"all-comments"}>
          <div className={"all-comments-inner"}>
            <div className={"comments-space"}>
              <div className={classes.commentText} className={"user_link user-comm-name"}>
                <Link to={"/profile/" + item.postedBy.username}>{item.postedBy.name}</Link>
              </div>


              <div className={"all-comments-para"}> {item.text}</div>
            </div>

            <div className={"all-comments-para trash_icon_blk"}>
              {/** {(new Date(item.created)).toDateString()} | **/}
              {auth.isAuthenticated().user._id === item.postedBy._id && (
                <Icon
                  onClick={this.deleteComment(item)}
                  className={classes.commentDelete}
                >
                  <i className={"far fa-trash-alt"}></i>
                </Icon>
              )}
            </div>
          </div>
          <div className={"comments-time"}><span>{created_date}</span></div>
        </div>
      );
    };

    return (
      <ul className={"comment-box"}>
        <div
          className={"sin-commentlist"}
          ref={divElement2 => (this.divElement2 = divElement2)}
        //style={{ height: this.state.newheight }}
        >
          {this.props.comments.map((item, i) => {
            return (
              <li key={i} className={this.props.comments.length == i + 1 ? "last-comment-li" : ""}>
                {" "}
                {/* i< 3 && */}
                <CardHeader
                  avatar={
                    <Avatar
                      className={"smallavatar"}
                      src={item.postedBy.photo ? config.profileImageBucketURL + item.postedBy.photo : config.profileDefaultPath}
                    //src={'/api/users/photo/' + item.postedBy._id}
                    />
                  }
                  title={commentBody(item)}
                  className={"comment-body"}
                  key={i}
                />
                {/* */}
              </li>
            );
          })}
          {this.props.comments.length == 0 && (
            <div className={"no-comments"}>
              <Typography>No Comments Yet</Typography>
            </div>
          )}
        </div>

        <div
          ref={divElement3 => (this.divElement3 = divElement3)}
          className={"btm-comments"}
        >
          <CardHeader

            title={
              <TextField
                onKeyDown={this.addComment}
                multiline
                value={this.state.text}
                onChange={this.handleChange("text")}
                placeholder="Add a comment..."
                className={"comment-field"}
                margin="normal"
                InputProps={{
                  disableUnderline: true,
                  classes: { input: this.props.classes["input"] },
                  style: {
                    padding: 0
                  }
                }}
              />
            }
            className={"comments-cardheader"}
          />
        </div>
        {/* this.props.comments.length > 3 &&
          <Typography className={"view-comment"}>
            <Link to={"/post/" + this.props.postId}>View all comments</Link>
          </Typography>
        */}
      </ul>
    );
  }
}

SinglePostComments.propTypes = {
  classes: PropTypes.object.isRequired,
  postId: PropTypes.string.isRequired,
  comments: PropTypes.array.isRequired,
  updateComments: PropTypes.func.isRequired
};

export default withStyles(styles)(SinglePostComments);
