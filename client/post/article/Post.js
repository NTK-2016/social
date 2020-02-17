import React, { Component } from 'react'
import auth from './../../auth/auth-helper'
import Typography from 'material-ui/Typography'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { withStyles } from 'material-ui/styles'
import ReactHtmlParser from 'react-html-parser';
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
  expandedText = () => {
    this.setState({ show: true })
    this.setState({ hide: true })
    this.setState({ read: false })
  }
  LessText = () => {
    this.setState({ show: false })
    this.setState({ hide: false })
    this.setState({ read: true })
  }

  render() {
    const { classes } = this.props
    var postId = this.props.post._id
    return (
      <div>



        <div className={"new-post-hold article-post"}>
          {this.props.post.text && <div className={"post-image-text"}>
            <Typography component="h1" className={"post-title-header"}>
              {this.props.post.text}
            </Typography>
          </div>}
          {this.props.post.subheading && <div className={"post-image-subtext edit-sbtxt2"}>
            <Typography component="div" className={"post-text"}>
              {this.props.post.subheading}
            </Typography>
          </div>}
          {this.props.post.photo &&
            <div className={"post-photo post-img-sec"}>
              <img
                className={classes.media}
                src={config.photoBucketURL + this.props.post.photo}
              />
            </div>
          }
          {this.props.post.description && <div className={"post-image-subtext editor-subtext"}>
            {!this.props.read &&
              <Typography component="div" className={"post-text editor-para"}>
                {ReactHtmlParser(this.props.post.description.substring(0, 300))}{this.props.post.description.length > 300 && <span>...</span>} &nbsp;
              </Typography>
            }
            {/*!this.props.read && this.state.show && this.props.post.description.substring(300)*/}
            {!this.props.read && this.state.read && this.props.post.description.length > 300 && <Link to={'/post/' + this.props.post._id}>Read more</Link>}
            {/*!this.props.read && this.state.hide && <a onClick={this.LessText}>Read Less</a>*/}
            <Typography component="div" className={"post-text editor-para"}>
              {this.props.read && ReactHtmlParser(this.props.post.description)}
            </Typography>
          </div>}
        </div>

      </div>
    )
  }
}

Post.propTypes = {
  classes: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
}

export default withStyles(styles)(Post)
