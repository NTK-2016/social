import React, { Component } from 'react'
import PropTypes from 'prop-types'
import IconButton from 'material-ui/IconButton'
import Button from 'material-ui/Button'
import DeleteIcon from 'material-ui-icons/Delete'
import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog'
import auth from './../auth/auth-helper'
import { ProductRemove } from './api-user.js'
import { Redirect, Link } from 'react-router-dom'

class DeleteProduct extends Component {
  state = {
    redirect: false,
    open: false
  }
  clickButton = () => {
    this.setState({ open: true })
  }
  deleteProduct = () => {
    const jwt = auth.isAuthenticated()
    console.log(this.props.productId + "sddf");
    ProductRemove({
      productId: this.props.productId
    }, { t: jwt.token }).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {

        this.setState({ redirect: false })
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
      <IconButton aria-label="Delete" onClick={this.clickButton} color="secondary">
        <DeleteIcon />
      </IconButton>

      <Dialog open={this.state.open} onClose={this.handleRequestClose}>
        <DialogTitle>{"Delet Product"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are You sure to delete product?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleRequestClose} color="primary">
            Cancel
          </Button>
          <Button onClick={this.deleteProduct} color="secondary" >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </span>)
  }
}
DeleteProduct.propTypes = {
  productId: PropTypes.string.isRequired
}
export default DeleteProduct
