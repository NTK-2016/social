import React from "react";
import { createRoom, listChat, listNewChat } from "./api-chat.js";
import { withStyles } from "material-ui/styles";
import Button from "@material-ui/core/Button";
import ReactDOM from "react-dom";
import auth from "./../auth/auth-helper";
import Message from "./Message";
import Typography from "material-ui/Typography";
import List, {
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText
} from "material-ui/List";
import Avatar from "material-ui/Avatar";
import Moment from "react-moment";
import config from "../../config/config";

const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

const styles = theme => ({
  button: {
    margin: 100
  },
  input: {
    display: "none"
  }
});
let intervalID = 0;
class TableRow extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      users: [],
      messages: "",
      typing: "",
      frndName: "",
      initMsg: "",
      chatForm: "",
      sendBtn: "",
      myMsg: "",
      toUser: "",
      msgCount: 0,
      oldInitDone: 0,
      roomId: "",
      noChat: 0,
      friendUsername: "",
      tousername: "",
      username: "",
      currentChat: "",
      scrolled: true,
      scrollTop: 0,
      displaydate: "",
      readChat: true
    };
    ///chat-msg
    var noChat = 0; //setting 0 if all chats histroy is not loaded. 1 if all chats loaded.
    var msgCount = 0; //counting total number of messages displayed.
    var oldInitDone = 0; //it is 0 when old-chats-init is not executed and 1 if executed.
    var roomId; //variable for setting room.
    var toUser;
    this.startChat = this.startChat.bind(this);
    this.getOldChat = this.getOldChat.bind(this);
    this.getNewChat = this.getNewChat.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);
    //localStorage.setItem("room_id", '');
  }

  componentDidMount() {
    intervalID = setInterval(() => {
      var tousername = this.state.tousername;
      var username = this.state.username ? this.state.username : this.props.username;
      var chat_form_display = ReactDOM.findDOMNode(chatForm).style.display;
      if (chat_form_display == "block") {
        var objDiv = document.getElementById("scrl2");
        const winScroll = objDiv.scrollTop;
        const height = objDiv.scrollHeight - objDiv.clientHeight;
        const scrolled = winScroll / height;
        if (scrolled < 1) {
          this.setState({ scrolled: false });
        }
        if (this.state.readChat) {
          this.setState({ readChat: false });
          if (username != "" && username != undefined) {
            this.getNewChat(username, tousername);
            this.props.onSubmit();
          }
        }
      }
    }, 5000);
  }

  componentWillUnmount() {
    clearInterval(intervalID);
  }
  scrollToBottom() {
    this.el.scrollIntoView({ behavior: "smooth" });
  }

  startChat = chatId => {
    if (localStorage.getItem("tousername") != this.props.data_rec._id || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      this.props.onStart();
      //(e) {
      sleep(100).then(() => {
        // var els = document.querySelectorAll('.chat_person_active')
        // for (var i = 0; i < els.length; i++) {
        //   els[i].classList.remove('chat_person_active')
        // }
        // var el = document.getElementById(chatId);
        // el.classList.add("chat_person_active");
        const jwt = auth.isAuthenticated();
        var username = jwt.user._id; // previously username - chnaged on 26 sep 2019 by harshal

        var friendNameValue = this.props.data_rec.name;
        var friendUsername = this.props.data_rec._id; //previously username - chnaged on 26 sep 2019 by harshal
        var friend_user_id = this.props.data_rec._id;
        this.setState({
          toUser: friend_user_id,
          frndName: friendNameValue,
          friendUsername: friendUsername,
          username: username,
          currentChat: this.props.data_rec._id
        });
        localStorage.setItem("tousername", friendUsername);

        ReactDOM.findDOMNode(frndName).innerText = friendNameValue;
        ReactDOM.findDOMNode(frndImage).src = this.props.data_rec.photo ? config.profileImageBucketURL + this.props.data_rec.photo : config.profileDefaultPath
        //"api/users/photo/" + this.props.data_rec._id;
        ReactDOM.findDOMNode(friend_id).value = friend_user_id;
        ReactDOM.findDOMNode(panel_footer).style.display = "block";
        //ReactDOM.findDOMNode(no_chat).style.display = "none";
        let toUser = ReactDOM.findDOMNode(friend_id).value; // = toUser;
        var tousername = friendUsername;
        ReactDOM.findDOMNode(chatForm).style.display = "block";
        ReactDOM.findDOMNode(myMsg).value = "";
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
            this.getOldChat(username, this.state.friendUsername);
          }

          if (data.data._id) {
            var my_room_id = data.data._id;
            this.setState({ roomId: my_room_id });
            localStorage.setItem("room_id", my_room_id);
            this.getOldChat(username, this.state.friendUsername);
          }

          if (data.error) {
            //console.log(data.error);
            this.setState({ error: data.error });
          } else {
            this.setState({ error: "", open: true });
          }
        });
      })
    }
  };

  getOldChat(username, tousername) {
    let currentTime = new Date().getTime();
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
              "<div id='abc' class='day_bar'><span><i class='far fa-clock'></i>" +
              display_date +
              "</span></div>";
            new_date = display_date;
            this.setState({ displaydate: display_date });
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

  getNewChat(username, tousername) {
    var isScrolled = document.getElementsByClassName("scrolled");
    if (isScrolled.length == 0) {
      var objDiv = document.getElementById("scrl2");
      objDiv.scrollTop = objDiv.scrollHeight;
    }
    let currentTime = new Date().getTime();
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

    listNewChat(chat).then(data => {
      const jwt = auth.isAuthenticated();
      if (data) {
        this.state.messages = data;

        var chat_string = ReactDOM.findDOMNode(messages).innerHTML;
        var date_string = ''
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
          if (days > 0) {
            display_date = chat_data.createdOn.substr(0, 10);
          }
          if (
            this.state.displaydate != chat_data.createdOn.substr(0, 10) &&
            this.state.displaydate != "Today"
          ) {
            date_string +=
              "<div id='abc' class='day_bar'><span><i class='far fa-clock'></i>" +
              display_date +
              "</span></div>";
            //chat_string += "<Typography variant = 'div' component = 'div' className ='day_bar'><Typography variant='span' component='span'><i className='far fa-clock'></i><Typography variant='h6' component='h6'>" + display_date + "</Typography></Typography></Typography >"
            new_date = display_date;
            this.setState({ displaydate: display_date });
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
        var isScrolled = document.getElementsByClassName("scrolled");
        if (isScrolled.length == 0) {
          var objDiv = document.getElementById("scrl2");
          objDiv.scrollTop = objDiv.scrollHeight;
        }

        // if (this.state.scrolled) {
        //   var objDiv = document.getElementById("scrl2");
        //   objDiv.scrollTop = objDiv.scrollHeight;
        //   //console.log(objDiv.scrollTop)
        //   this.setState({ scrollTop: objDiv.scrollTop })
        // }
      }
      if (data.error) {
        this.setState({ error: data.error });
      } else {
        this.setState({ error: "", open: true });
      }
      this.setState({ readChat: true });
    });
  }

  render() {
    const { classes } = this.props;
    var jwt = auth.isAuthenticated();
    var username = jwt.user.username;

    if (username == this.props.data_rec.username) {
      return this.props.data_rec.name ? (
        <ListItem className={"chat_person_outactive"}>
          <div className="btn_outer" key={this.props.data_rec.key}>
            <ListItemAvatar>
              <Avatar
                className={"chat_left_icon"}
                alt={this.props.data_rec.name}
                src="../dist/notification_icon.png"
              />
            </ListItemAvatar>

            <Typography component="div" className={"chat_user_ntxt"}>
              <Typography component="h4">{this.props.data_rec.name}</Typography>
            </Typography>
            <Typography
              component="div"
              className={"chat_left_time"}
              alignitems="flex-end"
            >
              <Typography component="div" className="badge">
                Now
              </Typography>
              <Typography component="div" className="online_icon"></Typography>
            </Typography>
          </div>
        </ListItem>
      ) : (
          ""
        );
    } else {
      var created_date = "now";
      var date1 = new Date(this.props.time).getTime();
      var date2 = new Date().getTime();
      var seconds = Math.floor((date2 - date1) / 1000);
      var minutes = Math.floor(seconds / 60);
      var hours = Math.floor(minutes / 60);
      var days = Math.floor(hours / 24);
      var year = Math.floor(days / 365);
      hours = hours - days * 24;
      minutes = minutes - days * 24 * 60 - hours * 60;
      seconds = seconds - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60;
      // created_date =
      //   year > 0
      //     ? year + " year ago"
      //     : days > 0
      //       ? days + " days ago"
      //       : hours > 0
      //         ? hours + " hours ago"
      //         : minutes > 0
      //           ? minutes + " minutes ago"
      //           : seconds > 0
      //             ? seconds + " Seconds ago"
      //             : created_date;
      if (days < 1) {
        created_date = "Today"; //new Date(this.props.time).getHours() + ":" + new Date(this.props.time).getMinutes();
      }
      // if (days >= 1 && days < 2) {
      //   created_date = 'yesterday'
      // }
      // if (days >= 2 && days <= 7) {
      //   var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
      //   created_date = new Date(this.props.time).getDay()
      //   created_date = days[created_date]
      // }
      // if (days > 7) {
      //   created_date = this.props.time.substr(0, 10);
      // }
      return this.props.data_rec.name ? (
        <ListItem
          alignitems="flex-start"
          id={this.props.data_rec._id}
          className={localStorage.getItem("tousername") != this.props.data_rec._id ? "chat_person_outactive" : "chat_person_active"}

        >
          <div
            className="btn_outer"
            onClick={() => this.startChat(this.props.data_rec._id)}
            key={this.props.data_rec.key}
          >
            <ListItemAvatar>
              <Avatar
                className={"chat_left_icon"}
                alt={this.props.data_rec.username}
                src={
                  this.props.data_rec.photo ? config.profileImageBucketURL + this.props.data_rec.photo : config.profileDefaultPath}
              //src={'/api/users/photo/' + this.props.data_rec._id}
              />
            </ListItemAvatar>
            <Typography component="div" className={"chat_user_ntxt"}>
              <Typography component="h4">
                {this.props.data_rec.name}
                <span
                  className="badge"
                  id={this.props.data_rec.username}
                ></span>
              </Typography>
              <Typography
                component="div"
                className={"chat_left_time"}
                alignitems="flex-end"
              >
                <Typography component="div" className={"chat_left_time_txt"}>
                  {created_date != "Today" && (
                    <Moment format="MMM D, YYYY">
                      {new Date(this.props.time).toString()}
                    </Moment>
                  )}
                  {created_date == "Today" && <span>{created_date}</span>}
                </Typography>
                {this.props.unread &&
                  <Typography component="div" className="online_icon"></Typography>
                }
              </Typography>
              {/* <Typography component="div" className="online_icon"></Typography> */}
            </Typography>
          </div>
        </ListItem>
      ) : (
          ""
        );
    }
  }
}
export default TableRow;
