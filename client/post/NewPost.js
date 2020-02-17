import React, { Component } from "react";
import Card, { CardHeader, CardContent, CardActions } from "material-ui/Card";
import Button from "material-ui/Button";
import TextField from "material-ui/TextField";
import Typography from "material-ui/Typography";
import Avatar from "material-ui/Avatar";
import Icon from "material-ui/Icon";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import { create } from "./api-post.js";
import auth from "./../auth/auth-helper";
import IconButton from "material-ui/IconButton";
import PhotoCamera from "material-ui-icons/PhotoCamera";
import CustomButton from "./../common/CustomButton";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import SideLoader from "./../common/SideLoader";
import ReactDOM from "react-dom";

const styles = theme => ({
  card: {
    boxShadow: "none",
    border: "1px solid #d6d6d6"
  },
  marginremove: "margin:0px"
});

var intervalID = "";
var uploaddata = "";
class NewPost extends Component {
  state = {
    text: "",
    photo: "",
    viewtype: "public",
    error: "",
    user: {},
    postname: "thought",
    currentLength: 0,
    RequiredLength: 200,
    errors: {},
    showImage: false,
    imagePath: "",
    buttonStatus: true,
    uploadtype: "",
    SideLoader: false,
    response: false,
    uploadpercent: 0
  };

