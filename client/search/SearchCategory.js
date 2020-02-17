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
import Divider from "material-ui/Divider";
import auth from "./../auth/auth-helper";
import { categoryuser } from "./../user/api-user.js";
import { Redirect, Link } from "react-router-dom";
import Grid from "material-ui/Grid";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";

const styles = theme => ({
  root: theme.mixins.gutters({
    maxWidth: 898,
    margin: "100px auto",
    padding: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit * 5,
    boxShadow: "none",
    background: "transparent"
  }),
  title: {
    margin: `${theme.spacing.unit * 2}px ${theme.spacing.unit}px 0`,
    color: theme.palette.protectedTitle,
    fontSize: "1em"
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: 10
  }
});

class SearchCategory extends Component {
  constructor({ match }) {
    super();
    this.state = {
      users: [],
      redirectToSignin: false
    };
    this.match = match;
  }

  init = () => {
    console.log("category" + this.props.category);
    const jwt = auth.isAuthenticated();
    categoryuser(
      {
        category: this.props.category
      },
      {
        t: jwt.token
      }
    ).then(data => {
      if (data.error) {
        //console.log(data[0].error)
        this.setState({ redirectToSignin: true });
      } else {
        this.setState({ users: data });
      }
    });
  };
  componentDidMount = () => {
    this.init();
  };

  render() {
    const { classes } = this.props;
    var category = "";
    const redirectToSignin = this.state.redirectToSignin;
    if (redirectToSignin) {
      return <Redirect to="/signin" />;
    }
    return (
      <Paper className={classes.root}>
        <span>{this.props.category}</span>
        {this.state.users.map((item, i) => {
          <span>{item}</span>;
        })}
      </Paper>
    );
  }
}
SearchCategory.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SearchCategory);
