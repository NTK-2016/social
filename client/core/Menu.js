import React, { Component } from "react";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Button from "material-ui/Button";
import auth from "./../auth/auth-helper";
import { Link } from "react-router-dom";
import Avatar from "material-ui/Avatar";
import Popover from "@material-ui/core/Popover";
import MenuItem from "@material-ui/core/MenuItem";
import Divider from "material-ui/Divider";
import MenuList from "@material-ui/core/MenuList";
import Home_before_login_nav from "./Home_before_login_nav";
import Typography from "material-ui/Typography";
import { readnotification, readprofileimage } from '../user/api-user.js'
import Menu_mobile from './Menu_mobile'
import {
  readRoom
} from "./../chat/api-chat.js";
import config from "../../config/config";

var notificationCount = 0
var messageCount = false
const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

class Menu extends Component {

  constructor(props) {
    super(props);
    this.state = {
      menuanchor: null,
      menuopen: false,
      menuid: undefined,
      imageUrl: "",
      isMount: false,
      isNotiResponse: false,
      isMsgResponse: false,
      profileImage: ''
    };
  }

  componentDidMount = () => {
    console.log(this.state.isMount)
    // console.log("menu called")
    // if (auth.isAuthenticated()) {
    //   var elmnt = document.getElementById("after");
    //   elmnt.classList.add("navmain");
    // }
    // else {
    //   var elmnt = document.getElementById("before");
    //   elmnt.classList.add("navmain_before");
    // }
    // if(auth.isAuthenticated()){
    //   //  this.setState({ imageUrl: '/api/users/defaultphoto' })
    //   // console.log(auth.isAuthenticated().user._id)
    //   // let photoUrl = auth.isAuthenticated().user._id
    //   // ? `/api/users/photo/${auth.isAuthenticated().user._id}?${new Date().getTime()}`
    //   // : '/api/users/defaultphoto'
    //   let photoUrl = '/api/users/photo/'+auth.isAuthenticated().user._id
    //   ? '/api/users/photo/'+auth.isAuthenticated().user._id : '/api/users/defaultphoto'
    //   this.setState({ imageUrl: photoUrl })
    // }



    if (auth.isAuthenticated()) {
      console.log("in hit")
      const jwt = auth.isAuthenticated()
      readnotification({
        userId: jwt.user._id,
        status: 1
      }, {
        t: jwt.token
      }).then((data) => {
        //this.setState({ notificationCount: data.length })
        notificationCount = data
        console.log("isNotiResponse hit")
        this.setState({ isNotiResponse: true });
      })
      console.log("between hit")
      var room = {
        name1: jwt.user._id
      };
      readRoom(room).then(data => {
        if (data.error) {
          console.log(data.error);
        } else {
          console.log("isMsgResponse hit")
          messageCount = data.chat[0]
          this.setState({ isMsgResponse: true });
        }
      });
      sleep(1000).then(() => {
        console.log("b4 isMount")
        if (this.state.isNotiResponse && this.state.isMsgResponse) {
          this.setState({ isMount: true });
          this.props.isMount()
        }

      })
      readprofileimage({
        userId: jwt.user._id,
      }, {
        t: jwt.token
      }).then((data) => {
        this.setState({ profileImage: data })
      })
    }
    console.log("after hit")
    if (!auth.isAuthenticated()) {
      this.setState({ isMount: true });
      this.props.isMount()
    }
    // this.setState({ isMount: true });
  };
  componentDidUpdate() {
    console.log("componentDidUpdate" + auth.isAuthenticated())
    if (auth.isAuthenticated()) {
      const jwt = auth.isAuthenticated()
      readnotification({
        userId: jwt.user._id,
        status: 1
      }, {
        t: jwt.token
      }).then((data) => {
        // this.setState({ notificationCount: data.length })
        notificationCount = data
      })
      var room = {
        name1: jwt.user._id
      };
      readRoom(room).then(data => {
        if (data.error) {
          console.log(data.error);
        } else {
          messageCount = data.chat[0]
        }
      });

    }
  }



  handleMore = event => {
    this.setState({ menuanchor: event.currentTarget });
    this.setState({ menuopen: true });
    this.setState({ menuid: "simple-popper" });
  };
  handleClose = () => {
    this.setState({ menuanchor: null });
    this.setState({ menuopen: false });
    this.setState({ menuid: undefined });
  };




