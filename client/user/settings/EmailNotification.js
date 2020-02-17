import React, { Component } from 'react'
import Card, { CardActions, CardContent } from 'material-ui/Card'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import Typography from 'material-ui/Typography'
import Icon from 'material-ui/Icon'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import { Redirect } from 'react-router-dom'
import Paper from 'material-ui/Paper'
import { Link } from 'react-router-dom'
// import Select from 'material-ui/Select'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Checkbox from '@material-ui/core/Checkbox';
import { FormGroup, FormControlLabel, FormControl, FormLabel } from 'material-ui';
import Snackbar from 'material-ui/Snackbar'
import auth from './../../auth/auth-helper'
import { read, update, notification } from './../api-user.js'
import CustomButton from "./../../common/CustomButton";

const styles = theme => ({

})

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

class EmailNotification extends Component {
  constructor(props) {
    super(props)
    this.state = {
      disable: false,
      userId: '',
      open: false,
      pmfollowers: '',
      pmlikes: '',
      pmnewmessage: '',
      notificationmsg: '',
      optionsbox: ['Never', 'Instantly', 'Daily', 'Weekly'],
      summaryoptn: ['Never', 'Daily', 'Weekly',]
    }
    this.props = props
  }

  componentDidMount = () => {
    sleep(500).then(() => {
      this.userData = new FormData()
      const jwt = auth.isAuthenticated()
      read({
        userId: this.props.userId
      }, { t: jwt.token }).then((data) => {
        if (data.error) {
          this.setState({ error: data.error })
        } else {
          this.userData.set("pmnewmessage", data.usernotification.pmnewmessage)
          this.userData.set("pmlikes", data.usernotification.pmlikes)
          this.userData.set("pmfollowers", data.usernotification.pmfollowers)
          this.setState({ open: true, pmnewmessage: data.usernotification.pmnewmessage, pmlikes: data.usernotification.pmlikes, pmfollowers: data.usernotification.pmfollowers })
        }
      })
    })
  }
  clickSubmit = () => {
    const jwt = auth.isAuthenticated()
    notification({
      userId: this.props.userId
    },
      {
        t: jwt.token
      }, this.userData).then((data) => {
        if (data.error) {
          this.setState({ error: data.error })
        }
        else {
          this.setState({ open: true, notificationmsg: `Changes have been saved ` })
        }
      })
  }
  handleRequestClose = (event, reason) => {
    this.setState({ open: false })
  }

  handleChange = name => event => {

    const value = event.target.value
    this.userData.set(name, value)
    this.setState({ [name]: value })
  }

  // handleClick = () => {
  //   console.log("handle click called");
  //   if(this.state.disable){
  //     this.setState({disable:false})
  //   }else{
  //     this.setState({disable:true})
  //   }     
  // }


