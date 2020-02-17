import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'
import { Link } from 'react-router-dom'
import { findPeople, follow } from './api-user.js'
import auth from './../auth/auth-helper'
import Snackbar from 'material-ui/Snackbar'
import CustomButton from "./../common/CustomButton";

const styles = theme => ({

})


class FindPeople extends Component {
  state = {
    users: [],
    open: false
  }
  componentDidMount = () => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    const jwt = auth.isAuthenticated()
    findPeople({
      userId: jwt.user._id
    }, {
      t: jwt.token
    }).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        this.setState({ users: data })
      }
    })
  }
  clickFollow = (user, index) => {
    const jwt = auth.isAuthenticated()
    follow({
      userId: jwt.user._id
    }, {
      t: jwt.token
    }, user._id).then((data) => {
      if (data.error) {
        this.setState({ error: data.error })
      } else {
        let toFollow = this.state.users
        toFollow.splice(index, 1)
        this.setState({ users: toFollow, open: true, followMessage: `Following ${user.name}!` })
      }
    })
  }
  handleRequestClose = (event, reason) => {
    this.setState({ open: false })
  }
  render() {
    const { classes } = this.props
    return (<div>
      <Paper className={"share-earn"}>
        <div className={"share-title"}>
          <Typography component="h1" variant="h1">
            Start Earning
       </Typography>
        </div>
        <div className={"find-creator-btn"}>
          <Typography component="p" variant="p">
            Become a creator to offer exclusive content through subscriptions, enable tipping and  set up your online shop.
       </Typography>
          <div className={"find-become-creator"}>
            <Link to={"/becomecreator/" + auth.isAuthenticated().user._id}>
              {/**  <Button aria-label="Follow" variant="raised" color="primary">
                Become a creator
				</Button>**/}
              <CustomButton
                label="Become a creator"
                className={"Primary_btn"}
              />
            </Link>
          </div>
        </div>

      </Paper>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={this.state.open}
        onClose={this.handleRequestClose}
        autoHideDuration={6000}
        message={<span className={classes.snack}>{this.state.followMessage}</span>}
      />
    </div>)
  }
}

FindPeople.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(FindPeople)
