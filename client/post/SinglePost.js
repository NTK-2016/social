import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Card from "material-ui/Card";
import Typography from "material-ui/Typography";
import Divider from "material-ui/Divider";
import auth from "./../auth/auth-helper";
import SinglePostDisplay from "./SinglePostDisplay";
import { readpost } from "./api-post.js";
import CustomLoader from "./../common/CustomLoader";
import Fourzerofour from "./../common/404";

const styles = theme => ({
  card: {
    margin: "auto",
    paddingTop: 0,
    paddingBottom: theme.spacing.unit * 3
  },
  title: {
    padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 2.5}px ${theme
      .spacing.unit * 2}px`,
    color: theme.palette.openTitle,
    fontSize: "1em"
  }
});

const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

class SinglePost extends Component {
  constructor({ match }) {
    super();
    this.state = {
      posts: "",
      loader: true,
      popanchor: null,
      popopen: false,
      id: undefined,
      pid: undefined,
      invalid: false
    };
    this.match = match;
  }

  // componentWillMount = () => {
  //     this.loadPosts()
  // }

  componentDidMount = () => {
    this.loadPosts();
  };

  handleMore = event => {
    if (this.state.popopen) {
      this.setState({
        // popanchor: null,
        // popopen: false,
        // pid: undefined,

        popanchor: event.currentTarget,
        popopen: true,
        pid: "simple-popper"
      });
    } else {
      this.setState({
        popanchor: event.currentTarget,
        popopen: true,
        pid: "simple-popper"
      });
    }
  };

  handleClose = event => {
    if (
      this.state.popanchor.current &&
      this.state.popanchor.current.contains(event.target)
    ) {
      return;
    }
    this.setState({
      popanchor: null,
      popopen: false,
      pid: undefined,
      deleteClick: false,
      share: false
    });
  };
  handleClosee = event => { };

  loadPosts = () => {
    const jwt = auth.isAuthenticated();
    readpost(
      {
        postId: this.match.params.postId,
        id: jwt.user._id
      },
      {
        t: jwt.token
      }
    ).then(data => {
      if (data.error) {
        this.setState({
          error: data.error,
          invalid: true,
          loader: false
        });
      } else {
        //console.log(data);
        if (typeof data.postedBy.stan == "undefined" && data.viewtype == "stans" && data.postname == "thought" && data.postedBy._id != auth.isAuthenticated().user._id) {
          window.location = "/becomestan/" + data.postedBy._id
          // this.setState({
          //   invalid: true,
          //   loader: false
          // })
        }
        else {
          this.setState({
            posts: data,
            loader: false
          })
        }
      }
    });
  };

  inValid = event => {
    this.setState({ invalid: true })
  }

  render() {
    if (this.state.invalid) {
      return <Fourzerofour />;
    }

    if (this.state.loader) {
      return <CustomLoader customclass="main-loader" />
    } else {
      const { classes } = this.props;
      let arr = [];
      if (this.state.posts.categories)
        arr = this.state.posts.categories.split(",");

      let attach = [];
      if (this.state.posts.attach) attach = this.state.posts.attach.split(",");
      var matches = "";
      if (this.state.posts.text)
        matches = this.state.posts.text.match(/\bhttps?:\/\/\S+/gi);
      return (
        <Card className={"single-post-card"}>
          <SinglePostDisplay post={this.state.posts} categories={arr} attach={attach} matches={matches} handleMore={this.handleMore} pid={this.state.pid} popopen={this.state.popopen} popanchor={this.state.popanchor} handleClose={this.handleClose} inValid={this.inValid} />
        </Card>
      );
    }
  }
}
SinglePost.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SinglePost);
