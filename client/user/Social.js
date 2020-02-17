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
import {read, update} from './api-user.js'
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
  errros:{
    color:'#FF1199'
  },
  snack: {
    color: theme.palette.protectedTitle
  }
})

class Social extends Component {

  constructor(props) {
    super(props)
    this.state = {
    social:[],
    fields: {},
    errors: {},
    facebook:'',
    twitter:'',
    instagram:'',
    youtube:'',
    linkedlin:'',   
    userId:'',
    redirectToProfile: false,   
    open:false,     
    }
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
        this.setState({id: data._id, facebook: data.facebook, twitter: data.twitter, instagram:data.instagram, youtube:data.youtube,linkedlin:data.linkedlin })
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
      facebook: this.state.facebook || undefined,
      twitter: this.state.twitter || undefined,
      instagram: this.state.instagram || undefined,
      youtube: this.state.youtube || undefined,
      linkedlin: this.state.linkedlin || undefined,
    }
     
    update({
      userId: this.props.userId
     },
   {
     t: jwt.token
     }, this.userData).then((data) => {
       if (data.error) {
         this.setState({error: data.error})
       } 
     else
    {
        this.setState({'redirectToProfile': false,open:true, socialmsg:`Your Social Links is updated.`})
     }
 })
}


  render() {
    return (
      <Card style={{ width:"400px",height:"600px" }}>
        <CardContent>
          <Typography type="headline" component="h2" style={{color:"#279588",fontFamily:"Roboto, Helvetica, Arial, sans-serif",fontSize:"20px", fontWeight:"500" }} >
            Connect Your Social Links 
          </Typography> 
            <TextField style={{ width:"400px" }}  ref="facebook" id="multiline-flexible_fb" label="Facebook" onChange={this.handleChange("facebook")} multiline  rows="2"margin="normal" value={this.state.facebook}/><span style={{ color:"#ff1122" }} >{this.state.errors["message"]}</span><br/>
            <TextField style={{ width:"400px" }}  ref="twitter" id="multiline-flexible_twt" label="Twitter"   onChange={this.handleChange("twitter")}  multiline  rows="2"  margin="normal" value={this.state.twitter} /><span style={{ color:"#ff1122" }}>{this.state.errors["message"]}</span><br/>
            <TextField style={{ width:"400px" }}  ref="instagram" id="multiline-flexible_inst" label="Instagram" onChange={this.handleChange("instagram")}  multiline  rows="2"  margin="normal" value={this.state.instagram}/><span style={{ color:"#ff1122" }}>{this.state.errors["message"]}</span><br/>
            <TextField style={{ width:"400px" }}  ref="youtube"  id="multiline-flexible_utube" label="YouTube"    onChange={this.handleChange("youtube")}  multiline  rows="2" margin="normal" value= {this.state.youtube}/><span style={{ color:"#ff1122" }}>{this.state.errors["message"]}</span><br/>
            <TextField style={{ width:"400px" }}  ref="linkedlin" id="multiline-flexible_lkn" label="Linkedlin"  onChange={this.handleChange("linkedlin")} multiline  rows="2" margin="normal" value={this.state.linkedlin} /><span style={{ color:"#ff1122" }}>{this.state.errors["message"]}</span><br/>
        </CardContent>
        <CardActions style={{ float:"right" }}>
        <Button color="secondary" variant="raised" onClick={this.clickSubmit} >UPDATE SOCIAL PROFILES</Button>
        </CardActions>
        <Typography  style={{ float:"left" }} >
        <Button color="primary" variant="raised">Logout</Button>
        </Typography>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          open={this.state.open}
          onClose={this.handleRequestClose}
          autoHideDuration={6000}
          message={<span >{this.state.socialmsg}</span>}
      />
      </Card>
    )
  }
}

Social.propTypes = {
  classes: PropTypes.object.isRequired,
  social: PropTypes.array.isRequired,
}

export default withStyles(styles)(Social)
