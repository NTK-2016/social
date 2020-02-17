import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'
import Switches from 'material-ui/Switch'
import { FormGroup, FormControlLabel, FormControl, FormLabel } from 'material-ui';
import { Paper } from 'material-ui';
import Divider from 'material-ui/Divider'
import auth from './../auth/auth-helper'
import { read, notification } from './api-user.js'
import Snackbar from 'material-ui/Snackbar'
import Checkbox from 'material-ui/Checkbox'
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
  filename: {
    marginLeft: '10px'
  }
})

class Notification extends Component {
  constructor({ props }) {
    super(props)
    this.state = {
      notification: [],
      snewstan: false,
      snewtips: false,
      sneworder: false,
      snewmessage: false,
      pmnewstan: false,
      pmnewtips: false,
      pmneworder: false,
      pmnewmessage: false,
      pmlikes: false,
      pmcommnents: false,
      pmreposts: false,
      userId: '',
      open: false,
      creater: ''
    }
    this.props = props
  }
  componentDidMount = () => {
    this.userData = new FormData()
    const jwt = auth.isAuthenticated()
    read({
      userId: this.props.userId
    }, { t: jwt.token }).then((data) => {
      if (data.error) {
        this.setState({ error: data.error })
      } else {
        this.userData.set("snewstan", data.usernotification.snewstan)
        this.userData.set("snewtips", data.usernotification.snewtips)
        this.userData.set("sneworder", data.usernotification.sneworder)
        this.userData.set("snewmessage", data.usernotification.snewmessage)
        this.userData.set("pmnewstan", data.usernotification.pmnewstan)
        this.userData.set("pmnewtips", data.usernotification.pmnewtips)
        this.userData.set("pmneworder", data.usernotification.pmneworder)
        this.userData.set("pmnewmessage", data.usernotification.pmnewmessage)
        this.userData.set("pmlikes", data.usernotification.pmlikes)
        this.userData.set("pmcommnents", data.usernotification.pmcommnents)
        this.userData.set("pmreposts", data.usernotification.pmreposts)

        this.setState({ id: data._id, snewstan: data.usernotification.snewstan, snewtips: data.usernotification.snewtips, sneworder: data.usernotification.sneworder, snewmessage: data.usernotification.snewmessage, pmnewstan: data.usernotification.pmnewstan, pmnewtips: data.usernotification.pmnewtips, pmneworder: data.usernotification.pmneworder, pmnewmessage: data.usernotification.pmnewmessage, pmlikes: data.usernotification.pmlikes, pmcommnents: data.usernotification.pmcommnents, pmreposts: data.usernotification.pmreposts, creater: data.creater.status })
      }
    })
  }