  render() {
    //console.log(this.state.imageUrl);
    // const photoUrl = auth.isAuthenticated().user._id
    //   ? `/api/users/photo/${auth.isAuthenticated().user._id}?${new Date().getTime()}`
    //   : '/api/users/defaultphoto'

    if (auth.isAuthenticated() && this.state.isMount) {
      return (
        <AppBar position="static" id="after" className={"navmain"}>
          {/* className={"navmain"} */}
          <Toolbar className={"menu-toolbar"}>
            {/*<Typography type="title" color="inherit">
    Stan Me
  </Typography> */}
            <div className={"align-menu"}>


              {/* // <div className={"sign-menu"}>

          //   <Link to="/signup">
          //     <i className="fal fa-user-plus"></i>
          //     <Button>Sign up</Button>
          //   </Link>
          //   <Link to="/signin">
          //     <i className="fal fa-sign-in"></i>
          //     <Button>Sign In</Button>
          //   </Link>
          // </div> */}

              <div className={"right-menu"}>
                <Typography component="div" variant="display4" className={"logo_top"}>
                  <Link to="/"><img
                    className={"tool_work3_img tool_img"}
                    src="/dist/header_logo.svg"
                    alt="Stan.Me Logo"
                  />Stan.Me</Link>
                </Typography>
                <div className={this.props.menu == "" ? "menu-active" : ''}>
                  {" "}
                  <Link to="/">
                    <i className="fal fa-home-alt"></i>
                    <Button className="head_nav">Home </Button>
                  </Link>
                </div>
                {/*
      auth.isAuthenticated().user.creator == 1 ?
      ( */}

                <div className={this.props.menu == "createpost" ? "menu-active" : ''}>
                  <Link to={"/createpost"}>
                    <i className="fal fa-edit"></i>
                    <Button className="head_nav">Create</Button>
                  </Link>
                </div>
                {/*  ):''
    // } */}
                <div className={this.props.menu == "search" ? "menu-active rot-icon" : "rot-icon"}>
                  <Link to={"/search"}>
                    <i className="fal fa-search"></i>
                    <Button className="head_nav">Discover</Button>
                  </Link>{" "}
                </div>
                <div className={this.props.menu == "messages" ? "menu-active notificaton_btn message_btn" : "notificaton_btn message_btn"}>
                  {" "}
                  <Link to={"/messages"}>
                    <i className="fal fa-comment-alt">{messageCount &&
                      <span className={"notification_num mess_num"}></span>}</i>
                    <Button className="head_nav">Messages</Button>
                  </Link>{" "}
                </div>
                <div className={this.props.menu == "notifications" ? "menu-active notificaton_btn" : "notificaton_btn"}>
                  <Link to={"/notifications"}>
                    <i className="fal fa-bell">{notificationCount > 0 &&
                      <span variant="span" className={"notification_num"}>{notificationCount}</span>}</i>
                    <Button className="head_nav">Notifications </Button>
                  </Link>
                </div>
                {/**<Menu_mobile />**/}
                <div className={"top-user"}>
                  {" "}
                  <Button onClick={this.handleMore}>
                    <Avatar
                      // src={
                      //   this.state.profileImage
                      //   //'/api/users/photo/' + auth.isAuthenticated().user._id
                      //   // photoUrl
                      //   // '/api/users/photo/' +
                      //   // auth.isAuthenticated().user._id 
                      // }
                      src={auth.isAuthenticated().user.photo ? config.profileImageBucketURL + auth.isAuthenticated().user.photo : config.profileDefaultPath}
                      aria-describedby={this.state.menuid}
                      variant="contained"
                      className={"nav-menu-avatar"}
                    />
                  </Button>{" "}
                </div>
                <Popover
                  id={this.state.menuid}
                  open={this.state.menuopen}
                  anchorEl={this.state.menuanchor}
                  onClose={this.handleClose}
                  className={"menu-sec"}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right"
                  }}
                >
                  <MenuList className={"menu-popup"}>
                    <MenuItem>
                      <Link
                        to={"/profile/" + auth.isAuthenticated().user.username}
                        onClick={this.handleClose}
                      >
                        <Avatar
                          className={"menu-avatar"}
                          // src={
                          //   '/api/users/photo/' +
                          //   auth.isAuthenticated().user._id
                          // }
                          src={auth.isAuthenticated().user.photo ? config.profileImageBucketURL + auth.isAuthenticated().user.photo : config.profileDefaultPath}
                        //imgProps={{ onError: (e) => { e.target.src = "/dist/profile-pic.png" } }}
                        />
                        <div className={""}>
                          <span className={"user-menu"}>
                            {auth.isAuthenticated().user.name}
                          </span>{" "}
                          <br />{" "}
                          <span className={"user-submenu"}>
                            @{auth.isAuthenticated().user.username}
                          </span>
                        </div>
                      </Link>
                    </MenuItem>
                    <Divider className={"divide-m"} />
                    <MenuItem className={"nav-submenuitem"}>
                      <Link
                        to={"/profile/" + auth.isAuthenticated().user.username}
                        onClick={this.handleClose}
                      >
                        My Profile
                    </Link>
                    </MenuItem>
                    <MenuItem className={"nav-submenuitem"}>
                      <Link
                        to={"/setting/" + auth.isAuthenticated().user._id}
                        onClick={this.handleClose}
                      >
                        Settings
                    </Link>
                    </MenuItem>
                    <MenuItem className={"nav-submenuitem"}>
                      {" "}
                      <Link
                        to={
                          "/payments_transaction/" +
                          auth.isAuthenticated().user._id + "/0"
                        }
                        onClick={this.handleClose}
                      >
                        Payments
                    </Link>
                    </MenuItem>
                    <Divider className={"divide-m"} />
                    {/* {auth.isAuthenticated().user.creator === 1 && ( */}
                    <MenuItem className={"nav-submenuitem"}>
                      <Link to={"/creatorspace"} onClick={this.handleClose}>
                        Creator's Space
                    </Link>
                    </MenuItem>
                    {/* )} */}
                    <MenuItem className={"nav-submenuitem"}>
                      <Link
                        to={
                          "/wallet_earnings/" +
                          auth.isAuthenticated().user._id
                        }
                        onClick={this.handleClose}
                      >
                        Earnings
                    </Link>
                    </MenuItem>
                    {auth.isAuthenticated().user.creator > 0 &&
                      <MenuItem className={"nav-submenuitem"}>
                        <Link
                          to={"/refer/" + auth.isAuthenticated().user._id}
                          onClick={this.handleClose}
                        >
                          Refer a friend
                    </Link>
                      </MenuItem>
                    }
                    {/* <MenuItem>
                    {" "}
                    <Link
                      to={"/myorders/" + auth.isAuthenticated().user._id}
                      onClick={this.handleClose}
                    >
                      My Orders
                    </Link>
                  </MenuItem> */}
                    {/* <Divider className={"divide-m"} />
                <MenuItem>
                  <Link to={"/notifications"} onClick={this.handleClose}>
                    Feedback
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link to={"/notifications"} onClick={this.handleClose}>
                    Help
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link to={"/notifications"} onClick={this.handleClose}>
                    About
                  </Link>
                </MenuItem> */}
                    <Divider className={"divide-m"} />
                    <MenuItem className={"nav-submenuitem"}>
                      <a target="_blank" href="http://help.stan.me/">
                        Help
                    </a>
                    </MenuItem>
                    <MenuItem className={"nav-submenuitem"}>
                      <Link
                        to={"/feedback"}
                        onClick={this.handleClose}
                      >
                        Feedback
                    </Link>
                    </MenuItem>
                    <MenuItem
                      className={"logoutmenu nav-submenuitem"}
                      onClick={() => {
                        auth.signout();
                      }}
                    >
                      Log Out
                  </MenuItem>
                  </MenuList>
                </Popover>
                {/*<Button color="inherit" onClick={() => {
          auth.signout(() => history.push('/'))
        }}>Sign out</Button> */}
              </div>
            </div>
          </Toolbar>
        </AppBar >
      )
    }
    // else{
    if (!auth.isAuthenticated() && this.state.isMount) {
      return (
        <AppBar position="static" id="before" className={"before_loginmenu"}>
          {/* className={"navmain_before"} */}
          <Toolbar>
            <Home_before_login_nav />
          </Toolbar>
        </AppBar>
      );
    }
    if (!this.state.isMount) {
      return null;
    }


    // }
  }
}
//))

export default Menu;
