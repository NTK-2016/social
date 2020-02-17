import React, { Component } from "react";
import Card, { CardHeader, CardContent, CardActions } from "material-ui/Card";
import Button from "material-ui/Button";
import TextField from "material-ui/TextField";
import Typography from "material-ui/Typography";
import Avatar from "material-ui/Avatar";
import Icon from "material-ui/Icon";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import { create, readcategory } from "./../api-post.js";
import auth from "./../../auth/auth-helper";
import IconButton from "material-ui/IconButton";
import AttachFile from "material-ui-icons/AttachFile";
//import Radio from 'material-ui/Radio'
import Select from "material-ui/Select";
import Snackbar from "material-ui/Snackbar";
import {
  required,
  countError,
  validatelink,
  requiredwith
} from "./../../common/ValidatePost";
import SplitButton from "../../common/SplitButton";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import CustomMessage from "./../../common/CustomMessage";
import CustomButton from "./../../common/CustomButton";
import SideLoader from "./../../common/SideLoader";
import CustomBack from "./../../common/CustomBack";
import "date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker
} from "@material-ui/pickers";

import DateFnsUtils from "@date-io/date-fns";
import Checkbox from "@material-ui/core/Checkbox";
import Fourzerofour from "./../../common/404";

const styles = theme => ({
  photoButton: {
    height: 30,
    marginBottom: 5
  },
  filename: {
    verticalAlign: "super"
  }
});

const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

var names = [];
var intervalID = ''
var uploaddata = ''
class NewLink extends Component {
  constructor() {
    super();
    this.state = {
      url: "",
      text: "",
      description: "",
      attach: "",
      categories: [],
      names: [],
      posttype: "1",
      viewtype: "public",
      postname: "link",
      error: "",
      errors: {},
      user: {},
      open: false,
      showDate: false,
      scheduled_datetime: new Date(),
      attachnames: [],
      choosed: true,
      SideLoader: false,
      showbutton: true,
      checkedTips: false,
      uploadpercent: 0,
      response: false,
      invalid: true
    };
  }

  //async
  init = () => {
    console.log("init");
    const jwt = auth.isAuthenticated();
    this.postData.set("posttype", this.state.posttype);
    // await
    readcategory(
      {
        userId: jwt.user._id
      },
      { t: jwt.token }
    ).then(data => {
      if (data.error) {
        this.setState({ redirectToSignin: true });
      } else {
        console.log(data);
        var categories = [];
        for (var i = 0; i < data.length; i++) {
          if (data[i].name != undefined) {
            categories[i] = data[i].name; //.split(',');
          }
        }

        var categories = [].concat.apply([], categories);
        names = Array.from(new Set(categories));
        //names.shift()

        console.log(names);
        //let following = this.checkFollow(data)
      }
    });
    sleep(500).then(() => {
      this.setState({ names: names });
      console.log(names);
      console.log("finish");
    });
  };

  handleValidation() {
    let errors = {};
    let res = [];
    let formIsValid = true;
    errors["text"] = required(this.state.text, "Title is required");
    res.push(required(this.state.text, "Title is required"));
    errors["url"] = required(this.state.url, "Link is required");
    res.push(required(this.state.url, "Link is required"));
    errors["invalidlink"] = validatelink(this.state.url, "Invalid URL");
    res.push(validatelink(this.state.url, "Invalid URL"));
    errors["viewtype"] = required(this.state.viewtype, "Viewtype is required");
    res.push(required(this.state.viewtype, "Viewtype is required"));
    errors["posttype"] = required(this.state.posttype, "Posttype is required");
    res.push(required(this.state.posttype, "Posttype is required"));
    errors["Date"] = requiredwith(
      this.state.posttype,
      this.state.scheduled_datetime,
      "Schedule date is required"
    );
    res.push(
      requiredwith(
        this.state.posttype,
        this.state.scheduled_datetime,
        "Schedule date is required"
      )
    );
    console.log(res);
    var count = countError(res);
    if (count > 0) {
      formIsValid = false;
      this.setState({ errors: errors, SideLoader: false, showbutton: true });
    }
    console.log(formIsValid);
    return formIsValid;
  }

