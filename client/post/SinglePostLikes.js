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
  cardHeader: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit
  },
  smallAvatar: {
    width: 25,
    height: 25
  },
  commentField: {
    width: "96%"
  },
  commentText: {
    backgroundColor: "white",
    // padding: theme.spacing.unit,
    // margin: `2px ${theme.spacing.unit * 2}px 2px 2px`
  },
  commentDate: {
    display: "block",
    color: "gray",
    fontSize: "0.8em"
  },
  commentDelete: {
    fontSize: "1.6em",
    verticalAlign: "middle",
    cursor: "pointer"
  },
  anchorcomment:
  {
    fontFamily: 'Helvetica-bold',
    fontWeight: 'normal',
    color: '#000',
  },
});

class SinglePostLikes extends Component {
  render() {
    const { classes } = this.props;
    const commentBody = item => {
      return (
        <p className={classes.commentText}>
          <Link to={"/profile/" + item.username} className={classes.anchorcomment}>{item.name}</Link>
          <br />
        </p>
      );
    };

    return (
      <div className="like_right_blk">
        {this.props.likeby.map((item, i) => {
          return (
            <div key={i} className={this.props.likeby.length == i + 1 ? "last-comment-li" : ""}>
              {" "}
              {/* i< 3 && */}
              <CardHeader
                avatar={
                  <Avatar
                    className={classes.smallAvatar}
                    src={item.photo ? config.profileImageBucketURL + item.photo : config.profileDefaultPath}
                  //src={'/api/users/photo/' + item._id}
                  />
                }
                title={commentBody(item)}
                className={classes.cardHeader}
                key={i}
              />
              {/* */}
            </div>
          );
        })}
        {this.props.likeby.length == 0 && (
          <div className={"no-likes"}>
            <Typography component="p">No Likes Yet</Typography>
          </div>
        )}
      </div>
    );
  }
}

SinglePostLikes.propTypes = {
  classes: PropTypes.object.isRequired,
  postId: PropTypes.string.isRequired,
  likeby: PropTypes.array.isRequired
};

export default withStyles(styles)(SinglePostLikes);
