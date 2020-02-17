import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Card from 'material-ui/Card'
import Typography from 'material-ui/Typography'
import Divider from 'material-ui/Divider'
import auth from './../../auth/auth-helper'
import PostList from './../PostList'
import { listNewsFeed } from './../api-post.js'
import { readpost } from './../api-post.js'
import NewImage from './NewImage'
import EditImage from './EditImage'

const styles = theme => ({

  title: {
    padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 2.5}px ${theme.spacing.unit * 2}px`,
    color: theme.palette.openTitle,
    fontSize: '1em'
  },
  media: {
    minHeight: 330
  }
})

class Image extends Component {
  constructor({ match }) {
    super()
    this.state = {
      posts: [],
      text: '',
      photo: '',
      posttype: '',
      viewtype: '',
      description: '',
      categories: '',
      id: '',
      error: ''
    }
    this.match = match
  }

  componentDidMount = () => {
    // this.loadPosts()
    // console.log("post ID 1 :"+this.match.params.postId)
    // console.log("random")
    // if(this.match.params.postId)
    // {
    // this.userData = new FormData()

    // }
    // else
    // {
    //   console.log("no found")
    // }
  }
  addPost = (post) => {
    const updatedPosts = this.state.posts
    updatedPosts.unshift(post)
    this.setState({ posts: updatedPosts })
  }
  removePost = (post) => {
    const updatedPosts = this.state.posts
    const index = updatedPosts.indexOf(post)
    updatedPosts.splice(index, 1)
    this.setState({ posts: updatedPosts })
  }
  render() {
    const { classes } = this.props
    return (
      <section className={"bg-white "}>
        <Card className={"card-main-hold"}>
          {this.match.params.postId === undefined &&
            <NewImage addUpdate={this.addPost} />}
          {this.match.params.postId !== undefined &&
            <EditImage addUpdate={this.addPost} postId={this.match.params.postId} />}
        </Card>
      </section>
    )
  }
}
Image.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Image)
