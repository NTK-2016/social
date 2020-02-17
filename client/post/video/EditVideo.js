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
import PhotoCamera from "material-ui-icons/PhotoCamera";
import Videocam from "material-ui-icons/Videocam";
//import Radio from 'material-ui/Radio'
import Select from "material-ui/Select";
import Snackbar from "material-ui/Snackbar";
import { readpost, updatepost, readcategory } from "./../api-post.js";
import Preview from "./../../common/Preview";
import SplitButton from "../../common/SplitButton";
import {
  required,
  requiredwith,
  requiredwithblank,
  countError,
  validateurl,
  validatelink
} from "./../../common/ValidatePost";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import SideLoader from "./../../common/SideLoader";
import CustomMessage from "./../../common/CustomMessage";
import CustomButton from "./../../common/CustomButton";
import CustomBack from "./../../common/CustomBack";
import "date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker
} from "@material-ui/pickers";

import DateFnsUtils from "@date-io/date-fns";
import Checkbox from "@material-ui/core/Checkbox";
import DeleteForeverOutlinedIcon from "@material-ui/icons/DeleteForeverOutlined";
import CustomLoader from "./../../common/CustomLoader";
import Fourzerofour from "./../../common/404";

const styles = theme => ({});

const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

var names = [];
var intervalID = "";
var uploaddata = "";
class EditArticle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      subheading: "",
      video: "",
      url: "",
      posttype: "1",
      viewtype: "public",
      categories: [],
      names: [],
      postname: "video",
      error: "",
      errors: {},
      id: "",
      open: false,
      showDate: false,
      scheduled_datetime: "",
      SideLoader: false,
      showbutton: true,
      checkedTips: false,
      videochoosed: false,
      urlchoosed: false,
      CustomLoader: true,
      invalid: false,
      response: false,
      uploadpercent: 0
    };
    // this.match = match
    // console.log("post ID 3:"+this.props.postId)
  }

  init = () => {};
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
    errors["video"] = requiredwithblank(
      this.state.video,
      this.state.url,
      "Video is required"
    );
    res.push(
      requiredwithblank(this.state.video, this.state.url, "Video is required")
    );
    errors["viewtype"] = required(this.state.viewtype, "Viewtype is required");
    res.push(required(this.state.viewtype, "Viewtype is required"));
    errors["posttype"] = required(this.state.posttype, "Posttype is required");
    res.push(required(this.state.posttype, "Posttype is required"));
    // errors["url"] = required(this.state.url,"URL is Required")
    // res.push(required(this.state.url,"URL is Required"))
    errors["url"] = validatelink(this.state.url, "Invalid URL");
    res.push(validatelink(this.state.url, "Invalid URL"));
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
        console.log(data);
        var inputInUtc = data.scheduled_datetime;
        var dateInUtc = new Date(inputInUtc);
        var dateInLocalTz = this.convertUtcToLocalTz(dateInUtc);
        var scheduled_datetime = dateInLocalTz.toISOString().substr(0, 16);
        var videocount = "";
        if (data.video) {
          if (data.video.indexOf(",") > 0) {
            var videoarray = data.video.split(",");
            videocount = videoarray.length;
            videocount = videocount + " files";
          } else {
            videocount = "1 file";
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
        if (data.photo != "") {
          this.setState({ showImage: true });
        }
        var url = "";
        if (data.url && data.video == "") {
          url = data.url;
          this.setState({ urlchoosed: true });
        }
        var video = "";
        if (data.url && data.video != "") {
          video = data.url;
          this.setState({ videochoosed: true });
        }
        // console.log(data.subheading)
        // this.postData.set("categories", data.categories)
        // this.postData.set("viewtype", data.viewtype)
        // this.postData.set("posttype", data.posttype)
        // this.postData.set("url", data.url)
        // var cat = data.categories.split(',')
        // console.log(cat)
        this.setState({
          id: data._id,
          categories: cat,
          viewtype: data.viewtype,
          posttype: data.posttype,
          scheduled_datetime: scheduled_datetime,
          url: url,
          text: data.text,
          subheading: data.subheading,
          video: video,
          videocount: videocount,
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
        //names.shift()
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
  clickPost = () => {
    this.setState({ error: "" });
    this.setState({ errors: {}, SideLoader: true, showbutton: false });
    this.postData.set("tipsEnabled", this.state.checkedTips);
    if (this.handleValidation()) {
      const jwt = auth.isAuthenticated();
      const user = {
        text: this.state.text || undefined,
        subheading: this.state.subheading || undefined,
        description: this.state.description || undefined,
        categories: this.state.categories || undefined,
        viewtype: this.state.viewtype || undefined,
        posttype: this.state.posttype || undefined
      };
      var percent = 0;
      if (this.state.video) {
        intervalID = setInterval(() => {
          percent = +percent + 1;
          percent = percent <= 100 ? percent : 100;
          this.setState({ uploadpercent: percent });
          if (percent == 100 && this.state.response) {
            clearInterval(intervalID);
            this.uploadpercent(uploaddata);
          }
        }, 500);
      }
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
          uploaddata = data;
          this.setState({ response: true });
          percent = 100;
          if (!this.state.video) {
            this.setState({ SideLoader: false, showbutton: true });
            // this.setState({text:'', photo: '',posttype: '',viewtype: '',description: '',categories: ''})
            //this.props.addUpdate(data)
            this.setState({
              open: true,
              successMessage: `Updated Successfully!`
            });
            window.location = "/post/" + data._id;
          }
        }
      });
    }
  };

  uploadpercent = data => {
    this.setState({ SideLoader: false, showbutton: true });
    // this.setState({text:'', photo: '',posttype: '',viewtype: '',description: '',categories: ''})
    //this.props.addUpdate(data)
    this.setState({
      open: true,
      successMessage: `Updated Successfully!`
    });
    window.location = "/post/" + data._id;
  };
  handleChange = name => event => {
    let errors = this.state.errors;
    if (name === "video") {
      console.log(event.target.files[0].type);
      var extension = [
        "video/avi",
        "video/mp4",
        "video/mov",
        "video/mpeg",
        "video/quicktime"
      ];
      if (event.target.files[0].size > 10500000) {
        errors["video"] = "Invalid File size, allowed 10 MB only";
        this.setState({ errors: errors });
        //this.setState({error:  })
        return false;
      }
      if (!extension.includes(event.target.files[0].type)) {
        errors["video"] = "Invalid File Type, only Allowed video/mp4";
        this.setState({ errors: errors });
        // this.setState({error:  })
        return false;
      }
    }

    var value =
      name === "video"
        ? event.target.files[0]
        : name == "scheduled_datetime"
        ? event
        : event.target.value;
    value = name == "scheduled_datetime" ? value.toISOString() : value;
    if (value != "") {
      errors[name] = false;
      this.setState({ errors: errors });
    }
    // const value = name === "video" ? event.target.files[0] : event.target.value;

    // const video = name === "video" ? event.target.files[0] : event.target.value;
    this.postData.set(name, value);
    this.setState({ [name]: value });
    // name === "video"
    //   ? this.postData.set(name, video)
    //   : this.postData.set(name, value);

    // name === "video"
    //   ? this.setState({ [name]: video })
    //   : this.setState({ [name]: value });

    const removevideo =
      this.state.url != "" ? this.postData.set("video", "") : "";

    const did = name === "url" ? this.postData.set("video", "") : "";

    this.postData.set("postname", this.state.postname);
    setTimeout(
      function() {
        //Start the timer
        //After 1 second, set render to true
        this.postData.set("viewtype", this.state.viewtype);
        console.log(name + "-" + audio);
        console.log(name + "- p " + value);
        if (this.state.posttype == "2") {
          this.setState({ showDate: true, scheduled_datetime: new Date() });
        } else {
          this.setState({ showDate: false });
        }
      }.bind(this),
      100
    );
    if (value != "" && (name == "video" || name == "url")) {
      name == "video"
        ? this.setState({ videochoosed: true })
        : this.setState({ urlchoosed: true });
    } else if (name == "video" || name == "url") {
      name == "video"
        ? this.setState({ videochoosed: false })
        : this.setState({ urlchoosed: false });
    }
    if (name === "url") {
      if (event.target.value) {
        var matches = event.target.value;
        var httpsStatus = matches.match(new RegExp(`${"https"}`, "gi"));
        if (httpsStatus) {
          if (
            !matches.includes("youtube") &&
            !matches.includes("youtu.be") &&
            !matches.includes("vimeo")
          ) {
            errors["url"] = "You can only share Youtube and Vimeo links";
            errors["video"] = "";
            this.setState({ url: "", errors: errors });
          } else {
            errors["url"] = "";
            this.setState({ errors: errors });
          }
        } else {
          errors["url"] = "You can only share Youtube and Vimeo links";
          errors["video"] = "";
          this.setState({ url: "", errors: errors });
        }
      } else {
        errors["url"] = "";
        this.setState({ errors: errors });
      }
    }
  };
  handleRequestClose = (event, reason) => {
    this.setState({ open: false });
  };

  removeFile = () => {
    document.getElementById("icon-button-file-video").value = "";
    this.setState({ video: "", url: "", videochoosed: false });
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
    if (this.state.invalid) {
      return <Fourzerofour />;
    }
    const { classes } = this.props;
    if (this.state.CustomLoader) {
      return <CustomLoader />;
    }
    if (!this.state.CustomLoader) {
      return (
        <div className={classes.root}>
          <Card className={"cardcustom"}>
            <div className={"upload-back"}>
              <CustomBack
                class={"fal fa-chevron-left"}
                backlink={"createpost"}
              />
              <CardHeader title="Edit Video" className={"cardheadercustom"} />
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
                    fullwidth
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
                    {/** <Typography variant="span" component="span" className={"gray-9 disinline"}>(Optional)</Typography>**/}
                  </Typography>
                  <TextField
                    id="standard-full-width"
                    placeholder="Write Something.."
                    fullWidth
                    multiline
                    rows="8"
                    value={this.state.subheading}
                    onChange={this.handleChange("subheading")}
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
                </div>
                <Typography component="div" className={"form-label"}>
                  Video
                </Typography>
                <div className={"input-div"}>
                  <div className={"audio-container"}>
                    <fieldset
                      className={"audio-continner1"}
                      disabled={this.state.urlchoosed}
                    >
                      {!this.state.video && (
                        <div>
                          <span>Drag and drop video here</span>
                          <span>or</span>
                          <span className="upload-text">Upload</span>
                          <p className={"support-ct"}>
                            supported video <br />
                            avi, mp4, mov, mpeg
                          </p>
                        </div>
                      )}
                      <input
                        onChange={this.handleChange("video")}
                        className={classes.input}
                        id="icon-button-file-video"
                        type="file"
                        accept="video/*"
                      />
                      <span className={"video-filenames"}>
                        {this.state.video.name
                          ? this.state.video.name
                          : this.state.video != ""
                          ? "1 File Uploaded"
                          : ""}
                      </span>
                      {/*
              this.state.video &&
              <video width="400" controls>
                <source src={this.state.video} type="video/mp4" />
                Your browser does not support HTML5 video.
            </video> */}
                      {this.state.video && (
                        <IconButton
                          aria-label="Edit"
                          className={"customicon-image delete-all"}
                          onClick={this.removeFile}
                        >
                          <i
                            className="fal fa-trash-alt"
                            color="secondary"
                            aria-hidden="true"
                          ></i>
                        </IconButton>
                      )}
                    </fieldset>

                    <TextField
                      id="standard-full-width"
                      style={{ margin: 0 }}
                      placeholder="Or paste video URL here"
                      fullWidth
                      value={this.state.url}
                      onChange={this.handleChange("url")}
                      className={"imageurl"}
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
                      disabled={this.state.videochoosed}
                    />
                    {/*<Preview url={this.state.url} /> */}
                  </div>
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
                  {this.state.errors["video"] && (
                    <Typography
                      component="p"
                      color="error"
                      className={"error-input"}
                    >
                      <Icon color="error" className={classes.error}>
                        error
                      </Icon>
                      {this.state.errors["video"]}
                    </Typography>
                  )}
                </div>
              </div>
              {/*
	       <Typography  component="div" className={"form-label"}>
          Categories
        </Typography> 
      <Select
          multiple
		    disableUnderline={true} 
			  className={"inputsel"}
           value={this.state.categories}
         onChange={this.handleChange('categories')}
          inputProps={{
            id: 'select-multiple-native',
          }}
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
                  <Typography
                    component="div"
                    className={"add-creator input-div"}
                  >
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
                {this.state.SideLoader && (
                  <SideLoader uploadpercent={this.state.uploadpercent} />
                )}
                {this.state.showbutton && (
                  <SplitButton
                    onType={this.handleType}
                    onDate={this.handleDate}
                    onClick={this.clickPost}
                    posttype={this.state.posttype}
                    scheduled_datetime={this.state.scheduled_datetime}
                  />
                )}
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
                <br />
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
              <CardActions className={"cardactioncustom"}>
                {/* {this.state.SideLoader && <SideLoader />} */}
                {/* {this.state.showbutton && (
                <CustomButton
                  label="Update"
                  disabled={this.state.posttype === ""}
                  onClick={this.clickPost}
                  className={"Primary_btn"}
                />
              )} */}
                {/** <Button color="primary" variant="raised" disabled={this.state.posttype === ''} onClick={this.clickPost} className={classes.submit}>UPDATE</Button>**/}
              </CardActions>
              {this.state.error && (
                <Typography
                  component="p"
                  color="error"
                  className={"error-input"}
                >
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

EditArticle.propTypes = {
  classes: PropTypes.object.isRequired,
  addUpdate: PropTypes.func.isRequired
};

export default withStyles(styles)(EditArticle);
