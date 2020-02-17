import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Card from 'material-ui/Card'
import Typography from 'material-ui/Typography'
import Divider from 'material-ui/Divider'
import auth from './../auth/auth-helper'
import PostList from './../post/PostList'
import { loadLikedPosts } from './../post/api-post.js'
import CustomLoader from "./../common/CustomLoader";

const styles = theme => ({
  card: {

    paddingTop: 0,
    paddingBottom: theme.spacing.unit * 3,
    width: '600px',
    boxShadow: 'none',
  },
  title: {
    padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 2.5}px ${theme.spacing.unit * 2}px`,
    color: theme.palette.openTitle,
    fontSize: '1em'
  },
  media: {
    minHeight: 330
  },


})
const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};
class LikedPost extends Component {
  state = {
    posts: [],
    postloader: true

  }

  removePost = (post) => {
    const updatedPosts = this.state.posts
    const index = updatedPosts.indexOf(post)
    updatedPosts.splice(index, 1)
    this.setState({ posts: updatedPosts })
  }

  loadLikedPosts = () => {
    const jwt = auth.isAuthenticated()
    loadLikedPosts({
      userId: this.props.userId
    }, {
      t: jwt.token
    }).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        sleep(500).then(() => {
          this.setState({ posts: data, postloader: false })
        })
      }
    })
  }
  componentDidMount = () => {
    this.loadLikedPosts()
  }
  render() {
    const { classes } = this.props
    return (<div className={"liked-container"}>
      <Card className={"profilelike-inner"}>
        {
          this.state.postloader &&
          <CustomLoader customclass={"loader_bottom"} width={30} height={30} />
        }
        {this.state.posts.length > 0 && !this.state.postloader ?
          (<PostList posts={this.state.posts} removeUpdate={this.removePost} postloader={this.state.postloader} />)
          :
          (<Typography component="p" className={"para-forteen"}>
            {auth.isAuthenticated().user._id == this.props.userId && !this.state.postloader &&
              <Typography component="p" className={"para-forteen no-fol"}>You have not liked any posts yet.</Typography>
            }
            {auth.isAuthenticated().user._id != this.props.userId && !this.state.postloader &&
              <Typography component="p" className={"para-forteen no-fol"}>{this.props.creatorname} hasn't liked anything yet.</Typography>
            }
          </Typography>)
        }
      </Card>
    </div>
    )
  }
}
LikedPost.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(LikedPost)
