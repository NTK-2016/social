import React, {Component} from 'react'
import Card, {CardActions, CardContent} from 'material-ui/Card'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import Typography from 'material-ui/Typography'
import Icon from 'material-ui/Icon'
import Avatar from 'material-ui/Avatar'
import FileUpload from 'material-ui-icons/FileUpload'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import auth from './../auth/auth-helper'
import {ProductList,ProductUpdate,ProductById} from './api-user.js'
import {Redirect} from 'react-router-dom'
import Snackbar from 'material-ui/Snackbar'
const styles = theme => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing.unit * 5,
    paddingBottom: theme.spacing.unit * 2
  },
  title: {
    margin: theme.spacing.unit * 2,
    color: theme.palette.protectedTitle
  },
  error: {
    verticalAlign: 'middle'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 300
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing.unit * 2
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: 'auto'
  },
  input: {
    display: 'none'
  },
  filename:{
    marginLeft:'10px'
  },
  snack: {
    color: theme.palette.protectedTitle
  },
})

class EditProduct extends Component {
  constructor({match}) {
    super()
    this.state = {
      productname: '',
      description: '',
      photo: '',
      price: '',
      created: '',
      redirectToProduct: false,
      error: '',
      open:false
    }
    this.match = match
   
  }
  
  componentDidMount = () => {
    this.shopData = new FormData()
    const jwt = auth.isAuthenticated()
    ProductById({
      productId: this.match.params.productId
    }, {t: jwt.token}).then((data) => {
      if (data.error) {
        this.setState({error: data.error})
      } else {
        this.setState({id: data._id, productname: data.productname, price: data.price, description: data.description,msg:`${data.productname} is Updated Successfully.`})
      }
    })
  }
 
  clickSubmit = () => {
    const jwt = auth.isAuthenticated()
    const shop = {
      productname: this.state.productname || undefined,
      price: this.state.price || undefined,
      created: this.state.created|| undefined,
      description: this.state.description || undefined
    }
    ProductUpdate({
      productId: this.match.params.productId
      
    }, {
      t: jwt.token
    }, this.shopData).then((data) => {
      if (data.error) {
        this.setState({error: data.error})
      } else {
        this.setState({'redirectToProduct': false})
      }
    })
  }
  handleChange = name => event => {
    const value = name === 'photo'
      ? event.target.files[0]
      : event.target.value
    this.shopData.set(name, value)
    this.setState({ [name]: value })
  }
  handleRequestClose = (event, reason) => {
    this.setState({ open: false })
  }
  render() {
    const {classes} = this.props
    const photoUrl = this.state.id
                 ? `/api/users/photo/${this.state.id}?${new Date().getTime()}`
                 : '/api/users/defaultphoto'
    if (this.state.redirectToProduct) {
      return (<Redirect to={'/editproduct/' + this.state.id}/>)
    }
    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography type="headline" component="h2" className={classes.title}>
            Edit Product
          </Typography>
          <Avatar src={photoUrl} className={classes.bigAvatar}/><br/>
          <input accept="image/*" onChange={this.handleChange('photo')} className={classes.input} id="icon-button-file" type="file" />
          <label htmlFor="icon-button-file">
            <Button variant="raised" color="default" component="span">
              Upload
              <FileUpload/>
            </Button>
          </label> <span className={classes.filename}>{this.state.photo ? this.state.photo.name : ''}</span><br/>
          <TextField id="name" label="Product Name" className={classes.textField} value={this.state.productname} onChange={this.handleChange('productname')} margin="normal"/><br/>
          <TextField
            id="multiline-flexible"
            label="Description"
            multiline
            rows="2"
            value={this.state.description}
            onChange={this.handleChange('description')}
            className={classes.textField}
            margin="normal"
          /><br/>
          <TextField id="email" type="text" label="price" className={classes.textField} value={this.state.price} onChange={this.handleChange('price')} margin="normal"/><br/>
          <TextField id="password" type="text" label="created" className={classes.textField} value={this.state.created} onChange={this.handleChange('created')} margin="normal"/>
          <br/> {
            this.state.error && (<Typography component="p" color="error">
              <Icon color="error" className={classes.error}>error</Icon>
              {this.state.error}
            </Typography>)
          }
        </CardContent>
        <CardActions>
          <Button color="primary" variant="raised" onClick={this.clickSubmit} className={classes.submit}>Submit</Button>
        </CardActions>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          open={this.state.open}
          onClose={this.handleRequestClose}
          autoHideDuration={6000}
          message={<span className={classes.snack}>{this.state.msg}</span>}
      />
      </Card>
    )
  }
}

EditProduct.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(EditProduct)
