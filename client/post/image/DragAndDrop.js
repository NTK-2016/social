import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import Card from 'material-ui/Card'
import Typography from 'material-ui/Typography'
import Divider from 'material-ui/Divider'
import auth from './../../auth/auth-helper'
import PostList from './../PostList'
import {listNewsFeed} from './../api-post.js'
import {readpost} from './../api-post.js'

const styles = theme => ({
  card: {
    margin: 'auto',
    paddingTop: 0,
    paddingBottom: theme.spacing.unit*3,
  },
  title: {
    padding:`${theme.spacing.unit * 3}px ${theme.spacing.unit * 2.5}px ${theme.spacing.unit * 2}px`,
    color: theme.palette.openTitle,
    fontSize: '1em'
  },
  media: {
    minHeight: 330
  }
})

class DragAndDrop extends Component {
  constructor({match}) {
    super()
    this.state = {
        posts: [],
        text: '',
        photo: '',
        posttype: '',
        viewtype: '',
        description: '',
        categories: '',
        id:'',
        error: '',
        dragging: false
    }
    this.match = match
  }

  dropRef = React.createRef()
  handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }
  handleDragIn = (e) => {
  e.preventDefault()
  e.stopPropagation()
  this.dragCounter++ 
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
    this.setState({dragging: true})
  }
  }
  handleDragOut = (e) => {
  e.preventDefault()
  e.stopPropagation()
  this.dragCounter--
  if (this.dragCounter > 0) return
  this.setState({dragging: false})
  }
  handleDrop = (e) => {
  e.preventDefault()
  e.stopPropagation()
  this.setState({drag: false})
  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    this.props.handleDrop(e.dataTransfer.files)
    e.dataTransfer.clearData()
    this.dragCounter = 0
  }
  }



  componentDidMount = () => {
    let div = this.dropRef.current
    div.addEventListener('dragenter', this.handleDragIn)
    div.addEventListener('dragleave', this.handleDragOut)
    div.addEventListener('dragover', this.handleDrag)
    div.addEventListener('drop', this.handleDrop)
  }

  componentWillUnmount() {
    let div = this.dropRef.current
    div.removeEventListener('dragenter', this.handleDragIn)
    div.removeEventListener('dragleave', this.handleDragOut)
    div.removeEventListener('dragover', this.handleDrag)
    div.removeEventListener('drop', this.handleDrop)
  }

  addPost = (post) => {
    const updatedPosts = this.state.posts
    updatedPosts.unshift(post)
    this.setState({posts: updatedPosts})
  }
  removePost = (post) => {
    const updatedPosts = this.state.posts
    const index = updatedPosts.indexOf(post)
    updatedPosts.splice(index, 1)
    this.setState({posts: updatedPosts})
  }
  render() {
    const {classes} = this.props
    return (
      <div
        style={{display: 'inline-block', position: 'relative'}}
        ref={this.dropRef}
      >
        {this.state.dragging &&
          <div 
            style={{
              border: 'dashed grey 4px',
              backgroundColor: 'rgba(255,255,255,.8)',
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0, 
              right: 0,
              zIndex: 9999
            }}
          >
            <div 
              style={{
                position: 'absolute',
                top: '50%',
                right: 0,
                left: 0,
                textAlign: 'center',
                color: 'grey',
                fontSize: 36
              }}
            >
              <div>drop here :)</div>
            </div>
          </div>
        }
        {this.props.children}
      </div>
    )
  }
}
DragAndDrop.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(DragAndDrop)
