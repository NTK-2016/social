import React, { Component } from 'react'
import auth from './../../auth/auth-helper'
import Typography from 'material-ui/Typography'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Preview from "../../common/Preview"
import { Link } from 'react-router-dom'
import config from "../../../config/config";

const styles = theme => ({
  cardContent: {
    backgroundColor: 'white',
    padding: `${theme.spacing.unit * 2}px 0px`
  },
  text: {
    margin: theme.spacing.unit * 2
  },
  media: {
    height: 200
  },
  button: {
    margin: theme.spacing.unit,
  }
})

class Post extends Component {

  state = {
    read: true,
    hide: false,
    show: false,
  }

  render() {
    const { classes } = this.props
    var postId = this.props.post._id
    return (
      <div>
        <div className={"link-post"}>
          {this.props.post.text && <div className={"post-image-text"}>
            <Typography component="h1" className={"post-title-header"}>
              {this.props.post.text}
            </Typography>
          </div>}
          {this.props.post.description && <div className={"post-image-description"}>
            <Typography component="p" className={"post-image-subtext"}>
              {!this.props.read && this.props.post.description.substring(0, 300)}
              {!this.props.read && this.state.show && this.props.post.description.substring(300)}
              {!this.props.read && this.state.read && this.props.post.description.length > 300 && <span><span>...&nbsp;</span><Link to={'/post/' + this.props.post._id}>Read more</Link></span>}
              {!this.props.read && this.state.hide && <a onClick={this.LessText}>Read Less</a>}
              {this.props.read && this.props.post.description}
              {/* {this.props.post.description.substring(0, 300)}
              {this.props.post.description.length > 300 && <span><span>...&nbsp;</span><Link to={'/post/' + this.props.post._id}>Read more</Link></span>} */}
            </Typography>
          </div>}


        </div>
        <div className={classes.photo}>
          {/* this.props.post.url &&
                        <Preview url={this.props.post.url} />
                      */}
          <Typography component="div" className={"post-photo preview link-sec"}>
            {this.props.post.url &&
              <Preview url={this.props.post.url} />
            }
          </Typography>
        </div>
        {this.props.post.photo &&
          <div className={"post-photo"}>
            <img
              className={classes.media}
              src={config.photoBucketURL + this.props.post.photo}
            />
          </div>
        }

      </div>


    )
  }
}

Post.propTypes = {
  classes: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
}

export default withStyles(styles)(Post)
