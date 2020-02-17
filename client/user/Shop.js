import React, {Component} from 'react'
import Card, {CardActions, CardContent} from 'material-ui/Card'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import Typography from 'material-ui/Typography'
import Icon from 'material-ui/Icon'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import {AddProduct,ProductList} from './api-user.js'
import Dialog, {DialogActions, DialogContent, DialogContentText, DialogTitle} from 'material-ui/Dialog'
import List, {ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText} from 'material-ui/List'
import Grid from  'material-ui/Grid'
import {Link} from 'react-router-dom'

const styles = theme => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing.unit * 5,
    paddingBottom: theme.spacing.unit * 2
  },
  error: {
    verticalAlign: 'middle'
  },
  title: {
    marginTop: theme.spacing.unit * 2,
    color: theme.palette.openTitle
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 300
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing.unit * 2
  }
})

class Shop extends Component {
  state = {
    productname: '',
    description: '',
    price: '',
    image: '',
  }

  handleChange = name => event => {
    this.setState({[name]: event.target.value})
  }

  clickSubmit = () => {
    const shop = {
      productname: this.state.productname || undefined,
      description: this.state.description || undefined,
      price: this.state.price || undefined
    }
    
    AddProduct(shop).then((data) => {
      if (data.error) {
        this.setState({error: data.error})
      } else {
        this.setState({error: '', open: true})
      }
    })
  }
  
 
  render() {
    const {classes} = this.props
    return (<div>
      <Card className={classes.card}>
        <CardContent>
          <Typography type="headline" component="h2" className={classes.title}>
            Product Details
          </Typography>
          <TextField id="name" label="Product Name" className={classes.textField} value={this.state.productname} onChange={this.handleChange('productname')} margin="normal"/><br/>
          <TextField id="email" type="text" label="Description" className={classes.textField} value={this.state.description} onChange={this.handleChange('description')} margin="normal"/><br/>
          <TextField id="password" type="text" label="Price" className={classes.textField} value={this.state.price} onChange={this.handleChange('price')} margin="normal"/>
          <br/> {
            this.state.error && (<Typography component="p" color="error">
              <Icon color="error" className={classes.error}>error</Icon>
              {this.state.error}</Typography>)
          }
        </CardContent>
        <CardActions>
          <Button color="primary" variant="raised" onClick={this.clickSubmit} className={classes.submit}>Submit</Button>
        </CardActions>
      </Card>
      <Dialog open={this.state.open} disableBackdropClick={true}>
        <DialogTitle>New Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            New account successfully created.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Link to="">
            <Button color="primary"  variant="raised">
              Add more Product
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
    </div>)
  }
}

Shop.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Shop)
