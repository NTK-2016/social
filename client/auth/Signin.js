import React, { Component } from 'react'
import Card, { CardActions, CardContent } from 'material-ui/Card'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
//import TextField from '@material-ui/core/TextField'
import Typography from 'material-ui/Typography'
import Icon from 'material-ui/Icon'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import auth from './../auth/auth-helper'
import { Redirect, Link } from 'react-router-dom'
import { signin } from './api-auth.js'
import CustomButton from './../common/CustomButton'
import { required, countError } from '../common/ValidatePost'
import { readnotification } from '../user/api-user.js'
import { readRoom } from "./../chat/api-chat.js";

const styles = theme => ({
  card: {
    // maxWidth: 410,
    // margin: 'auto',
    // marginTop: '10px',
    // marginBottom: theme.spacing.unit * 5,
    // padding: '10px 24px 24px 24px',
    // boxShadow: 'none',
  },
  error: {
    verticalAlign: 'middle'
  },

  textField: {
    margin: '0',

    width: '100%',
  },
  submit: {
    margin: 'auto',
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
    // border: '1px solid #CCCCCC',
    // borderRadius: '4px',
    // padding: '7px 15px',
    // boxSizing: 'border-box',
    // width: '100%',
    // lineHeight: '21px',
    // fontSize: '16px',
    // fontFamily: 'Helvetica',
    // fontWeight: 'normal',
    // height: '35px',
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
  link: {
    fontSize: '14px',
    fontFamily: 'Helvetica',
    fontWeight: 'normal',
  },
  linked: {
    fontSize: '14px',
    fontFamily: 'Helvetica',
    fontWeight: 'normal',
    textDecoration: 'underline',
    color: '#000',
  },
  forpwd:
  {
    margin: '0px 0 8px 0',
    fontSize: '16px',
    fontFamily: 'Helvetica',
    fontWeight: 'normal',
    lineHeight: '20px',
  },
})

const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};


class Signin extends Component {
  state = {
    email: '',
    password: '',
    error: '',
    redirectToReferrer: false,
    errors: {},
  }

  componentDidMount = () => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }

  clickSubmit = () => {
    const user = {
      email: this.state.email || undefined,
      password: this.state.password || undefined
    }
    if (this.validateTextFields()) {
      signin(user).then((data) => {
        if (data.error) {
          this.setState({ error: data.error })
        } else {
          auth.authenticate(data, () => {
            window.location = "/";
            //this.setState({ redirectToReferrer: true })
          })
          var elmnt = document.getElementById("after");
          elmnt.classList.add("navmain");
        }
      })
    }
  }
  validateTextFields = () => {
    let errors = {};
    let res = [];
    let formIsValid = true;
    errors["email"] = required(this.state.email, "Email is required")
    res.push(required(this.state.email, "Email is required"))
    errors["password"] = required(this.state.password, "Password is required")
    res.push(required(this.state.password, "Password is required"))
    var count = countError(res)
    if (count > 0) {
      formIsValid = false;
      this.setState({ errors: errors })
    }
    return formIsValid;
  }
  handleChange = name => event => {
    let errors = this.state.errors
    errors[name] = false
    this.setState({ [name]: event.target.value, errors: errors, error: '' })
  }

  _handleKeyDown = e => {
    if (e.key === "Enter") {
      e.preventDefault()
      this.clickSubmit();
    }
  };

  render() {
    const { classes } = this.props
    const { from } = this.props.location.state || {
      from: {
        pathname: '/'
      }
    }
    const { redirectToReferrer } = this.state
    if (auth.isAuthenticated()) {
      return (<Redirect to={from} />)
    }

    return (<section className={"signup-content log-in"}>
      <Card className={classes.card}>
        <CardContent className={"signup_inner"}>
          <Typography type="headline" component="h2" className={classes.title}>
            Log In
          </Typography>
          <Typography component="div" className={"form-label"}>
            Email or username
        </Typography>
          <Typography component="div" className={"input-div "}>
            <TextField id="email"
              type="email"

              className={classes.textField} value={this.state.email}
              onChange={this.handleChange('email')}
              margin="none"
              InputProps={{
                disableUnderline: true, classes: { input: this.props.classes['input'] }, style: {
                  padding: 0
                }
              }}
              autoComplete="off"
            />
            {
              this.state.errors["email"] && (<Typography component="p" color="error" className={"error-input"}>
                <Icon color="error" className={classes.error}>error</Icon>
                {this.state.errors["email"]}</Typography>)
            }
          </Typography>
          <Typography component="div" className={"form-label"}>
            Password
        </Typography>
          <Typography component="div" className={"input-div "}>
            <TextField id="password"
              type="password"
              className={classes.textField} value={this.state.password}
              onChange={this.handleChange('password')}
              margin="none"
              InputProps={{
                disableUnderline: true, classes: { input: this.props.classes['input'] }, style: {
                  padding: 0
                }
              }}
              onKeyDown={this._handleKeyDown}

            />
            {
              this.state.errors["password"] && (<Typography component="p" color="error" className={"error-input"}>
                <Icon color="error" className={classes.error}>error</Icon>
                {this.state.errors["password"]}</Typography>)
            }
            {
              this.state.error && (<Typography component="p" color="error" className={"error-input-act"}>
                <Icon color="error" className={classes.error}>error</Icon>
                {this.state.error}
              </Typography>)
            }
          </Typography>

          <CardActions className={classes.cardaction}>
            <CustomButton label="Log In" variant="raised" onClick={this.clickSubmit} disabled={this.state.password.length === 0} className={"Primary_btn_blk"} style="width:100%" />
            {/*  <Button color="primary" variant="raised" onClick={this.clickSubmit} className={classes.submit}>Submit</Button>*/}
          </CardActions>
          <Typography component="p" className={classes.forpwd}>Forgot your  <Link to={"/forgotpwd"} className={"sign-pwd"}>password?</Link></Typography>
          <Typography component="div" className={"log-not-reg"}>
            Not registered yet? <Link to={"/signup"} className={classes.link}>Sign Up</Link>
          </Typography>
        </CardContent>

      </Card>
    </section>
    )
    // }, 100);
    // return ;
  }
}

Signin.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Signin)
