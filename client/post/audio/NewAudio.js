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
import Audiotrack from "material-ui-icons/Audiotrack";
//import Radio from 'material-ui/Radio'
import EditIcon from "material-ui-icons/Edit";
import Select from "material-ui/Select";
import Snackbar from "material-ui/Snackbar";
import {
  required,
  requiredwith,
  requiredwithblank,
  countError,
  validateurl,
  validateaudiourl,
  validatelink
} from "./../../common/ValidatePost";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import CustomMessage from "./../../common/CustomMessage";
import CustomButton from "./../../common/CustomButton";
import SideLoader from "./../../common/SideLoader";
import "date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker
} from "@material-ui/pickers";

import DateFnsUtils from "@date-io/date-fns";
import SplitButton from "../../common/SplitButton";
import Checkbox from "@material-ui/core/Checkbox";
import DeleteForeverOutlinedIcon from "@material-ui/icons/DeleteForeverOutlined";
import CustomBack from "./../../common/CustomBack";

const styles = theme => ({});

const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

var names = [];
var intervalID = ''
var uploaddata = ''
class NewAudio extends Component {
  constructor() {
    super();
    this.state = {
      text: "",
      subheading: "",
      audio: "",
      url: "",
      photo: "",
      attach: "",
      posttype: "1",
      viewtype: "public",
      categories: [],
      names: [],
      postname: "audio",
      error: "",
      errors: {},
      open: false,
      showDate: false,
      showImage: false, // selected image preview
      imagePath: "", // image preview path
      scheduled_datetime: new Date(),
      attachnames: [],
      choosed: true,
      SideLoader: false,
      showbutton: true,
      checkedTips: false,
      audiochoosed: false,
      urlchoosed: false,
      uploadpercent: 0,
      response: false,
    };
  }

