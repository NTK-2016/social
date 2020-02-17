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
import EditIcon from "material-ui-icons/Edit";
import IconButton from "material-ui/IconButton";
import AttachFile from "material-ui-icons/AttachFile";
//import Radio from 'material-ui/Radio'
import Select from "material-ui/Select";
import Snackbar from "material-ui/Snackbar";
import { readpost, updatepost, readcategory } from "./../api-post.js";
import {
  required,
  requiredwith,
  requiredwithblank,
  countError,
  validateurl
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
import SplitButton from "../../common/SplitButton";

import DateFnsUtils from "@date-io/date-fns";
import Checkbox from "@material-ui/core/Checkbox";
import DeleteForeverOutlinedIcon from "@material-ui/icons/DeleteForeverOutlined";
import CustomLoader from "./../../common/CustomLoader";
import CustomBack from "./../../common/CustomBack";
import Fourzerofour from "./../../common/404";
import config from "../../../config/config";

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
      text: "", // title
      subheading: "", // subheading
      photo: "", //image
      posttype: "", // published, schdule, draft
      viewtype: "public", // public or stans
      categories: [], // selected categories
      names: [], // display categories
      attach: "", // attachment
      postname: "image", // ppost craete type
      error: "", // error from API
      open: false, // snackbar open/close
      showDate: false, // schedule date display
      showImage: false, // selected image preview
      imagePath: "", // image preview path
      url: "", // inserted link
      scheduled_datetime: "", // scheduke date & time
      errors: {}, // form validation error.
      attachnames: [],
      choosed: true,
      SideLoader: false,
      showbutton: true,
      removeAttach: [],
      checkedTips: false,
      imagechoosed: false,
      urlchoosed: false,
      CustomLoader: true,
      newattachnames: [],
      invalid: false,
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
        // Input time in UTC
        var inputInUtc = data.scheduled_datetime;
        var dateInUtc = new Date(inputInUtc);
        //Print date in UTC time
        //console.log("Date in UTC : " + dateInUtc.toISOString()+"<br>");
        var dateInLocalTz = this.convertUtcToLocalTz(dateInUtc);
        //Print date in local time
        //console.log("Date in Local : " + dateInLocalTz.toISOString());
        var scheduled_datetime = dateInLocalTz.toISOString().substr(0, 16);
        // this.postData.set("text", data.text)
        // this.postData.set("subheading", data.subheading)
        // this.postData.set("categories", data.categories)
        // this.postData.set("viewtype", data.viewtype)
        // this.postData.set("posttype", data.posttype)
        // this.postData.set("url", data.url)
        // this.postData.set("scheduled_datetime", scheduled_datetime)
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
        var showUrl = "";
        var showPhoto = "";
        if (data.photo != "" || data.url != "") {
          this.setState({ showImage: true });
        }
        if (data.url) {
          showUrl = data.url;
          this.setState({ urlchoosed: true });
        }
        if (data.photo) {
          showPhoto = data.photo;
          this.setState({ imagechoosed: true });
        }
        this.setState({
          id: data._id,
          text: data.text,
          subheading: data.subheading,
          description: data.description,
          categories: cat,
          viewtype: data.viewtype,
          posttype: data.posttype,
          url: showUrl,
          imagePath: config.photoBucketURL + data.photo,
          scheduled_datetime: scheduled_datetime,
          attach: attachcount,
          photo: showPhoto,
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
            categories[i] = data[i].name;
          }
        }

        var categories = [].concat.apply([], categories);
        names = Array.from(new Set(categories));
        // names.shift()
      }
    });
    sleep(500).then(() => {
      this.setState({ names: names });
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
    // let errors = {};
    // let formIsValid = true;
    // if(this.state.photo == '' && this.state.url == '')
    //    {
    //      formIsValid = false;
    //      errors["image"] = "Photo is Missing"
    //    }
    //   if(this.state.viewtype == '')
    //    {
    //      formIsValid = false;
    //      errors["viewtype"] = "who can see this post is Missing"
    //    }
    //    if(this.state.posttype == '')
    //    {
    //      formIsValid = false;
    //      errors["posttype"] = "Post Type is Missing"
    //    }
    //    if(this.state.posttype == '2' && this.state.scheduled_datetime == '')
    //    {
    //      formIsValid = false;
    //      errors["Date"] = "Schedule Date is Missing"
    //    }
    //    if(this.state.scheduled_datetime == 'undefined' || this.state.scheduled_datetime == '')
    //    {
    //       this.setState({scheduled_datetime: Date.now })
    //    }
    //    this.setState({errors: errors});
    //    return formIsValid;
    let errors = {};
    let res = [];
    let formIsValid = true;
    errors["viewtype"] = required(this.state.viewtype, "Viewtype is required");
    res.push(required(this.state.viewtype, "Viewtype is required"));
    errors["posttype"] = required(this.state.posttype, "Posttype is required");
    res.push(required(this.state.posttype, "Posttype is required"));
    errors["image"] = requiredwithblank(
      this.state.photo,
      this.state.url,
      "Photo is missing"
    );
    res.push(
      requiredwithblank(this.state.photo, this.state.url, "Image is missing")
    );
    errors["url"] = validateurl(this.state.url, "Invalid URL");
    res.push(validateurl(this.state.url, "Invalid URL"));
    errors["Date"] = requiredwith(
      this.state.posttype,
      this.state.scheduled_datetime,
      "Schedule Date is required"
    );
    res.push(
      requiredwith(
        this.state.posttype,
        this.state.scheduled_datetime,
        "Schedule Date is required"
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
    this.setState({ errors: "", SideLoader: true, showbutton: false });
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
    this.setState({
      open: true,
      successMessage: `Updated Successfully!`
    });
    window.location = "/post/" + data._id;
  }
  handleChange = name => event => {
    let errors = this.state.errors;
    errors[name] = false;
    this.setState({ errors: errors });
    if (name === "photo") {
      errors["url"] = false;
      this.setState({ errors: errors });
      var extension = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
      if (event.target.files[0].size > 10500000) {
        errors["photo"] = "File is too large. Max size is 10 MB";
        this.setState({ errors: errors });
        return false;
      }
      if (!extension.includes(event.target.files[0].type)) {
        errors["photo"] = "This file type is invalid. File formats allowed jpeg, png,jpg,gif. ";
        this.setState({ errors: errors });
        return false;
      }
    }
    var value =
      name === "photo"
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
      this.setState({ url: "", showImage: true, imagePath: "" });
      var file = event.target.files[0];
      var reader = new FileReader();
      var url = reader.readAsDataURL(file);

      reader.onloadend = function (e) {
        this.setState({
          imagePath: [reader.result]
        });
      }.bind(this);
    }

    if (
      name == "url" &&
      value.match(/\.(jpeg|jpg|gif|png)$/) != null &&
      value != ""
    ) {
      errors["photo"] = false;
      this.setState({ errors: errors });
      // this.setState({ showImage: true });
      value.match(/\.(jpeg|jpg|gif|png)$/) == null
        ? this.setState({ showImage: false })
        : this.setState({ showImage: true });
    } else {
      if (name == "url" && value != "") {
        errors["photo"] = false;
        this.setState({ errors: errors });
        errors["url"] = "Invalid image URL.";
        this.setState({ errors: errors, showImage: false });
        //return false;
      } else {
        //this.setState({ showImage: false });
      }
    }
    if (name == "photo")
      value == ""
        ? this.setState({ showImage: false })
        : this.setState({ showImage: true });

    this.postData.set(name, value);
    this.postData.set("postname", this.state.postname);
    const did = name === "url" ? this.postData.set("photo", "") : "";
    const didthis = name === "photo" ? this.postData.set("url", "") : "";
    this.setState({ [name]: value });
    setTimeout(
      function () {
        //Start the timer
        //After 1 second, set render to true
        this.postData.set("viewtype", this.state.viewtype);
        if (this.state.posttype == "2") {
          this.setState({ showDate: true, scheduled_datetime: new Date() });
        } else {
          errors["Date"] = "";
          this.setState({ errors: errors, showDate: false });
        }
      }.bind(this),
      100
    );
    if (value != "" && (name == "photo" || name == "url")) {
      name == "photo"
        ? this.setState({ imagechoosed: true })
        : this.setState({ urlchoosed: true });
    } else if (name == "photo" || name == "url") {
      name == "photo"
        ? this.setState({ imagechoosed: false })
        : this.setState({ urlchoosed: false });
    }
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
    var attachcount = attachments.length;
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
    var attachname = [];
    var count = minus
    for (var i = 0; i < attachcount - minus; i++) {
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
    // const value = attachname//event.target.files[0]
    // this.postData.set(name, attachments)
    this.setState({ [name]: attachcount + " Files" });
    document.getElementById("icon-button-file-attach").value = "";
  };

  handleAttachRemove = (attachId, attchName) => {
    var index = this.state.attachnames.indexOf(attchName);
    if (index > -1) {
      this.state.attachnames[index] = "";
      // this.state.attachnames.splice(index, 1);
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
  removeFile = () => {
    document.getElementById("icon-button-file").value = "";
    this.setState({ imagePath: "", url: "", showImage: false });
    this.postData.delete("photo");
    this.setState({ imagechoosed: false });
    if (this.state.url) {
      this.setState({ urlchoosed: false })

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
      return <CustomLoader />
    }
    if (!this.state.CustomLoader) {
      return (
        <div className={classes.root}>
          <Card className={"cardcustom"}>
            <div className={"upload-back"}><CustomBack class={"fal fa-chevron-left"} backlink={"createpost"} />
              <CardHeader title="Edit Image" className={"cardheadercustom"} />
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
                    value={this.state.subheading}
                    onChange={this.handleChange("subheading")}
                    className={"textFieldforms"}
                    margin="normal"
                    multiline
                    rows="7"
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
                {/*this.state.showImage && <div className={classes.photo}>
              <img
                className={classes.media}
                src={this.state.url ? this.state.url : '/dist/uploads/photos/'+this.state.photo}  style={{width:250}}
                />
        </div>*/}
                <div className={"input-div"}>
                  <Typography component="div" className={"form-label"}>
                    Image
                </Typography>

                  <div className={"audio-container"}>
                    <fieldset
                      className={"audio-continner1"}
                      style={{ position: "relative" }}
                    >
                      {!this.state.showImage && (
                        <fieldset disabled={this.state.urlchoosed}>
                          <span>Drag and drop image here</span>
                          <span>or</span>
                          <span className={"upload-text"}>Upload</span>
                          <p className={"support-ct"}>
                            supported formats
                          <br />
                            png, jpeg, jpg, gif
                        </p>
                        </fieldset>
                      )}
                      <input
                        accept="image/*"
                        onChange={this.handleChange("photo")}
                        id="icon-button-file"
                        type="file"
                        disabled={this.state.urlchoosed}
                      />
                      {this.state.showImage && (
                        <div className={classes.photo}>
                          <img
                            className={classes.media}
                            src={
                              this.state.url
                                ? this.state.url
                                : this.state.imagePath
                            }
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
                      placeholder="Or paste image URL here"
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
                      disabled={this.state.imagechoosed}
                    />
                  </div>
                  {this.state.errors["image"] && !this.state.errors["url"] && (
                    <Typography component="p" color="error" className={"error-input"}>
                      <Icon color="error" className={classes.error}>
                        error
                        </Icon>
                      {this.state.errors["image"]}
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
                  {this.state.errors["photo"] && (
                    <Typography
                      component="p"
                      color="error"
                      className={"error-input "}
                    >
                      <Icon color="error" className={classes.error}>
                        error
                    </Icon>
                      {this.state.errors["photo"]}
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
                {/*}
   <Typography variant="h2" component="h2" >
          Tags
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
            <option key={name} value={name} selected={this.state.categories.includes(name)}>
              {name}
            </option>
          ))}
        </Select>*/}
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
                    <Icon color="error" className={classes.error}>
                      error
                  </Icon>
                    {this.state.errors["posttype"]}
                  </Typography>
                )}
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
                <Typography
                  component="p"
                  color="error"
                  className={"error-input fff"}
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

EditImage.propTypes = {
  classes: PropTypes.object.isRequired,
  addUpdate: PropTypes.func.isRequired
};

export default withStyles(styles)(EditImage);
