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
import { checkemail } from "./api-user.js";
import DeleteUser from "./DeleteUser";
import Snackbar from "material-ui/Snackbar";
import CustomButton from "./../common/CustomButton";
import { Link } from "react-router-dom";

const styles = theme => ({
  card: {
    maxWidth: 410,
    margin: "auto",
    marginTop: "20px",
    marginBottom: theme.spacing.unit * 5,
    padding: "10px 24px 24px 24px",

    boxShadow: "none"
  },
  error: {
    verticalAlign: "middle"
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
  cardcontent: {
    padding: "0px"
  },
  cardaction: {
    paddingLeft: "0px",
    paddingRight: "0px",
    // paddingTop: "40px"
  },
  forpwd: {
    marginLeft: "auto",
    marginRight: "10px"
  }
});
const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

class ForgetEmail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      success: "",
      error: "",
      redirectToProfile: false,
      open: false,
      msg: ""
    };
    this.props = props;
  }
  componentDidMount = () => {
    this.userData = new FormData();
  };
  handleChange = name => event => {
    const value = event.target.value;
    this.userData.set(name, value);
    this.setState({ [name]: value, error: "", success: "" });
  };
  handleRequestClose = (event, reason) => {
    this.setState({ open: false });
  };
  clickSubmit = () => {
    this.setState({ success: "", error: "" });
    checkemail({
      value: this.state.email
    }).then(data => {
      data.count
        ? this.setState({
          email: "",
          success: "Please check your emails to proceed."
        })
        : this.setState({ error: "Invalid Email" });
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <section>
        <Typography component="div" className={"reset-pwd"}>
          <Card className={classes.card}>
            <CardContent className={classes.cardcontent}>
              <Typography
                type="headline"
                component="h2"
                className={classes.title}
              >
                Reset your Password
              </Typography>
              <Typography component="p">
                Enter your email address and Stan.me Team will email you a link
                to reset your password.
              </Typography>
              <span style={{ color: "red" }}>{this.state.msg} </span>
              <Typography component="div" className={"form-label"}>
                E-mail
              </Typography>
              <Typography component="div" className={"input-div "}>
                <TextField
                  id="mailid"
                  type="email"
                  value={this.state.email}
                  className={classes.textField}
                  margin="0"
                  onChange={this.handleChange("email")}
                  InputProps={{
                    disableUnderline: true,
                    classes: { input: this.props.classes["input"] },
                    style: {
                      padding: 0
                    }
                  }}
                />

                {this.state.error && (
                  <Typography
                    variant="span"
                    component="span"
                    className={"error-input"}
                    style={{ color: "red" }}
                  >
                    <Icon color="error" className={classes.error}>
                      error
                  </Icon>
                    <Typography
                      component="p"
                      variant="p"
                      color="error"
                      className={"error_txt_blk"}>
                      {this.state.error}
                    </Typography>
                  </Typography>
                )}
                {this.state.success && (
                  <Typography
                    variant="span"
                    component="span"
                    className={"success-input"}
                    style={{ color: "green" }}
                  >
                    <Icon className={"material-icons"}>
                      done
                    </Icon>

                    {this.state.success}
                  </Typography>
                )}
              </Typography>

            </CardContent>
            <CardActions className={classes.cardaction} >
              <Typography component="div" className={classes.forpwd}>
                <Link to={"/signin"} className={classes.linked}>
                  <CustomButton
                    label="Back"
                    variant="raised"
                    className={"Secondary_btn"}
                  />
                </Link>
              </Typography>
              <Typography component="div">
                <CustomButton
                  label="Confirm"
                  variant="raised"
                  disabled={this.state.email.length === 0}
                  onClick={this.clickSubmit}
                  className={"Primary_btn_blk"}
                />
              </Typography>

              {/*  <Button color="primary" className={classes.submit} variant="raised" onClick={this.clickSubmit} >send Confirmation</Button>*/}
            </CardActions>
            <CardContent>
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
        </Typography>
      </section>
    );
  }
}

ForgetEmail.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ForgetEmail);
