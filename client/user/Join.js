import React, { Component } from "react";
import Card, { CardActions, CardContent } from "material-ui/Card";
import Button from "material-ui/Button";
import TextField from "material-ui/TextField";
import Typography from "material-ui/Typography";
import Grid from "material-ui/Grid";
import Box from "@material-ui/core/Box";
import Icon from "material-ui/Icon";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import { create } from "./api-user.js";
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "material-ui/Dialog";
import auth from "./../auth/auth-helper";
import { Redirect, Link } from "react-router-dom";
import { checkusername } from "./api-user.js";
import CustomButton from "./../common/CustomButton";
import {
  required,
  vaildateEmail,
  countError,
  strongPassword,
  strongUsername
} from "./../common/ValidatePost";
import Home from "../core/Home.js";

let validField = [];
const styles = theme => ({
  card: {
    maxWidth: "410px",
    margin: "auto",
    marginBottom: theme.spacing.unit * 5,
    padding: "10px 24px 24px 24px",
    boxShadow: "none",
    marginTop: "20px"
  },
  error: {
    verticalAlign: "middle"
  },

  title: {
    fontSize: "30px",
    lineHeight: "30px",
    color: "#000",
    fontFamily: "Helvetica-Bold",
    fontWeight: "normal",
    paddingBottom: "40px"
  },
  textField: {
    margin: "0",

    width: "100%"
  },
  submit: {
    margin: "auto",
    marginBottom: theme.spacing.unit * 2
  },
  input: {
    border: "1px solid #CCCCCC",
    borderRadius: "4px",
    padding: "7px 15px",
    boxSizing: "border-box",
    width: "100%",
    lineHeight: "21px",
    fontSize: "14px",
    fontFamily: "Helvetica",
    fontWeight: "normal",
    height: "42px"
  },
  imgsec: {
    width: "110px",
    height: "auto",
    marginBottom: "30px",
    marginTop: "30px"
  },

  cardcontent: {
    padding: "0px !important"
  },
  cardaction: {
    paddingLeft: "0px",
    paddingRight: "0px",
    paddingTop: "20px",
    paddingBottom: "20px"
  },
  link: {
    textDecoration: "underline",
    color: "#000"
  },
  contenttext: {
    padding: "10px 16px"
  },

  diaction: {
    padding: "0 5px 40px 0",
    justifyContent: "center",
    marginTop: "20px"
  },
  texthead: {
    fontSize: "18px",
    lineHeight: "22px",
    fontFamily: "Helvetica-bold",
    fontWeight: "normal"
  },
  textpara: {
    fontSize: "14px",
    lineHeight: "18px",
    fontFamily: "Helvetica",
    fontWeight: "normal",
    color: "#000"
  },
  textpara1: {
    fontSize: "25px",
    lineHeight: "30px",
    fontFamily: "Helvetica-bold",
    fontWeight: "normal",
    color: "#000",
    margin: "10px 0 15px 0"
  }
});
const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      username: "",
      password: "",
      email: "",
      open: false,
      error: "",
      errors: {},
      userchanged: false,
      formatEmail: "",
      duplicateEmail: "",
      isSuggested: false,
      isUsernameUnique: false,
      formIsValid: true,
      referral: "",
      validlink: false,
      linkmessage: "",
      refername: ""
    };
    this.match = props.match;
  }

  handleChange = name => event => {
    let errors = this.state.errors;
    errors[name] = false;
    this.setState({
      [name]: event.target.value,
      formIsValid: false,
      errors: errors
    });
    if (name == "username") {
      this.setState({ userchanged: true });
      this.checkusername(event.target.value.toLowerCase());
    }
    if (name == "name") {
      let nameStr =
        event.target.value.charAt(0).toUpperCase() +
        event.target.value.slice(1);
      nameStr = nameStr.replace(/[^a-zA-Z ]/g, "");
      this.setState({ [name]: nameStr });
    }
  };
  /* Handle Username Random generate */
  handleUsername = name => event => {
    if (this.state.name) {
      var number = Math.random();
      var uniqueid = number.toString().substr(2, 5);
      var typename = this.state.name;
      typename = typename.replace(/\s/g, "");
      typename = typename.toLowerCase();
      this.checkusername(typename);
    }
  };
  componentDidMount = () => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    var username = this.match.params.userName;
    checkusername({
      value: username
    }).then(data => {
      if (data.count) {
        this.setState({
          referral: data._id,
          validlink: true,
          refername: data.name
        });
      } else {
        this.setState({
          validlink: false,
          linkmessage: "Invalid Referral Link"
        });
      }
    });
  };
  /* End Handle Username Random Generate */
  /* Check Again username exists */
  checkusername = name => {
    if (this.state.isSuggested === false) {
      if (name !== "") {
        checkusername({
          value: name
        }).then(data => {
          if (!data.count) {
            this.setState({ username: name });
          } else {
            if (!this.state.userchanged) {
              var number = Math.random();
              var uniqueid = number.toString().substr(2, 5);
              var username = name + uniqueid;
              this.checkusername(username);
            } else {
              if (!this.state.username) {
                var number = Math.random();
                var uniqueid = number.toString().substr(2, 5);
                var username = name + uniqueid;
                this.checkusername(username);
              }
            }
          }
          this.setState({ isSuggested: true });
        });
      }
    }
  };
  /* End Check Again Username exist */
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
    errors["email"] = required(this.state.email, "Email is required");
    res.push(required(this.state.email, "Email is required"));
    errors["formatEmail"] = vaildateEmail(
      this.state.email,
      "Enter a valid email address"
    );
    res.push(vaildateEmail(this.state.email, "Enter a valid email address"));
    errors["password"] = required(this.state.password, "Password is required");
    res.push(required(this.state.password, "Password is required"));
    if (errors["password"] == false) {
      errors["password"] = strongPassword(
        this.state.password,
        "Must be eight characters or longer and should contain at least 1 lowercase alphabet, 1 uppercase alphabet, 1 numeric and 1 special character"
      );
      res.push(
        strongPassword(
          this.state.password,
          "Must be eight characters or longer and should contain at least 1 lowercase alphabet, 1 uppercase alphabet, 1 numeric and 1 special character"
        )
      );
    }

    var count = countError(res);
    if (count > 0) {
      formIsValid = false;
      this.setState({ errors: errors, formIsValid: false });
    }
    return formIsValid;
  };
  clickSubmit = () => {
    this.setState({
      error: {},
      errors: {},
      duplicateEmail: "",
      formIsValid: true
    });
    let errors = this.state.errors;
    let res = [];
    /* Start Check Unique Username */
    checkusername({
      value: this.state.username
    }).then(data => {
      if (!data.count) {
        this.setState({ isUsernameUnique: true, errors: errors });
      } else {
        this.setState({
          isUsernameUnique: false,
          error: {},
          formIsValid: false
        });
      }
    });
    /* End Check unique Username */
    sleep(100).then(() => {
      if (this.validateTextFields()) {
        if (this.state.isUsernameUnique) {
          const user = {
            name: this.state.name || undefined,
            username: this.state.username || undefined,
            email: this.state.email || undefined,
            password: this.state.password || undefined,
            referral: this.state.referral || undefined
          };

          create(user).then(data => {
            if (data.error) {
              console.log(data.error);
              validField.push(data.error.split(":"));
              sleep(100).then(() => {
                this.setState({
                  error: data.error
                  // duplicateEmail: validField[0][2]
                });
              });
            } else if (data.duplicateEmail) {
              errors["email"] = data.duplicateEmail;
              this.setState({ errors: errors, formIsValid: false });
            } else {
              this.setState({ error: "", open: true });
            }
          });
        } else {
          errors["username"] = "Username already taken";
          this.setState({
            errors: errors,
            error: "",
            formIsValid: false
          });
        }
      }
    });
  };

  render() {
    const { classes } = this.props;
    if (auth.isAuthenticated()) {
      return <Redirect to="/" />;
    }
    if (!this.state.validlink) {
      return (
        <div>
          <section className={"signup-content"}>
            <Card className={classes.card}>
              <CardContent className={classes.cardcontent}>
                <Typography
                  type="headline"
                  component="h2"
                  className={classes.title}
                >
                  {this.state.linkmessage}
                </Typography>
              </CardContent>
            </Card>
          </section>
        </div>
      );
    } else {
      return (
        <div>
          <section className={"full_width_blk join_invited_first_sec"}>
            <Typography variant="h4" component="h4">
              {this.state.refername} invited you to join Stan.Me
            </Typography>
            <Typography variant="body2" className="txt">
              Sign up and join thousands of creators on Stan.Me! The one-stop{" "}
              <br />
              place to build a community and get paid for your creations.
            </Typography>
          </section>
          <section
            className={"full_width_gray_bg third_section join_invited_sec_sec"}
          >
            <Grid container className={"inner_container"}>
              <Grid item xs={12} sm={12} md={4} className={"tool_work"}>
                <Box boxShadow={0} className={"tool_work_inner text-center"}>
                  <Box className={"content_blk_img"}>
                    <img
                      className={"tool_work1_img tool_img"}
                      src="/dist/content_icon.svg"
                      alt=""
                    />
                  </Box>
                  <Grid className={"content_blk"}>
                    <Typography component="h5">
                      Monetise your content
                    </Typography>
                    <Typography variant="body2" component="p" className="txt">
                      Share your creations publicly and enable tipping, or set
                      up a subscription plan to offer exclusive content to your
                      subscribers, your Stans.{" "}
                    </Typography>
                  </Grid>
                </Box>
              </Grid>
              <Grid item xs={12} sm={12} md={4} className={"tool_work"}>
                <Box boxShadow={0} className={"tool_work_inner text-center"}>
                  <Box className={"content_blk_img"}>
                    <img
                      className={"tool_work2_img tool_img"}
                      src="/dist/online_store_icon.svg"
                      alt=""
                    />
                  </Box>
                  <Grid className={"content_blk"}>
                    <Typography component="h5">
                      Your own online store
                    </Typography>
                    <Typography variant="body2" component="p" className="txt">
                      Maximise your revenue with a personal online store for
                      digital and physical products.
                    </Typography>
                  </Grid>
                </Box>
              </Grid>
              <Grid item xs={12} sm={12} md={4} className={"tool_work"}>
                <Box boxShadow={0} className={"tool_work_inner text-center"}>
                  <Box className={"content_blk_img"}>
                    <img
                      className={"tool_work3_img tool_img"}
                      src="/dist/earning_icon.svg"
                      alt=""
                    />
                  </Box>
                  <Grid className={"content_blk"}>
                    <Typography component="h5">Your Earnings</Typography>
                    <Typography
                      variant="body2"
                      component="p"
                      className={"txt text-center"}
                    >
                      {/**Connect your bank account with Strip and withdraw your earnings at any time, with no minimum amount needed.**/}
                      Get paid directly into your bank account, at any time.
                    </Typography>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </section>
          <section className={"signup-content"}>
            <Card className={classes.card}>
              <CardContent className={classes.cardcontent}>
                <Typography
                  type="headline"
                  component="h2"
                  className={classes.title}
                >
                  Sign Up
                </Typography>
                <Typography component="div" className={"form-label"}>
                  Full name
                </Typography>
                <Typography component="div" className={"input-div "}>
                  <TextField
                    id="name"
                    className={classes.textField}
                    value={this.state.name}
                    onChange={this.handleChange("name")}
                    InputProps={{
                      disableUnderline: true,
                      classes: { input: this.props.classes["input"] },
                      style: {
                        padding: 0
                      }
                    }}
                    autoComplete="off"
                  />
                  {this.state.errors["name"] && (
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
                        className={"error_txt_blk"}
                      >
                        {this.state.errors["name"]}
                      </Typography>
                    </Typography>
                  )}
                </Typography>
                <Typography component="div" className={"form-label"}>
                  Email
                </Typography>
                <Typography component="div" className={"input-div "}>
                  <TextField
                    id="email"
                    type="email"
                    className={classes.textField}
                    value={this.state.email}
                    onChange={this.handleChange("email")}
                    InputProps={{
                      disableUnderline: true,
                      classes: { input: this.props.classes["input"] },
                      style: {
                        padding: 0
                      }
                    }}
                    autoComplete="off"
                  />
                  {/* {
              this.state.errors["formatEmail"] && (<Typography component="p" color="error" className={"error-input"}>
                <Icon color="error" className={classes.error}>error</Icon>
                {this.state.errors["formatEmail"]}</Typography>)
            } */}
                  {this.state.errors["email"] != ""
                    ? this.state.errors["email"] && (
                        <Typography
                          component="p"
                          color="error"
                          className={"error-input"}
                        >
                          <Icon color="error" className={classes.error}>
                            error
                          </Icon>
                          {this.state.errors["email"]}{" "}
                        </Typography>
                      )
                    : this.state.errors["formatEmail"] && (
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
                            className={"error_txt_blk"}
                          >
                            {this.state.errors["formatEmail"]}
                          </Typography>
                        </Typography>
                      )}
                </Typography>
                <Typography component="div" className={"form-label"}>
                  Username
                </Typography>
                <Typography component="div" className={"input-div "}>
                  <TextField
                    id="username"
                    className={classes.textField}
                    value={this.state.username}
                    onFocus={this.handleUsername("username")}
                    onChange={this.handleChange("username")}
                    InputProps={{
                      disableUnderline: true,
                      classes: { input: this.props.classes["input"] },
                      style: {
                        padding: 0
                      }
                    }}
                    autoComplete="off"
                  />
                  {this.state.errors["username"] && (
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
                        className={"error_txt_blk"}
                      >
                        {this.state.errors["username"]}
                      </Typography>
                    </Typography>
                  )}
                </Typography>

                <Typography component="div" className={"form-label"}>
                  Password
                </Typography>
                <Typography component="div" className={"input-div "}>
                  <TextField
                    id="password"
                    type="password"
                    className={classes.textField}
                    value={this.state.password}
                    onChange={this.handleChange("password")}
                    InputProps={{
                      disableUnderline: true,
                      classes: { input: this.props.classes["input"] },
                      style: {
                        padding: 0
                      }
                    }}
                    autoComplete="off"
                  />
                  {this.state.errors["password"] && (
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
                        className={"error_txt_blk"}
                      >
                        {this.state.errors["password"]}
                      </Typography>
                    </Typography>
                  )}
                </Typography>
                {this.state.duplicateEmail && (
                  <Typography
                    component="div"
                    color="error"
                    className={"error-input-act flex_box_start"}
                  >
                    <Icon color="error" className={classes.error}>
                      error
                    </Icon>
                    <Typography
                      component="p"
                      color="error"
                      className={"error_txt_blk"}
                    >
                      {this.state.duplicateEmail}
                    </Typography>
                  </Typography>
                )}
                <Typography
                  variant="body2"
                  component="p"
                  className={"sign-agree"}
                >
                  By Signing up, I agree to the Stan.me{" "}
                  <a
                    target="_blank"
                    href="http://help.stan.me/#faq-terms-and-conditions"
                  >
                    Terms & Conditions
                  </a>{" "}
                  and
                  <a
                    target="_blank"
                    href="http://help.stan.me/#faq-privacy-policy"
                  >
                    {" "}
                    Privacy Policy
                  </a>
                  . I also confirm that I am at least 13 years of age.
                </Typography>
              </CardContent>
              <CardActions className={classes.cardaction}>
                <CustomButton
                  label="Sign Up"
                  variant="raised"
                  onClick={this.clickSubmit}
                  className={"Primary_btn_blk"}
                  style="width:100%"
                  disabled={this.state.formIsValid}
                />

                {/*<Button color="primary" variant="raised" onClick={this.clickSubmit} className={classes.submit}>Sign Up</Button>*/}
              </CardActions>
              <Typography component="div" className={"log-not-reg"}>
                {" "}
                Already have an account? <Link to={"/signin"}>Log In</Link>
              </Typography>
            </Card>

            <Dialog
              open={this.state.open}
              disableBackdropClick={true}
              className={"verify-email"}
            >
              <DialogTitle className={"newacctitle"}>
                Thank you for registering!
              </DialogTitle>
              <DialogContent className={classes.contenttext}>
                <img
                  src="../dist/svg_icons/mail.svg"
                  className={classes.imgsec}
                />
                <DialogContentText className={classes.textpara1}>
                  Verify your email address
                </DialogContentText>
                <DialogContentText className={classes.textpara}>
                  Please click on the link in your inbox to verify your email
                  address, to get full access to your account.
                  <br />
                  If you can not find the email in your inbox, check your spam
                  folder.
                </DialogContentText>
              </DialogContent>
              <DialogActions className={classes.diaction}>
                <Link to="/signin">
                  <CustomButton label="Sign In" className={"Primary_btn_blk"} />
                  {/**<Button color="primary"  variant="raised">
                Sign In
  </Button>**/}
                </Link>
              </DialogActions>
            </Dialog>
          </section>
        </div>
      );
    }
  }
}

Signup.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Signup);
