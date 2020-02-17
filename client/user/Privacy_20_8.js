import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'
import Switches from 'material-ui/Switch'
import { FormGroup,FormControlLabel,FormControl,FormLabel } from 'material-ui'; 
import { Paper } from 'material-ui';
import Divider from 'material-ui/Divider'
import {read,privacy} from './api-user.js'
import Snackbar from 'material-ui/Snackbar'
import auth from './../auth/auth-helper'


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
  
  class Privacy extends Component {
    constructor({props}) {
      super(props)
      this.state = {
        privacy:[],
        nofstan :false,
        noffollowing : false,
        noffollowers : false,
        income : false,
        goal : false,
        userId:'',
        open:false,
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
          this.userData.set("nofstan", data.privacy.nofstan)
          this.userData.set("noffollowing", data.privacy.noffollowing)
          this.userData.set("noffollowers", data.privacy.noffollowers)
          this.userData.set("income", data.privacy.income)
          this.userData.set("goal", data.privacy.goal)
          this.setState({id: data._id, nofstan: data.privacy.nofstan, noffollowing: data.privacy.noffollowing, noffollowers:data.privacy.noffollowers, income :data.privacy.income, goal :data.privacy.goal })
        }
      })
    }
    handleChange = name => event => {
     const jwt = auth.isAuthenticated()
     const value = event.target.checked

     this.userData.set(name, value)
     this.setState({ [name]: value }) 
     privacy({
      userId: this.props.userId
     },
   {
     t: jwt.token
     },this.userData ).then((data) => {
       if (data.error) {
         this.setState({error: data.error})
       } 
     else
    {
      this.setState({'redirectToProfile': false,open:true, privacymsg:`Privacy Policy is Changed Successfully.`})
    }
 })
 }
 handleRequestClose = (event, reason) => {
  this.setState({ open: false })
}

    render() {
      const {classes} = this.props          
      return ( <Paper style={{ width:"1200px", height:"500px" }}>
               <Typography> Choose What would you want to hide  on your customized profile.<br/>
               You can also hide from Your customized profile Page.  </Typography>
               <Typography>Your Profile</Typography>
                <Divider/>
             <FormGroup>
             <Typography><FormControlLabel  control={<Switches color="primary"  value={this.state.nofstan} onChange={this.handleChange('nofstan')} checked={this.state.nofstan}/>} label="NR. OF STANS"  /></Typography>
              <Typography><FormControlLabel  control={<Switches color="primary" value={this.state.noffollowers}  onChange={this.handleChange('noffollowers')} checked={this.state.noffollowers} />} label="NR. OF FOLLOWERS" /></Typography>
               <Typography><FormControlLabel  control={<Switches color="primary" value={this.state.noffollowing}   onChange={this.handleChange('noffollowing')} checked={this.state.noffollowing} />} label="NR. OF FoLLOWING" /></Typography>
               <Typography>Balance</Typography>
                <Divider/>  
                <Typography><FormControlLabel  control={<Switches color="primary" value={this.state.income}   checked={this.state.income}/>} label="Income"  onChange={this.handleChange('income')} /></Typography>
                    <Typography><FormControlLabel  control={<Switches color="primary" value={this.state.goal} checked={this.state.goal} />} label="Goal"   onChange={this.handleChange('goal')}/></Typography>          
             </FormGroup>
             <Snackbar
            anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
            }}
          open={this.state.open}
          onClose={this.handleRequestClose}
          autoHideDuration={6000}
          message={<span >{this.state.privacymsg}</span>}
      />
             </Paper>)
    }
  }
  
  Privacy.propTypes = {
    classes: PropTypes.object.isRequired,
    privacy: PropTypes.array.isRequired,
  }
  
  export default withStyles(styles)(Privacy)
  