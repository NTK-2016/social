import React, { Component } from 'react'
import auth from './../auth/auth-helper'
import Card, { CardHeader, CardContent, CardActions } from 'material-ui/Card'
import Typography from 'material-ui/Typography'
import Avatar from 'material-ui/Avatar'
import IconButton from 'material-ui/IconButton'
import DeleteIcon from 'material-ui-icons/Delete'
import FavoriteIcon from 'material-ui-icons/Favorite'
import FavoriteBorderIcon from 'material-ui-icons/FavoriteBorder'
import CommentIcon from 'material-ui-icons/Comment'
import Divider from 'material-ui/Divider'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import { Link } from 'react-router-dom'
import Edit from 'material-ui-icons/Edit'
import config from "../../config/config";

const styles = theme => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    marginBottom: theme.spacing.unit * 3,
    backgroundColor: 'rgba(0, 0, 0, 0.06)'
  },
  cardContent: {
    backgroundColor: 'white',
    padding: `${theme.spacing.unit * 2}px 0px`
  },
  cardHeader: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit
  },
  text: {
    margin: theme.spacing.unit * 2
  },
  photo: {
    textAlign: 'center',
    backgroundColor: '#f2f5f4',
    padding: theme.spacing.unit
  },
  media: {
    height: 200
  },
  button: {
    margin: theme.spacing.unit,
  }
})

class Display extends Component {
  state = {
    like: false,
    likes: 0,
    comments: []
  }

  componentDidMount = () => {
    this.setState({ like: this.checkLike(this.props.post.likes), likes: this.props.post.likes.length, comments: this.props.post.comments })
  }
  componentWillReceiveProps = (props) => {
    this.setState({ like: this.checkLike(props.post.likes), likes: props.post.likes.length, comments: props.post.comments })
  }

  checkLike = (likes) => {
    const jwt = auth.isAuthenticated()
    let match = likes.indexOf(jwt.user._id) !== -1
    return match
  }

  like = () => {
    let callApi = this.state.like ? unlike : like
    const jwt = auth.isAuthenticated()
    callApi({
      userId: jwt.user._id
    }, {
      t: jwt.token
    }, this.props.post._id).then((data) => {
      if (data) { //data.error
      } else {
        this.setState({ like: !this.state.like, likes: data.likes.length })
      }
    })
  }

  updateComments = (comments) => {
    this.setState({ comments: comments })
  }

  deletePost = () => {
    const jwt = auth.isAuthenticated()
    remove({
      postId: this.props.post._id
    }, {
      t: jwt.token
    }).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        this.props.onRemove(this.props.post)
      }
    })
  }

  render() {
    const { classes } = this.props
    return (
      <Card className={classes.card}>
        <CardHeader
          // avatar={
          //   <Avatar src={'/api/users/photo/'+this.props.post.postedBy._id}/>
          // }
          // action={ this.props.post.postedBy._id === auth.isAuthenticated().user._id &&
          //   <IconButton onClick={this.deletePost}>
          //     <DeleteIcon />
          //   </IconButton> 

          //  }
          className={classes.cardHeader}
        />
        <CardContent className={classes.cardContent}>
          {(this.props.post.postname === "text" && this.props.post.photo) &&
            (<div className={classes.photo}>
              <img
                className={classes.media}
                src={this.props.post.photo ? config.photoBucketURL + this.props.post._id : ''}
              />
            </div>)
          } {/* Text Ends here*/}

          {(this.props.post.postname === "image") &&
            (<div className={classes.photo}>
              <img
                className={classes.media}
                src={this.props.post.url ? this.props.post.url : config.photoBucketURL + this.props.post.photo}
              />

            </div>)}
          {(this.props.post.postname === "audio") &&
            (<div className={classes.photo}>
              {this.props.post.photo &&
                <img
                  className={classes.media}
                  src={config.photoBucketURL + this.props.post.photo}
                />
              }
              <audio controls>
                <source src={this.props.post.url ? this.props.post.url : config.audioBucketURL + this.props.post.audio} type="audio/mpeg" />
                Your browser does not support the audio element.
                </audio>

            </div>)}
          {(this.props.post.postname === "video") &&
            (<div className={classes.photo}>
              {/* this.props.post.url &&
                <Preview url={this.props.post.url} />
              */}
              {!this.props.post.url &&
                <iframe src={config.videoThumbnailBucketURL + this.props.post.video}></iframe>
              }

            </div>)}

          {(this.props.post.postname === "link") &&
            (<div className={classes.photo}>
              <a href={this.props.post.url} target="_blank">{this.props.post.url}</a>
            </div>)}
          {(this.props.post.price) &&
            (<div className={classes.photo}>
              <img
                className={classes.media}
                src={config.photoBucketURL + this.props.post.photo}
              />
            </div>)}

          <Typography component="p" className={classes.text}>
            {this.props.post.text}
          </Typography>
          {(this.props.post.price) &&
            <Typography component="p" className={classes.text}>
              Price: {this.props.post.price}
            </Typography>
          }
          {this.props.post.postname == 'poll' &&
            <div>
              <Typography component="p" className={classes.text}>
                1: {this.props.post.options.option1} <br />
              </Typography>
              <Typography component="p" className={classes.text}>
                2: {this.props.post.options.option2}
              </Typography>
              {this.props.post.options.option3 &&
                <Typography component="p" className={classes.text}>
                  3: {this.props.post.options.option3}
                </Typography>
              }
              {this.props.post.options.option4 &&
                <Typography component="p" className={classes.text}>
                  4: {this.props.post.options.option4}
                </Typography>
              }
            </div>
          }

          {(this.props.post.posttype == '1' || this.props.post.posttype == '3') &&
            <Typography component="p" className={classes.text}>
              {"Posted/Published : " + (new Date(this.props.post.created)).toDateString()}
            </Typography>
          }
          {this.props.post.posttype == '2' &&
            <Typography component="p" className={classes.text}>
              {"Scheduled : " + (new Date(this.props.post.scheduled_datetime)).toDateString()}
            </Typography>
          }

          {this.props.post.postedBy._id === auth.isAuthenticated().user._id &&
            <Link to={"/" + this.props.post.postname + "edit/" + this.props.post._id}>
              <IconButton aria-label="Edit" color="primary">
                <Edit />
              </IconButton>
            </Link>}
          {this.props.post.postedBy._id === auth.isAuthenticated().user._id &&
            // <IconButton onClick={this.deletePost}>
            //   <DeleteIcon /> 
            // </IconButton>
            <DeletePost postId={this.props.post._id} post={this.props.post} onDelete={this.props.onRemove} />
          }
        </CardContent>
        <CardActions>


        </CardActions>
      </Card>
    )
  }
}

Display.propTypes = {
  classes: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired
}

export default withStyles(styles)(Display)
