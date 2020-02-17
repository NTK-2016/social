import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import auth from './../auth/auth-helper'
import { read } from './../user/api-user.js'
import { Redirect, Link } from 'react-router-dom'
import PostTabs from './PostTabs'
import { listByUser } from './../post/api-post.js'
import { listScheduleByUser } from './../post/api-post.js'
import { listDraftByUser } from './../post/api-post.js'

const styles = theme => ({
  root: theme.mixins.gutters({
    maxWidth: 700,
    margin: '0px auto',
    padding: theme.spacing.unit * 3,

    boxShadow: 'none',
    background: 'transparent',
  }),
  title: {
    margin: `${theme.spacing.unit * 2}px ${theme.spacing.unit}px 0`,
    color: theme.palette.protectedTitle,
    fontSize: '1em'
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: 10
  },
})

class Create extends Component {
  constructor({ match }) {
    super()
    this.state = {
      user: { following: [], followers: [] },
      redirectToSignin: false,
      following: false,
      drafts: [],
      schedules: [],
      posts: [],
      tab: '0'
    }
    this.match = match

  }
  init = () => {

    const jwt = auth.isAuthenticated()
    read({
      userId: jwt.user._id
    }, { t: jwt.token }).then((data) => {
      if (data.error) {
        this.setState({ redirectToSignin: true })
      } else {
        let following = this.checkFollow(data)
        this.setState({ user: data, following: following })
        this.loadPosts(data._id) // published
        this.loadSchedulePosts(data._id) // Schedule 2
        this.loadDraftPosts(data._id) // draft 3
      }
    })
  }
  // componentWillReceiveProps = (props) => {

  //   this.init(props.match.params.userId)
  // }
  componentDidMount = () => {
    this.setState({ tab: 0 })
    // console.log("create1:" + this.state.tab)
    this.init()
  }
  checkFollow = (user) => {
    const jwt = auth.isAuthenticated()
    const match = user.followers.find((follower) => {
      return follower._id == jwt.user._id
    })
    return match
  }
  clickFollowButton = (callApi) => {
    const jwt = auth.isAuthenticated()
    callApi({
      userId: jwt.user._id
    }, {
      t: jwt.token
    }, this.state.user._id).then((data) => {
      if (data.error) {
        this.setState({ error: data.error })
      } else {
        this.setState({ user: data, following: !this.state.following })
      }
    })
  }
  loadDraftPosts = (user) => {

    const jwt = auth.isAuthenticated()
    listDraftByUser({
      userId: user
    }, {
      t: jwt.token
    }).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        this.setState({ drafts: data })
      }
    })
  }
  loadSchedulePosts = (user) => {

    const jwt = auth.isAuthenticated()
    listScheduleByUser({
      userId: user
    }, {
      t: jwt.token
    }).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        this.setState({ schedules: data })
      }
    })
  }
  loadPosts = (user) => {

    const jwt = auth.isAuthenticated()
    listByUser({
      userId: user,
      id: user
    }, {
      t: jwt.token
    }).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        this.setState({ posts: data })
      }
    })
  }
  removePost = (post) => {
    const updatedPosts = this.state.posts
    const index = updatedPosts.indexOf(post)
    updatedPosts.splice(index, 1)
    this.setState({ posts: updatedPosts })
    this.setState({ tab: 3 })
    // console.log("pub  :" + this.state.tab)
  }
  removeSchedulePost = (post) => {
    const updatedPosts = this.state.schedules
    const index = updatedPosts.indexOf(post)
    updatedPosts.splice(index, 1)
    this.setState({ schedules: updatedPosts })
    this.setState({ tab: 2 })
    // console.log("sch :" + this.state.tab)
  }
  removeDraftPost = (post) => {
    const updatedPosts = this.state.drafts
    const index = updatedPosts.indexOf(post)
    updatedPosts.splice(index, 1)
    this.setState({ drafts: updatedPosts })
    this.setState({ tab: 1 })
    // console.log("draft:" + this.state.tab)
  }
  render() {
    const { classes } = this.props
    const photoUrl = this.state.user._id
      ? `/api/users/photo/${this.state.user._id}?${new Date().getTime()}`
      : '/api/users/defaultphoto'
    const redirectToSignin = this.state.redirectToSignin
    if (redirectToSignin) {
      return <Redirect to='/signin' />
    }
    return (
      <section className={"bg-white"}>
        <Paper className={"create-container"}>
          <PostTabs posts={this.state.posts} schedules={this.state.schedules} drafts={this.state.drafts} removePostUpdate={this.removePost} removeDraftUpdate={this.removeDraftPost} removeScheduleUpdate={this.removeSchedulePost} tab={this.state.tab} />
        </Paper>
      </section>
    )
  }
}
Create.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Create)
