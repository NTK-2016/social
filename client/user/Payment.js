import React, {Component} from 'react'
import Card, {CardActions, CardContent} from 'material-ui/Card'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import Typography from 'material-ui/Typography'
import Icon from 'material-ui/Icon'
import Avatar from 'material-ui/Avatar'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import {Redirect} from 'react-router-dom'
import Paper from 'material-ui/Paper'
import auth from './../auth/auth-helper'
import {read,payment} from './api-user.js'
import DeleteUser from './DeleteUser'
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
  }
})

class Payment extends Component {
  constructor(props) {
    super(props)
    this.state = {
      payment:[],
      acc_holdername:'',
      bankname:'',
      accountnumber:'',
      subscriber:'',
      discount:'',
      error: '',
      redirectToProfile: false,
      userId:'',
      open:false
    }
   this.props = props

  }
  componentDidMount = () =>
   {
     this.userData = new FormData()
     const jwt = auth.isAuthenticated()
     read({
       userId: this.props.userId
     }, {t: jwt.token}).then((data) => {
       if (data.error) {
         this.setState({error: data.error})
       } else {
            this.userData.set("acc_holdername", data.payment.acc_holdername)
            this.userData.set("bankname", data.payment.bankname)
            this.userData.set("accountnumber", data.payment.accountnumber)
            this.userData.set("subscriber", data.payment.subscriber)
            this.userData.set("discount", data.payment.discount)
         this.setState({id: data._id,acc_holdername:data.payment.acc_holdername, bankname: data.payment.bankname, accountnumber:data.payment.accountnumber,subscriber: data.payment.subscriber,discount:data.payment.discount})
       }
     })
   }

   handleChange = name => event => {
    const value = event.target.value
    this.userData.set(name, value)
    this.setState({ [name]: value })
  }
  handleRequestClose = (event, reason) => {
    this.setState({ open: false })
  }
  clickSubmit = () => {
    const jwt = auth.isAuthenticated()
  
    const user = {
      acc_holdername: this.state.acc_holdername || undefined,
      bankname: this.state.bankname || undefined,
      accountnumber: this.state.accountnumber || undefined,
      subscriber: this.state.subscriber || undefined,
      discount: this.state.discount || undefined
    }
    payment({
      userId: this.props.userId
    }, {
      t: jwt.token
    }, this.userData).then((data) => {
      if (data.error) {
        this.setState({error: data.error})
      } else {
        this.setState({'redirectToProfile': false,open:true,paymentmsg:`Your Payment Policy is Updated Successfully.`})
      }
    })

  
}

  render() {
    return (
     
      <Card style={{ width:"400px",height:"500px" }} >
        <CardContent >
          <Typography type="headline" component="h2"  >
           Payment
          </Typography> 
          <TextField id="acc_holdername" type="text" label="Account Holder Name"  value={this.state.acc_holdername}  margin="normal" onChange={this.handleChange('acc_holdername')} /><br/>
          <TextField id="bankname" type="text" label="Bank Name"  value={this.state.bankname}  margin="normal" onChange={this.handleChange('bankname')} /><br/>
          <TextField id="accountnumber" type="text" label="Account Number"  value={this.state.accountnumber}  margin="normal" onChange={this.handleChange('accountnumber')} /><br/>
          <TextField id="subscriber" type="text" label="Subscription €"  value={this.state.subscriber}  margin="normal" onChange={this.handleChange('subscriber')} /><br/>
          <TextField id="discount" type="text"  value={this.state.discount} label="Discount %"  margin="normal"   onChange={this.handleChange('discount')}/><br/>
          <br/> 
        </CardContent>
        <CardActions style={{ float:"right" }}>
          <Button color="secondary" variant="raised" onClick={this.clickSubmit}>Save</Button>
        </CardActions>
        <CardContent>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          open={this.state.open}
          onClose={this.handleRequestClose}
          autoHideDuration={6000}
          message={<span >{this.state.paymentmsg}</span>}
      />
        </CardContent>
      </Card>
      
    )
  }
}

Payment.propTypes = {
  classes: PropTypes.object.isRequired,
  payment: PropTypes.array.isRequired,
}

export default withStyles(styles)(Payment)