  componentDidMount = () => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    this.postData = new FormData();
    this.setState({ user: auth.isAuthenticated().user });
    this.init();
  };
  handleChangeTips = () => {
    this.setState({ checkedTips: !this.state.checkedTips });
  };
  clickPost = () => {
    this.setState({ error: "" });
    this.setState({ errors: {}, SideLoader: true, showbutton: false });
    this.postData.set("tipsEnabled", this.state.checkedTips);
    if (this.handleValidation()) {
      var percent = 0;
      if (this.state.attachnames.length > 0) {
        intervalID = setInterval(() => {
          percent = +percent + 1 //Math.floor((Math.random() * 10) + 1);
          percent = percent <= 100 ? percent : 100
          this.setState({ uploadpercent: percent })
          if (percent == 100 && this.state.response) {
            clearInterval(intervalID);
            this.uploadpercent(uploaddata)
          }
        }, 50);
      }
      const jwt = auth.isAuthenticated();
      create(
        {
          userId: jwt.user._id
        },
        {
          t: jwt.token
        },
        this.postData
      ).then(data => {
        if (data.error) {
          this.setState({
            error: data.error,
            SideLoader: false,
            showbutton: true
          });
        } else {
          uploaddata = data
          this.setState({ response: true })
          percent = 100
          if (this.state.attachnames.length == 0) {
            this.uploadpercent(uploaddata)
          }
        }
      });
    }
  };

  uploadpercent = (data) => {
    this.setState({
      text: "",
      subheading: "",
      photo: "",
      posttype: "",
      viewtype: "",
      description: "",
      categories: [],
      scheduled_datetime: "",
      showDate: false,
      error: "",
      url: "",
      attachnames: []
    });
    this.props.addUpdate(data);
    this.setState({ open: true, successMessage: `Published` });
    window.location = "/post/" + data._id;
  }
  handleChange = name => event => {
    let errors = this.state.errors;

    var value = name == "scheduled_datetime" ? event : event.target.value;
    value = name == "scheduled_datetime" ? value.toISOString() : value;
    if (value != "") {
      errors[name] = false;
      this.setState({ errors: errors });
    }
    if (
      name == "url" &&
      (value.includes("youtube") ||
        value.includes("vimeo") ||
        value.includes("youtu.be"))
    ) {
      errors["url"] = "youtube/vimeo URL Not allowed";
      this.setState({ errors: errors });
      return false;
    }

    // var value = value === 'undefined' ? '' : value
    this.postData.set(name, value);
    this.postData.set("postname", this.state.postname);
    this.setState({ [name]: value });
    setTimeout(
      function () {
        //Start the timer
        //After 1 second, set render to true
        this.postData.set("viewtype", this.state.viewtype);
        console.log(name + "-" + value);
        if (this.state.posttype == "2") {
          this.setState({ showDate: true, scheduled_datetime: new Date() });
        } else {
          this.setState({ showDate: false });
        }
      }.bind(this),
      100
    );
  };

  handleAttachChange = name => event => {
    this.setState({ choosed: false });
    let errors = this.state.errors;
    errors[name] = false;
    this.setState({ errors: errors });
    var extension = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "application/pdf",
      "audio/mp3",
      "video/mp4",
      "image/gif",
      "audio/aac",
      "audio/m4a",
      "video/mpeg",
      "audio/mpeg",
      "audio/ogg",
      "video/ogg",
      "application/ogg",
      "audio/wav",
      "audio/x-ms-wma",
      "audio/x-m4a",
      "audio/x-wav",
      "application/octet-stream",
      "application/epub+zip"
    ];
    let attachments = Array.from(event.target.files);
    console.log(attachments);
    var attachcount = attachments.length;
    console.log(attachcount);
    attachcount = this.state.attachnames.length + attachcount;
    if (attachcount > 5) {
      errors["attach"] = "Sorry, you can't upload more than 5 attachments";
      this.setState({ errors: errors });
      document.getElementById("icon-button-file-attach").value = "";
      return false;
    }
    if (attachcount <= 5 && attachcount > 0) {
      var attachname = [];
      var count = this.state.attachnames.length;
      for (var i = 0; i < attachcount - this.state.attachnames.length; i++) {
        console.log(event.target.files[i].size);
        if (event.target.files[i].size > 210000000) {
          errors["attach"] = "File is too large. Max size is 200 MB";
          this.setState({ errors: errors });
          this.setState({ [name]: "" });
          document.getElementById("icon-button-file-attach").value = "";
          return false;
        }
        if (!extension.includes(event.target.files[i].type)) {
          errors["attach"] =
            "This file type is invalid. For valid file formats check Help page.";
          this.setState({ errors: errors });
          this.setState({ [name]: "" });
          document.getElementById("icon-button-file-attach").value = "";
          return false;
        }
        attachname[i] = event.target.files[i].name;
        this.postData.set(name + count, event.target.files[i]);
        count++;
      }
      var joined = this.state.attachnames.concat(attachname);
      this.setState({ attachnames: joined });
      this.postData.set("attachcount", attachcount);
      //attachname = ltrim(attachname,",");
      console.log(attachments);
      // const value = attachname//event.target.files[0]
      // this.postData.set(name, attachments)
      console.log(attachcount + " Files");
      this.setState({ [name]: attachcount + " Files" });
      console.log(attachcount + " Files");
    }
    document.getElementById("icon-button-file-attach").value = "";
  };

  handleRequestClose = (event, reason) => {
    this.setState({ open: false });
  };

  handleAttachRemove = (attachId, attchName) => {
    var index = this.state.attachnames.indexOf(attchName);
    if (index > -1) {
      this.state.attachnames.splice(index, 1);
    }
    this.setState({ attachnames: this.state.attachnames });
    this.postData.delete(["attach" + attachId]);
    if (this.state.attachnames.length == 0) {
      this.setState({ choosed: true });
    }
  };

  handleType = index => {
    let errors = this.state.errors;
    index = index + 1;
    this.postData.set("posttype", index);
    this.setState({ posttype: index });
    if (index != 2) {
      errors["Date"] = false;
      this.setState({ errors: errors });
    }

    console.log("index" + index);
  };

  handleDate = date => {
    let errors = this.state.errors;
    date = date.toISOString();
    this.postData.set("scheduled_datetime", date);
    this.setState({ scheduled_datetime: date });
    if (date != "") {
      errors["Date"] = false;
      this.setState({ errors: errors });
    }
    console.log("index" + date);
  };

  render() {
    if (this.state.invalid) {
      return <Fourzerofour />;
    }
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Card className={"cardcustom"}>
          <div className={"upload-back"}><CustomBack class={"fal fa-chevron-left"} backlink={"createpost"} />
            <CardHeader title="Link" className={"cardheadercustom"} />
            {/*avatar={
              <Avatar src={'/api/users/photo/'+this.state.user._id}/>
            } */}
          </div>
          <CardContent className={"cardcontentcustom"}>
            <div className={"maininner"}>
              <div className={"input-div"}>
                <Typography component="div" className={"form-label"}>
                  Title
                </Typography>
                <TextField
                  id="standard-full-width"
                  placeholder="Write Something.."
                  fullWidth
                  value={this.state.text}
                  onChange={this.handleChange("text")}
                  className={"textFieldforms"}
                  margin="normal"
                  autoComplete="off"
                  InputLabelProps={{
                    shrink: true
                  }}
                  InputProps={{
                    disableUnderline: true,
                    classes: { input: this.props.classes["input"] }
                  }}
                />
                {this.state.errors["text"] && (
                  <Typography
                    component="p"
                    color="error"
                    className={"error-input"}
                  >
                    <Icon color="error" className={classes.error}>
                      error
                    </Icon>
                    {this.state.errors["text"]}
                  </Typography>
                )}
              </div>
              <div className={"input-div "}>
                <Typography component="div" className={"form-label"}>
                  Description
                </Typography>
                <TextField
                  id="standard-full-width"
                  style={{ margin: 0 }}
                  placeholder="Write Something..."
                  fullWidth
                  value={this.state.description}
                  onChange={this.handleChange("description")}
                  className={classes.textField}
                  margin="normal"
                  multiline
                  rows="8"
                  autoComplete="off"
                  InputLabelProps={{
                    shrink: true
                  }}
                  InputProps={{
                    disableUnderline: true,
                    classes: { input: this.props.classes["input"] },
                    style: {
                      padding: 0
                    }
                  }}
                />
                <TextField
                  id="standard-full-width"
                  placeholder="Type Or paste link here"
                  fullWidth
                  value={this.state.url}
                  onChange={this.handleChange("url")}
                  className={"imageurl link-urladd"}
                  margin="normal"
                  autoComplete="off"
                  InputLabelProps={{
                    shrink: true
                  }}
                  InputProps={{
                    disableUnderline: true,
                    classes: { input: this.props.classes["input"] }
                  }}
                />
                {this.state.errors["url"] && (
                  <Typography
                    component="p"
                    color="error"
                    className={"error-input"}
                  >
                    {/* <Icon color="error" className={classes.error}>error</Icon> */}
                    <Icon color="error" className={classes.error}>
                      error
                    </Icon>
                    {this.state.errors["url"]}
                  </Typography>
                )}
                {this.state.errors["invalidlink"] && (
                  <Typography
                    component="p"
                    color="error"
                    className={"error-input"}
                  >
                    <Icon color="error" className={classes.error}>
                      error
                    </Icon>
                    {this.state.errors["invalidlink"]}
                  </Typography>
                )}
              </div>
              <div className="input-div">
                <div className={"attached-img"}>
                  <Typography component="div" className={"headsec form-label"}>
                    Attachment
                  </Typography>
                  <div className={"img-example"}>
                    <span className={"upload-i"}>
                      <img src="../dist/svg_icons/upload.svg" />
                      Upload
                    </span>
                    <input
                      accept="audio/*|image/*|video/*|application/*"
                      onChange={this.handleAttachChange("attach")}
                      className={classes.input}
                      id="icon-button-file-attach"
                      type="file"
                      multiple
                    />
                  </div>
                </div>
                {(this.state.choosed == false ||
                  this.state.error.length > 0 ||
                  this.state.errors.length > 0) && (
                    <div className={"img-holder"}>
                      {this.state.attachnames.map((item, i) => {
                        return (
                          <p className={"img-holder-content"} key={i}>
                            {" "}
                            <span>{item}</span>{" "}
                            <i
                              className={"fal fa-times"}
                              onClick={() => this.handleAttachRemove(i, item)}
                            ></i>{" "}
                          </p>
                        );
                      })}
                      {this.state.choosed && (
                        <p className={"img-holder-content"}> </p>
                      )}
                      {this.state.errors["attach"] && (
                        <Typography
                          component="p"
                          color="error"
                          className={"error-input"}
                        >
                          <Icon color="error" className={classes.error}>
                            error
                        </Icon>
                          {this.state.errors["attach"]}
                        </Typography>
                      )}
                    </div>
                  )}
              </div>
              {/* <label className={"textname"}>Categories</label>
       <Select
          multiple
          fullWidth
		  disableUnderline={true} 
           value={this.state.categories}
         onChange={this.handleChange('categories')}
          inputProps={{
            id: 'select-multiple-native',
          }}
		className={"inputsel"}
MenuProps=
{{
classes: { paper: classes.dropdownStyle },
getContentAnchorEl: null,
anchorOrigin: {
vertical: "bottom",
horizontal: "left",
}
}}
        >
          {this.state.names.map(name => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </Select> */}
            </div>{" "}
            {auth.isAuthenticated().user.creator == 0 && (
              <Typography component="div" className={"add-creator input-div"}>
                <CustomMessage
                  message="To enable tips and subscription on your profile sign up to become a creator"
                  link={true}
                  linkurl={
                    "../becomecreator/" + auth.isAuthenticated().user._id
                  }
                  linkmessage="Become a creator"
                />
              </Typography>
            )}
            {auth.isAuthenticated().user.stanEnabled == false &&
              auth.isAuthenticated().user.creator == 1 && (
                <Typography component="div" className={"add-creator input-div"}>
                  <CustomMessage
                    message="To decide who can see this post"
                    link={true}
                    linkurl={"../creatorspace/"}
                    linkmessage="enable the Stan button"
                  />
                </Typography>
              )}
            <fieldset>
              <div>
                <Typography component="div" className={"form-label"}>
                  Who can see this post ?
                </Typography>
                <div className={"bottominner"}>
                  <RadioGroup
                    aria-label="gender"
                    name="gender1"
                    value={this.state.viewtype}
                    onChange={this.handleChange("viewtype")}
                    className={"radio-uploads"}
                  >
                    <FormControlLabel
                      value="public"
                      control={<Radio />}
                      label="Public"
                    />
                    <FormControlLabel
                      value="stans"
                      control={<Radio />}
                      label="Stans Only"
                      disabled={
                        auth.isAuthenticated().user.creator == 0 ||
                        auth.isAuthenticated().user.stanEnabled == false
                      }
                    />
                  </RadioGroup>

                  {/* <div className={"input1"}> <input type="radio" value="public" fullWidth
                  checked={this.state.viewtype === "public"}
                  onChange={this.handleChange('viewtype')} /> Public</div>
                <div className={"input1"}>  <input type="radio" value="stans" fullWidth
                  checked={this.state.viewtype === "stans"}
                  onChange={this.handleChange('viewtype')} /> Stans Only</div> */}
                </div>

                {this.state.errors["viewtype"] && (
                  <Typography
                    component="p"
                    color="error"
                    className={"error-input"}
                  >
                    <Icon color="error" className={classes.error}>
                      error
                    </Icon>
                    {this.state.errors["viewtype"]}
                  </Typography>
                )}
              </div>
            </fieldset>
            <fieldset
              disabled={
                (auth.isAuthenticated().user.creator == 0 &&
                  auth.isAuthenticated().user.stanEnabled == false) ||
                auth.isAuthenticated().user.creator == 0
              }
            >
              <div className="input-div enable-contain">
                <Typography component="div" className={"form-label"}>
                  Do you want to receive tips on this post?
                </Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.state.checkedTips}
                      onChange={this.handleChangeTips}
                      value={this.state.checkedTips}
                      color="primary"
                      className={"enable-tips"}
                    />
                  }
                  label="Add tip to post"
                />
              </div>
            </fieldset>
            <div className={"publishtext"}>
              {this.state.SideLoader && <SideLoader uploadpercent={this.state.uploadpercent} />}
              {this.state.showbutton &&
                <SplitButton
                  onType={this.handleType}
                  onDate={this.handleDate}
                  onClick={this.clickPost}
                />
              }
              {this.state.errors["posttype"] && (
                <Typography
                  component="p"
                  color="error"
                  className={"error-input"}
                >
                  {this.state.errors["posttype"]}
                </Typography>
              )}
              {/*this.state.showDate ? <TextField
                id="datetime-local"
                label="Schedule"
                type="datetime-local"
                onChange={this.handleChange('scheduled_datetime')}
                className={"schedule-time"}
                InputLabelProps={{
                  shrink: true,
                }}

                InputProps={{
                  disableUnderline: true, classes: { input: this.props.classes['input'] }, style: {
                    padding: 0
                  }
                }}
              />
              : null*/}
              {this.state.showDate ? (
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <div className={"picker-container"}>
                    <KeyboardDatePicker
                      id="date-picker-dialog"
                      format="MM/dd/yyyy"
                      value={this.state.scheduled_datetime}
                      onChange={this.handleChange("scheduled_datetime")}
                      KeyboardButtonProps={{
                        "aria-label": "change date"
                      }}
                      InputProps={{
                        disableUnderline: true
                      }}
                      className={"month-picker"}
                    />
                    <KeyboardTimePicker
                      id="time-picker"
                      value={this.state.scheduled_datetime}
                      onChange={this.handleChange("scheduled_datetime")}
                      KeyboardButtonProps={{
                        "aria-label": "change time"
                      }}
                      className={"time-picker"}
                      InputProps={{
                        disableUnderline: true
                      }}
                    />
                  </div>
                </MuiPickersUtilsProvider>
              ) : null}
              {this.state.errors["Date"] && (
                <Typography
                  component="p"
                  color="error"
                  className={"error-input"}
                >
                  {this.state.errors["Date"]}
                </Typography>
              )}
            </div>
            {this.state.error && (
              <Typography component="p" color="error" className={"error-input"}>
                {this.state.error}
              </Typography>
            )}
          </CardContent>
        </Card>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right"
          }}
          open={this.state.open}
          onClose={this.handleRequestClose}
          autoHideDuration={6000}
          message={
            <span className={classes.snack}>{this.state.successMessage}</span>
          }
        />
      </div>
    );
  }
}

NewLink.propTypes = {
  classes: PropTypes.object.isRequired,
  addUpdate: PropTypes.func.isRequired
};

export default withStyles(styles)(NewLink);
