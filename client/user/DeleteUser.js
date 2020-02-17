import React, { Component } from 'react'
import PropTypes from 'prop-types'
import IconButton from 'material-ui/IconButton'
import Button from 'material-ui/Button'
import DeleteIcon from 'material-ui-icons/Delete'
import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog'
import auth from './../auth/auth-helper'
import { remove } from './api-user.js'
import { Redirect, Link } from 'react-router-dom'
import Typography from 'material-ui/Typography'
import CustomButton from './../common/CustomButton'

class DeleteUser extends Component {
  state = {
    redirect: false,
    open: false
  }
  clickButton = () => {
    this.setState({ open: true })
  }
  deleteAccount = () => {
    const jwt = auth.isAuthenticated()
    remove({
      userId: this.props.userId
    }, { t: jwt.token }).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        auth.signout(() => console.log('deleted'))
        this.setState({ redirect: true })
      }
    })
  }
  handleRequestClose = () => {
    this.setState({ open: false })
  }
  render() {
    const redirect = this.state.redirect
    if (redirect) {
      return <Redirect to='/' />
    }
    return (<span>
      {/* <IconButton aria-label="Delete"  color="secondary">
        <DeleteIcon/>
      </IconButton> */}
      <Typography className={"act-xs-btn"} component={"h3"}  onClick={this.clickButton}>
        Delete
      </Typography>
	  
      <Dialog open={this.state.open} onClose={this.handleRequestClose} className={"delete-user seeting_account"}>
        <DialogTitle className={"delete-user-title"}
		 style={{borderBottom:'1px solid #d6d6d6',borderRadius:'8px 8px 0 0',}}>{"Are you sure you want to delete your account?"}</DialogTitle>
        <DialogContent className={"delete-contenttext"}>
          <DialogContentText >
   Please note, proceeding with this action will permanently delete your
account and all your data stored. Be aware you won’t be able to retrieve it later. 
          </DialogContentText>
        </DialogContent>
        <DialogActions className={"delete-useraction"}>
        {/**  <Button onClick={this.handleRequestClose} color="primary">
            Cancel
          </Button>
          <Button onClick={this.deleteAccount} color="secondary" >
            Confirm
		</Button>**/}
		 <CustomButton label="Cancel" onClick={this.handleRequestClose} className={"Secondary_btn mr-10"} />
		 <CustomButton label="Delete" onClick={this.deleteAccount} className={"Primary_btn_blk"} />
        </DialogActions>
      </Dialog>
    </span>)
  }
}
DeleteUser.propTypes = {
  userId: PropTypes.string.isRequired
}
export default DeleteUser
