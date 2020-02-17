import React, { Component } from "react";
import auth from "./../auth/auth-helper";
import { CardHeader } from "material-ui/Card";
import TextField from "material-ui/TextField";
import Avatar from "material-ui/Avatar";
import Icon from "material-ui/Icon";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import { comment, uncomment } from "./api-post.js";
import { getUsernameById } from "../user/api-user";
import { Link } from "react-router-dom";
import Typography from "material-ui/Typography";
import config from "../../config/config";
const styles = theme => ({
  smallAvatar: {
    width: 25,
    height: 25
  }
});

class Comments extends Component {
  state = { text: "" };
  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };
  addComment = event => {
    if (event.keyCode == 13 && event.target.value && !event.shiftKey) {
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
          this.props.updateComments(data.comments.reverse());
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
        this.props.updateComments(data.comments.reverse());
      }
    });
  };

  getUsernameById(userId) {
    console.log(this.props.comments);
    const jwt = auth.isAuthenticated();
    return getUsernameById(
      {
        userId: userId
      },
      {
        t: jwt.token
      },
    ).then(data => {
      console.log(data.username);
      return data.username;
    }).then(data => {
      return data;
    });
  };


  render() {
    // const name = this.getUsernameById("5dd2ab9c7e8ebe235c6065e5");
    // console.log(name);
    const { classes } = this.props;
    const commentBody = item => {
      //var name = this.getUsernameById(item.postedBy._id);
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
              <div className={"user-comm-name"}>
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
                  <i className={"fal fa-trash-alt"} color="secondary" aria-hidden="true"></i>

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
        {this.props.comments.slice(0, 3).map((item, i) => {
          return (
            <li key={i} className={i == 2 ? "last-comment-li" : (this.props.comments.length == 2 && i == 1 ? "last-comment-li" : (this.props.comments.length == 1 && i == 0 ? "last-comment-li" : ""))}>
              {i < 3 && (
                <CardHeader
                  avatar={
                    <Avatar
                      className={"smallavatar"}
                      src={item.postedBy.photo ? config.profileImageBucketURL + item.postedBy.photo : config.profileDefaultPath}
                    // src={'/api/users/photo/' + item.postedBy._id}
                    />
                  }
                  title={commentBody(item)}
                  className={"comment-body"}
                  key={i}
                />
              )}
            </li>
          );
        })}
        {this.props.comments.length > 3 && (
          <Typography className={"view-comment"}>
            <Link to={"/post/" + this.props.postId}>View all comments</Link>
          </Typography>
        )}
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
      </ul>
    );
  }
}

Comments.propTypes = {
  classes: PropTypes.object.isRequired,
  postId: PropTypes.string.isRequired,
  comments: PropTypes.array.isRequired,
  updateComments: PropTypes.func.isRequired
};

export default withStyles(styles)(Comments);