  handleChange = checked => event => {
    const jwt = auth.isAuthenticated()
    const value = event.target.checked
    this.userData.set(checked, value)
    this.setState({ [checked]: value })


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
          this.setState({ 'redirectToProfile': false, open: true, notificationmsg: `Notification Policy is Changed Successfully.` })
        }
      })

  }
  handleRequestClose = (event, reason) => {
    this.setState({ open: false })
  }

  render() {
    const { classes } = this.props
    return (<Paper style={{ width: "1200px", height: "700px" }}>
      <Typography> Choose What would you want to hide  on your customized profile.<br />
        You can also hide from Your customized profile Page.  </Typography>
      <Divider />
      <FormControl component="fieldset">
        <FormLabel component="legend">Notification</FormLabel>
        <FormGroup style={{ width: "600px", float: "left" }}>
          {(this.state.creater === 1) ?
            (<Grid style={{ float: "left" }} >
              <Typography>PUSH SITE</Typography>
              <Typography><FormControlLabel control={<Checkbox color="primary" value={this.state.snewstan} checked={this.state.snewstan} />} label="NEW STAN" onChange={this.handleChange('snewstan')} /></Typography>
              <Typography><FormControlLabel control={<Checkbox color="primary" value={this.state.snewtips} checked={this.state.snewtips} />} label="NEW TIP" onChange={this.handleChange('snewtips')} /></Typography>
              <Typography><FormControlLabel control={<Checkbox color="primary" value={this.state.sneworder} checked={this.state.sneworder} />} label="NEW ORDER" onChange={this.handleChange('sneworder')} /></Typography>
              <Typography><FormControlLabel control={<Checkbox color="primary" value={this.state.snewmessage} checked={this.state.snewmessage} />} label="NEW MESSAGE" onChange={this.handleChange('snewmessage')} /></Typography>
            </Grid>) :
            (<Typography>Become a creater to unlock more notification options.</Typography>)
          }

          <Divider />
          {(this.state.creater === 1) ?
            (<Grid style={{ float: "right" }}>
              <Typography>PUSH EMAIL</Typography>
              <Typography><FormControlLabel control={<Checkbox color="primary" value={this.state.pmnewstan} checked={this.state.pmnewstan} />} label="NEW STAN" onChange={this.handleChange('pmnewstan')} /></Typography>
              <Typography><FormControlLabel control={<Checkbox color="primary" value={this.state.pmnewtips} checked={this.state.pmnewtips} />} label="NEW TIP" onChange={this.handleChange('pmnewtips')} /></Typography>
              <Typography><FormControlLabel control={<Checkbox color="primary" value={this.state.pmneworder} checked={this.state.pmneworder} />} label="NEW ORDER" onChange={this.handleChange('pmneworder')} /></Typography>
              <Typography><FormControlLabel control={<Checkbox color="primary" value={this.state.pmnewmessage} checked={this.state.pmnewmessage} />} label="NEW MESSAGE" onChange={this.handleChange('pmnewmessage')} /></Typography>
              <Typography><FormControlLabel control={<Checkbox color="primary" value={this.state.pmcommnents} checked={this.state.pmcommnents} />} label="COMMENTS" onChange={this.handleChange('pmcommnents')} /></Typography>
              <Typography><FormControlLabel control={<Checkbox color="primary" value={this.state.pmlikes} checked={this.state.pmlikes} />} label="LIKES" onChange={this.handleChange('pmlikes')} /></Typography>
              <Typography><FormControlLabel control={<Checkbox color="primary" value={this.state.pmreposts} checked={this.state.pmreposts} />} label="REPOSTS" onChange={this.handleChange('pmreposts')} /></Typography>
            </Grid>)
            : (<Grid>
              <Typography>PUSH EMAIL</Typography>
              <Typography>Become a creater to unlock more notification options.</Typography>
              <Typography><FormControlLabel control={<Checkbox color="primary" value={this.state.pmnewmessage} checked={this.state.pmnewmessage} />} label="NEW MESSAGE" onChange={this.handleChange('pmnewmessage')} /></Typography>
              <Typography><FormControlLabel control={<Checkbox color="primary" value={this.state.pmcommnents} checked={this.state.pmcommnents} />} label="COMMENTS" onChange={this.handleChange('pmcommnents')} /></Typography>
              <Typography><FormControlLabel control={<Checkbox color="primary" value={this.state.pmlikes} checked={this.state.pmlikes} />} label="LIKES" onChange={this.handleChange('pmlikes')} /></Typography>
              <Typography><FormControlLabel control={<Checkbox color="primary" value={this.state.pmreposts} checked={this.state.pmreposts} />} label="REPOSTS" onChange={this.handleChange('pmreposts')} /></Typography>
            </Grid>)}

        </FormGroup>
      </FormControl>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={this.state.open}
        onClose={this.handleRequestClose}
        autoHideDuration={6000}
        message={<span >{this.state.notificationmsg}</span>}
      />
    </Paper>)
  }
}

Notification.propTypes = {
  classes: PropTypes.object.isRequired,
  notification: PropTypes.array.isRequired,
}

export default withStyles(styles)(Notification)