  render() {
    return (
      <Card className={"account-tab"} >
        <CardContent onLoad={this.handleOnLoad} className={"email_notification_blk"}>
          <div className={"edit-headtitle"}>
            <Typography type="headline" component="div" className={"title-profile"}>
              Email Notification
          </Typography>
            <Typography component="p" variant="p" >
              Depending on the setting you choose below,Stan.Me will notify you of the progress via email.
          </Typography>
            {/* <Typography><FormControlLabel control={<Checkbox color="primary"  />} label="Turn Off Notify" onClick={this.handleClick} /></Typography> */}
            {/* <Typography variant="h3" component="h3" className={"headsec"}>
          Turn Off Notify
        </Typography> 
          <Checkbox
        value="checkedB"
        color="primary"
        onClick={this.handleClick}
        /> */}
          </div>
          <div className={"maininner-edit"}>
            <Typography component="div" className={"form-label"}>
              New Followers summary
        </Typography>
            <div className={"setting-input-div email-w"}>

              <Select
                disableUnderline={true}
                value={this.state.pmfollowers}
                fullWidth
                className={"selectdropdown"}
                MenuProps=
                {
                  {
                    classes: { paper: "upload-dropdown" },
                    getContentAnchorEl: null,
                    anchorOrigin:
                    {
                      vertical: "bottom",
                      horizontal: "left",
                    },
                    transformOrigin: {
                      vertical: "top",
                      horizontal: "left"
                    },
                  }
                }
                onChange={this.handleChange('pmfollowers')}
              >
                <MenuItem value="1" >Instantly </MenuItem>
                <MenuItem value="2" >Daily </MenuItem>
                <MenuItem value="3" >Weekly </MenuItem>
                <MenuItem value="0" >Never </MenuItem>
                {/* {this.state.optionsbox.map((item, i) => {
                  // console.log(item+'option')
                  return <MenuItem key={i} value={i}>{item}</MenuItem>;

                }
                )
                } */}
                {/* <option value="1" >Instantly </option>
                <option value="2" >Daily </option>
                <option value="3" >Weekly </option>
                <option value="0" >Never </option> */}
              </Select>
            </div>
            <Typography component="div" className={"form-label"}>
              New Likes Summary
        </Typography>
            <div className={"setting-input-div email-w"}>
              <Select
                disableUnderline={true}
                value={this.state.pmlikes}
                fullWidth
                className={"selectdropdown"}
                MenuProps=
                {
                  {
                    classes: { paper: "upload-dropdown" },
                    getContentAnchorEl: null,
                    anchorOrigin:
                    {
                      vertical: "bottom",
                      horizontal: "left",
                    },
                    transformOrigin: {
                      vertical: "top",
                      horizontal: "left"
                    },
                  }

                }
                onChange={this.handleChange('pmlikes')}
              >
                <MenuItem value="1">Instantly </MenuItem>
                <MenuItem value="2">Daily </MenuItem>
                <MenuItem value="3">Weekly </MenuItem>
                <MenuItem value="0" >Never </MenuItem>
                {/* {this.state.optionsbox.map((item, i) => {
                  return <MenuItem key={i} value={i}>{item}</MenuItem>;

                }
                )
                } */}
                {/* <option value="1">Instantly </option>
                <option value="2">Daily </option>
                <option value="3">Weekly </option>
                <option value="0" >Never </option> */}
              </Select>
            </div>
            <Typography component="div" className={"form-label"}>
              New Message Summary
        </Typography>
            <div className={"setting-input-div email-w"}>

              <Select
                disableUnderline={true}
                value={this.state.pmnewmessage}
                fullWidth
                className={"selectdropdown"}
                MenuProps=
                {
                  {
                    classes: { paper: "upload-dropdown" },
                    getContentAnchorEl: null,
                    anchorOrigin:
                    {
                      vertical: "bottom",
                      horizontal: "left",
                    },
                    transformOrigin: {
                      vertical: "top",
                      horizontal: "left"
                    },
                  }
                }
                onChange={this.handleChange('pmnewmessage')}

              >
                {/* <option value="1">Instantly </option> */}
                <MenuItem value="2">Daily </MenuItem>
                <MenuItem value="3">Weekly </MenuItem>
                <MenuItem value="0" >Never </MenuItem>
                {/* <option value="1">Instantly </option> */}
                {/* {this.state.summaryoptn.map((item, i) => {

                  return <MenuItem key={i} value={i}>{item}</MenuItem>;

                }
                )
                } */}
                {/* <option value="2">Daily </option>
                <option value="3">Weekly </option>
                <option value="0" >Never </option> */}
                {/* <option value={2}>Sent Weekly </option>  */}
              </Select>
            </div>
            {/* <Typography component="p"  >
           Creator Notifications
        </Typography> 
      <Typography variant="h3" component="h3" className={"headsec"}>
          New Stan
        </Typography> 
        <Select 
          disableUnderline={true} 
          value={1}
          fullWidth          
        className={"selectdropdown"}
        MenuProps=
        {
          {
            classes: { paper: "upload-dropdown" },
            getContentAnchorEl: null,
            anchorOrigin:
            {
            vertical: "bottom",
            horizontal: "left",
            },
            transformOrigin: {
                        vertical: "top",
                        horizontal: "left"
            },
         }
       }
       disabled={this.state.disable}
      >
      <option value={1}>Sent Daily </option>      
      <option value={2}>Sent Weekly </option> 
      </Select>
        <Typography variant="h3" component="h3" className={"headsec"}>
          New Trip
        </Typography> 
        <Select 
          disableUnderline={true} 
          value={1}
          fullWidth          
        className={"selectdropdown"}
        MenuProps=
        {
          {
            classes: { paper: "upload-dropdown" },
            getContentAnchorEl: null,
            anchorOrigin:
            {
            vertical: "bottom",
            horizontal: "left",
            },
            transformOrigin: {
                        vertical: "top",
                        horizontal: "left"
            },
         }
       }
       disabled={this.state.disable}
      >
      <option value={1}>Sent Daily </option>      
      <option value={2}>Sent Weekly </option> 
      </Select>
      <Typography variant="h3" component="h3" className={"headsec"}>
          New Shop Order
        </Typography> 
        <Select 
          disableUnderline={true} 
          value={2}
          fullWidth          
        className={"selectdropdown"}
        MenuProps=
        {
          {
            classes: { paper: "upload-dropdown" },
            getContentAnchorEl: null,
            anchorOrigin:
            {
            vertical: "bottom",
            horizontal: "left",
            },
            transformOrigin: {
                        vertical: "top",
                        horizontal: "left"
            },
         }
       }
       disabled={this.state.disable}
      >
      <option value={1}>Sent Daily </option>      
      <option value={2}>Sent Weekly </option> 
      </Select> */}

            <CardActions className={"email-notification"}>
              <CustomButton
                label="Save"
                onClick={this.clickSubmit}
                className={"Primary_btn_blk"}
              />
            </CardActions>

            <Snackbar
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              open={this.state.open}
              onClose={this.handleRequestClose}
              autoHideDuration={600}
              message={<span >{this.state.notificationmsg}</span>}
            />
          </div>
        </CardContent>
      </Card>

    )
  }
}
export default withStyles(styles)(EmailNotification)
