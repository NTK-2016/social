import React, { Component } from "react";
import Card, { CardActions, CardContent } from "material-ui/Card";
import Button from "material-ui/Button";
import TextField from "material-ui/TextField";
import Typography from "material-ui/Typography";
import Icon from "material-ui/Icon";
import Avatar from "material-ui/Avatar";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import { Redirect } from "react-router-dom";
import Paper from "material-ui/Paper";
import auth from "./../auth/auth-helper";
import { Link } from "react-router-dom";
import {
  read,
  update,
  checkoldpassword,
  checkemail,
  checkEmailById
} from "./api-user.js";
import DeleteUser from "./DeleteUser";
import Snackbar from "material-ui/Snackbar";
import CustomButton from "./../common/CustomButton";
import { required, vaildateEmail, countError, strongPassword } from "./../common/ValidatePost";
const styles = theme => ({
  error: {
    verticalAlign: "middle"
  }
});
const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: [],
      oldpassword: "",
      oldemail: auth.isAuthenticated().user.email,
      newemail: "",
      newpassword: "",
      password: "",
      error: "",
      errors: {},
      redirectToProfile: false,
      userId: "",
      open: false,
      msg: ""
    };
    this.props = props;
  }
  componentDidMount = () => {
    this.userData = new FormData();
    const jwt = auth.isAuthenticated();
  };

  handleChange = name => event => {
    let errors = this.state.errors
    errors[name] = false
    const value = event.target.value;
    this.userData.set(name, value);
    this.setState({ [name]: value, msg: "", errors: errors });
  };

  handleRequestClose = (event, reason) => {
    this.setState({ open: false });
  };
  validateTextFields = () => {
    let errors = {};
    let res = [];
    let formIsValid = true;
    errors["oldpassword"] = required(
      this.state.oldpassword,
      "Old Password is required"
    );
    res.push(required(this.state.oldpassword, "Old Password is required"));
    errors["newpassword"] = required(
      this.state.newpassword,
      "New Password is required"
    );
    res.push(required(this.state.newpassword, "New Password is required"));

    errors["password"] = required(
      this.state.password,
      "Confirm Password is required"
    );
    res.push(required(this.state.password, "Confirm Password is required"));

    if(errors["newpassword"] == false){
    errors["newpassword"] = strongPassword(this.state.newpassword, "Must be eight characters or longer and should contain at least 1 lowercase alphabet, 1 uppercase alphabet, 1 numeric and 1 special character");
    res.push(strongPassword(this.state.newpassword, "Must be eight characters or longer and should contain at least 1 lowercase alphabet, 1 uppercase alphabet, 1 numeric and 1 special character"));
    }

    if(errors["password"] == false){
      if(this.state.password!=this.state.newpassword){
        errors["password"] = "Password and confirm Password not match" ;
        res.push("Password and confirm Password not match");
      }
    }
    
    var count = countError(res);
    if (count > 0) {
      formIsValid = false;
      this.setState({ errors: errors });
    }
    return formIsValid;
  };

  validateEmailFields = () => {
    let errors = {};
    let res = [];
    let formIsValid = true;
    errors["oldemail"] = required(this.state.oldemail, "Old Email is required");
    res.push(required(this.state.oldemail, "Old Email is required"));
    errors["newemail"] = required(this.state.newemail, "New Email is required");
    res.push(required(this.state.newemail, "New Email is required"));
    var oemail, nemail = true
    if (this.state.oldemail != '') {
      errors["oldemail"] = vaildateEmail(
        this.state.oldemail,
        "Enter a valid email address "
      );
      res.push(vaildateEmail(this.state.oldemail, "Enter a valid email address "));
      oemail = vaildateEmail(this.state.oldemail, "Enter a valid email address ")
    }
    if (this.state.newemail != '') {
      errors["newemail"] = vaildateEmail(
        this.state.newemail,
        "Enter a valid email address "
      );
      res.push(vaildateEmail(this.state.newemail, "Enter a valid email address "));
      nemail = vaildateEmail(this.state.newemail, "Enter a valid email address ")
    }
    if (!oemail && !nemail && this.state.newemail != '' && this.state.oldemail != '' && this.state.newemail == this.state.oldemail) {
      errors["newemail"] = "The original email address and the new one cannot be the same. ";
      res.push("The original email address and the new one cannot be the same. ");
    }
    var count = countError(res);
    if (count > 0) {
      formIsValid = false;
      this.setState({ errors: errors });
    }
    return formIsValid;
  };

  clickUpdateEmail = () => {
    let errors = {};
    this.setState({ error: errors });
    this.setState({ errors: errors });
    const jwt = auth.isAuthenticated();
    if (this.validateEmailFields()) {
      checkEmailById(
        {
          oldEmail: this.state.oldemail,
          userId: this.props.userId,
          newEmail: this.state.newemail
        },
        {
          t: jwt.token
        }
      ).then(data => {
        if (data.count == false && data.newEmail == "") {
          errors["oldemail"] = "Invalid current email";
          this.setState({ errors: errors });
        }
        if (data.count == true && data.newEmail == true) {
          errors["newemail"] = "Email address already taken";
          this.setState({ errors: errors });
        }
        if (data.count == true && data.newEmail == "success") {
          this.setState({
            email: "",
            success: "Please check your emails to proceed.",
            open: true,
            nemail: ''
          });
        } else if (data.count == false && data.newEmail == "fail") {
          errors["newemail"] = "Invalid new email"
          this.setState({ errors: errors });
        }
        // if (data.count == false && data.newEmail == "fail") {
        //   errors["newemail"] =
        //     "You already updated your mail, Please confirm on mail.";
        //   this.setState({ errors: errors });
        // }
      });
    }
  };
  clickSubmit = () => {
    let errors = this.state.errors

    const jwt = auth.isAuthenticated();
    if (this.validateTextFields()) {
      if (
        this.state.newpassword !== this.state.password ||
        (this.state.password.length < 6 && this.state.newpassword.length < 6)
      ) {
        errors["password"] = "The Confirm password doesn't match the New password. "
        this.setState({ errors: errors });
      } else {
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
            console.log(data.error);
            this.setState({ msg: data.error }); //error: data.error,
          } else {
            this.setState({
              redirectToProfile: false,
              open: true,
              passwordmsg: `Changes have been saved`,
              msg: "",
              password: "",
              newpassword: "",
              oldpassword: ""
            });
            auth.signout();
          }
        });
      }
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <Card className={"account-tab"}>
        <CardContent className={"maininner-edit account-edit"}>
          <div className={"edit-headtitle"}>
            <Typography component="div" className={"title-profile"}>
              Account
            </Typography>
            {/**  <Typography component="p" >
              At any time you can come back and update your personal information
              and passwords
            </Typography>**/}
          </div>

          <Typography
            component="div"

            className={"mb-25 form-label-2"}
          >
            Update email
          </Typography>
          <Typography component="div" className={"form-label"}>
            Current email
          </Typography>
          <div className="setting-input-div">
            <TextField
              autoComplete='off'
              id="oldemail"
              type="text"
              fullWidth
              className={"textFieldforms"}
              value={this.state.oldemail}
              margin="normal"
              onChange={this.handleChange("oldemail")}
              InputProps={{
                disableUnderline: true,
                classes: { input: this.props.classes["input"] }
              }}
              autoComplete="off"
            />
            {this.state.errors["oldemail"] &&
              <Typography
                component="p"
                color="error"
                className={"error-input"}
              >
                <Icon color="error" className={classes.error}>
                  error
                  </Icon>
                {this.state.errors["oldemail"]}
              </Typography>}
            {/* {(this.state.errors["oldemailf1"] && (
               <Typography
                  component="p"
                  color="error"
                  className={"error-input"}
                >
                  <Icon color="error" className={classes.error}>
                    error
                  </Icon>
                  {this.state.errors["oldemail"]}
                  {this.state.errors["oldemailf1"]}
                </Typography>
              ))} */}
          </div>
          <Typography component="div" className={"form-label"}>
            New email
          </Typography>
          <div className="setting-input-div">
            <TextField
              autoComplete='off'
              id="newemail"
              type="text"
              fullWidth
              className={"textFieldforms "}
              value={this.state.newemail}
              margin="normal"
              onChange={this.handleChange("newemail")}
              InputProps={{
                disableUnderline: true,
                classes: { input: this.props.classes["input"] }
              }}
            />
            {this.state.errors["newemail"] && (
              <Typography
                component="p"
                color="error"
                className={"error-input"}
              >
                <Icon color="error" className={classes.error}>
                  error
                  </Icon>
                {this.state.errors["newemail"]}{" "}
              </Typography>
            )}
          </div>
          <CardActions className={"edit-account"}>
            <CustomButton
              label="Save"
              onClick={this.clickUpdateEmail}
              className={"Primary_btn_blk"}
            />
          </CardActions>

          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right"
            }}
            open={this.state.open}
            // onClose={this.handleRequestClose}
            autoHideDuration={6000}
            message={<span>{this.state.success}</span>}
          />

          <Typography
            component="div"

            className={"mb-25 form-label-2"}
          >
            Update Password
          </Typography>

          <div>
            <Typography component="div" className={"form-label"}>
              Current Password
            </Typography>
            <div className={"setting-input-div"}>
              <TextField
                autoComplete="off"
                value=""
                id="password"
                type="password"
                fullWidth
                className={"textFieldforms "}
                value={this.state.oldpassword}
                InputProps={{
                  disableUnderline: true,
                  classes: { input: this.props.classes["input"] }
                }}
                margin="normal"
                onChange={this.handleChange("oldpassword")}
              />
              {this.state.errors["oldpassword"] && (
                <Typography
                  component="p"
                  color="error"
                  className={"error-input"}
                >
                  <Icon color="error" className={classes.error}>
                    error
                  </Icon>
                  {this.state.errors["oldpassword"]}
                </Typography>
              )}
            </div>
            <Typography component="div" className={"form-label"}>
              New Password
            </Typography>
            <div className={"setting-input-div"}>
              <TextField
                autoComplete='off'
                id="newpassword"
                type="password"
                fullWidth
                className={"textFieldforms "}
                value={this.state.newpassword}
                margin="normal"
                onChange={this.handleChange("newpassword")}
                InputProps={{
                  disableUnderline: true,
                  classes: { input: this.props.classes["input"] }
                }}
              />
              {this.state.errors["newpassword"] && (
                <Typography
                    component="div"
                    variant="div"
                    color="error"
                    className={"error-input flex_box_start"}
                  >
                  <Icon color="error" className={classes.error}>
                    error
                  </Icon>
                  <Typography
                      component="p"
                      color="error"
                      className={"error_txt_blk"}>{this.state.errors["newpassword"]}
                      </Typography>
                </Typography>
              )}
            </div>
            <Typography component="div" className={"form-label"}>
              Confirm New Password
            </Typography>
            <div className={"setting-input-div"}>
              <TextField
                autoComplete='off'
                id="confirmpassword"
                type="password"
                fullWidth
                className={"textFieldforms "}
                value={this.state.password}
                margin="normal"
                onChange={this.handleChange("password")}
                InputProps={{
                  disableUnderline: true,
                  classes: { input: this.props.classes["input"] }
                }}
              />
              {(this.state.msg ||
                this.state.errors["password"]) && (
                  <Typography
                    component="div"
                    color="error"
                    className={"error-input flex_box_start"}
                  >
                    <Icon color="error" className={classes.error}>
                      error
                    </Icon>
                    <Typography
                      component="p"
                      color="error"
                      className={"error_txt_blk"}>{this.state.msg} {this.state.errors["password"]}
                  </Typography>
                  </Typography>
                )}
            </div>

            <CardActions className={"edit-account"}>
              <CustomButton
                label="Save"
                onClick={this.clickSubmit}
                className={"Primary_btn_blk"}
              />
            </CardActions>
            <div className={"delete-account"}>
              <Typography className={"gray-9"} component={"h3"} >
                Delete this account
              </Typography>
              <Typography component="p" className={"gray-9"}>
                This action will permanently delete your account.
				     </Typography>
              <Typography component="div" className={"gray-9"}>Are you sure
                you wish to proceed ? <DeleteUser userId={this.props.userId} />
              </Typography>
            </div>
          </div>
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right"
            }}
            open={this.state.open}
            onClose={this.handleRequestClose}
            autoHideDuration={6000}
            message={<span>{this.state.passwordmsg}</span>}
          />
        </CardContent>
      </Card>
    );
  }
}

Account.propTypes = {
  classes: PropTypes.object.isRequired,
  account: PropTypes.array.isRequired
};

export default withStyles(styles)(Account);
