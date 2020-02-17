import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import { Redirect, Link } from 'react-router-dom'
import NotifictionTabs from './NotifictionTabs'

const styles = theme => ({
  root: theme.mixins.gutters({
    maxWidth: 1000,
    margin: '100px auto',
    padding: 0,
    marginTop: theme.spacing.unit * 5,
    boxShadow: 'none',
    background: 'transparent',
    boxSizing: 'border-box',
  }),
  title: {
    margin: `${theme.spacing.unit * 2}px ${theme.spacing.unit}px 0`,
    color: theme.palette.protectedTitle,
    fontSize: '1em'
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: 10
  },
})

class Notifications extends Component {

  state = {
    redirectToSignin: false,
    tab: 0
  }
  render() {
    const { classes } = this.props
    const redirectToSignin = this.state.redirectToSignin
    if (redirectToSignin) {
      return <Redirect to='/signin' />
    }
    return (
      <section className={"notification-container"}>
        <NotifictionTabs tab={this.state.tab} />
      </section>
    )
  }
}
Notifications.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Notifications)
