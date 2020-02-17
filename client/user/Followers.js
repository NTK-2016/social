import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
//import List, { ListItem, ListItemAvatar, ListItemIcon, ListItemSecondaryAction, ListItemText } from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
//import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import { Link } from 'react-router-dom'
import GridList, { GridListTile } from 'material-ui/GridList'
import auth from './../auth/auth-helper'
import { read, follow } from './api-user.js'
import CustomButton from './../common/CustomButton'
import Snackbar from 'material-ui/Snackbar'
import Box from '@material-ui/core/Box'
import config from "../../config/config";
const styles = theme => ({
  bigAvatar:
  {
    width: '60',
    height: '60',
    float: 'left',
    boxSizing: 'border-box',
    border: '1px solid #000',
  },
  tileText:
  {
    marginTop: '10',
    marginLeft: '15',


  },
  gridList: {
    display: 'block',
    marginTop: '20px',
  },

})
class Followers extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userId: '',
      followers: [],
      followMessage: '',
      followers_id: []
    }
    this.match = props.match
  }

  clickFollow = (user) => {
    const jwt = auth.isAuthenticated()
    follow({
      userId: jwt.user._id
    }, {
      t: jwt.token
    }, user._id).then((data) => {
      if (data.error) {
        this.setState({ error: data.error })
      } else {
        this.props.newfollowing(user)
        var followers_id = this.state.followers_id
        followers_id.push(user._id)
        this.setState({ open: true, followMessage: `Following ${user.name}!`, followers_id: followers_id })
      }
    })
  }

  handleRequestClose = (event, reason) => {
    this.setState({ open: false });
  };

  // componentDidMount = () => {
  //   const jwt = auth.isAuthenticated()
  //   read({
  //     userId: this.props.userId
  //   }, { t: jwt.token }).then((data) => {
  //     if (data.error) {
  //       this.setState({ error: data.error })
  //     } else {
  //       console.log(data.followers)
  //       this.setState({ id: data._id, followers: data.followers })
  //     }
  //   })
  // }
  render() {
    const { classes } = this.props
    return (<div className={"follower-container"}>
      {this.props.followers.length > 0 &&
        <Typography component="p" className={"mb-twenty para-sixteen"}>{this.props.followers.length} Followers</Typography>
      }
      <GridList className={classes.gridList} cols={4}>
        {this.props.followers.length > 0 ?
          this.props.followers.map((followers, i) => {
            return <GridListTile className={"list-actfollowing"} style={{ 'height': 'auto' }} key={i}>
              <Box className={"follows_with_user"}>
                <Link to={"/profile/" + followers.followers_id.username}>

                  <Avatar src={followers.followers_id.photo ? config.profileImageBucketURL + followers.followers_id.photo : config.profileDefaultPath}
                    // src={'/api/users/photo/' + followers.followers_id._id} 
                    className={classes.bigAvatar} />
                  <Typography component="div" className={"ml-fifteen"}><Typography component="h4" >{followers.followers_id.name}</Typography>
                    <div variant="span" component="span">@{followers.followers_id.username}</div>
                  </Typography>
                </Link>
                {auth.isAuthenticated().user._id != followers.followers_id._id && followers.followers_id.following.includes(auth.isAuthenticated().user._id) && auth.isAuthenticated().user._id != this.props.userId &&
                  < Typography component="div" className={"gray-bg"}><Typography component="p">Follows you</Typography></Typography>}
              </Box>
              {
                auth.isAuthenticated().user._id == this.props.userId &&
                <div>
                  {(!this.props.followingid.includes(followers.followers_id._id) && !this.state.followers_id.includes(followers.followers_id._id)) &&
                    <CustomButton label="Follow" className={"Secondary_btn"} onClick={() => this.clickFollow(followers.followers_id)} />
                  }
                </div>
              }
            </GridListTile>
          }) :
          (
            <Typography component="p" className={"para-forteen"}>
              {auth.isAuthenticated().user._id == this.props.userId &&
                <Typography component="p" className={"para-forteen no-fol"}>You don't have any followers.</Typography>
              }
              {auth.isAuthenticated().user._id != this.props.userId &&
                <Typography component="p" className={"para-forteen no-fol"}>{this.props.creatorname} does not have any followers.</Typography>
              }
            </Typography>)
        }
      </GridList>
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
    </div >)
  }
}

Followers.propTypes = {
  classes: PropTypes.object.isRequired,
  // people: PropTypes.array.isRequired
}

export default withStyles(styles)(Followers)
