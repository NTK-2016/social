import React, { Component } from 'react'
import auth from './../../auth/auth-helper'
import Typography from 'material-ui/Typography'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import { Link } from 'react-router-dom'

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
      <div className={"new-post-hold"}>
        {this.props.post.text && <div className={"post-image-text"}>
          <Typography component="h1" className={"post-title-header"}>
            {this.props.post.text}
          </Typography>
        </div>}
        {this.props.post.subheading && <div className={"post-image-text"}>
          <Typography component="div" className={"post-text"}>
            {this.props.post.subheading}
          </Typography>
        </div>}
        {this.props.post.description && <div className={"post-image-subtext"}>
          <Typography component="div" className={"post-text"}>
            {!this.props.read && this.props.post.description.substring(0, 300)}
            {!this.props.read && this.state.show && this.props.post.description.substring(300)}
            {!this.props.read && this.state.read && this.props.post.description.length > 300 && <span><span>...&nbsp;</span><Link to={'/post/' + this.props.post._id}>Read more</Link></span>}
            {!this.props.read && this.state.hide && <a onClick={this.LessText}>Read Less</a>}
            {this.props.read && this.props.post.description}
          </Typography>
        </div>}

      </div>
    )
  }
}

Post.propTypes = {
  classes: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
}

export default withStyles(styles)(Post)
