import React, { Component } from "react";
import Card, { CardActions, CardContent, CardMedia } from "material-ui/Card";
import Button from "material-ui/Button";
import TextField from "material-ui/TextField";
import Typography from "material-ui/Typography";
import Icon from "material-ui/Icon";
import Avatar from "material-ui/Avatar";
import FileUpload from "material-ui-icons/FileUpload";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import auth from "./../auth/auth-helper";
import { read, update, creatorcategory, checkusername } from "./api-user.js";
import { Redirect } from "react-router-dom";
import Grid from "material-ui/Grid";
import Snackbar from "material-ui/Snackbar";
import Select from "react-select";
import SimpleModal from "./../common/SimpleModal";
import CustomButton from "./../common/CustomButton";
import List, {
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText
} from "material-ui/List";
import CustomLoader from "./../common/CustomLoader";
import SideLoader from "./../common/SideLoader";
import { strict } from "assert";
import {
  required,
  vaildateEmail,
  countError,
  strongUsername
} from "./../common/ValidatePost";
import config from "../../config/config";
const styles = theme => ({});

const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

var names = [];
var suggestions = "";
var categories1 = new Array();
var categoriesValue = new Array();
var categoriesValue1 = new Array();
var categoriesValue2 = new Array();
class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      name: "",
      about: "",
      photo: "",
      email: "",
      username: "",
      banner: "",
      password: "",
      location: "",
      userId: "",
      redirectToProfile: false,
      error: "",
      editprofile: [],
      open: false,
      loading: true,
      multi: [],
      croppedimage: "",
      isSetCategories: true,
      bannerRemove: false,
      isUserNameExist: false,
      imagePreviewUrl: "",
      errors: {},
      loader: false,
      photoUrl: "",
      bannerUrl: "",
      currentLength: 0,
      RequiredLength: 200
    };
    this.props = props;
  }

  componentDidMount = () => {
    sleep(500).then(() => {
      this.userData = new FormData();
      const jwt = auth.isAuthenticated();

      read(
        {
          userId: this.props.userId
        },
        { t: jwt.token }
      ).then(data => {
        if (data.error) {
          this.setState({ error: data.error });
        } else {
          if (data.creatorcategory) {
            var arr = {};
            var label;
            var categoryValue;
            var i = 0;
            categoriesValue2 = [];
            data.creatorcategory.forEach(function (key, value) {
              label = "label";
              categoryValue = "value";
              arr[label] = key.name;
              arr[categoryValue] = key._id;
              categoriesValue2.push(arr);
              arr = {};
            });
          }
          var photoUrl = data.photo
            ? config.profileImageBucketURL + data.photo + "?" + new Date().getTime()
            : config.profileDefaultPath;
          // data._id
          //   ? `/api/users/photo/${data._id}?${new Date().getTime()}`
          //   : "/api/users/defaultphoto";
          var bannerUrl = data.banner
            ? config.bannerImageBucketURL + data.banner + "?" + new Date().getTime()
            : config.bannerDefaultPath;
          // data._id
          // ? `/api/users/banner/${data._id}?${new Date().getTime()}`
          // : "/api/users/defaultbanner";
          var aboutlength = 0;
          if (data.about) aboutlength = data.about.length;
          this.setState({
            id: data._id,
            name: data.name,
            email: data.email,
            username: data.username,
            about: data.about,
            currentLength: aboutlength,
            location: data.location,
            multi: categoriesValue2,
            photoUrl: photoUrl,
            bannerUrl: bannerUrl
          });
        }
      });
    });

    sleep(500).then(() => {
      this.userData = new FormData();
      const jwt = auth.isAuthenticated();
      creatorcategory(
        {
          userId: this.props.userId
        },
        { t: jwt.token }
      ).then(data => {
        if (data.error) {
          this.setState({ redirectToSignin: true });
        } else {
          categories1 = data;
        }
      });
      sleep(500).then(() => {
        this.setState({ names: names });
        suggestions = categories1.map((key, value) => ({
          value: key._id,
          label: key.name
        }));
        this.setState({ loading: false });
      });

      categories1 = [];
    });
  };

  finalvalue = src => {
    this.setState({ croppedimage: src });
    /*var BASE64_MARKER = ';base64,';
    var base64Index = src.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    var base64 = src.substring(base64Index);
    var raw = window.atob(base64);
   // console.log("raw :"+raw);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));

    for(var i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    console.log(array);*/
    //return array;
    this.userData.set("photo", src);
  };

  clickSubmit = () => {
    this.setState({ loader: true });
    const jwt = auth.isAuthenticated();
    /* Check Again username exists */
    checkusername({
      value: this.state.username
    }).then(data => {
      if (!data.count) {
        this.setState({ isUserNameExist: false });
        //console.log(" data " + data);
      } else {
        //console.log("else data " + data._id + " id " + jwt.user._id);
        if (data._id == jwt.user._id) {
          this.setState({ isUserNameExist: false });
        } else {
          this.setState({ isUserNameExist: true });
        }
      }
    });
    /* End Check Again Username exist */
    //console.log("this.state.multi  :" + this.state.multi.length);
    let isCheckCategory = false;
    if (jwt.user.creator == 1) {
      isCheckCategory = true;
    }
    if (this.state.multi.length >= 1) {
      this.setState({ isSetCategories: true });
    } else if (this.state.multi.length < 1) {
      this.setState({ isSetCategories: false });
    }

    sleep(100).then(() => {
      if (this.validateTextFields()) {
        this.setState({ errors: "" });
        let checkCondition = "";
        if (isCheckCategory) {
          checkCondition =
            this.state.isSetCategories === true &&
            this.state.isUserNameExist === false;
        } else {
          checkCondition = this.state.isUserNameExist === false;
        }
        if (this.state.currentLength > this.state.RequiredLength) {
          checkCondition = false;
        }
        if (checkCondition) {
          const user = {
            // profileimage: this.state.croppedimage || undefined,
            name: this.state.name || undefined,
            username: this.state.username || undefined,
            email: this.state.email || undefined,
            password: this.state.password || undefined,
            about: this.state.about || undefined,
            location: this.state.location || undefined,
            myreferralcode: this.state.username || undefined
          };
          update(
            {
              userId: this.props.userId
            },
            {
              t: jwt.token
            },
            this.userData
          ).then(data => {
            if (data.error) {
              this.setState({ error: data.error });
            } else {
              //console.log(" length " + data.creatorcategory.length);
              /* Update local storage value */
              var jwt = JSON.parse(localStorage.jwt);
              jwt.user.name = data.name;
              jwt.user.username = data.username;
              jwt.user.email = data.email;
              jwt.user.creator = data.creater.status;
              if (this.state.croppedimage)
                jwt.user.photo = this.props.userId + ".png";
              if (this.state.imagePreviewUrl)
                jwt.user.banner = this.props.userId + ".png";
              localStorage.setItem("jwt", JSON.stringify(jwt));
              /* End Upadte local storage value */

              sleep(5000).then(() => {
                this.setState({
                  redirectToProfile: false,
                  open: true,
                  profilemsg: `Changes have been saved`,
                  loader: false
                });
                location.reload(true);
              });
            }
          });
        } else {
          let errors = {};
          if (this.state.isUserNameExist === true) {
            errors["username"] = `Username already taken`;
            this.setState({
              redirectToProfile: false,
              errors: errors,
              profilemsg: "",
              open: false,
              loader: false
            });
          } else if (this.state.isSetCategories === false) {
            errors["category"] = `Please select at least one option. `;
            this.setState({
              redirectToProfile: false,
              open: false,
              profilemsg: "",
              errors: errors,
              loader: false
            });
          } else if (this.state.currentLength > this.state.RequiredLength) {
            errors["about"] = "Max. 200 characterss ";
            this.setState({
              redirectToProfile: false,
              open: false,
              profilemsg: "",
              errors: errors,
              loader: false
            });
          }
        }
      }
    });
  };
  validateTextFields = () => {
    let errors = {};
    let res = [];
    let formIsValid = true;
    errors["name"] = required(this.state.name, "Name is required");
    res.push(required(this.state.name, "Name is required"));
    errors["username"] = required(this.state.username, "Username is required");
    res.push(required(this.state.username, "Username is required"));
    errors["username"] = strongUsername(
      this.state.username,
      "Username only allow alphabets, numbers, underscore and dot"
    );
    res.push(
      strongUsername(
        this.state.username,
        "Username only allow alphabets, numbers, underscore and dot"
      )
    );

    var count = countError(res);
    if (count > 0) {
      formIsValid = false;
      this.setState({ errors: errors });
    }
    return formIsValid;
  };
  handleChangeMulti = value => {
    if (value != null) {
      if (value.length < 4) {
        categoriesValue = [];
        if (value) {
          value.forEach(function (key) {
            categoriesValue.push(key.value);
          });
          this.setState({ multi: value });
          if (categoriesValue.length > 0 && categoriesValue.length <= 3) {
            this.userData.set("creatorcategory", categoriesValue);
            this.setState({ isSetCategories: true, redirectToProfile: false });
          } else if (categoriesValue.length < 1) {
            this.setState({ isSetCategories: false, redirectToProfile: false });
          }
        } else if (categoriesValue.length < 1) {
          let errors = {};
          errors["category"] = "Please select at least one option. ";
          this.setState({
            multi: [],
            redirectToProfile: false,
            open: false,
            profilemsg: "",
            isSetCategories: false,
            errors: errors
          });
        }
      } else {
        let errors = {};
        errors["category"] =
          "You are allowed to select max three categories only.";
        this.setState({
          open: false,
          profilemsg: "",
          errors: errors
        });
      }
    } else {
      this.setState({
        multi: []
      });
    }
  };
  handleChange = name => event => {
    let errors = this.state.errors;
    errors[name] = false;
    this.setState({ errors: errors });
    var value = name === "photo" ? event.target.files[0] : event.target.value;
    if (name === "email" || name === "username") {
      this.userData.set(name, value.toLowerCase());
      this.userData.set("myreferralcode", value.toLowerCase());
    } else {
      this.userData.set(name, value);
    }
    if (name === "username") {
      value = value.replace(/\s/g, "");
    }
    if (value.length > 200) {
      errors["about"] = "Max. 200 characters ";
      this.setState({ errors: errors });
    }
    if (name == "about" && value != "") {
      console.log("about length" + value.length);
      this.setState({ currentLength: value.length });
    } else if (name == "about") {
      this.setState({ currentLength: 0 });
    }
    this.setState({ [name]: value });
  };
  handleRequestClose = (event, reason) => {
    this.setState({ open: false });
  };

  handleBackgroundChange = src => {
    this.userData.set("banner", src);
    this.setState({ imagePreviewUrl: src });
  };
  // handleBackgroundChange = name => event => {
  //   let reader = new FileReader();
  //   const value =
  //     name === "banner" ? event.target.files[0] : event.target.value;
  //   this.userData.set(name, value);
  //   this.setState({ [name]: value });
  //   console.log("value " + event.target.value + " && ");
  //   if (name === "banner") {
  //     //console.log(event.target.files[0]);
  //     reader.onloadend = () => {
  //       console.log(" reader.result " + reader.result);
  //       this.setState({
  //         imagePreviewUrl: reader.result
  //       });
  //       console.log(" reader.result " + reader.result);
  //       //this.userData.set("banner", reader.result);
  //     };
  //     reader.readAsDataURL(event.target.files[0]);
  //   }

  //   // update({
  //   //   userId: this.props.userId
  //   // }, {
  //   //   t: jwt.token
  //   // }, this.userData).then((data) => {
  //   //   if (data.error) {
  //   //     this.setState({error: data.error})
  //   //   } else {
  //   //     this.setState({'redirectToProfile': false,open:true, profilemsg:`${data.name} profile is updated Successfully.` })
  //   //   }
  //   // })
  // };
  handleBannerImage = name => event => {
    if (name === "bannerremove") {
      this.setState({ bannerRemove: true });
    } else if (name === "bannercancel") {
      this.setState({ bannerRemove: false });
    } else if (name === "bannersave") {
      //this.setState({ bannerRemove: true }) // need work on this section
    }
  };

  render() {
    const { classes } = this.props;

    if (this.state.redirectToProfile) {
      return <Redirect to={"/setting/" + this.state.id} />;
    }
    if (this.state.loading) {
      return <CustomLoader />;
    } else {
      return (
        <Card className={"edit-profilecard"}>
          <CardContent className={"edit-procontainer"}>
            <Typography component="div" className={"title-profile"}>
              Edit Profile
            </Typography>
            <Grid className={"editprofile-banner"}>
              {/* {console.log(" gfdsgd" + this.state.imagePreviewUrl)} */}
              {/* <img
                // src={this.state.bannerRemove === true ? "" : bannerUrl} imagePreviewUrl
                src={
                  this.state.imagePreviewUrl
                    ? this.state.imagePreviewUrl
                    : bannerUrl
                }
                title="banner image"
                className={"edit-bannerimg"}
              /> */}
              <CardMedia
                className={"profile-cover-container-image"}
                image={
                  this.state.imagePreviewUrl
                    ? this.state.imagePreviewUrl
                    : this.state.bannerUrl
                }
                title="banner image"
              />
              {/* <CardMedia
                className={"edit-bannerimg"}
                image={bannerUrl}
                title="banner image"
              /> */}
              <div
                className={"save-editprofile"}
                style={{
                  display: this.state.bannerRemove == true ? "block" : "none"
                }}
              >
                <Button
                  color="secondary"
                  variant="raised"
                  className={classes.submit}
                  onClick={this.handleBannerImage("bannercancel")}
                >
                  Cancel
                </Button>
                <Button
                  color="secondary"
                  variant="raised"
                  className={classes.submit}
                  onClick={this.handleBannerImage("bannersave")}
                >
                  Save Changes
                </Button>
              </div>
              <div className={"remove-editprofpic"}>
                {/* <div className={"remove-pic"}>
                  <Button color="secondary" variant="raised" onClick={this.handleBannerImage('bannerremove')} className={classes.submit}>Remove Picture</Button>
                </div> */}
                <div className={"change-editpic"}>
                  {/* <ListItemAvatar> */}
                  <Avatar
                    src={
                      this.state.croppedimage
                        ? this.state.croppedimage
                        : this.state.photoUrl
                    }
                    className={"editprofile-avatar"}
                  />
                  {/* </ListItemAvatar> */}
                  {auth.isAuthenticated().user.creator > 0 && (
                    <div className={"profile-verified"}>
                      <img src="/dist/create/certified.svg" />
                    </div>
                  )}
                  <div className={"edit-modal-contain"}>
                    <div className={"edit-modal"}>
                      <i className={"fal fa-pen"}></i>
                      <SimpleModal
                        onCropImage={this.finalvalue}
                        aspectRatio={16 / 16}
                        editProfileMsg={"Edit Profile Image"}
                      />
                      {/*</label>*/}{" "}
                      <span className={classes.filename}>
                        {this.state.photo ? this.state.photo.name : ""}
                      </span>
                    </div>
                  </div>
                  {/*<label htmlFor="icon-button-file">*/}
                  {/*<Button variant="raised" color="default" component="span" >
              Change Picture
              {<FileUpload/>}
            </Button>*/}
                </div>
              </div>
              {/* <div className={"upload-editcontain"}>
                <div className={"upload-editprofcover"}> */}
              <div className={"edit-modal-contain setting_back_cover"}>
                <div className={"edit-modal"}>
                  <Typography
                    component="span"
                    className={"upload_full_pic_blk"}
                  >
                    <i className={"fal fa-pen"}></i> Upload Cover Image
                  </Typography>
                  <SimpleModal
                    onCropImage={this.handleBackgroundChange}
                    aspectRatio={3 / 1.05}
                    editProfileMsg={"Edit Cover Image"}
                  />
                </div>
                {/* </div>
                </div> */}
              </div>
            </Grid>

            <div className={"maininner-edit mt-fifty"}>
              <Typography component="div" className={"form-label"}>
                Name<span className={"nec_icon"}>*</span>
              </Typography>
              <div className={"setting-input-div"}>
                <TextField
                  id="name"
                  className={"textFieldforms "}
                  value={this.state.name}
                  onChange={this.handleChange("name")}
                  margin="normal"
                  InputProps={{
                    disableUnderline: true,
                    classes: { input: this.props.classes["input"] }
                  }}
                />
                {this.state.errors["name"] && (
                  <Typography
                    component="p"
                    color="error"
                    className={"error-input"}
                  >
                    <Icon color="error" className={classes.error}>
                      error
                    </Icon>
                    {this.state.errors["name"]}
                  </Typography>
                )}
              </div>
              <Typography component="div" className={"form-label"}>
                Username<span className={"nec_icon"}>*</span>
              </Typography>
              <div className={"setting-input-div"}>
                <TextField
                  id="username"
                  type="text"
                  className={"textFieldforms "}
                  value={this.state.username}
                  onChange={this.handleChange("username")}
                  margin="normal"
                  InputProps={{
                    disableUnderline: true,
                    classes: { input: this.props.classes["input"] }
                  }}
                />
                {this.state.errors["username"] && (
                  <Typography
                    component="p"
                    color="error"
                    className={"error-input"}
                  >
                    <Icon color="error" className={classes.error}>
                      error
                    </Icon>
                    {this.state.errors["username"]}
                  </Typography>
                )}
              </div>
              {/* <Typography
                component="div"
                
                className={"form-label"}
              >
                Email *
              </Typography>
              <div className={"setting-input-div"}>
                <TextField
                  id="email"
                  type="email"
                  className={"textFieldforms "}
                  value={this.state.email}
                  onChange={this.handleChange("email")}
                  margin="normal"
                  InputProps={{
                    disableUnderline: true,
                    classes: { input: this.props.classes["input"] }
                  }}
                />
              </div> */}
              <Typography component="div" className={"form-label"}>
                Location
              </Typography>
              <div className={"setting-input-div textarea_height"}>
                <TextField
                  id="multiline-flexible"
                  multiline
                  rows="1"
                  value={this.state.location}
                  onChange={this.handleChange("location")}
                  className={"textFieldforms "}
                  margin="normal"
                  InputProps={{
                    disableUnderline: true,
                    classes: { input: this.props.classes["input"] },
                    style: {
                      padding: 0
                    }
                  }}
                />
              </div>
              <Typography component="div" className={"form-label"}>
                Bio
              </Typography>
              <div className={"setting-input-div"}>
                <div className={"setting-input-div_inner"}>
                  <TextField
                    id="multiline-flexible"
                    multiline
                    rows="4"
                    value={this.state.about}
                    onChange={this.handleChange("about")}
                    className={"textFieldforms "}
                    margin="normal"
                    InputProps={{
                      disableUnderline: true,
                      classes: { input: this.props.classes["input"] },
                      style: {
                        padding: 0
                      }
                    }}
                  />
                  <Typography component="span" className={"length-count"}>
                    {this.state.currentLength + "/" + this.state.RequiredLength}
                  </Typography>
                </div>
                {this.state.errors["about"] && (
                  <Typography
                    component="p"
                    color="error"
                    className={"error-input"}
                  >
                    <Icon color="error" className={classes.error}>
                      error
                    </Icon>
                    {this.state.errors["about"]}
                  </Typography>
                )}
              </div>

              <div className={"edit-creator"}>
                {auth.isAuthenticated().user.creator == 1 && (
                  <div className={"left-editcreator"}>
                    <Typography component="div" className={"form-label"}>
                      What kind of content do you do?{/**(your roles)**/}
                      <span className={"nec_icon"}>*</span>
                    </Typography>
                    <Typography component="p" className={"edit-select-option"}>
                      {/**Choose up to three of who you are**/}
                      Select up to three options
                    </Typography>
                    <div className={"setting-input-div"}>
                      <Select
                        disableUnderline={true}
                        placeholder="Creater Category"
                        TextFieldProps={{
                          label: "Creater",
                          InputLabelProps: {
                            htmlFor: "react-select-multiple",
                            shrink: true
                          }
                        }}
                        inputId="react-select-multiple"
                        options={suggestions}
                        onChange={this.handleChangeMulti}
                        value={this.state.multi}
                        multiple={true}
                        isMulti
                        autoComplete="off"
                      />
                      {this.state.errors["category"] && (
                        <Typography
                          component="p"
                          color="error"
                          className={"error-input"}
                        >
                          <Icon color="error" className={classes.error}>
                            error
                          </Icon>
                          {this.state.errors["category"]}
                        </Typography>
                      )}
                    </div>
                  </div>
                )}
                {/* <TextField
                  id="password"
                  type="password"
                  label="Password"
                  className={classes.textField}
                  value={this.state.password}
                  onChange={this.handleChange("password")}
                  margin="normal"
                  autoComplete="off"
                  style={{ display: "none" }}
                /> */}
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
                <CardActions className={"edit-save"}>
                  {/* <Button
                    color="primary"
                    variant="raised"
                    onClick={this.clickSubmit}
                    className={classes.submit}
                  >
                    Save
					</Button> **/}
                  {!this.state.loader && (
                    <CustomButton
                      label="Save"
                      onClick={this.clickSubmit}
                      className={"Primary_btn_blk"}
                    />
                  )}
                  {this.state.loader && <SideLoader />}
                </CardActions>
                <Snackbar
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                  }}
                  open={this.state.open}
                  onClose={this.handleRequestClose}
                  autoHideDuration={6000}
                  message={<span>{this.state.profilemsg}</span>}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }
  }
}

EditProfile.propTypes = {
  classes: PropTypes.object.isRequired,
  editprofile: PropTypes.array.isRequired
};

export default withStyles(styles)(EditProfile);
