import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import Notification from './Notification'

class PostDisplayList extends Component {
  render() {
    return (
      <div style={{marginTop: '24px'}}>
        {this.props.posts.map((item, i) => {
            return <Notification post={item} key={i} onRemove={this.props.removeUpdate}/>
          })
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
