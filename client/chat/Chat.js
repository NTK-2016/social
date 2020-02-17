import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Grid from "material-ui/Grid";
import Button from "@material-ui/core/Button";
import Card, { CardActions, CardContent } from "material-ui/Card";
import Typography from "material-ui/Typography";
import auth from "./../auth/auth-helper";
import IconButton from "material-ui/IconButton";
import SendIcon from '@material-ui/icons/Send';
import {
  listChat,
  listMoreChat,
  listNotification,
  readRoom,
  createRoom
} from "./api-chat.js";
import ReactDOM from "react-dom";
//import socket from './socket';
import { list, read } from "../user/api-user.js";
import { create } from "./api-chat.js";
import TableRow from "./TableRow";
import Box from "@material-ui/core/Box";
import CustomLoader from "./../common/CustomLoader";
//import io from "socket.io-client";
import { Link } from "react-router-dom";
import SideLoader from "./../common/SideLoader";
import config from "../../config/config";
// import ScrollArea from 'react-scrollbar';

const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

const styles = theme => ({
  // root: {
  //   maxWidth: 1000,
  //   margin: "100px auto",
  //   marginTop: theme.spacing.unit * 2,
  //   boxShadow: "none",
  //   background: "transparent"
  // },
  card: {
    margin: "auto",
    boxShadow: "none"
  },

  title: {
    padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 2.5}px ${theme
      .spacing.unit * 2}px`,
    color: theme.palette.text.secondary
  },
  media: {
    minHeight: 330
  },
  font_chat: {
    fontSize: 18
  }
  /*
  '@global': {
    '*::-webkit-scrollbar': {
      width: '0.4em'
    },
    '*::-webkit-scrollbar-track': {
      '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
    },
    '*::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,.1)',
      outline: '1px solid slategrey'
    }
  },*/
});
//const socket = io();

let arrdata = [];
let intervalID = 0;
class Chat extends Component {
  constructor(props, context) {
    super(props, context);
    (this.state = {
      users: [],
      all: [],
      isRegisterInProcess: false,
      client: "", //socket(),
      chatrooms: null,
      AllUsers: null,
      myMsg: "",
      myNewMsg: "",
      currentUser: "",
      socket: "",
      room_id: "",
      old_chat: "",
      notifications: "",
      new: false,
      chatmessagestart: 20,
      displayingDate: "",
      newuser: "",
      newid: "",
      newphoto: "",
      frndName: "",
      friendUsername: "",
      loader: false,
      readRoom: true,
      scrollvalue: 0,
      redirectChatId: "",
      SideLoader: false,
      unread: [],
      isMobile: false,
      isleftdisplay: true,
      isrightdisplay: true,
      chat_msg: ''
    }),

      //this.onEnterChatroom = this.onEnterChatroom.bind(this)
      //this.onLeaveChatroom = this.onLeaveChatroom.bind(this)
      //this.getChatrooms = this.getChatrooms.bind(this)
      //this.getAllUsers = this.getAllUsers.bind(this)
      //this.register = this.register.bind(this)
      (this.submitChat = this.submitChat.bind(this));
    this.socketInit = this.socketInit.bind(this);
    this._handleKeyDown = this._handleKeyDown.bind(this);
    this.getNotificationList = this.getNotificationList.bind(this);
  }

  socketInit(jwt) {
    //this.setState({socket:socket})
    let username = jwt.user.username;
    //alert(username+" logged In");
    socket.on("connect", function () {
      socket.emit("set-user-data", username);
      // setTimeout(function() { alert(username+" logged In"); }, 500);
      socket.on("broadcast", function (data) {
        document.getElementById("hell0").innerHTML +=
          "<li>" + data.description + "</li>";
        //$('#hell0').append($('<li>').append($(data.description).append($('<li>');
        $("#hell0").scrollTop($("#hell0")[0].scrollHeight);
      });
    });
    //setTimeout(function() { },jwt, 200);
  }

  onEnterChatroom(chatroomName, onNoUserSelected, onEnterSuccess) {
    if (!this.state.user) return onNoUserSelected();

    return this.state.client.join(chatroomName, (err, chatHistory) => {
      if (err) return console.error(err);
      return onEnterSuccess(chatHistory);
    });
  }

  onLeaveChatroom(chatroomName, onLeaveSuccess) {
    this.state.client.leave(chatroomName, err => {
      if (err) return console.error(err);
      return onLeaveSuccess();
    });
  }

  getChatrooms() {
    this.state.client.getChatrooms((err, chatrooms) => {
      this.setState({ chatrooms });
    });
  }

  getAllUsers() {
    this.state.client.getAllUsers((err, AllUsers) => {
      this.setState({ AllUsers });
    });
  }

  register(name) {
    const onRegisterResponse = user =>
      this.setState({ isRegisterInProcess: false, user });
    this.setState({ isRegisterInProcess: true });
    this.state.client.register(name, (err, user) => {
      if (err) return onRegisterResponse(null);
      return onRegisterResponse(user);
    });
  }

  renderUserSelectionOrRedirect(renderUserSelection) {
    if (this.state.user) {
      return <Redirect to="/" />;
    }

    return this.state.isRegisterInProcess ? <Loader /> : renderUserSelection();
  }

  /* New Message New Chat start */
  newChat = chatId => {
    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      ReactDOM.findDOMNode(isChat).style.display = "block";
      ReactDOM.findDOMNode(isNew).style.display = "none";
      ReactDOM.findDOMNode(isleftdisplay).style.display = "none";
      ReactDOM.findDOMNode(isrightdisplay).style.display = "block";
      this.setState({ isrightdisplay: false, isMobile: true })
    }
    else {
      ReactDOM.findDOMNode(isNew).style.display = "none";
      ReactDOM.findDOMNode(isChat).style.display = "block";
      ReactDOM.findDOMNode(isChat).style.display = "flex";
      //ReactDOM.findDOMNode(isleftdisplay).style.display = "block";
      //ReactDOM.findDOMNode(isrightdisplay).style.display = "block";
    }
    //(e) {
    // var els = document.querySelectorAll('.chat_person_active')
    // for (var i = 0; i < els.length; i++) {
    //   els[i].classList.remove('chat_person_active')
    // }
    // var el = document.getElementById(chatId);
    // el.classList.add("chat_person_active");
    const jwt = auth.isAuthenticated();
    var username = jwt.user._id; // previously username - chnaged on 26 sep 2019 by harshal
    var friendNameValue = this.state.newuser;
    var friendUsername = this.state.newid; //previously username - chnaged on 26 sep 2019 by harshal
    var friend_user_id = this.state.newid;
    this.setState({
      toUser: friend_user_id,
      frndName: friendNameValue,
      friendUsername: friendUsername,
      username: username,
      currentChat: this.state.newid,
      new: false
    });
    sleep(500).then(() => {
      localStorage.setItem("tousername", friendUsername);
      ReactDOM.findDOMNode(frndName).innerText = friendNameValue;
      ReactDOM.findDOMNode(frndImage).src = this.state.newphoto != "" ? config.profileImageBucketURL + this.state.newphoto : config.profileDefaultPath
      //"api/users/photo/" + this.state.newid;
      ReactDOM.findDOMNode(friend_id).value = friend_user_id;
      ReactDOM.findDOMNode(panel_footer).style.display = "block";
      //ReactDOM.findDOMNode(no_chat).style.display = "none";

      let toUser = ReactDOM.findDOMNode(friend_id).value; // = toUser;
      var tousername = friendUsername;
      ReactDOM.findDOMNode(chatForm).style.display = "block";
      ReactDOM.findDOMNode(myMsg).value = "";
      //ReactDOM.findDOMNode(myNewMsg).value = '';
      ReactDOM.findDOMNode(initMsg).innerText = "";
      if (tousername == "Group") {
        var currentRoom = "Group-Group";
        var reverseRoom = "Group-Group";
      } else {
        var currentRoom = username + "-" + tousername;
        var reverseRoom = tousername + "-" + username;
      }
      var roomId = currentRoom;
      //socket.emit('set-room',{name1:currentRoom,name2:reverseRoom});
      //eventEmitter.emit("get-room-data", room);
      var msgCount = this.msgCount;
      var room = {
        name1: currentRoom,
        name2: reverseRoom,
        numbers: 0,
        members: [username, tousername]
        //createdOn:current_date,
      };

      createRoom(room).then(data => {
        if (data.data && data.data[0]) {
          var my_room_id = data.data[0]._id;
          var my_room_username = data.data[0].username;
          this.setState({ roomId: my_room_id });
          localStorage.setItem("room_id", my_room_id);
          this.submitChat();
          sleep(100).then(() => {
            this.getCurrentChat(username, this.state.friendUsername);
            this.readRoom()
            this.setState({ SideLoader: false })
          });
        }
        if (data.data._id) {
          var my_room_id = data.data._id;
          this.setState({ roomId: my_room_id });
          localStorage.setItem("room_id", my_room_id);
          this.submitChat();
          sleep(100).then(() => {
            this.getCurrentChat(username, this.state.friendUsername);
            this.readRoom()
            this.setState({ SideLoader: false })
          });
        }
        if (data.error) {
          //console.log(data.error);
          this.setState({ error: data.error });
        } else {
          this.setState({ error: "", open: true });
        }
      });
    });
  };

  /* New Message New Chat end */
  showChatList() {
    ReactDOM.findDOMNode(isleftdisplay).style.display = "block";
    ReactDOM.findDOMNode(isrightdisplay).style.display = "none";

    this.setState({ isleftdisplay: true, isrightdisplay: false })
  }
  readRoom() {
    const jwt = auth.isAuthenticated();
    this.setState({ readRoom: false });
    var room = {
      name1: jwt.user._id
    };
    readRoom(room).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        arrdata = data.data;
        this.setState({
          users: arrdata,
          unread: data.chat,
          readRoom: true
        });
      }
    });
  }

  /* start Called when new chat start */
  getCurrentChat(username, tousername) {
    let currentTime = new Date();
    let room_id = localStorage.getItem("room_id");
    //let room_id = ReactDOM.findDOMNode(room_id).value
    let chat = {
      username: username,
      room: room_id,
      msgCount: 2,
      tousername: tousername,
      currentTime: currentTime,
      less: true
    };
    listChat(chat).then(data => {
      const jwt = auth.isAuthenticated();
      if (data) {
        this.state.messages = data;
        var chat_string = "";
        var new_date = "";
        for (var i = 0; i < data.length; i++) {
          let chat_data = data[i];
          var chat_msg = chat_data.msg;
          //var createdOn = chat_data.createdOn;
          var display_date = "Today";
          var createdOn = "now";
          var date1 = new Date(chat_data.createdOn).getTime();
          var date2 = new Date().getTime();
          var seconds = Math.floor((date2 - date1) / 1000);
          var minutes = Math.floor(seconds / 60);
          var hours = Math.floor(minutes / 60);
          var days = Math.floor(hours / 24);
          var year = Math.floor(days / 365);
          hours = hours - days * 24;
          minutes = minutes - days * 24 * 60 - hours * 60;
          seconds =
            seconds - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60;
          createdOn =
            year > 0
              ? year + " year ago"
              : days > 0
                ? days + " days ago"
                : hours > 0
                  ? hours + " hours ago"
                  : minutes > 0
                    ? minutes + " minutes ago"
                    : seconds > 0
                      ? seconds + " Seconds ago"
                      : createdOn;

          if (days < 1) {
            var minutes = new Date(chat_data.createdOn).getMinutes() < 10 ? "0" + new Date(chat_data.createdOn).getMinutes() : new Date(chat_data.createdOn).getMinutes();
            createdOn =
              new Date(chat_data.createdOn).getHours() +
              ":" + minutes
          }
          if (days >= 1 && days < 2) {
            createdOn = "yesterday";
          }
          if (days >= 2 && days <= 7) {
            var days = [
              "sunday",
              "monday",
              "tuesday",
              "wednesday",
              "thursday",
              "friday",
              "saturday"
            ];
            createdOn = new Date(chat_data.createdOn).getDay();
            createdOn = days[createdOn];
          }
          if (days > 7) {
            createdOn =
              chat_data.createdOn.substr(0, 10) +
              " " +
              new Date(chat_data.createdOn).getHours() +
              ":" +
              new Date(chat_data.createdOn).getMinutes();
          }

          var msg_to = chat_data.msgTo;
          var msg_from = chat_data.msgFrom._id;
          let imgURL = chat_data.msgFrom.photo ? config.profileImageBucketURL + chat_data.msgFrom.photo : config.profileDefaultPath
          //"api/users/photo/" + msg_from;
          var t = new Date().toISOString().slice(0, 10);
          if (t == chat_data.createdOn.substr(0, 10)) {
            display_date = "Today";
          } else {
            display_date = chat_data.createdOn.substr(0, 10);
          }
          if (
            new_date != chat_data.createdOn.substr(0, 10) &&
            new_date != "Today"
          ) {
            chat_string +=
              "<div id=" +
              new Date(chat_data.createdOn.substr(0, 10)).getTime() +
              " class='day_bar'><span><i class='far fa-clock'></i>" +
              display_date +
              "</span></div>";
            new_date = display_date;
          }
          msg_from == jwt.user._id
            ? (chat_string +=
              "<li class='user_listing sender'><Box class='user_listing_txt'><Typography variant='p'  component='p' class='chat'>" +
              chat_msg +
              "</Typography><Typography variant='div'  component='div' class='chat_time'>" +
              createdOn +
              "</Typography></Box><Box class='user_listing_icon'><img src=" +
              imgURL +
              " /></Box></li>")
            : (chat_string +=
              "<li class='user_listing receiver'><Box class='user_listing_icon'><img src=" +
              imgURL +
              " /></Box><Box class='user_listing_txt'><Typography variant='p'  component='p' class='chat'>" +
              chat_msg +
              "</Typography><Typography variant='div'  component='div' class='chat_time'>" +
              createdOn +
              "</Typography></Box></li>");
        }

        ReactDOM.findDOMNode(messages).innerHTML = chat_string;
        const objList = document.getElementById("listChatItems");
        objList.scrollTop = objList.objList;
        if (this.state.scrolled) {
          var objDiv = document.getElementById("scrl2");
          objDiv.scrollTop = objDiv.scrollHeight;
          this.setState({ scrollTop: objDiv.scrollTop });
        }
      }
      if (data.error) {
        this.setState({ error: data.error });
      } else {
        this.setState({ error: "", open: true });
      }
    });
  }
  /* start Called when new chat end */

  /* start Called of old chat on scrooll start */
  getOldChat = () => {
    var elmnt = document.getElementById("scrl2");
    var y = elmnt.scrollTop;
    if (y < this.state.scrollvalue) {
      elmnt.classList.add("scrolled");
    } else {
      this.setState({ scrollvalue: y });
    }
    if (y == this.state.scrollvalue) {
      elmnt.classList.remove("scrolled");
    }

    if (y == 0) {
      this.setState({ loader: true });
      const jwt = auth.isAuthenticated();
      let room_id = localStorage.getItem("room_id");
      let chat = {
        username: jwt.user._id,
        room: room_id,
        msgCount: 2,
        chatmessagestart: this.state.chatmessagestart
        //tousername: '5d82105e7c2d1f260c085e2d'
      };
      listMoreChat(chat).then(data => {
        const jwt = auth.isAuthenticated();
        if (data) {
          if (data.length > 0) {
            this.setState({
              chatmessagestart: this.state.chatmessagestart + 20
            });
          }
          this.state.messages = data;

          var chat_string = ReactDOM.findDOMNode(messages).innerHTML;
          var new_date = "";
          for (var i = 0; i < data.length; i++) {
            let chat_data = data[i];
            var chat_msg = chat_data.msg;
            //var createdOn = chat_data.createdOn;
            var display_date = "Today";
            var createdOn = "now";
            var date1 = new Date(chat_data.createdOn).getTime();
            var date2 = new Date().getTime();

            var seconds = Math.floor((date2 - date1) / 1000);
            var minutes = Math.floor(seconds / 60);
            var hours = Math.floor(minutes / 60);
            var days = Math.floor(hours / 24);
            var year = Math.floor(days / 365);
            hours = hours - days * 24;
            minutes = minutes - days * 24 * 60 - hours * 60;
            seconds =
              seconds - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60;
            createdOn =
              year > 0
                ? year + " year ago"
                : days > 0
                  ? days + " days ago"
                  : hours > 0
                    ? hours + " hours ago"
                    : minutes > 0
                      ? minutes + " minutes ago"
                      : seconds > 0
                        ? seconds + " Seconds ago"
                        : createdOn;

            if (days < 1) {
              var minutes = new Date(chat_data.createdOn).getMinutes() < 10 ? "0" + new Date(chat_data.createdOn).getMinutes() : new Date(chat_data.createdOn).getMinutes();
              createdOn =
                new Date(chat_data.createdOn).getHours() +
                ":" + minutes
            }
            if (days >= 1 && days < 2) {
              createdOn = "yesterday";
            }
            if (days >= 2 && days <= 7) {
              var days = [
                "sunday",
                "monday",
                "tuesday",
                "wednesday",
                "thursday",
                "friday",
                "saturday"
              ];
              createdOn = new Date(chat_data.createdOn).getDay();
              createdOn = days[createdOn];
            }
            if (days > 7) {
              createdOn =
                chat_data.createdOn.substr(0, 10) +
                " " +
                new Date(chat_data.createdOn).getHours() +
                ":" +
                new Date(chat_data.createdOn).getMinutes();
            }

            var msg_to = chat_data.msgTo;
            var msg_from = chat_data.msgFrom._id;
            let imgURL = chat_data.msgFrom.photo ? config.profileImageBucketURL + chat_data.msgFrom.photo : config.profileDefaultPath
            var t = new Date().toISOString().slice(0, 10);
            if (t == chat_data.createdOn.substr(0, 10)) {
              display_date = "Today";
            } else {
              display_date = chat_data.createdOn.substr(0, 10);
            }
            var date_string = "";
            var change = new Date(chat_data.createdOn.substr(0, 10)).getTime();
            //document.getElementById("abc").style.display = "none";
            //ReactDOM.findDOMNode('1569801600000').innerHTML = ''
            // if (document.body.contains(document.getElementById(change))) {
            //   if (i == 0) {
            //     var span = document.getElementById(change);
            //     //if (span != null) {
            //     span.parentNode.removeChild(span);
            //     // }
            //   }
            // }

            // sleep(500).then(() => {
            // if (new_date != chat_data.createdOn.substr(0, 10) && new_date != "Today" && i == data.length - 1) { //&& this.state.displayingDate != display_date
            if (i == data.length - 1) {
              // ReactDOM.findDOMNode(messageDate).innerHTML = display_date;
              // date_string = "<div id='abc'>" + display_date + "</div>"
              date_string =
                "<div id='abc' class='day_bar'><span><i class='far fa-clock'></i>" +
                display_date +
                "</span></div>";
              new_date = display_date;
              this.setState({ displayingDate: display_date });
            }
            //})
            msg_from == jwt.user._id
              ? (chat_string =
                date_string +
                "<li class='user_listing sender'><Box class='user_listing_txt'><Typography variant='p'  component='p' class='chat'>" +
                chat_msg +
                "</Typography><Typography variant='div'  component='div' class='chat_time'>" +
                createdOn +
                "</Typography></Box><Box class='user_listing_icon'><img src=" +
                imgURL +
                " /></Box></li>" +
                chat_string)
              : (chat_string =
                date_string +
                "<li class='user_listing receiver'><Box class='user_listing_icon'><img src=" +
                imgURL +
                " /></Box><Box class='user_listing_txt'><Typography variant='p'  component='p' class='chat'>" +
                chat_msg +
                "</Typography><Typography variant='div'  component='div' class='chat_time'>" +
                createdOn +
                "</Typography></Box></li>" +
                chat_string);
          }

          ReactDOM.findDOMNode(messages).innerHTML = chat_string;
          const objList = document.getElementById(" ");
          objList.scrollTop = objList.objList;
          if (this.state.scrolled) {
            var objDiv = document.getElementById("scrl2");
            objDiv.scrollTop = objDiv.scrollHeight;
            this.setState({ scrollTop: objDiv.scrollTop });
          }
        }
        if (data.error) {
          this.setState({ error: data.error });
        } else {
          this.setState({ error: "", open: true });
        }

        elmnt.scrollTop = data.length * 70;
      });
      sleep(500).then(() => {
        this.setState({ loader: false });
      });
      var elmnt = document.getElementById("scrl2");
      var y = elmnt.scrollTop;
      this.setState({ scrollvalue: y });
    }
  };
  /* start Called of old chat on scrooll end */

  /* send New Message start*/
  submitChat(e) {
    let chat_msg = ReactDOM.findDOMNode(myMsg).value;
    if (chat_msg == "") {
      chat_msg = this.state.myNewMsg;
      //ReactDOM.findDOMNode(myNewMsg).value;
    }


    this.setState({ chat_msg: chat_msg, SideLoader: true });

    let toUser = ReactDOM.findDOMNode(frndName).innerText; //(friend_id).value
    let room_id = localStorage.getItem("room_id");
    let tousername = localStorage.getItem("tousername");
    // var el = document.getElementById(tousername);
    // el.classList.add("chat_person_active");
    //let room_id = ReactDOM.findDOMNode(room_id).value
    let current_date = Date.now("Y-m-d H:i:s");

    ReactDOM.findDOMNode(myMsg).value = "";
    //ReactDOM.findDOMNode(myNewMsg).value = "";
    //const jwt = auth.isAuthenticated()
    var chat_message_current_content = ReactDOM.findDOMNode(messages).innerHTML;

    const jwt = auth.isAuthenticated();
    var username = jwt.user._id; //this.state.currentUser.username
    let chat = {
      msgFrom: username,
      msgTo: tousername,
      room: room_id,
      msg: chat_msg || undefined
      //createdOn:current_date,
    };

    create(chat).then(data => {
      if (data.error) {
        this.setState({ error: data.error });
      } else {
        this.setState({ error: "", open: true });
        if (data) {
          // var created_date = data.data.createdOn;

          var created_date = "now";
          var date1 = new Date(data.data.createdOn).getTime();
          var date2 = new Date().getTime();

          var seconds = Math.floor((date2 - date1) / 1000);
          var minutes = Math.floor(seconds / 60);
          var hours = Math.floor(minutes / 60);
          var days = Math.floor(hours / 24);
          var year = Math.floor(days / 365);
          hours = hours - days * 24;
          minutes = minutes - days * 24 * 60 - hours * 60;
          seconds =
            seconds - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60;
          created_date =
            year > 0
              ? year + " year ago"
              : days > 0
                ? days + " days ago"
                : hours > 0
                  ? hours + " hours ago"
                  : minutes > 0
                    ? minutes + " minutes ago"
                    : seconds > 0
                      ? seconds + " Seconds ago"
                      : created_date;

          if (days < 1) {
            createdOn =
              new Date(chat_data.createdOn).getHours() +
              ":" +
              new Date(chat_data.createdOn).getMinutes();
          }
          if (days >= 1 && days < 2) {
            createdOn = "yesterday";
          }
          if (days >= 2 && days <= 7) {
            var days = [
              "sunday",
              "monday",
              "tuesday",
              "wednesday",
              "thursday",
              "friday",
              "saturday"
            ];
            createdOn = new Date(chat_data.createdOn).getDay();
            createdOn = days[createdOn];
          }
          if (days > 7) {
            createdOn =
              chat_data.createdOn.substr(0, 10) +
              " " +
              new Date(chat_data.createdOn).getHours() +
              ":" +
              new Date(chat_data.createdOn).getMinutes();
          }
          if (created_date) {
            var imgURL = "api/users/photo/" + username;
            // chat_message_current_content += "<li class='user_listing 1'><div class='user_listing_txt'><p>" + chat_msg + "</p><div class='chat_time'>" + created_date + "</div></div><div class='user_listing_icon'><img src=" + imgURL + " /></div></li>"
            // ReactDOM.findDOMNode(messages).innerHTML = chat_message_current_content;
            var objDiv = document.getElementById("scrl2");
            objDiv.scrollTop = objDiv.scrollHeight;
          }
          this.setState({ chat_msg: '' });
        }
      }
    });
  }
  /* send New Message end*/

  _handleKeyDown = e => {
    if (e.key === "Enter" && !this.state.isMobile) {
      e.preventDefault()
      this.submitChat(e);
    }
  };

  componentDidMount = () => {
    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      ReactDOM.findDOMNode(isleftdisplay).style.display = "block";
      ReactDOM.findDOMNode(isrightdisplay).style.display = "none";
      this.setState({ isrightdisplay: false, isMobile: true })
    }
    localStorage.removeItem("room_id");
    localStorage.removeItem("tousername");
    const jwt = auth.isAuthenticated();

    this.setState({ currentUser: jwt.user });

    // list().then((data) => {
    //   if (data.error) {
    //     console.log(data.error)
    //   } else {
    //     this.setState({ all: data })
    //   }
    // })
    /* start for new message users list */
    read(
      {
        userId: jwt.user._id
      },
      { t: jwt.token }
    ).then(data => {
      if (data.error) {
        this.setState({ error: data.error });
      } else {
        this.setState({ all: data.following });
      }
    });
    /* end for new message users list */
    /* start for old message chatroom */
    var room = {
      name1: jwt.user._id
    };

    readRoom(room).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        arrdata = data.data;
        this.setState({ users: arrdata, unread: data.chat });
      }
    });

    /* end for old message chatroom */
    const objList = document.getElementById("listChatItems");
    objList.scrollTop = objList.objList;

    intervalID = setInterval(() => {
      var room = {
        name1: jwt.user._id
      };
      if (this.state.readRoom) {
        this.setState({ readRoom: false });
        readRoom(room).then(data => {
          if (data.error) {
            console.log(data.error);
          } else {
            arrdata = data.data;
            this.setState({
              users: arrdata,
              unread: data.chat,
              readRoom: true
            });
          }
        });
      }
      var username = this.state.currentUser._id;
      let query_params = {
        username: username
      };
      //this.getNotificationList(query_params);
    }, 5000);
    /* To Send Direct Chat by parameter */
    this.setState({
      new: false,
      newuser: "",
      newid: "",
      newphoto: ""
    });
    if (this.props.match.params.user) {
      this.setState({
        new: true,
        newuser: "",
        newid: "",
        newphoto: ""
      });
      ReactDOM.findDOMNode(isChat).style.display = "none";
      ReactDOM.findDOMNode(isNew).style.display = "block";
      sleep(400).then(() => {
        var redirectUserId = this.props.match.params.user;
        var redirectUsername = "";
        var redirectUserProfile = "";
        this.state.all.map((item, key) => {
          if (item._id == redirectUserId) {
            redirectUsername = item.name;
            redirectUserProfile = item.photo ? item.photo : ""
          }
        });
        if (redirectUsername == "") {
          read(
            {
              userId: redirectUserId
            },
            { t: jwt.token }
          ).then(data => {
            if (data.error) {
              this.setState({ error: data.error });
            } else {
              redirectUsername = data.name
              this.setState({
                newuser: redirectUsername,
                newid: redirectUserId,
                newphoto: redirectUserProfile
              });
            }
          });

        }
        this.setState({
          newuser: redirectUsername,
          newid: redirectUserId,
          newphoto: redirectUserProfile
        });
      });
    }
    /* End To Send Direct Chat by parameter */
  };

  componentWillUnmount() {
    clearInterval(intervalID);
  }

  getNotificationList(query_params) {
    listNotification(query_params).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ notifications: data });
        for (var userName in data) {
          var userID = data[userName];
          var userDom = document.getElementById(userID);
          if (userDom) {
            //userDom.innerText = 1;
          }
        }
      }
    });
  }

  newMessage = status => {
    ReactDOM.findDOMNode(isChat).style.display = "none";
    ReactDOM.findDOMNode(isNew).style.display = "block";
    this.setState({ new: status, newuser: "", newid: "", newphoto: "" });
  };
  newMessageRedirect = status => {
    window.location.href = "/messages";
  };
  handleChange = event => {
    var username = event.target.value;
    var toid = "";
    var toprofile = "";
    this.state.all.map((item, key) => {
      if (item.name == username) {
        toid = item._id;
        toprofile = item.photo ? item.photo : ""
      }
    });
    this.setState({ newuser: username, newid: toid, newphoto: toprofile });
  };
  handleMessage = name => event => {
    this.setState({ [name]: event.target.value });
  };

  start = () => {
    this.setState({ chatmessagestart: 20, scrollvalue: 0 });
    if (this.state.isMobile) {
      ReactDOM.findDOMNode(isleftdisplay).style.display = "none";
      ReactDOM.findDOMNode(isrightdisplay).style.display = "block";
    }
    //this.state.isMobile ? this.setState({ isleftdisplay: false, isrightdisplay: true }) : ''
    sleep(100).then(() => {
      var elmnt = document.getElementById("scrl2");
      elmnt.classList.remove("scrolled");
      var objDiv = document.getElementById("scrl2");
      objDiv.scrollTop = objDiv.scrollHeight;
    })
  };

  removeUser = () => {
    this.setState({ newid: "", newuser: "", newphoto: "" })
  }

  changeLoader = () => {
    this.setState({ SideLoader: false })
  }

  render() {
    const { classes } = this.props;
    return (
      <section className={"chat_out_section"}>
        {/* {!this.state.new && ( */}
        <Grid container className={"chat_outer_blk"} id="isChat">
          <input type="hidden" id="user" value="" />
          {/* {this.state.isleftdisplay && */}
          <Grid item xs={12} md={4} className="message_left_blk" id="isleftdisplay">

            <div className="panel panel-primary">
              <div className="panel-heading">
                <center>
                  <Button
                    className={"btn_sec"}
                    onClick={() => this.newMessage(true)}
                  >
                    New Message
                    </Button>
                </center>
              </div>

              <div
                className="panel-body"
                id="scrl1"
                ref={el => {
                  this.el = el;
                }}
              >

                <ul id="listChatItems"></ul>
                {this.state.users.map((person, i) => {
                  if (person.members[0] && person.members[0]._id != this.state.currentUser._id)
                    return (
                      <TableRow
                        key={i}
                        data_rec={person.members[0]}
                        time={person.lastActive}
                        onStart={this.start}
                        onSubmit={this.changeLoader}
                        username={this.state.username}
                        unread={this.state.unread[i]}
                      />
                    );
                  if (person.members[1] && person.members[1]._id != this.state.currentUser._id)
                    return (
                      <TableRow
                        key={i}
                        data_rec={person.members[1]}
                        time={person.lastActive}
                        onStart={this.start}
                        onSubmit={this.changeLoader}
                        username={this.state.username}
                        unread={this.state.unread[i]}
                      />
                    );
                })}

              </div>
            </div>
          </Grid>
          {/* } */}
          {/* {this.state.isrightdisplay && */}
          <Grid item xs={12} sm={12} md={8} className="message_right_blk dee" id="isrightdisplay">
            <div className="panel panel-primary">
              <Typography component="div" className="panel-heading">
                <Typography component="div" className="user_back_btn">
                  <IconButton size="small" aria-label="small" className={"short_ico"}><i className="far fa-chevron-left" onClick={() => this.showChatList()}></i></IconButton>
                </Typography>

                <Typography component="div" className="user_icon_name">
                  <img
                    className={"notification_icon chat_big_icon"}
                    alt=""
                    id="frndImage"
                    src=""
                  />
                  <Typography id="loading" component="h2" id="frndName"></Typography>
                </Typography>
              </Typography>

              <div className="panel-body dee" id="scrl2" onScroll={this.getOldChat}>
                <Typography component="div" className={"message_val_blk"}>
                  <Typography id="loading" component="h5">
                    Loading..... Please Wait.
                    </Typography>
                  <Typography id="noChat" component="h5">
                    No More Chats To Display.....
                    </Typography>
                  <Typography id="initMsg" component="h5">
                    !!...Click On User Or Group Button To Start Chat...!!
                    </Typography>
                </Typography>
                <Typography component="div">
                  {/*  className={"day_bar"} */}
                  {/* <Typography variant="span" component="span"><i className="far fa-clock"></i>
                        <Typography variant="h6" component="h6" id="messageDate">Today</Typography>
                      </Typography> */}
                  {this.state.loader && (
                    <CustomLoader height={50} width={30} />
                  )}
                </Typography>
                {this.state.users.length == 0 &&
                  <div className="no_message_txt" id="no_chat">
                    You do not have any new messages available
                  </div>
                }
                {
                  this.state.users.length > 0 && !localStorage.getItem("room_id") &&
                  <div className="no_message_txt gray_txt" id="no_chat">
                    <Typography component="h4">You don't have a message selected</Typography>
                    Choose one from your existing messages, or start a new one.
                  </div>
                }
                <ul id="messages"></ul>
              </div>

              {this.state.SideLoader && <SideLoader height={35} width={35} />}
              <div className="panel-footer" id="panel_footer">
                <Card className={classes.card}>
                  <Typography
                    component="div"
                    id="chatForm"
                    className={"chat_comment_box"}
                  >
                    <textarea
                      id="myMsg"
                      className="input-box-send"
                      placeholder="Write Message Here.."
                      onKeyDown={this._handleKeyDown}
                      onChange={this.handleMessage("chat_msg")}
                    ></textarea>
                    {/*  */}
                    <input id="friend_id" type="hidden" value="" />
                    <input type="hidden" id="room_id" value="" />
                    <Button className={"btn_pri"} onClick={this.submitChat} disabled={this.state.chat_msg == ""}>Send <SendIcon fontSize="small" className={"mobile_use"} /></Button>
                  </Typography>
                </Card>
              </div>
            </div>
          </Grid>
          {/* } */}
        </Grid>
        {/* )} */}

        {/* New message design start  */}
        {/* {this.state.new && ( */}
        <Grid container className={"chat_outer_blk new_message_blk"} id="isNew" style={{ display: "none" }}>
          <Grid item xs={12} className="new_message_inner">
            <Typography component="div" className="panel panel-primary">
              <div className="panel-heading">
                <Typography component="div" className={"previous_arrow"}>
                  {/* <Link to={"/messages"}>
                      <i className="far fa-chevron-left"></i>
                    </Link> */}
                  <i
                    className="far fa-chevron-left"
                    onClick={() => this.newMessageRedirect()}
                  ></i>
                </Typography>

                <Typography component="div" className={"message_title"}>
                  New Message
                  </Typography>
              </div>

              <div className="panel-body">
                <Typography component="div" className={"top_email_blk"}>
                  <Box component="div" className={"search_blk"}>
                    <Box component="div" className={"linline_txt"}>
                      To
                      </Box>
                    {/* <TextField
                          list="data"
                          id="simple-start-adornment"
                          className={clsx(classes.margin, classes.textField)}
                          InputProps={{
                            startAdornment: <InputAdornment></InputAdornment>,
                          }}

                          /><br /> */}

                    <input
                      type="text"
                      list="data"
                      value={this.state.newuser}
                      onChange={this.handleChange}
                      placeholder="Enter a name..."
                    />
                    <datalist id="data">
                      {this.state.all.map((item, key) => (
                        <option key={key}>
                          {item.isDeleted != 1 && item.name}
                        </option>
                      ))}
                    </datalist>
                  </Box>
                  {this.state.newid && (
                    <Box component="div" className={"user_block_section"}>
                      <img
                        className={"user_icon"}
                        src={
                          this.state.newphoto != "" ? config.profileImageBucketURL + this.state.newphoto : config.profileDefaultPath
                          // '/api/users/photo/' + this.state.newid
                          //   ? '/api/users/photo/' + this.state.newid
                          //   : "/api/users/defaultphoto"
                        }
                        alt="User"
                      />
                      <Box component="div" className={"txt"}>
                        {this.state.newuser}
                      </Box>
                      <Box component="div" className={"trash_sec_blk"} onClick={this.removeUser}>
                        <i className="fal fa-trash"></i>
                      </Box>
                    </Box>
                  )}
                  <Box component="div" className={"search_message_section"}>
                    <textarea
                      id="myNewMsg"
                      className="input_message_blk"
                      placeholder="Type something"
                      onChange={this.handleMessage("myNewMsg")}
                    ></textarea>

                    <Button
                      className={"btn_pri"}
                      onClick={this.newChat}
                      disabled={this.state.myNewMsg == "" || this.state.newid == ""}
                    >
                      Send
                      </Button>
                  </Box>
                </Typography>
              </div>
            </Typography>
          </Grid>
        </Grid>
        {/* )} */}
        {/* New message design end  */}
      </section>
    );
  }
}
Chat.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Chat);