  componentDidMount = () => {
    this.postData = new FormData();
    this.postData.set("viewtype", "public");
    this.setState({ user: auth.isAuthenticated().user });
  };
  clickPost = () => {
    var textvalue = this.state.text;
    var matches = textvalue.match(/\bhttps?:\/\/\S+/gi);
    if (matches) {
      console.log(matches[0]);
      textvalue = textvalue.replace(matches[0], "");
    }
    if (textvalue.length > 200) {
      let errors = {};
      errors["text"] = "length must be equal to 200";
      this.setState({ errors: errors });
      return false;
    }
    this.setState({ SideLoader: true });

    var percent = 0;
    if (this.state.uploadtype == "video") {
      intervalID = setInterval(() => {
        percent = +percent + 1; //Math.floor((Math.random() * 10) + 1);
        percent = percent <= 100 ? percent : 100;
        this.setState({ uploadpercent: percent });
        if (percent == 100 && this.state.response) {
          clearInterval(intervalID);
          this.uploadpercent(uploaddata);
        }
      }, 250);
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
        this.setState({ error: data.error });
      } else {
        uploaddata = data;
        this.setState({ response: true });
        percent = 100;
        if (this.state.uploadtype != "video") {
          this.uploadpercent(uploaddata);
        }
        // if (this.state.uploadpercent == 100) {
        //   clearInterval(intervalID);
        //   this.setState({ text: '', photo: '', video: '', viewtype: 'public', currentLength: 0, showImage: false, imagePath: '', buttonStatus: true, SideLoader: false, uploadtype: '' })
        //   this.postData.delete(['text'])
        //   this.postData.delete(['photo'])
        //   this.postData.delete(['video'])
        //   this.postData.set("viewtype", "public")
        //   this.props.addUpdate(data)
        // }
      }
    });
  };

  uploadpercent = data => {
    this.setState({
      text: "",
      photo: "",
      video: "",
      viewtype: "public",
      currentLength: 0,
      showImage: false,
      imagePath: "",
      buttonStatus: true,
      SideLoader: false,
      uploadtype: "",
      uploadpercent: 0
    });
    this.postData.delete(["text"]);
    this.postData.delete(["photo"]);
    this.postData.delete(["video"]);
    this.postData.set("viewtype", "public");
    this.props.addUpdate(data);
  };

  handleChange = name => event => {
    let errors = this.state.errors;
    errors[name] = false;
    this.setState({ errors: errors });
    var uploadtype = this.state.uploadtype;
    var videoextensions = [
      "video/avi",
      "video/mp4",
      "video/mov",
      "video/mpeg",
      "video/quicktime"
    ];
    var imageextensions = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
    if (name == "photo") {
      if (videoextensions.includes(event.target.files[0].type)) {
        uploadtype = "video";
        if (this.state.showImage)
          uploadtype === "photo"
            ? this.setState({ showImage: true })
            : this.setState({ showImage: false });
      }
      if (imageextensions.includes(event.target.files[0].type)) {
        uploadtype = "photo";
        if (!this.state.showImage)
          uploadtype === "photo"
            ? this.setState({ showImage: true })
            : this.setState({ showImage: false });
      }
    }
    if (uploadtype == "" && name == "photo") {
      errors["text"] = "File type not allowed";
      this.setState({ errors: errors });
    }
    var value = name === "photo" ? event.target.files[0] : event.target.value;

    if (uploadtype == "photo" && name == "photo") {
      this.setState({ imagePath: "" });
      var file = event.target.files[0];
      var reader = new FileReader();
      var url = reader.readAsDataURL(file);

      reader.onloadend = function(e) {
        this.setState({
          imagePath: [reader.result],
          buttonStatus: false
        });
      }.bind(this);
    }
    uploadtype != "video"
      ? this.postData.set(name, value)
      : this.postData.set(uploadtype, value);
    uploadtype == "video" ? this.setState({ buttonStatus: false }) : "";

    //this.postData.set(name, value)
    this.postData.set("posttype", "1");
    this.postData.set("postname", this.state.postname);

    this.setState({ [name]: value, uploadtype: uploadtype });
    setTimeout(
      function() {
        //Start the timer
        //After 1 second, set render to true
        if (name == "text") {
          var matches = value.match(/\bhttps?:\/\/\S+/gi);
          if (matches) {
            value = value.replace(matches[0], "");
          }
        }

        if (value.length > 200) {
          errors["text"] = "Max. 200 characters ";
          this.setState({ errors: errors, buttonStatus: true });
        } else {
          this.setState({ errors: errors, buttonStatus: false });
        }

        if (name == "text" && value != "") {
          // console.log("des length" + this.state.text.length)
          this.setState({ currentLength: value.length });
        } else if (name == "text") {
          this.setState({
            currentLength: 0,
            errors: errors,
            buttonStatus: true
          });
        }
        if (this.state.text == "" && this.state.uploadtype == "") {
          this.setState({ buttonStatus: true });
        }
        if (matches) {
          this.setState({ buttonStatus: false });
        }
      }.bind(this),
      100
    );
    document.getElementById("icon-button-file").value = "";
  };

  removeImage = () => {
    this.setState({ showImage: false, imagePath: "", photo: "" });
    setTimeout(
      function() {
        //Start the timer
        if (this.state.text == "" && this.state.imagePath == "") {
          this.setState({ buttonStatus: true });
        }
      }.bind(this),
      100
    );
    this.postData.delete(["photo"]);
  };

  removeVideo = () => {
    this.setState({ uploadtype: "", photo: "" });
    setTimeout(
      function() {
        //Start the timer
        if (this.state.text == "" && this.state.uploadtype == "") {
          this.setState({ buttonStatus: true });
        }
      }.bind(this),
      100
    );
    this.postData.delete(["video"]);
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Card className={classes.card}>
          {/** <CardHeader
            avatar={
              <Avatar src={'/api/users/photo/'+this.state.user._id}/>
            }
            title={this.state.user.name}
            className={classes.cardHeader}
          />**/}
          <CardContent className={"newspostcontent"}>
            <div className={"post-msg-outer"}>
              <div className={"post-msg"}>
                <TextField
                  placeholder="Share something…"
                  multiline
                  value={this.state.text}
                  onChange={this.handleChange("text")}
                  className={"newposttextarea"}
                  margin="normal"
                  InputProps={{
                    disableUnderline: true,
                    classes: { input: this.props.classes["input"] },
                    style: {
                      padding: 0
                    }
                  }}
                />
                {this.state.text.length > 0 && (
                  <Typography component="span" className={"length-count"}>
                    {this.state.currentLength + "/" + this.state.RequiredLength}
                  </Typography>
                )}

                {this.state.text.length == 0 && (
                  <div className={"newposttoday"}>
                    <input
                      accept="image/*|video/*"
                      onChange={this.handleChange("photo")}
                      className={classes.input}
                      id="icon-button-file"
                      type="file"
                    />
                  </div>
                )}
                {this.state.text.length > 0 && (
                  <div className={"newposttoday-new"}>
                    <input
                      accept="image/*|video/*"
                      onChange={this.handleChange("photo")}
                      className={classes.input}
                      id="icon-button-file"
                      type="file"
                    />
                  </div>
                )}
              </div>
              {this.state.errors["text"] && (
                <Typography
                  component="p"
                  color="error"
                  className={"error-input"}
                  style={styles.marginremove}
                >
                  <Icon color="error" className={classes.error}>
                    error
                  </Icon>
                  {this.state.errors["text"]}
                </Typography>
              )}
            </div>

            {this.state.showImage && (
              <div className={classes.photo}>
                <div className={"upart-close-icon"}>
                  {" "}
                  <i className={"fal fa-times"} onClick={this.removeImage}></i>
                </div>
                <img
                  className={classes.media}
                  src={this.state.imagePath}
                  style={{ width: "auto" }}
                />
              </div>
            )}
            {this.state.uploadtype == "video" && (
              <div className={classes.photo}>
                <div className={"upart-close-icon"}>
                  {" "}
                  <i className={"fal fa-times"} onClick={this.removeVideo}></i>
                </div>
                <p>{this.state.photo.name}</p>
              </div>
            )}
            <div className={"post-newpost"}>
              {auth.isAuthenticated().user.creator > 0 &&
                auth.isAuthenticated().user.stanEnabled && (
                  <Typography component="div" className={"action-command"}>
                    <RadioGroup
                      aria-label="viewtype"
                      name="viewtype"
                      value={this.state.viewtype}
                      onChange={this.handleChange("viewtype")}
                      className={"radio-post"}
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
                      />
                    </RadioGroup>
                    {/* <input type="radio" value="public"
                    checked={this.state.viewtype === "public"}
                    onChange={this.handleChange('viewtype')} /> Public */}

                    {/* <div className={"command-input"}><input type="radio" value="stans"
                  checked={this.state.viewtype === "stans"}
                  onChange={this.handleChange('viewtype')} /> Stans Only</div> */}

                    {this.state.error && (
                      <Typography component="p" color="error">
                        <Icon color="error" className={classes.error}>
                          error
                        </Icon>
                        {this.state.error}
                      </Typography>
                    )}
                  </Typography>
                )}
              <CardActions className={"newpostaction"}>
                {this.state.SideLoader && (
                  <SideLoader uploadpercent={this.state.uploadpercent} />
                )}

                {!this.state.SideLoader && (
                  <CustomButton
                    label="Post"
                    disabled={this.state.buttonStatus}
                    onClick={this.clickPost}
                    className={"Primary_btn_blk"}
                  />
                )}

                {/* <Button color="primary" variant="raised" disabled={this.state.text === ''} onClick={this.clickPost} className={classes.submit}>Post</Button> */}
              </CardActions>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}

NewPost.propTypes = {
  classes: PropTypes.object.isRequired,
  addUpdate: PropTypes.func.isRequired
};

export default withStyles(styles)(NewPost);
