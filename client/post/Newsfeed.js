import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Card from "material-ui/Card";
import auth from "./../auth/auth-helper";
import PostList from "./PostList";
import { listNewsFeed } from "./api-post.js";
import NewPost from "./NewPost";
import CustomLoader from "./../common/CustomLoader";
import FindPeople from "./../user/FindPeople";
const styles = theme => ({
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

class Newsfeed extends Component {
  state = {
    posts: [],
    limit: 10,
    skip: 0,
    loader: true,
    top: true,
    postloader: true,
    response: true
  };

  loadPosts = () => {
    if (this.state.response) {
      this.setState({ response: false });
      const jwt = auth.isAuthenticated();
      listNewsFeed(
        {
          userId: jwt.user._id,
          limit: this.state.limit,
          skip: this.state.skip
        },
        {
          t: jwt.token
        }
      ).then(data => {
        if (data.error) {
          console.log(data.error);
        } else {
          if (this.state.skip == 0) {
            sleep(1500).then(() => {
              this.setState({
                posts: data,
                skip: this.state.skip + 10,
                loader: false,
                postloader: false,
                response: true
              });
            });
          } else {
            var joined = this.state.posts.concat(data);
            sleep(100).then(() => {
              this.setState({
                posts: joined,
                skip: this.state.skip + 10,
                loader: false,
                postloader: false,
                response: true
              });
            });
          }
          if (data.length == 10) {
            console.log("scroll added");
            document.addEventListener("scroll", this.trackScrolling);
          }
        }
      });
    }
  };
  componentDidMount = () => {
    this.loadPosts();
    document.addEventListener("scroll", this.trackScrolling);
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  };
  componentWillUnmount() {
    console.log("componentWillUnmount");
    document.removeEventListener("scroll", this.trackScrolling);
    this.setState({ skip: 0 });
  }
  isBottom(el) {
    return el.getBoundingClientRect().bottom <= window.innerHeight;
  }
  trackScrolling = () => {
    const wrappedElement = document.getElementById("newsfeed");
    if (this.isBottom(wrappedElement) && this.state.response) {
      this.setState({ loader: true, top: false });
      this.loadPosts();
      console.log("header bottom reached");
      document.removeEventListener("scroll", this.trackScrolling);
    }
  };

  addPost = post => {
    const updatedPosts = this.state.posts;
    updatedPosts.unshift(post);
    this.setState({ posts: updatedPosts, skip: this.state.skip + 1 });
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  };
  removePost = post => {
    const updatedPosts = this.state.posts;
    const index = updatedPosts.indexOf(post);
    updatedPosts.splice(index, 1);
    this.setState({ posts: updatedPosts });
  };
  getMorePost = () => {
    console.log("here");
  };
  render() {
    const { classes } = this.props;
    return (
      <section>
        <Card className={"newsfeed"} id={"newsfeed"}>
          {/*<Typography type="title" className={classes.title}>
          Newsfeed
        </Typography> */}
          <NewPost addUpdate={this.addPost} />
          <FindPeople />
          <PostList
            removeUpdate={this.removePost}
            posts={this.state.posts}
            userId={auth.isAuthenticated().user._id}
            top={this.state.top}
            postloader={this.state.postloader}
          />
          <br />
          {this.state.loader && this.state.skip > 0 && (
            <CustomLoader
              customclass={"loader_bottom"}
              width={30}
              height={30}
            />
          )}
        </Card>
      </section>
    );
  }
}
Newsfeed.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Newsfeed);
