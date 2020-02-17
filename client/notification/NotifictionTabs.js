import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Divider from '@material-ui/core/Divider'
import Button from 'material-ui/Button'
import { Link } from 'react-router-dom'
import AppBar from 'material-ui/AppBar'
import Typography from 'material-ui/Typography'
import Tabs, { Tab } from 'material-ui/Tabs'
//import NotificationList from './NotificationList'
import List, { ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText } from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
import auth from './../auth/auth-helper'
import { useAsync } from "react-async"
import Grid from 'material-ui/Grid';
import { readnotification } from '../user/api-user.js'
import CustomLoader from './../common/CustomLoader';
import config from "../../config/config";

const styles = {
  spacePadding: {
    padding: "16px 0",
    backgroundColor: '#fff',
  },
  title2h2:
  {
    fontSize: '25px',
    lineHeight: '33px',
    color: '#000',
    marginBottom: '50px',
    borderBottom: '1px solid #D6D6D6',
    paddingBottom: '20px',

  },
  tabheaddes:
  {
    boxShadow: 'none',
    backgroundColor: 'transparent',
    borderBottom: '3px solid #f2f2f2',
    maxWidth: '1200px',
    margin: '0px auto',
    height: '48px',
  },


  gap:
  {
    marginBottom: '70px',
    textAlign: 'center',
  },
  gap1:
  {

    textAlign: 'center',
  },

  tabtext:
  {
    fontSize: '18px',
    lineHeight: '24px',
    color: '#2E2E2E',
    marginTop: '5px',
  },
  root: {
    width: '100%',
    maxWidth: 360,

  },
  inline: {
    display: 'inline',
  },

};
var stan = 0
var tip = 0
var shop = 0
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}
//var stanArray = new Array();
//var tipArray = new Array();
//var shopArray = new Array();
class NotifictionTabs extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tab: this.props.tab,
      posts: [],
      notificationData: [],
      tipArray: [],
      loader: true,
      nostan: true,
      notip: true,
      noshop: true
    }
  }

  componentWillReceiveProps = (props) => {
    this.setState({ tab: this.state.tab })
    setTimeout(function () {
    }.bind(this), 2000)
  }

  componentDidMount = () => {
    const jwt = auth.isAuthenticated()
    readnotification({
      userId: jwt.user._id,
      status: 0
    }, {
      t: jwt.token
    }).then((data) => {
      // if (data.error) {
      // this.setState({error: data.error})
      // } 
      sleep(1000).then(() => {
        this.setState({ notificationData: data.reverse(), loader: false })
      })
    })

  }

  handleTabChange = (event, value) => {
    this.setState({ tab: value })
  }

  checkstan = () => {
    stan++
    if (this.state.nostan)
      this.setState({ nostan: false })
  }

  checktip = () => {
    tip++
    console.log("tip  " + tip)
    if (this.state.notip)
      this.setState({ notip: false })
  }

  checkshop = () => {
    shop++
    console.log("shop  " + shop)
    if (this.state.noshop)
      this.setState({ noshop: false })

  }

  render() {
    const { classes } = this.props
    if (this.state.loader) {
      return <CustomLoader customclass={"loader_bottom"} width={30} height={30} />
    } else {
      return (
        <div className={"notification-main"}>
          {/* <AppBar position="static" color="default" my style={styles.tabheaddes} className={"notification_tab tab_for_all"}> */}
          <AppBar position="static" color="default" style={styles.tabheaddes} className={"notification_tab tab_for_all"}>
            <Tabs className={"tab_indicator_hei3"}
              value={this.state.tab}
              onChange={this.handleTabChange}
              indicatorColor="secondary"
              textColor="secondary"
              fullWidth  >
              <Tab label={<span><i className="far fa-clone"></i> All</span>} />
              {auth.isAuthenticated().user.creator &&
                <Tab label={<span><i className="stan_notification_logo"></i>Stans</span>} />}
              {auth.isAuthenticated().user.creator &&
                <Tab label={<span><i className="fal fa-usd-circle"></i> Tips</span>} />}
              {auth.isAuthenticated().user.creator &&
                <Tab label={<span><i className="fal fa-shopping-cart"></i> Shop</span>} />
              }
              {/* <Tab label={<span><i className="stan_notification_logo"></i>Stans</span>} />
              <Tab label={<span><i className="fal fa-usd-circle"></i> Tips</span>} />
              <Tab label={<span><i className="fal fa-shopping-cart"></i> Shop</span>} /> */}
            </Tabs>
          </AppBar>
          {this.state.tab == 0 &&
            <TabContainer>
              <div style={styles.spacePadding} className={"notification_outer_sec"}>
                {this.state.notificationData.map((notification, i) => {
                  var productImage = '';
                  let path = 'dist/uploads/photos/';
                  if (notification.productId) {
                    let ProductAllImage = notification.productId.photo.split(",")
                    productImage = path + ProductAllImage[0];
                  }
                  var time = 'now';
                  var date1 = new Date(notification.created_at).getTime();
                  var date2 = new Date().getTime();

                  var seconds = Math.floor((date2 - (date1)) / 1000);
                  var minutes = Math.floor(seconds / 60);
                  var hours = Math.floor(minutes / 60);
                  var days = Math.floor(hours / 24);
                  var year = Math.floor(days / 365);
                  hours = hours - (days * 24);
                  minutes = minutes - (days * 24 * 60) - (hours * 60);
                  seconds = seconds - (days * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60);
                  time = year > 0 ? year + " ys" : (days > 0 ? days + " ds" : (hours > 0 ? hours + " hs" : (minutes > 0 ? minutes + "ms" : (seconds > 0 ? seconds + " ss" : time))));

                  // return (<Answer key={i} answer={answer} />)
                  return (<div key={i}>
                    {/* {i >= 0 &&
                      <Divider className={"notification_divider"} component="li" />
                    } */}
                    {notification.type === "stan" && notification.fromId &&
                      // <Divider className={"notification_divider"} component="li" />
                      <ListItem alignitems="flex-start" className={"notification_listing"}>
                        <ListItemAvatar>
                          <Avatar className={"notification_icon cre_icon"} alt={notification.fromId.name} src={notification.fromId.photo ? config.profileImageBucketURL + notification.fromId.photo : config.profileDefaultPath} />
                        </ListItemAvatar>
                        <Typography component="div" className={"notification_txt_full"}>
                          <Typography component="div" className={"notification_txt"}>
                            <Typography component="p" >
                              <Link to={"/profile/" + notification.fromId.username}>
                                {notification.fromId.name} </Link> <span>has</span> stanned<span> you</span>
                            </Typography>
                            <Typography component="p" >
                              <span>and you received a payment of </span><span className={"notification_price"}>${Number(notification.amount).toFixed(2)}</span>
                            </Typography>
                          </Typography>
                          <Typography component="div" className={"notification_time"} alignitems="flex-end">
                            {time}
                          </Typography>
                        </Typography>
                      </ListItem>
                    }

                    {notification.type === "tip" && notification.fromId &&

                      <ListItem alignitems="flex-start" className={"notification_listing"}>
                        <ListItemAvatar>
                          <Avatar className={"notification_icon cre_icon"} alt={notification.fromId.name} src={notification.fromId.photo ? config.profileImageBucketURL + notification.fromId.photo : config.profileDefaultPath} />
                        </ListItemAvatar>
                        <Typography component="div" className={"notification_txt_full"}>
                          <Typography component="div" className={"notification_txt"}>
                            <Typography component="p" >
                              <Link to={"/profile/" + notification.fromId.username}>
                                {notification.fromId.name} </Link><span>has</span> tipped <span>you and you received</span>
                            </Typography>
                            <Typography component="p" >
                              <span>a payment of </span><span className={"notification_price"}>${Number(notification.amount).toFixed(2)}</span>
                            </Typography>
                          </Typography>
                          <Typography component="div" className={"notification_time"} alignitems="flex-end">
                            {time}
                          </Typography>
                        </Typography>
                      </ListItem>
                    }

                    {notification.type === "shop" && notification.fromId && notification.productId &&
                      <ListItem alignitems="flex-start" className={"notification_listing noti_show_time_mobile"}>
                        <Typography component="div" className={"notification_left_sec"}>
                          <ListItemAvatar>
                            <Avatar className={"notification_icon cre_icon"} alt={notification.fromId.name} src={notification.fromId.photo ? config.profileImageBucketURL + notification.fromId.photo : config.profileDefaultPath} />
                          </ListItemAvatar>
                          <Typography component="div" className={"notification_txt_full"}>
                            <Typography component="div" className={"notification_txt"}>
                              <Typography component="p" >
                                <Link to={"/profile/" + notification.fromId.username}>
                                  {notification.fromId.name} </Link> <span>has</span> bought
                              </Typography>
                              <Typography component="p" >
                                <span><Link to={"/productdetails/" + notification.productId._id}>
                                  {notification.productId.text} </Link> and you received a payment of</span> <span className={"notification_price"}>${Number(notification.amount).toFixed(2)}</span>
                              </Typography>
                            </Typography>
                          </Typography>
                          <Typography component="div" className={"shop_pic_blk"} alignitems="flex-end">
                            {/* <Avatar className={"shop_pic"} alt="" src="dist/c6fc97f3fb6ea0d30afd3cbfe46239a2.jpg" /> */}
                            <Avatar className={"shop_pic"} alt="" src={productImage} />
                          </Typography>
                          <Typography component="div" className={"notification_time"} alignitems="flex-end">
                            {time}
                          </Typography>
                        </Typography>
                      </ListItem>
                    }
                    {notification.type === "like" && notification.postId && notification.fromId &&

                      <ListItem alignitems="flex-start" className={"notification_listing"}>
                        <ListItemAvatar>
                          <Avatar className={"notification_icon cre_icon"} alt={notification.fromId.name} src={notification.fromId.photo ? config.profileImageBucketURL + notification.fromId.photo : config.profileDefaultPath} />
                        </ListItemAvatar>
                        <Typography component="div" className={"notification_txt_full"}>
                          <Typography component="div" className={"notification_txt"}>
                            <Typography component="p" >
                              <Link to={"/profile/" + notification.fromId.username}>
                                {notification.fromId.name} </Link><span>has</span> liked your<span><Link to={"/post/" + notification.postId._id}> post</Link></span>
                            </Typography>
                            {/* <Typography component="p" >
                            <span><Link to={"/post/" + notification.postId._id}>
                              {notification.postId.text} </Link> </span>
                          </Typography> */}
                          </Typography>
                          <Typography component="div" className={"notification_time"} alignitems="flex-end">
                            {time}
                          </Typography>
                        </Typography>
                      </ListItem>
                    }
                    {notification.type === "follower" && notification.fromId &&

                      <ListItem alignitems="flex-start" className={"notification_listing"}>
                        <ListItemAvatar>
                          <Avatar className={"notification_icon cre_icon"} alt={notification.fromId.name} src={notification.fromId.photo ? config.profileImageBucketURL + notification.fromId.photo : config.profileDefaultPath} />
                        </ListItemAvatar>
                        <Typography component="div" className={"notification_txt_full"}>
                          <Typography component="div" className={"notification_txt"}>
                            <Typography component="p" >
                              <Link to={"/profile/" + notification.fromId.username}>
                                {notification.fromId.name} </Link><span>has</span> followed <span>you</span>
                            </Typography>
                          </Typography>
                          <Typography component="div" className={"notification_time"} alignitems="flex-end">
                            {time}
                          </Typography>
                        </Typography>
                      </ListItem>
                    }
                    {notification.type === "comment" && notification.postId && notification.fromId &&

                      <ListItem alignitems="flex-start" className={"notification_listing"}>
                        <ListItemAvatar>
                          <Avatar className={"notification_icon cre_icon"} alt={notification.fromId.name} src={notification.fromId.photo ? config.profileImageBucketURL + notification.fromId.photo : config.profileDefaultPath} />
                        </ListItemAvatar>
                        <Typography component="div" className={"notification_txt_full"}>
                          <Typography component="div" className={"notification_txt"}>
                            <Typography component="p" >
                              <Link to={"/profile/" + notification.fromId.username}>
                                {notification.fromId.name} </Link><span>has</span> commented on your<span><Link to={"/post/" + notification.postId._id}> post</Link></span>
                            </Typography>
                            {/* <Typography component="p" >
                            <span><Link to={"/post/" + notification.postId._id}>
                              {notification.postId.text} </Link> </span>
                          </Typography> */}
                          </Typography>
                          <Typography component="div" className={"notification_time"} alignitems="flex-end">
                            {time}
                          </Typography>
                        </Typography>
                      </ListItem>
                    }
                    {((notification.type === "stan" && notification.fromId) || (notification.type === "tip" && notification.fromId) ||
                      (notification.type === "shop" && notification.fromId && notification.productId) ||
                      (notification.type === "like" && notification.postId && notification.fromId) ||
                      (notification.type === "follower" && notification.fromId) ||
                      (notification.type === "comment" && notification.postId && notification.fromId)) &&
                      <Divider className={"notification_divider"} component="li" />
                    }
                  </div>)
                })}
                {this.state.notificationData.length == 0 && <Typography variant="display1" component="h2" className={"display-postmsg"} style={{ textAlign: "center" }}>You don't have any notification</Typography>}
              </div>
            </TabContainer>
          }
          {this.state.tab == 1 && auth.isAuthenticated().user.creator && <TabContainer>
            <div style={styles.spacePadding} className={"notification_outer_sec"}>
              {this.state.notificationData.map((notification, i) => {
                var time = 'now';
                var date1 = new Date(notification.created_at).getTime();
                var date2 = new Date().getTime();

                var seconds = Math.floor((date2 - (date1)) / 1000);
                var minutes = Math.floor(seconds / 60);
                var hours = Math.floor(minutes / 60);
                var days = Math.floor(hours / 24);
                var year = Math.floor(days / 365);
                hours = hours - (days * 24);
                minutes = minutes - (days * 24 * 60) - (hours * 60);
                seconds = seconds - (days * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60);

                time = year > 0 ? year + " ys" : (days > 0 ? days + " ds" : (hours > 0 ? hours + " hs" : (minutes > 0 ? minutes + " ms" : (seconds > 0 ? seconds + " ss" : time))));
                return (<div key={i}>
                  {notification.type === "stan" && notification.fromId &&
                    <ListItem alignitems="flex-start" className={"notification_listing"}>
                      <ListItemAvatar>
                        <Avatar className={"notification_icon cre_icon"} alt={notification.fromId.name} src={notification.fromId.photo ? config.profileImageBucketURL + notification.fromId.photo : config.profileDefaultPath} />
                      </ListItemAvatar>

                      <Typography component="div" className={"notification_txt_full"}>
                        <Typography component="div" className={"notification_txt"}>
                          <Typography component="p" >
                            <Link to={"/profile/" + notification.fromId.username}>
                              {notification.fromId.name} </Link> <span>has</span> stanned<span> you</span>
                          </Typography>
                          <Typography component="p" >
                            <span>and you received a payment of </span><span className={"notification_price"}>${Number(notification.amount).toFixed(2)}</span>
                          </Typography>
                        </Typography>
                        <Typography component="div" className={"notification_time"} alignitems="flex-end">
                          {time}
                          {this.checkstan()}
                        </Typography>
                      </Typography>

                    </ListItem>
                  }
                  {notification.type === "stan" && notification.fromId &&
                    <Divider className={"notification_divider"} component="li" />
                  }
                </div>)
              })}
              {this.state.nostan && <Typography variant="display1" component="h2" className={"display-postmsg"} style={{ textAlign: "center" }}>You don't have any notification</Typography>}
            </div>
          </TabContainer>
          }
          {this.state.tab == 2 && auth.isAuthenticated().user.creator && <TabContainer>
            <div style={styles.spacePadding} className={"notification_outer_sec"}>
              {this.state.notificationData.map((notification, i) => {
                var time = 'now';
                var date1 = new Date(notification.created_at).getTime();
                var date2 = new Date().getTime();

                var seconds = Math.floor((date2 - (date1)) / 1000);
                var minutes = Math.floor(seconds / 60);
                var hours = Math.floor(minutes / 60);
                var days = Math.floor(hours / 24);
                var year = Math.floor(days / 365);
                hours = hours - (days * 24);
                minutes = minutes - (days * 24 * 60) - (hours * 60);
                seconds = seconds - (days * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60);

                time = year > 0 ? year + " ys" : (days > 0 ? days + " ds" : (hours > 0 ? hours + " hs" : (minutes > 0 ? minutes + " ms" : (seconds > 0 ? seconds + " ss" : time))));
                return (<div key={i}>
                  {notification.type === "tip" && notification.fromId &&
                    <ListItem alignitems="flex-start" className={"notification_listing"}>
                      <ListItemAvatar>
                        <Avatar className={"notification_icon cre_icon"} alt={notification.fromId.name} src={notification.fromId.photo ? config.profileImageBucketURL + notification.fromId.photo : config.profileDefaultPath} />
                      </ListItemAvatar>
                      <Typography component="div" className={"notification_txt_full"}>
                        <Typography component="div" className={"notification_txt"}>
                          <Typography component="p" >
                            <Link to={"/profile/" + notification.fromId.username}>
                              {notification.fromId.name} </Link> <span>has</span> tipped <span>you and you received</span>
                          </Typography>
                          <Typography component="p" >
                            <span>a payment of </span><span className={"notification_price"}>${Number(notification.amount).toFixed(2)}</span>
                          </Typography>
                        </Typography>
                        <Typography component="div" className={"notification_time"} alignitems="flex-end">
                          {time}
                          {this.checktip()}
                        </Typography>
                      </Typography>
                    </ListItem>
                  }
                  {notification.type === "tip" && notification.fromId &&
                    <Divider className={"notification_divider"} component="li" />
                  }
                </div>)
              })}
              {this.state.notip && <Typography variant="display1" component="h2" className={"display-postmsg"} style={{ textAlign: "center" }}>You don't have any notification</Typography>}
            </div>
          </TabContainer>
          }
          {this.state.tab == 3 && auth.isAuthenticated().user.creator && <TabContainer>
            <div style={styles.spacePadding} className={"notification_outer_sec"}>
              {this.state.notificationData.map((notification, i) => {
                var time = 'now';
                var date1 = new Date(notification.created_at).getTime();
                var date2 = new Date().getTime();

                var seconds = Math.floor((date2 - (date1)) / 1000);
                var minutes = Math.floor(seconds / 60);
                var hours = Math.floor(minutes / 60);
                var days = Math.floor(hours / 24);
                var year = Math.floor(days / 365);
                hours = hours - (days * 24);
                minutes = minutes - (days * 24 * 60) - (hours * 60);
                seconds = seconds - (days * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60);

                time = year > 0 ? year + " ys" : (days > 0 ? days + " ds" : (hours > 0 ? hours + " hs" : (minutes > 0 ? minutes + " ms" : (seconds > 0 ? seconds + " ss" : time))));
                return (<div key={i}>
                  {notification.type === "shop" && notification.fromId && notification.productId &&
                    <ListItem alignitems="flex-start" className={"notification_listing noti_show_time_mobile"}>
                      <Typography component="div" className={"notification_left_sec"}>
                        <ListItemAvatar>
                          <Avatar className={"notification_icon cre_icon"} alt={notification.fromId.name} src={notification.fromId.photo ? config.profileImageBucketURL + notification.fromId.photo : config.profileDefaultPath} />
                        </ListItemAvatar>
                        <Typography component="div" className={"notification_txt_full"}>
                          <Typography component="div" className={"notification_txt"}>
                            <Typography component="p" >
                              <Link to={"/profile/" + notification.fromId.username}>
                                {notification.fromId.name} </Link> <span>has</span> bought
                      </Typography>
                            <Typography component="p" >
                              <span><Link to={"/productdetails/" + notification.productId._id}>
                                {notification.productId.text} </Link> and you received a payment of</span> <span className={"notification_price"}>${Number(notification.amount).toFixed(2)}</span>
                            </Typography>
                          </Typography>
                        </Typography>
                        <Typography component="div" className={"shop_pic_blk"} alignitems="flex-end">
                          {/* <Avatar className={"shop_pic"} alt="" src="dist/c6fc97f3fb6ea0d30afd3cbfe46239a2.jpg" /> */}
                          <Avatar className={"shop_pic"} alt="" src="" />
                        </Typography>
                        <Typography component="div" className={"notification_time"} alignitems="flex-end">
                          {time}
                          {this.checkshop()}
                        </Typography>
                      </Typography>
                    </ListItem>
                  }

                  {notification.type === "shop" && notification.fromId && notification.productId &&
                    <Divider className={"notification_divider"} component="li" />
                  }
                </div>)
              })}
              {this.state.noshop && <Typography variant="display1" component="h2" className={"display-postmsg"} style={{ textAlign: "center" }}>You don't have any notification</Typography>}
            </div>
          </TabContainer>
          }

        </div>)
    }
  }
}

NotifictionTabs.propTypes = {
  // removePostUpdate: PropTypes.func.isRequired,
  // posts: PropTypes.array.isRequired
}

const TabContainer = (props) => {
  return (
    <Typography component="div">
      {props.children}
    </Typography>
  )
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
}

export default NotifictionTabs