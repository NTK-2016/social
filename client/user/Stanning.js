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
import IconButton from "material-ui/IconButton";
import Typography from "material-ui/Typography";
import { Link } from "react-router-dom";
import { findPeople, follow, findStanning } from "./api-user.js";
import auth from "./../auth/auth-helper";
import Snackbar from "material-ui/Snackbar";
import ViewIcon from "material-ui-icons/Visibility";
import Grid from "material-ui/Grid";
import Card, { CardActions, CardContent } from "material-ui/Card";
import { GridList } from "material-ui";
import CustomLoader from "./../common/CustomLoader";
import config from "../../config/config";
const styles = theme => ({
  root: theme.mixins.gutters({
    padding: theme.spacing.unit,
    margin: 0
  }),
  title: {
    margin: `${theme.spacing.unit * 0}px ${theme.spacing.unit}px ${theme.spacing
      .unit * 1}px  ${theme.spacing.unit * 0}`,
    color: theme.palette.openTitle,
    fontSize: "1em"
  },
  avatar: {
    marginRight: theme.spacing.unit * 1
  },
  follow: {
    right: theme.spacing.unit * 2
  },
  snack: {
    color: theme.palette.protectedTitle
  },
  viewButton: {
    verticalAlign: "middle"
  }
});
class Stanning extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      open: false,
      loading: true,
      error: ""
    };
    this.props = props;
  }
  componentDidMount = () => {
    const jwt = auth.isAuthenticated();
    findStanning(
      {
        userId: jwt.user._id
      },
      {
        t: jwt.token
      }
    ).then(data => {
      if (data.error) {
        this.setState({ error: data.error });
      } else {
        this.setState({ users: data, loading: false });
      }
    });
  };

  handleRequestClose = (event, reason) => {
    this.setState({ open: false });
  };
  render() {
    const { classes } = this.props;
    if (this.state.loading) {
      return (
        <div className={"followers-list"}>
          <CustomLoader />
        </div>
      );
    } else {
      return (
        this.state.users.stanning.length > 0 && (
          <div className={"followers-list"}>
            <Typography component="h2" variant="h2" className={classes.title}>
              Stanning
            </Typography>
            <Typography component="p" variant="p" className={classes.title}>
              This is only visible to you.
            </Typography>
            <Grid className={"followers-list"}>
              <ul>
                {this.state.users.stanning &&
                  this.state.users.stanning.map((item, i) => {

                    return (
                      i < 4 && (
                        <li key={i}>
                          <ListItemAvatar className={classes.avatar}>
                            <Link to={"/profile/" + item.creatorId.username}>
                              <ListItemAvatar className={classes.avatar}>
                                <Avatar
                                  src={item.creatorId.photo ? config.profileImageBucketURL + item.creatorId.photo : config.profileDefaultPath}
                                  //src={'/api/users/photo/' + item.creatorId._id}
                                  className={"profile-thumb"}
                                />
                              </ListItemAvatar>
                            </Link>
                          </ListItemAvatar>
                          <ListItemText primary={item.creatorId.name} />
                        </li>
                      )
                    );
                  })}
              </ul>
            </Grid>
            {this.state.users.stanning.length > 4 && (
              <Grid className={"all-followers"}>
                <Link to={""}>See All</Link>
              </Grid>
            )}

            <Snackbar
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right"
              }}
              open={this.state.open}
              onClose={this.handleRequestClose}
              autoHideDuration={6000}
              message={
                <span className={classes.snack}>
                  {this.state.followMessage}
                </span>
              }
            />
          </div>
        )
      );
    }
  }
}

Stanning.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Stanning);
