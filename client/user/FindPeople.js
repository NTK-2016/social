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
import Button from "material-ui/Button";
import Typography from "material-ui/Typography";
import { Link } from "react-router-dom";
import { findPeople, follow, readprofileimage } from "./api-user.js";
import auth from "./../auth/auth-helper";
import Snackbar from "material-ui/Snackbar";
import OwlCarousel from 'react-owl-carousel2';
import Grid from "material-ui/Grid";
import config from "../../config/config";
const styles = theme => ({
  root: theme.mixins.gutters({
    padding: theme.spacing.unit,
    margin: 0
  }),

  avatar: {
    marginRight: '5px',
  },
  follow: {
    right: theme.spacing.unit * 2
  },
  snack: {
    color: '#fff',
  },
  viewButton: {
    verticalAlign: "middle"
  }
});

const options = {
  margin: 0,
  items: 3,
  nav: false,
  rewind: true,
  autoplay: false,
  loop: false,
  autoHeight: false,
  responsive: {
    0: {
      items: 3
    },
    600: {
      items: 5
    },
    1000: {
      items: 7
    }
  }
};


class FindPeople extends Component {
  state = {
    users: [],
    open: false,
    profileImage: ''
    //showfindpeople: true
  };
  componentDidMount = () => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    const jwt = auth.isAuthenticated();
    findPeople(
      {
        userId: jwt.user._id
      },
      {
        t: jwt.token
      }
    ).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ users: data });
      }
    });
    if (auth.isAuthenticated().user.showtime) {
      if (Date.parse(auth.isAuthenticated().user.showtime) < new Date()) {
        this.setState({ showfindpeople: true })
      } else if (Date.parse(auth.isAuthenticated().user.showtime) > new Date()) {
        this.setState({ showfindpeople: false })
      }
    }
    else {
      this.setState({ showfindpeople: true })
    }
  };
  clickFollow = (user, index) => {

    const jwt = auth.isAuthenticated();
    follow(
      {
        userId: jwt.user._id
      },
      {
        t: jwt.token
      },
      user._id
    ).then(data => {
      if (data.error) {
        this.setState({ error: data.error });
      } else {
        let toFollow = this.state.users;
        toFollow.splice(index, 1);
        this.setState({
          users: toFollow,
          //open: true,
          // followMessage: `Following ${user.name}!`
        });
      }
    });
  };
  handleRequestClose = (event, reason) => {
    this.setState({ open: false });
  };
  clickButton = () => {
    var jwt = JSON.parse(localStorage.jwt);
    var date = new Date();
    date.setDate(date.getDate() + 1);
    jwt.user.showtime = new Date(date);
    localStorage.setItem("jwt", JSON.stringify(jwt));
    this.setState({ showfindpeople: false })
  }
  getProfile = (userid) => {
    console.log("getProfile" + userid)
    readprofileimage({
      userId: userid,
    }, {
      t: jwt.token
    }).then((data) => {
      return data
      //this.setState({ profileImage: data })
    })
  }
  render() {
    const { classes } = this.props;
    return (
      <div>
        <div className={"find-people-container desktop"}>
          <Paper className={"find-people-inner"}>
            <Grid component="h2" variant="h2" type="title" className={"people-title"}>
              Joined recently
            </Grid>
            <List className={"people-list"}>
              {this.state.users.slice(0, 3).map((item, i) => {
                var path = () => this.getProfile(item._id)
                return (
                  <span key={i}>
                    <ListItem className={"list-people"}>
                      <div className={"joincreator"}>
                        <Grid className={classes.avatar}>
                          <Avatar
                            src={item.photo ? config.profileImageBucketURL + item.photo : config.profileDefaultPath}
                            className={"find-avatar"}
                          />
                        </Grid>
                        {item.creater.status == 1 && (
                          <div className={"profile-verified"}>
                            {/** <img src="/dist/create/certified.svg" />**/}
                            <div className={"creator-img-small"}>c </div>
                          </div>
                        )}
                      </div>
                      <Link
                        to={"/profile/" + item.username}
                        className={"suggested-people"}
                      >
                        <ListItemText
                          primary={item.name}
                          className={"suggesteduser"}
                        />
                        <Grid variant="p" component="p">@{item.username}</Grid>
                      </Link>

                      <ListItemSecondaryAction className={"follow-people"}>
                        {/*<Link to={"/user/" + item._id}>
                      <IconButton variant="raised" color="secondary" className={classes.viewButton}>
                        <ViewIcon/>
                      </IconButton>
                    </Link>*/}
                        <Button
                          aria-label="Follow"
                          variant="raised"
                          color="primary"
                          onClick={this.clickFollow.bind(this, item, i)}
                        >
                          Follow
                      </Button>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </span>
                );
              })}
            </List>
            <Link to={"/search/"} className={"explore-people"}>
              Discover more
          </Link>
          </Paper>

          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right"
            }}
            open={this.state.open}
            onClose={this.handleRequestClose}
            autoHideDuration={6000}
            message={
              <span className={classes.snack}>{this.state.followMessage}</span>
            }
          />
        </div>
        {this.state.showfindpeople && this.state.users.length > 0 &&
          <div className={"find-people-container mobile"}>
            <Paper className={"find-people-inner"}>
              <Grid component="h2" variant="h2" type="title" className={"people-title"}>
                Connect with People
                <Grid component="div" variant="div" className={"close_button"}><i className={"fal fa-times"} onClick={this.clickButton}></i></Grid>
              </Grid>
              <OwlCarousel ref="car" options={options}>
                {this.state.users.map((item, i) => {
                  return (
                    <div key={i} className={"owl_item_inner"}>
                      <div className={"joincreator"}>
                        <Grid className={classes.avatar}>
                          <Avatar
                            src={item.photo ? config.profileImageBucketURL + item.photo : config.profileDefaultPath}
                            className={"find-avatar"}
                          />
                        </Grid>
                        {item.creater.status == 1 && (
                          <div className={"profile-verified"}>
                            {/** <img src="/dist/create/certified.svg" />**/}
                            <div className={"creator-img-small"}>
                              c
						                </div>
                          </div>
                        )}
                      </div>
                      <Grid component="div" variant="div" className={"suggested_with_follow_blk"}>
                        <Link
                          to={"/profile/" + item.username}
                          className={"suggested-people"}>
                          <ListItemText
                            primary={item.name}
                            className={"suggesteduser"} />
                        </Link>
                        <Grid component="p" variant="p" className={"suggested-people_user"}>@{item.username}</Grid>
                        <Grid component="div" variant="div" className={"follow-people"}>
                          <Button
                            aria-label="Follow"
                            variant="raised"
                            color="primary"
                            onClick={this.clickFollow.bind(this, item, i)}>
                            Follow
                          </Button>
                        </Grid>
                      </Grid>
                    </div>)
                })}
              </OwlCarousel>
            </Paper>
          </div>
        }
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right"
          }}
          open={this.state.open}
          onClose={this.handleRequestClose}
          autoHideDuration={6000}
          message={
            <span className={classes.snack}>{this.state.followMessage}</span>
          }
        />
      </div >


    );
  }
}

FindPeople.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FindPeople);
