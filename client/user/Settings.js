import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import SettingsTabs from './SettingsTabs'
import Grid from 'material-ui/Grid'
import auth from './../auth/auth-helper'
import { read } from './api-user.js'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import Fourzerofour from "./../common/404";

const styles = theme => ({


})

class Settings extends Component {
  constructor(props) {
    super(props)
    this.state = {
      account: [],
      editprofile: [],
      social: [],
      privacy: [],
      notification: [],
      editprofile: [],
      payment: [],
      userId: '',
      invalid: false
    }
    this.match = props.match
  }
  componentDidMount = () => {
    console.log(" settings ");
    const jwt = auth.isAuthenticated()
    var userId = jwt.user._id
    this.setState({ userId: userId })
    read({
      userId: userId
    }, { t: jwt.token }).then((data) => {
      if (data.error) {
        this.setState({ error: data.error, invalid: true })
      } else {
        this.setState({ id: data._id })
      }
    })
  }
  render() {
    if (this.state.invalid) {
      return <Fourzerofour />;
    }
    const { classes } = this.props
    return (
      <section>
        <SettingsTabs editprofile={this.state.editprofile} userId={this.state.userId} account={this.state.account} social={this.state.social} payment={this.state.payment} privacy={this.state.privacy} notification={this.state.notification} />
      </section>
    )
  }
}

Settings.propTypes = {
  classes: PropTypes.object.isRequired
}
export default withStyles(styles)(Settings)
