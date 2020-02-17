import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import List, { ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText } from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
import IconButton from 'material-ui/IconButton'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import Edit from 'material-ui-icons/Edit'
import Divider from 'material-ui/Divider'
import DeleteUser from './DeleteUser'
import auth from './../auth/auth-helper'
import { read } from './api-user.js'
import { Redirect, Link } from 'react-router-dom'
import FollowProfileButton from './../user/FollowProfileButton'
import ProfileTabs from './../user/ProfileTabs'
import { listByUser } from './../post/api-post.js'
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card'
import Grid from 'material-ui/Grid'
import { FormatAlignRight } from 'material-ui-icons';
import SuggestedFollower from './SuggestedFollower'
import config from "../../config/config";
const styles = theme => ({
  root: theme.mixins.gutters({
    maxWidth: 800,
    margin: 'auto',
    padding: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit * 5
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
  grid: {

    flexGrow: 1,
    margin: 30,
    float: screenLeft,
    width: 1250

  },
  card: {
    maxWidth: 600,
    margin: 'auto',
    marginTop: theme.spacing.unit * 5
  },
  title: {
    padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 2.5}px ${theme.spacing.unit * 2}px`,
    color: theme.palette.text.secondary
  },
  media: {
    minHeight: 450
  },

})

class Profile extends Component {
  constructor({ match }) {
    super()
    this.state = {
      user: { following: [], followers: [] },
      redirectToSignin: false,
      following: false,
      posts: [],
      shop: []
    }
    this.match = match
  }
  init = (userId) => {
    const jwt = auth.isAuthenticated()
    read({
      userId: userId
    }, { t: jwt.token }).then((data) => {
      if (data.error) {
        this.setState({ redirectToSignin: true })
      } else {
        let following = this.checkFollow(data)
        this.setState({ user: data, following: following })
        this.loadPosts(data._id)
      }
    })
  }
  componentWillReceiveProps = (props) => {
    this.init(props.match.params.userId)
  }
  componentDidMount = () => {
    this.init(this.match.params.userId)
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
  loadPosts = (user) => {
    const jwt = auth.isAuthenticated()
    listByUser({
      userId: user
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
  }
  render() {
    const { classes } = this.props
    const photoUrl = this.state.user.photo ? config.profileImageBucketURL + this.state.user.photo : config.profileDefaultPath
    // this.state.user._id
    //           ? `/api/users/photo/${this.state.user._id}?${new Date().getTime()}`
    //           : '/api/users/defaultphoto'
    const bannerUrl = this.state.user.banner ? config.bannerImageBucketURL + this.state.user.banner : config.bannerDefaultPath
    // this.state.user._id
    //   ? `/api/users/banner/${this.state.user._id}?${new Date().getTime()}`
    //   : '/api/users/defaultbanner'
    const redirectToSignin = this.state.redirectToSignin
    if (redirectToSignin) {
      return <Redirect to='/signin' />
    }
    return (
      <div className={classes.grid} >
        <Grid>
          {/* <Typography type="title" className={classes.title}>
           Profile
         </Typography> */}
          <Grid>
            <CardMedia
              className={classes.media}
              image={bannerUrl}
              title="banner image"
            />
            <List dense>
              <ListItem>
                <ListItemAvatar>
                  <Avatar src={photoUrl} className={classes.bigAvatar} />
                </ListItemAvatar>
                <ListItemText primary={this.state.user.name} secondary={this.state.user.email} /> {
                  auth.isAuthenticated().user && auth.isAuthenticated().user._id == this.state.user._id
                    ? (<ListItemSecondaryAction>
                      <CardContent>no. of Followers
              <CardContent>no. of Following</CardContent>
                      </CardContent>
                      <Link to={"/setting/" + this.state.user._id}>
                        <IconButton aria-label="Edit" color="primary">
                          <Edit />
                        </IconButton>
                      </Link>
                      <DeleteUser userId={this.state.user._id} />
                    </ListItemSecondaryAction>)
                    : (<FollowProfileButton following={this.state.following} onButtonClick={this.clickFollowButton} />)
                }
              </ListItem>
            </List>
          </Grid>
          <Divider />
        </Grid>
        <Grid className={classes.grid} container spacing={24}>
          <CardContent item xs={8} sm={7}>
            <b>About
              <Link to={"/setting/" + this.state.user._id}>
                <IconButton aria-label="Edit" color="primary">
                  <Edit />
                </IconButton>Edit Bio
                  </Link>
            </b>
            <ListItem>
              <ListItemText primary={this.state.user.about} secondary={"Joined: " + (
                new Date(this.state.user.created)).toDateString()} />
            </ListItem>
            <h2>Stanning </h2>
            <CardContent type="headline" component="h2" className={classes.title}>
              You are not stanning<br /> anyone at the moment.<br />
              Discover and explore
          </CardContent>
            <h2>Following </h2>
            <Grid item xs={6} sm={5}>
              <Typography type="headline" component="h2" className={classes.title} paragraph>
                Become a stan for following creators and see posts<br />
                in feed.
          <Grid>
                  <SuggestedFollower />
                </Grid>
                <Button variant="raised" color="default" component="span">
                  <Link to={"/users/findpeople/" + this.state.user._id} style={{ color: "#E7A430" }}>Explore more</Link>
                </Button>
              </Typography>
            </Grid>
          </CardContent>
          <Grid><ProfileTabs user={this.state.user} shop={this.state.shop} posts={this.state.posts} removePostUpdate={this.removePost} />
            <Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>

    )
  }
}
Profile.propTypes = {
  classes: PropTypes.object.isRequired
}
export default withStyles(styles)(Profile)
