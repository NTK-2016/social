import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'
import { FormGroup, FormControlLabel, FormControl, FormLabel } from 'material-ui';
import { Paper } from 'material-ui';
import Divider from 'material-ui/Divider'
import { read, privacy } from './api-user.js'
import Snackbar from 'material-ui/Snackbar'
import auth from './../auth/auth-helper'
import CustomSwitch from './../common/CustomSwitch'



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

class Privacy extends Component {
  constructor({ props }) {
    super(props)
    this.state = {
      privacy: [],
      nofstan: false,
      income: false,
      userId: '',
      open: false,
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
        this.userData.set("nofstan", data.privacy.nofstan)
        this.userData.set("income", data.privacy.income)
        this.setState({ id: data._id, nofstan: data.privacy.nofstan, income: data.privacy.income })
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
      }, this.userData).then((data) => {
        if (data.error) {
          this.setState({ error: data.error })
        }
        else {
          this.setState({ 'redirectToProfile': false, open: true, privacymsg: `Changes have been saved` })
        }
      })
  }

  handleRequestClose = (event, reason) => {
    this.setState({ open: false })
  }

  render() {
    const { classes } = this.props
    return (<Grid item xs={12} sm={6}>
      <FormGroup className={"hide-show-section"}>
        <Grid container>
          <Grid className={"hide-show-left"} item xs={10}>
            <Typography>Show number of stans on your profile</Typography>
          </Grid>
          <Grid className={"hide-show-right"} item xs={2}>
            {console.log("statusBtn " + this.props.statusBtn)}
            <CustomSwitch className={"customswitch"} color="primary"
              onChange={this.handleChange('nofstan')} checked={this.state.nofstan}
              disabled={!this.props.statusBtn}
            />
            {(!this.state.nofstan) ?
              (<Typography component="p">Hide</Typography>) :
              (<Typography component="p">Show</Typography>)}
          </Grid>
        </Grid>
        <Grid container className={"mt-10"}>
          <Grid className={"hide-show-left"} item xs={10}>
            <Typography>Show your earnings</Typography>
          </Grid>
          <Grid className={"hide-show-right"} item xs={2}>
            <CustomSwitch className={"customswitch"} color="primary" color="primary"
              checked={this.state.income}
              onChange={this.handleChange('income')}
              disabled={(!this.props.statusBtn) ? true : false}

            />
            {(!this.state.income) ?
              (<Typography component="p">Hide</Typography>) :
              (<Typography component="p">Show</Typography>)}
          </Grid>
        </Grid>
      </FormGroup>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={this.state.open}
        onClose={this.handleRequestClose}
        autoHideDuration={1000}
        message={<span >{this.state.privacymsg}</span>}
      />
    </Grid>)
  }
}

Privacy.propTypes = {
  classes: PropTypes.object.isRequired,
  // privacy: PropTypes.array.isRequired,
}

export default withStyles(styles)(Privacy)
