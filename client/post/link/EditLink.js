import React, { Component } from "react";
import Card, { CardHeader, CardContent, CardActions } from "material-ui/Card";
import Button from "material-ui/Button";
import TextField from "material-ui/TextField";
import Typography from "material-ui/Typography";
import Avatar from "material-ui/Avatar";
import Icon from "material-ui/Icon";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import auth from "./../../auth/auth-helper";
import IconButton from "material-ui/IconButton";
import AttachFile from "material-ui-icons/AttachFile";
//import Radio from 'material-ui/Radio'
import Select from "material-ui/Select";
import Snackbar from "material-ui/Snackbar";
import { readpost, updatepost, readcategory } from "./../api-post.js";
import {
  required,
  countError,
  validatelink,
  requiredwith
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
import Checkbox from "@material-ui/core/Checkbox";
import SplitButton from "../../common/SplitButton";
import CustomLoader from "./../../common/CustomLoader";
import CustomBack from "./../../common/CustomBack";
import Fourzerofour from "./../../common/404";
const styles = theme => ({});

const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

var names = [];
var intervalID = ''
var uploaddata = ''
class EditImage extends Component {
  constructor(props) {
    super(props);
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
      scheduled_datetime: "",
      attachnames: [],
      choosed: true,
      SideLoader: false,
      showbutton: true,
      removeAttach: [],
      checkedTips: false,
      CustomLoader: true,
      newattachnames: [],
      invalid: true,
      uploadpercent: 0,
      response: false,
    };
    // this.match = match
    // console.log("post ID 3:"+this.props.postId)
  }

  init = () => { };
  // state = {
  //   text: '',
  //   photo: '',
  //   posttype: '',
  //   viewtype: '',
  //   description: '',
  //   categories: '',
  //   error: '',
  //   user: {},
  //   open: false
  // }

  componentDidMount = () => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    this.postData = new FormData();
    //this.setState({user: auth.isAuthenticated().user})
    console.log("post ID 2 :" + this.props.postId);
    const jwt = auth.isAuthenticated();
    // console.log("jwt "+jwt.token)
    readpost(
      {
        postId: this.props.postId,
        id: jwt.user._id
      },
      { t: jwt.token }
    ).then(data => {
      if (data.error) {
        this.setState({ error: data.error, invalid: true });
      } else {
        var inputInUtc = data.scheduled_datetime;
        var dateInUtc = new Date(inputInUtc);
        //Print date in UTC time
        //console.log("Date in UTC : " + dateInUtc.toISOString()+"<br>");
        var dateInLocalTz = this.convertUtcToLocalTz(dateInUtc);
        //Print date in local time
        //console.log("Date in Local : " + dateInLocalTz.toISOString());
        var scheduled_datetime = dateInLocalTz.toISOString().substr(0, 16);
        console.log(data.categories);
        console.log(data.subheading);
        // this.postData.set("text", data.text)
        // this.postData.set("description", data.description)
        // this.postData.set("categories", data.categories)
        // this.postData.set("viewtype", data.viewtype)
        // this.postData.set("posttype", data.posttype)
        // this.postData.set("url", data.url)
        var attachcount = "";
        if (data.attach) {
          if (data.attach.indexOf(",") > 0) {
            var attacharray = data.attach.split(",");
            attacharray = attacharray.filter(Boolean);
            this.setState({ attachnames: attacharray });
            this.setState({ choosed: false });
            for (var i = 0; i < attacharray.length; i++) {
              this.postData.set("attach" + i, attacharray[i]);
            }
            attachcount = attacharray.length;
            attachcount = attachcount + " files";
          } else {
            attachcount = "1 file";
            var attacharray = [];
            attacharray.push(data.attach);
            this.setState({ attachnames: attacharray });
            this.setState({ choosed: false });
            for (var i = 0; i < attacharray.length; i++) {
              this.postData.set("attach" + i, attacharray[i]);
            }
          }
        }
        // if (data.posttype == "2") {
        //   this.setState({ showDate: true });
        // } else {
        //   this.setState({ showDate: false });
        // }
        var cat = [];
        if (data.categories) {
          cat = data.categories.split(",");
        }
        this.setState({
          id: data._id,
          text: data.text,
          description: data.description,
          categories: cat,
          viewtype: data.viewtype,
          posttype: data.posttype,
          url: data.url,
          scheduled_datetime: scheduled_datetime,
          attach: attachcount,
          checkedTips: data.tipsEnabled,
          CustomLoader: false
        });
      }
    });
    //const jwt = auth.isAuthenticated()
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
            categories[i] = data[i].name; //.split(',');
          }
        }

        var categories = [].concat.apply([], categories);
        names = Array.from(new Set(categories));
        // names.shift()
      }
    });
    sleep(500).then(() => {
      this.setState({ names: names });
      console.log(names);
      console.log("finish");
    });
  };
  handleChangeTips = () => {
    this.setState({ checkedTips: !this.state.checkedTips });
  };
  convertUtcToLocalTz(dateInUtc) {
    //Convert to local timezone
    return new Date(
      dateInUtc.getTime() - dateInUtc.getTimezoneOffset() * 60 * 1000
    );
  }
  handleValidation() {
    let errors = {};
    let res = [];
    let formIsValid = true;
    errors["text"] = required(this.state.text, "Title is required");
    res.push(required(this.state.text, "Title is required"));
    errors["link"] = required(this.state.url, "Link is required");
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
        }, 10);
      }
      const jwt = auth.isAuthenticated();
      const user = {
        text: this.state.text || undefined,
        subheading: this.state.subheading || undefined,
        description: this.state.description || undefined,
        categories: this.state.categories || undefined,
        viewtype: this.state.viewtype || undefined,
        posttype: this.state.posttype || undefined
      };
      updatepost(
        {
          postId: this.state.id
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
    //this.setState({id: data._id})
    // this.setState({text:'', photo: '',posttype: '',viewtype: '',description: '',categories: ''})
    //this.props.addUpdate(data)

    this.setState({
      open: true,
      successMessage: `Updated Successfully!`
    });
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
      value.includes("youtube") ||
      value.includes("vimeo") ||
      value.includes("youtu.be")
    ) {
      errors["url"] = "youtube/Vimeo URL Not allowed";
      this.setState({ errors: errors });
    }

    this.postData.set(name, value);

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
    // for (var i = 0; i < 5; i++) {
    //   this.postData.delete(["attach" + i]);
    // }
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
    var arr = this.state.attachnames.filter(Boolean);
    console.log(arr);
    attachcount = arr.length + attachcount + this.state.newattachnames.length;
    var minus = arr.length + this.state.newattachnames.length;
    if (attachcount > 5) {
      errors["attach"] = "Sorry, you can't upload more than 5 attachments";
      this.setState({ errors: errors });
      document.getElementById("icon-button-file-attach").value = "";
      return false;
    }
    if (attachcount <= 5 && attachcount > 0) {
      var attachname = [];
      var count = minus
      for (var i = 0; i < attachcount - minus; i++) {
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
        if (attachname[i] != "") {
          attachname[i] = event.target.files[i].name;
          for (var j = 0; j < 5; j++) {
            console.log("Get Value Of attach012345**");
            console.log(this.postData.get(["attach" + j]));
            if (this.postData.get(["attach" + j]) == null) {
              console.log("Set to postdata:", name + j);
              this.postData.set(name + j, event.target.files[i]);
              break;
            }
          }
        }
      }
      var joined = this.state.newattachnames.concat(attachname);
      this.setState({ newattachnames: joined });
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
  handleAttachRemove = (attachId, attchName) => {
    var index = this.state.attachnames.indexOf(attchName);
    if (index > -1) {
      this.state.attachnames[index] = "";
      //this.state.attachnames.splice(index, 1);
      /* image push to Unlink image */
      this.state.removeAttach.push(attchName);
      /* End Unlink Image */
    }
    this.setState({
      attachnames: this.state.attachnames
    });
    this.postData.delete(["attach" + attachId]);
    /* Start Unlink image */
    if (this.state.removeAttach.length > 0) {
      console.log(this.state.removeAttach);
      this.postData.set("removeAttach", this.state.removeAttach);
    }
    /* End Unlink Image */
    if (this.state.attachnames.length == 0) {
      this.setState({
        choosed: true
      });
    }
    var index = this.state.newattachnames.indexOf(attchName);
    if (index > -1) {
      this.state.newattachnames.splice(index, 1);
    }
    console.log("newattachnames", this.state.newattachnames);
    this.setState({ newattachnames: this.state.newattachnames });
  };
  handleRequestClose = (event, reason) => {
    this.setState({ open: false });
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
    if (this.state.CustomLoader) {
      return <CustomLoader />
    }
    if (!this.state.CustomLoader) {
      return (
        <div className={classes.root}>
          <Card className={"cardcustom"}>
            <div className={"upload-back"}><CustomBack class={"fal fa-chevron-left"} backlink={"createpost"} />
              <CardHeader title="Edit Link" className={"cardheadercustom"} />
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
                    placeholder="Write Something..."
                    fullWidth
                    value={this.state.description}
                    multiline
                    rows="8"
                    onChange={this.handleChange("description")}
                    className={classes.textField}
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
                    placeholder="Or paste link here"
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
                            {item != "" && <span>Attachment {i + 1}</span>}
                            {item != "" && (
                              <i
                                className={"fal fa-times"}
                                onClick={() => this.handleAttachRemove(i, item)}
                              ></i>
                            )}{" "}
                          </p>
                        );
                      })}
                      {this.state.newattachnames.map((item, i) => {
                        return (
                          <p className={"img-holder-content"} key={i}>
                            {item != "" && <span>{item}</span>}
                            {item != "" && (
                              <i
                                className={"fal fa-times"}
                                onClick={() => this.handleAttachRemove(i, item)}
                              ></i>
                            )}{" "}
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
          fullWidth
		  disableUnderline={true} 
           value={this.state.categories}
         onChange={this.handleChange('categories')}
          inputProps={{
            id: 'select-multiple-native',
          }}
			Name={"inputsel"}
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
            <option key={name} value={name} selected={this.state.categories.includes(name)}>
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
                    posttype={this.state.posttype}
                    scheduled_datetime={this.state.scheduled_datetime}
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
}

EditImage.propTypes = {
  classes: PropTypes.object.isRequired,
  addUpdate: PropTypes.func.isRequired
};

export default withStyles(styles)(EditImage);
