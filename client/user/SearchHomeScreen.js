import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import List, { ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText } from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
import Button from 'material-ui/Button'
import IconButton from 'material-ui/IconButton'
import Typography from 'material-ui/Typography'
import { Link } from 'react-router-dom'
import { findPeople, follow } from './api-user.js'
import auth from './../auth/auth-helper'
import Snackbar from 'material-ui/Snackbar'
import ViewIcon from 'material-ui-icons/Visibility'
import config from "../../config/config";

const styles = theme => ({
  root: theme.mixins.gutters({
    padding: theme.spacing.unit,
    margin: 0
  }),

  avatar: {
    marginRight: theme.spacing.unit * 1
  },
  follow: {
    right: theme.spacing.unit * 2
  },
  snack: {
    color: theme.palette.protectedTitle
  },
  viewButton: {
    verticalAlign: 'middle'
  }
})
class SearchHomeScreen extends Component {
  state = {
    users: [],
    open: false,
    home: []
  }
  componentDidMount = () => {
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
    return (<div class="find-people-container">

      <List>
        {this.state.users.map((item, i) => {
          return <span key={i}>
            <ListItem className={"list-people"}>
              <ListItemAvatar className={classes.avatar}>
                <Avatar src={item.photo ? config.profileImageBucketURL + item.photo : config.profileDefaultPath}
                  //src={'/api/users/photo/' + item._id} 
                  className={"find-avatar"} />
              </ListItemAvatar>
              <Link to={"/profile/" + item.username} className={"suggested-people"}>
                <ListItemText primary={item.name} />
              </Link>
            </ListItem>
          </span>
        })
        }
      </List>
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

SearchHomeScreen.propTypes = {
  classes: PropTypes.object.isRequired,
  home: PropTypes.array.isRequired
}

export default withStyles(styles)(SearchHomeScreen)
