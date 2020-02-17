import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Display from './Display'
import Typography from 'material-ui/Typography'
import { textAlign } from '@material-ui/system'
class PostDisplayList extends Component {
  render() {
    return (
      <div>
        {this.props.posts.length > 0 ?
          (this.props.posts.map((item, i) => {
            return <Display post={item} key={i} onRemove={this.props.removeUpdate} />
          })) :
          (
            <Typography component="h2" className={"display-postmsg"} style={{ textAlign: "center" }}>
              {this.props.type == "draft" ? "Your draft is empty" : (this.props.type == "schedule" ? "You don't have any scheduled post" : (this.props.type == "publish" ? "You don't have any published post" : ""))}
            </Typography>)
        }
      </div>
    )
  }
}
PostDisplayList.propTypes = {
  posts: PropTypes.array.isRequired,
  removeUpdate: PropTypes.func.isRequired
}
export default PostDisplayList
