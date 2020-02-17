import React, { Component } from 'react'
import PropTypes from 'prop-types'
import IconButton from 'material-ui/IconButton'

import Button from 'material-ui/Button'
import DeleteIcon from 'material-ui-icons/Delete'
import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog'
import auth from './../auth/auth-helper'
import { remove } from './api-post.js'
import { Redirect, Link } from 'react-router-dom'
import CustomButton from './../common/CustomButton'

class DeletePost extends Component {
  state = {
    redirect: false,
    open: false
  }
  // shouldComponentUpdate(nextProps) {
  //   if(this.state.open)
  //   {
  //     console.log("false 2"+this.state.open)
  //     return false;
  //   }
  //   else
  //   {
  //     //console.log("true 1"+this.state.open)
  //     return true;
  //   }
  // }
  clickButton = () => {
    // console.log("123 "+this.state.open)
    this.setState({ open: true })
    // console.log("321 "+this.state.open)
  }
  // deleteAccount = () => {
  //   const jwt = auth.isAuthenticated()
  //   remove({
  //     userId: this.props.userId
  //   }, {t: jwt.token}).then((data) => {
  //     if (data.error) {
  //       console.log(data.error)
  //     } else {
  //       auth.signout(() => console.log('deleted'))
  //       this.setState({redirect: true})
  //     }
  //   })
  // }
  deletePost = () => {
    const jwt = auth.isAuthenticated()
    remove({
      postId: this.props.postId
    }, {
      t: jwt.token
    }).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        if (this.props.from == "single") {
          this.props.onDelete()
        }
        else {
          this.props.onDelete(this.props.post)
        }

        this.setState({ open: false })
      }
    })
  }
  deleteProduct = () => {
    const jwt = auth.isAuthenticated()
    remove({
      postId: this.props.postId
    }, {
      t: jwt.token
    }).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        if (this.props.from == "single") {
          this.props.onDelete()
        }
        else {
          this.props.onProductDelete(this.props.post)
        }

        this.setState({ open: false })
      }
    })
  }
  handleRequestClose = () => {
    this.setState({ open: false })
    this.props.onClose()
  }
  render() {
    const redirect = this.state.redirect
    if (redirect) {
      return <Redirect to='/' />
    }
    return (<span>
      {this.props.display == "icon" &&

        <i className={"fal fa-trash-alt"} onClick={this.clickButton} color="secondary"></i>
      }
      {this.props.display == "text" &&
        <span onClick={this.clickButton}>Delete</span>
      }
      <Dialog open={this.state.open} onClose={this.handleRequestClose} className={"delete-container"} >




        <DialogTitle className={"delete-head"}>{"Delete Post"}
          <IconButton className={"delete-close"}>
            <i className="fal fa-times" onClick={this.handleRequestClose}></i>
          </IconButton>
        </DialogTitle>
        <DialogContent className={"delete-content"}>
          <DialogContentText >
            Are you sure you want to delete this post?
          </DialogContentText>
        </DialogContent>
        <DialogActions className={"deletepost-action"}>

          {/** <Button onClick={this.handleRequestClose} color="primary">
            Cancel
			</Button>**/}
          <CustomButton
            label="Cancel"
            onClick={this.handleRequestClose}
            className={"Primary_btn_border"}
          />
          {this.props.type == "post" &&


            <CustomButton
              label="Confirm"
              onClick={this.deletePost}
              className={"Primary_btn_blk mar-space"}
            />

          }
          {this.props.type == "product" &&


            <CustomButton
              label="Confirm"
              onClick={this.deleteProduct}
              className={"Primary_btn_blk mar-space"}
            />
          }
        </DialogActions>
      </Dialog>
    </span>)
  }
}
DeletePost.propTypes = {
  postId: PropTypes.string.isRequired,
  //onRemove: PropTypes.func.isRequired
}
export default DeletePost