  //async
  init = () => {
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
        var categories = [];
        for (var i = 0; i < data.length; i++) {
          if (data[i].name != undefined) {
            categories[i] = data[i].name;
          }
        }

        var categories = [].concat.apply([], categories);
        names = Array.from(new Set(categories));
        //names.shift()
        //let following = this.checkFollow(data)
      }
    });
    sleep(500).then(() => {
      this.setState({ names: names });
    });
  };

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
  handleValidation() {
    let errors = {};
    let res = [];
    let formIsValid = true;
    errors["text"] = required(this.state.text, "Title is required");
    res.push(required(this.state.text, "Title is required"));
    errors["subheading"] = required(
      this.state.subheading,
      "Description is required"
    );
    res.push(required(this.state.subheading, "Description is required"));
    errors["audio"] = requiredwithblank(
      this.state.audio,
      this.state.url,
      "Audio is required"
    );
    res.push(
      requiredwithblank(this.state.audio, this.state.url, "Audio is required")
    );
    errors["viewtype"] = required(this.state.viewtype, "Viewtype is required");
    res.push(required(this.state.viewtype, "Viewtype is required"));
    errors["posttype"] = required(this.state.posttype, "Posttype is required");
    res.push(required(this.state.posttype, "Posttype is required"));
    // errors["url"] = required(this.state.url,"URL is Required")
    // res.push(required(this.state.url,"URL is Required"))
    if (this.state.url != "") {
      errors["url"] = validatelink(this.state.url, "Invalid URL");
      res.push(validatelink(this.state.url, "Invalid URL"));
    }
    errors["Date"] = requiredwith(
      this.state.posttype,
      this.state.scheduled_datetime,
      "Schedule date is Required"
    );
    res.push(
      requiredwith(
        this.state.posttype,
        this.state.scheduled_datetime,
        "Schedule date is Required"
      )
    );
    var count = countError(res);
    if (count > 0) {
      formIsValid = false;
      this.setState({ errors: errors, SideLoader: false, showbutton: true });
    }
    return formIsValid;
  }

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
      audio: "",
      photo: "",
      posttype: "",
      viewtype: "",
      categories: [],
      scheduled_datetime: "",
      showDate: false,
      error: "",
      url: "",
      attachnames: [],
      choosed: true
    });
    this.props.addUpdate(data);
    this.setState({ open: true, successMessage: `Published ` });
    window.location = "/post/" + data._id;
  }
  handleChange = name => event => {
    // alert(name)
    let errors = this.state.errors;
    errors[name] = false;
    if (name == "url") {
      errors["audio"] = false;
    }

    this.setState({ errors: errors });
    if (name === "photo") {
      var extension = ["image/jpeg", "image/png", "image/jpg"];
      if (event.target.files[0].size > 2100000) {
        errors["photo"] = "File is too large. Max size is 2 MB";
        this.setState({ errors: errors });
        return false;
      }
      if (!extension.includes(event.target.files[0].type)) {
        errors["photo"] = "This file type is invalid. File formats allowed jpeg, png,jpg,gif.";
        this.setState({ errors: errors });
        return false;
      }
    }

    if (name === "audio") {
      var extension = ["audio/mp3", "audio/ogg", "audio/wav", "audio/mpeg", "video/ogg"];
      if (event.target.files[0].size > 10500000) {
        errors["audio"] = "File is too large. Max size is 10 MB";
        this.setState({ errors: errors });
        return false;
      }
      if (!extension.includes(event.target.files[0].type)) {
        errors["audio"] = "This file type is invalid. File formats allowed mp3, wav, ogg.";
        this.setState({ errors: errors });
        return false;
      }
    }
    var value =
      name === "photo" || name === "audio"
        ? event.target.files[0]
        : name == "scheduled_datetime"
          ? event
          : event.target.value;
    value = name == "scheduled_datetime" ? value.toISOString() : value;
    if (value != "") {
      errors[name] = false;
      this.setState({ errors: errors });
    }
    if (name == "photo") {
      this.setState({ showImage: true, imagePath: "" });
      var file = event.target.files[0];
      var reader = new FileReader();
      var url = reader.readAsDataURL(file);

      reader.onloadend = function (e) {
        this.setState({
          imagePath: [reader.result]
        });
      }.bind(this);
    }
    this.postData.set(name, value);
    this.setState({ [name]: value });
    console.log(name)
    console.log(value)
    const did = name === "url" ? this.postData.set("audio", "") : "";

    this.postData.set("postname", this.state.postname);
    setTimeout(
      function () {
        //Start the timer
        //After 1 second, set render to true
        this.postData.set("viewtype", this.state.viewtype);
        if (this.state.posttype == "2") {
          this.setState({ showDate: true, scheduled_datetime: new Date() });
        } else {
          this.setState({ showDate: false });
        }
      }.bind(this),
      100
    );
    if (value != "" && (name == "audio" || name == "url")) {
      name == "audio"
        ? this.setState({ audiochoosed: true })
        : this.setState({ urlchoosed: true });
    } else if (name == "audio" || name == "url") {
      name == "audio"
        ? this.setState({ audiochoosed: false })
        : this.setState({ urlchoosed: false });
    }
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
    //console.log(attachments);
    var attachcount = attachments.length;
    //console.log(attachcount);
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
        //console.log(event.target.files[i].size);
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
      // const value = attachname//event.target.files[0]
      // this.postData.set(name, attachments)
      this.setState({ [name]: attachcount + " Files" });
    }
    document.getElementById("icon-button-file-attach").value = "";
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

  handleRequestClose = (event, reason) => {
    this.setState({ open: false });
  };

  removeFile = () => {
    this.setState({ imagePath: "", showImage: false });
    this.postData.delete("photo");
    document.getElementById("icon-button-file").value = "";
  };

  removeAudioFile = () => {
    this.setState({ audio: "", url: "" });
    this.postData.delete("audio");
    document.getElementById("icon-button-file-audio").value = "";
    this.setState({ audiochoosed: false });
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
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Card className={"cardcustom"}>
          <div className={"upload-back"}><CustomBack class={"fal fa-chevron-left"} backlink={"createpost"} />
            <CardHeader title="Audio" className={"cardheadercustom"} />
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

              <div className={"input-div"}>
                <Typography component="div" className={"form-label"}>
                  Description
                </Typography>
                <TextField
                  id="standard-full-width"
                  placeholder="Write Something.."
                  fullWidth
                  value={this.state.subheading}
                  onChange={this.handleChange("subheading")}
                  className={"textFieldforms"}
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

                {this.state.errors["subheading"] && (
                  <Typography
                    component="p"
                    color="error"
                    className={"error-input"}
                  >
                    <Icon color="error" className={classes.error}>
                      error
                    </Icon>
                    {this.state.errors["subheading"]}
                  </Typography>
                )}
              </div>
              <div className={"input-div"}>
                <Typography component="div" className={"form-label"}>
                  Upload Image{" "}
                  <Typography

                    component="span"
                    className={"gray-9 disinline"}
                  >
                    (Optional)
                  </Typography>
                </Typography>
                <div className={"audio-container audio-uploadwork"}>
                  <div className={"audio-continner"}>
                    {!this.state.showImage && (
                      <div>
                        <span className={"black-text"}>Upload </span>
                        <span>or</span>
                        <span>drop here</span>
                        <span className={"right-text"}></span>
                        <p className={"support-ct"}>
                          supported formats <br />
                          png, jpg, gif
                        </p>
                      </div>
                    )}
                    <input
                      accept="image/*"
                      onChange={this.handleChange("photo")}
                      className={classes.input}
                      id="icon-button-file"
                      type="file"
                      multiple
                    />

                    <span className={classes.filename}>
                      {/*this.state.photo ? this.state.photo.name : ''*/}
                    </span>
                    {this.state.showImage && (
                      <div className={classes.photo}>
                        <img
                          className={classes.media}
                          src={this.state.imagePath}
                          style={{ width: "100%" }}
                        />
                      </div>
                    )}
                    {this.state.showImage && (
                      <IconButton
                        aria-label="Edit"
                        className={"customicon-image delete-all"}
                        onClick={this.removeFile}
                      >
                        <i
                          className={"fal fa-trash-alt"}
                          color="secondary"
                          aria-hidden="true"
                        ></i>
                      </IconButton>
                    )}
                  </div>

                </div>
                {this.state.errors["photo"] && (
                  <Typography
                    component="p"
                    color="error"
                    className={"error-input"}
                  >
                    <Icon color="error" className={classes.error}>
                      error
                      </Icon>
                    {this.state.errors["photo"]}
                  </Typography>
                )}
              </div>
              <div className={"input-div"}>
                <Typography component="div" className={"form-label"}>
                  Audio
                </Typography>

                <div className={"audio-container"}>
                  <fieldset
                    className={"audio-continner1"}
                    disabled={this.state.urlchoosed}
                  >
                    {!this.state.audio && (
                      <div>
                        <span>Drag and drop audio here</span>
                        <span>or</span>
                        <span className="upload-text">Upload</span>
                        <p className={"support-ct"}>
                          supported formats <br />
                          mp3, wav, ogg
                        </p>
                      </div>
                    )}
                    <input
                      accept="audio/*"
                      onChange={this.handleChange("audio")}
                      className={classes.input}
                      id="icon-button-file-audio"
                      type="file"
                    />
                    <span className={classes.audiofilename}>
                      {this.state.audio && (
                        <div className={classes.photo}>
                          <Typography component="div" className={"form-label"}>
                            {this.state.audio.name}
                          </Typography>
                        </div>
                      )}
                    </span>

                    {this.state.audio && (
                      <IconButton
                        aria-label="Edit"
                        className={"customicon-image delete-all"}
                        onClick={this.removeAudioFile}
                      >
                        <i
                          className={"fal fa-trash-alt"}
                          color="secondary"
                          aria-hidden="true"
                        ></i>
                      </IconButton>
                    )}
                  </fieldset>
                  <TextField
                    id="standard-full-width"
                    style={{ margin: 0 }}
                    placeholder="Or paste audio URL here"
                    fullWidth
                    value={this.state.url}
                    onChange={this.handleChange("url")}
                    className={"audiourl"}
                    margin="normal"
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
                    disabled={this.state.audiochoosed}
                  />
                </div>
                {this.state.errors["audio"] && (
                  <Typography
                    component="p"
                    color="error"
                    className={"error-input"}
                  >
                    <Icon color="error" className={classes.error}>
                      error
                    </Icon>
                    {this.state.errors["audio"]}
                  </Typography>
                )}
                {this.state.errors["url"] && (
                  <Typography
                    component="p"
                    color="error"
                    className={"error-input"}
                  >
                    <Icon color="error" className={classes.error}>
                      error
                    </Icon>
                    {this.state.errors["url"]}
                  </Typography>
                )}
              </div>
              <div className={"attached-img"}>
                <Typography component="div" className={"headsec form-label"}>
                  Attachments
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
              {/* <Typography  component="div" className={"form-label"}>
          Categories
        </Typography> 
       <Select
          multiple
		  disableUnderline={true} 
          fullWidth
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
            </div>
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
                  <Icon color="error" className={classes.error}>
                    error
                  </Icon>
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
                  <Icon color="error" className={classes.error}>
                    error
                  </Icon>
                  {this.state.errors["Date"]}
                </Typography>
              )}
            </div>
            {this.state.error && (
              <Typography component="p" color="error" className={"error-input"}>
                <Icon color="error" className={classes.error}>
                  error
                </Icon>
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

NewAudio.propTypes = {
  classes: PropTypes.object.isRequired,
  addUpdate: PropTypes.func.isRequired
};

export default withStyles(styles)(NewAudio);
