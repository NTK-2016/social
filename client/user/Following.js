import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import List, {
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText
} from "material-ui/List";
import Avatar from "material-ui/Avatar";
import Button from "material-ui/Button";
import Typography from "material-ui/Typography";
import { Link } from "react-router-dom";
import GridList, { GridListTile } from "material-ui/GridList";
import auth from "./../auth/auth-helper";
import { read, unfollow, follow } from "./api-user.js";
import CustomButton from "./../common/CustomButton";
import StanButton from "./stan/StanButton";
import Box from "@material-ui/core/Box";
import config from "../../config/config";
const styles = theme => ({


  bigAvatar: {
    width: "60",
    height: "60",
    float: "left"
  },
  tileText: {
    marginTop: "10",
    marginLeft: "15"
  },
  gridList: {
    display: "block",
    marginTop: "20px"
  }
});
class Following extends Component {
  constructor({ match }) {
    super();
    this.state = {
      userId: "",
      user: auth.isAuthenticated().user
    };
    this.match = match;
  }

  // componentDidMount = () => {

  //   const jwt = auth.isAuthenticated()
  //   read({
  //     userId: this.props.userId
  //   }, { t: jwt.token }).then((data) => {
  //     if (data.error) {
  //       this.setState({ error: data.error })
  //     } else {
  //       this.setState({ id: data._id, following: data.following })
  //     }
  //   })
  // }

  unfollowClick = unfollowId => {
    const jwt = auth.isAuthenticated();
    unfollow(
      {
        userId: jwt.user._id
      },
      {
        t: jwt.token
      },
      unfollowId
    ).then(data => {
      if (data.error) {
        this.setState({ error: data.error });
      } else {
        console.log(unfollowId);
        this.props.onUnfollowUser(unfollowId);
      }
    });
  };

  stanDate = (data, id) => {
    var res = "";
    data.some(function (el) {
      if (el.creatorId === id) {
        res = el.stanRemoved
      }
    });
    return res;
    //  this.props.stanning.some((el, index) => el.creatorId === following._id)
    //  return el[index].stanRemoved
  }



  render() {
    const { classes } = this.props;
    return (
      <div className={"following-container"}>
        {this.props.following.length > 0 &&
          <Typography component="p" className={"mb-twenty para-sixteen no-fol"}>
            {this.props.following.length} Following
        </Typography>
        }
        <GridList className={classes.gridList} cols={4}>
          {this.props.following.length > 0 ? (
            this.props.following.map((following, i) => {
              return (
                <GridListTile
                  className={"list-actfollowing"}
                  style={{ height: 'auto' }}
                  key={i}>
                  <Link to={"/profile/" + following.username}>
                    <Avatar
                      src={following.photo ? config.profileImageBucketURL + following.photo : config.profileDefaultPath}

                      className={"following-avatarimg"} />
                    <Box component="div" className={"ml-fifteen"}>
                      <Typography component="h4">{following.name}</Typography>
                      <Typography component="p">
                        @{following.username}
                      </Typography>
                    </Box>
                  </Link>
                  {this.props.userId == auth.isAuthenticated().user._id &&
                    <div>
                      {!this.props.stanning.some(el => el.creatorId === following._id) &&
                        <CustomButton
                          label="Following"
                          className={"Primary_btn_blk"}
                          onClick={() => this.unfollowClick(following._id)}
                        />
                      }
                      {this.props.stanning.some(el => el.creatorId === following._id) &&
                        <StanButton
                          className={"Primary_btn_blk"}
                          userId={following._id}
                          stanRemoved={this.stanDate(this.props.stanning, following._id)}
                          handleStanStatus={this.props.handleStanStatus}
                          stan={true}
                          name={following.name}
                        />
                      }
                    </div>
                  }
                </GridListTile>
              );
            })
          ) : (

              <Typography component="p" className={"para-forteen"}>
                {auth.isAuthenticated().user._id == this.props.userId &&
                  <Typography component="p" className={"para-forteen no-fol"}>You are not following anyone.</Typography>
                }
                {auth.isAuthenticated().user._id != this.props.userId &&
                  <Typography component="p" className={"para-forteen no-fol"}>{this.props.creatorname} is not following anyone.</Typography>
                }
              </Typography>

            )}
        </GridList>
      </div>
    );
  }
}

Following.propTypes = {
  classes: PropTypes.object.isRequired
  // people: PropTypes.array.isRequired
};

export default withStyles(styles)(Following);
