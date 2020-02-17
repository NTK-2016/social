import React, { Component } from 'react'
import Card, { CardActions, CardContent } from 'material-ui/Card'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import Typography from 'material-ui/Typography'
import Icon from 'material-ui/Icon'
import Avatar from 'material-ui/Avatar'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import { Redirect } from 'react-router-dom'
import Paper from 'material-ui/Paper'
import auth from './../auth/auth-helper'
import { read, update, checkreset, reset } from './api-user.js'
import DeleteUser from './DeleteUser'
import Snackbar from 'material-ui/Snackbar'
import CustomLoader from './../common/CustomLoader'
import CustomButton from "./../common/CustomButton";
import { required, countError, strongPassword } from './../common/ValidatePost'
import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog'
import { Link } from 'react-router-dom'
const styles = theme => ({
  card: {
    maxWidth: 410,
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing.unit * 5,
    paddingBottom: theme.spacing.unit * 2,
    boxShadow: 'none',
  },
  title: {
    fontSize: '30px',
    lineHeight: '30px',
    color: '#000',
    fontFamily: 'Helvetica-Bold',
    fontWeight: 'normal',
    paddingBottom: '40px',
  },
  error: {
    verticalAlign: 'middle'
  },

  textField: {
    // marginLeft: theme.spacing.unit,
    // marginRight: theme.spacing.unit,
    width: '100%'
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing.unit * 2
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: 'auto'
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
  cardcontent:
  {
    padding: '0px',
  },
  cardaction:
  {
    paddingLeft: '0px',
    paddingRight: '0px',
    paddingTop: '5px',
    paddingBottom: '30px',
  },
  filename: {
    marginLeft: '10px'
  }
})
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

class ForgetPassword extends Component {
  constructor({ match }) {
    super()
    this.state = {
      newpassword: '',
      password: '',
      token: '',
      error: '',
      redirectToProfile: false,
      userId: '',
      open: false,
      msg: '',
      loader: true,
      valid: true,
      success: false,
      errors: {}
    }
    this.match = match
  }
  componentDidMount = () => {
    const jwt = auth.isAuthenticated()
    checkreset({
      value: this.match.params.token
    }, { t: jwt.token }).then((data) => {
      if (data.count) {
        this.setState({ loader: false, valid: true })
      }
      if (!data.count) {
        this.setState({ loader: false, valid: false })
      }
    })
  }

  handleChange = name => event => {
    let errors = this.state.errors
    errors[name] = false
    const value = event.target.value
    this.setState({ [name]: value, error: "" })
  }
  handleRequestClose = (event, reason) => {
    this.setState({ open: false })
  }

  handleValidation() {
    let errors = {};
    let res = [];
    let formIsValid = true;
    errors["newpassword"] = required(this.state.newpassword, "Password is required");
    res.push(required(this.state.newpassword, "Password is required"));
    errors["password"] = required(this.state.password, "Confirm password is required");
    res.push(required(this.state.password, "Confirm password is required"));
    if( errors["newpassword"]==false){
      errors["newpassword"] = strongPassword(this.state.newpassword, "Must be eight characters or longer and should contain at least 1 lowercase alphabet, 1 uppercase alphabet, 1 numeric and 1 special character");
      res.push(strongPassword(this.state.newpassword, "Must be eight characters or longer and should contain at least 1 lowercase alphabet, 1 uppercase alphabet, 1 numeric and 1 special character"));
  
    }
    if(errors["password"] == false){
    if(this.state.newpassword!=this.state.password){
      errors["password"] = "Password and confirm Password not match" ;
      res.push("Password and confirm Password not match");
    }
  }

    console.log(res);
    var count = countError(res);
    if (count > 0) {
      formIsValid = false;
      this.setState({
        errors: errors,
      });
    }
    console.log(formIsValid);
    return formIsValid;
  }


  clickSubmit = () => {
    let errors = this.state.errors
    if (this.handleValidation()) {
      console.log(this.state.newpassword + "===" + this.state.password)
      if (this.state.newpassword === this.state.password) {
        reset({
          newpassword: this.state.newpassword,
          token: this.match.params.token
        }).then((data) => {
          if (data.count) {
            this.setState({ valid: true, open: true, newpassword: '', password: '', success: true })
          }
          if (!data.count) {
            this.setState({ valid: false })
          }
        })
      }
      else {
        errors['conpassowrd'] = "Confirm password doesn't match"
        this.setState({ error: errors })
      }
    }
  }

  render() {
    const { classes } = this.props
    if (this.state.loader) {
      return <CustomLoader />
    } else {
      return (<div>
        {this.state.valid && !this.state.success &&
          <div className={"reset_pass_blk"}>
            <Card className={classes.card}>
              <CardContent >
                <Typography type="headline" component="h2" className={classes.title}>
                  Reset Password
              </Typography>
                <Typography component="div" className={"form-label"}>
                  New Password
        </Typography>
                <Typography component="div" className={"input-div "}>
                  <TextField id="newpassword" type="password"
                    className={classes.textField}
                    value={this.state.newpassword}
                    autoComplete="off"
                    margin="none"
                    InputProps={{
                      disableUnderline: true, classes: { input: this.props.classes['input'] }, style: {
                        padding: 0
                      }
                    }}
                    onChange={this.handleChange('newpassword')} />
                  {this.state.errors["newpassword"] && (
                    <Typography
                      component="p"
                      color="error"
                      className={"error-input"}
                    >
                      <Icon color="error" className={classes.error}>
                        error
                      </Icon>
                      {this.state.errors["newpassword"]}
                    </Typography>
                  )}
                </Typography>
                <Typography component="div" className={"form-label"}>
                  Confirm Password
           </Typography>
                <Typography component="div" className={"input-div "}>
                  <TextField id="confirmpassword" type="password"
                    className={classes.textField}
                    value={this.state.password}
                    onChange={this.handleChange('password')}
                    margin="none"
                    autoComplete="off"
                    InputProps={{
                      disableUnderline: true, classes: { input: this.props.classes['input'] }, style: {
                        padding: 0
                      }
                    }}
                  />
                  {this.state.errors["password"] && (
                    <Typography
                      component="p"
                      color="error"
                      className={"error-input"}
                    >
                      <Icon color="error" className={classes.error}>
                        error
                      </Icon>
                      {this.state.errors["password"]}
                    </Typography>
                  )}
                  {this.state.error != "" &&
                    <Typography component="div" className={"error-input"}>
                      <Icon color="error" className={classes.error}>error</Icon>
                      {this.state.error}
                    </Typography>
                  }
                </Typography>

                <CustomButton
                  label="Confirm"
                  variant="raised"
                  // disabled={this.state.email.length === 0}
                  onClick={this.clickSubmit}
                  className={"Primary_btn_blk"}
                />
              </CardContent>
              <CardActions >

                {/**
                <Button color="primary" variant="raised" className={classes.submit} onClick={this.clickSubmit} >Save</Button>
			  **/}
              </CardActions>
              <CardContent>
                {/* <Snackbar
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                open={this.state.open}
                onClose={this.handleRequestClose}
                autoHideDuration={6000}
                message={<span >{this.state.passwordmsg}</span>}
              /> */}
              </CardContent>

              <Dialog open={this.state.open} disableBackdropClick={true}>
                <DialogTitle>Successfully Changed</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Your Password has been successfully changed.
          </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Link to="/signin">
                  <CustomButton
                    label="Sign In"
                    variant="raised"
                    className={"Primary_btn_blk"}
                  />
                  </Link>
                </DialogActions>
              </Dialog>
            </Card>
          </div>
        }
        {!this.state.valid &&
          <Card className={classes.card}>
            <CardContent className={"invalid_link_txt"}>
              <Typography type="headline" component="h2"  >
                Invalid Link
          </Typography>
            </CardContent>
          </Card>
        }
        {this.state.success &&
          <Card className={classes.card}>
            <CardContent className={"invalid_link_txt"}>
              {/* <Typography type="headline" component="h2"  >
                Successfully Changed
          </Typography> */}
            <Typography type="headline" component="span" className={"success_txt"}>
                Your Password has Been successfully Changed.
          </Typography>
              <Link to="/signin">
              <CustomButton
                label="Sign In"
                variant="raised"
                className={"Primary_btn_blk"}
              />
              </Link>
            </CardContent>
          </Card>
        }
      </div>
      )
    }



  }
}

ForgetPassword.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(ForgetPassword)
