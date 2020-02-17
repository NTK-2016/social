import React from 'react'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'
import HomeIcon from 'material-ui-icons/Home'
import Button from 'material-ui/Button'
import auth from './../auth/auth-helper'
import { Link, withRouter } from 'react-router-dom'
import Avatar from 'material-ui/Avatar'
import config from "../../config/config";

const isActive = (history, path) => {
  if (history.location.pathname == path)
    return { color: '#ffa726' }
  else
    return { color: '#ffffff' }
}
const Menu = withRouter(({ history }) => (
  <AppBar position="static">
    <Toolbar>
      {/*<Typography type="title" color="inherit">
        Stan Me
      </Typography> */}
      <Link to="/">
        <IconButton aria-label="Home" style={isActive(history, "/")}>
          <HomeIcon />
        </IconButton>
      </Link>
      {
        !auth.isAuthenticated() && (<span>
          <Link to="/signup">
            <Button style={isActive(history, "/signup")}>Sign up
            </Button>
          </Link>
          <Link to="/signin">
            <Button style={isActive(history, "/signin")}>Sign In
            </Button>
          </Link>
        </span>)
      }
      {
        auth.isAuthenticated() && (<span>
          {/*
          auth.isAuthenticated().user.creator == 1 ?
          ( */}
          <Link to={"/create"}>
            <Button style={isActive(history, "/create" + auth.isAuthenticated().user._id)}>Create</Button>
          </Link>
          {/*  ):''
        // } */}
          <Link to={"/notifications"}>
            <Button style={isActive(history, "/notifications" + auth.isAuthenticated().user._id)}>Notifications</Button>
          </Link>
          <Link to={"/messages/"}>
            <Button style={isActive(history, "/messages/" + auth.isAuthenticated().user._id)}>Messages</Button>
          </Link>
          <Link to={"/search/" + auth.isAuthenticated().user._id}>
            <Button style={isActive(history, "/search/" + auth.isAuthenticated().user._id)}>Search</Button>
          </Link>
          {/*<Link to={"/user/" + auth.isAuthenticated().user._id}>
            <Button style={isActive(history, "/user/" + auth.isAuthenticated().user._id)}>My Profile</Button>
          </Link> */}
          <Link to={"/user/" + auth.isAuthenticated().user._id}>
            <Button style={isActive(history, "/user/" + auth.isAuthenticated().user._id)}>
              <Avatar
                src={auth.isAuthenticated().user.photo ? config.profileImageBucketURL + auth.isAuthenticated().user.photo : config.profileDefaultPath}
              />
            </Button>
          </Link>
          <Button color="inherit" onClick={() => {
            auth.signout(() => history.push('/'))
          }}>Sign out</Button>
        </span>)
      }
    </Toolbar>
  </AppBar>
))

export default Menu
