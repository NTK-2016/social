import React, { Component } from "react";
import { withStyles } from "material-ui/styles";
import Typography from "material-ui/Typography";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Switches from "material-ui/Switch";
import PropTypes from "prop-types";
import {
  FormGroup,
  FormControlLabel,
  FormControl,
  FormLabel
} from "material-ui";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import { TextField } from "material-ui";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import Privacy from "../Privacy";
import auth from "../../auth/auth-helper";
import { subscriptionAndPitch, fetchenableStanBtnStatus } from "../api-user";
import Snackbar from "material-ui/Snackbar";
import Icon from "material-ui/Icon";
import CustomButton from "../../common/CustomButton";
import CustomSwitch from "../../common/CustomSwitch";
import {
  required,
  countError,
  validatelink,
  requiredValue
} from "../../common/ValidatePost";
import SideLoader from "./../../common/SideLoader";
import { Link } from "react-router-dom";
const styles = theme => ({
  root: {
    width: 1000,
    height: 100
  },
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(12, 1fr)",
    gridGap: 5
  },
  paper: {
    padding: 5,
    textAlign: "center",
    color: theme.palette.text.secondary,
    whiteSpace: "nowrap",
    marginBottom: 5
  },
  divider: {
    margin: 10
  },
  stanbtnvisible: {
    visibility: "hidden"
  }
});

class SubscriptionandPitch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: "",
      price: "",
      stanbtn: false,
      presentyourself: "",
      videourl: "",
      SubscriptionandPitch: 0,
      open: false,
      errors: [],
      loader: false
    };
    this.props = props;
  }
  // fetch reccord of subscription and pitch data
  componentDidMount = () => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    this.userData = new FormData();
    const jwt = auth.isAuthenticated();
    fetchenableStanBtnStatus(
      { userId: this.props.userId },
      {
        t: jwt.token
      }
    ).then(data => {
      if (data.error) {
        console.log(data);
      } else {
        this.userData.set("stanbtn", data.stanbtn);
        this.setState({ stanbtn: data.stanbtn })
        //if (data.stanbtn) {
        let price = "";
        data.planInfo.forEach(plandata => {
          if (plandata.status == 1) {
            price = plandata.amount;
          }
        });
        console.log("price" + price)
        if (price != "") {
          this.userData.set("price", price);
        }
        if (data.presentyourself) {
          this.userData.set("presentyourself", data.presentyourself);
        }
        if (data.videourl) {
          this.userData.set("videourl", data.videourl);
        } else {
          this.userData.set("videourl", "");
        }
        var v = "";
        var presentYourSelf = "";
        if (data.videourl) {
          v = data.videourl;
        }
        if (data.presentyourself) {
          presentYourSelf = data.presentyourself;
        }
        this.setState({
          price: price,
          presentyourself: presentYourSelf,
          videourl: v
        });
      }
      //  }
    });
  };
  // set value of formdata on handlechange
  handleChange = name => event => {
    let errors = this.state.errors;
    const value =
      name === "stanbtn" ? event.target.checked : event.target.value;
    this.userData.set(name, value);
    if (value != "") {
      errors[name] = false;
      this.setState({ errors: errors });
    }
    this.setState({ [name]: value });
  };
  // Snackbar closed popup
  handleRequestClose = (event, reason) => {
    this.setState({ open: false });
  };
  //validation for formdata
  handleValidation() {
    let errors = {};
    let res = [];
    let formIsValid = true;
    if (this.state.stanbtn) {
      console.log(this.state.presentyourself + "  tetw ");
      errors["price"] = required(this.state.price, "This is a required field.");
      res.push(required(this.state.price, "This is a required field."));
      if (this.state.price != "") {
        errors["price"] = requiredValue(
          this.state.price,
          "Please enter amount greater than zero."
        );
        res.push(
          requiredValue(this.state.price, "Please enter amount greater than zero")
        );
      }
      //errors["presentyourself"] = required(this.state.presentyourself,"This is a required field.");
      //res.push(required(this.state.presentyourself, "This is a required field."));
      errors["videourl"] = validatelink(this.state.videourl, "Enter links only.");
      res.push(validatelink(this.state.videourl, "Enter links only."));
      var count = countError(res);
      console.log(" count " + errors + " errors length " + errors.length);
      if (count > 0) {
        formIsValid = false;
        this.setState({ errors: errors });
      } else {
        this.setState({ errors: [] });
      }
    }
    console.log(errors);
    return formIsValid;
  }
  // update subscription and pitch data
  clickSubmit = () => {
    this.setState({ SideLoader: true });
    //console.log("StanBtn" + this.state.stanbtn);
    const jwt = auth.isAuthenticated();
    if (this.handleValidation()) {
      this.setState({ errors: [] });
      //console.log(" inside handleValidation check")
      subscriptionAndPitch(
        {
          userId: this.props.userId
        },
        {
          t: jwt.token
        },
        this.userData
      ).then(data => {
        if (data.error) {
          console.log(this.state.error);
          this.setState({ error: data.error });
        } else {
          console.log(this.state.error);
          let userInfo = JSON.parse(localStorage.getItem("jwt"));
          // console.log(userInfo.user.stanEnabled);
          userInfo.user.stanEnabled = this.state.stanbtn;
          localStorage.setItem("jwt", JSON.stringify(userInfo));
          this.setState({
            SideLoader: false,
            redirectToProfile: false,
            open: true,
            SubscriptionandPitch: `Changes have been saved`
          });
        }
      });
    }
    else {
      this.setState({ SideLoader: false });
    }
  };

  checkNumber = evt => {
    // var iKeyCode = (event.which) ? event.which : event.keyCode
    // if (iKeyCode != 46 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57))
    //   return false;

    // return true;
    const price = evt.target.validity.valid
      ? evt.target.value
      : this.state.price;
    const errors = this.state.errors;
    if (price != "") {
      errors["price"] = false;
      this.setState({ errors: errors });
    } else {
      errors["price"] = "This is a required field.";
      this.setState({ errors: errors });
    }
    this.setState({ price });
    this.userData.set("price", price);
  };

  render() {
    console.log(" this.state.stanbtn " + this.state.stanbtn);
    const { classes } = this.props;
    return (
      <section>
        <div className={"subscription subscription-container"}>
          <Grid>
            <Grid item xs={11}>
              <Card className={"subscription-card"}>
                <CardContent className={"subscription-inner"}>
                  <Grid
                    className={"subscription-block subscription-title-block"}
                    item
                    xs={12}
                    sm={12}
                  >
                    <Typography component="h1">Set up subscription</Typography>
                    <Typography component="h3" className={"peighteen"}>
                      Set up a monthly subscription plan to offer exclusive content to your followers
                    </Typography>
                  </Grid>
                  <Grid className={"subscription-block"} item xs={12} sm={12}>
                    <Typography component="h2" className={"border-line"}>
                      Add a stan Button
                    </Typography>
                    <Typography component="p" className={"pforteen"}>
                      Once enabled, the Stan button will be visible on your
                      profile and will allow people to subscribe to you.
                    </Typography>
                    <Typography component="div" className={"btn-abled"}>
                      {/**<FormControlLabel control={
						<Switches color="primary" onChange={this.handleChange('stanbtn')} checked={this.state.stanbtn} />} />**/}
                      <CustomSwitch
                        className={"customswitch"}
                        onChange={this.handleChange("stanbtn")}
                        checked={this.state.stanbtn}
                      />

                      {!this.state.stanbtn ? (
                        <Typography component="p">Disabled</Typography>
                      ) : (
                          <Typography component="p">Enabled</Typography>
                        )}
                    </Typography>
                  </Grid>

                  {/** <Grid className={"subscription-block"}>
                             <Typography>
                              Before adding your subscription.<br/>
                      
                              <Link to={"/"}> Add your bank details</Link>  to get paid into wallet.
                                
                          </Typography>
                          
							 </Grid>**/}

                  <Typography
                    component="div"
                    className={
                      !this.state.stanbtn ? "disable-subscription" : ""
                    }
                  >
                    <Grid className={"subscription-block"}>
                      <Typography
                        className={"subscription-block"}
                        component="h2"
                      >
                        Price per month
                      </Typography>
                      <Typography
                        component="div"
                        className={"subscription-price"}
                      >
                        <input
                          placeholder=""
                          value={this.state.price}
                          disabled={!this.state.stanbtn}
                          className={"subscription-price"}
                          type="text"
                          pattern="^\d*(\.\d{0,2})?$"
                          onChange={this.checkNumber.bind(this)}
                        />
                      </Typography>
                      {this.state.errors["price"] && (
                        <Typography
                          component="p"
                          color="error"
                          className={"error-input"}
                        >
                          {" "}
                          <Icon color="error" className={classes.error}>
                            error
                          </Icon>
                          {this.state.errors["price"]}
                        </Typography>
                      )}
                    </Grid>

                    <Grid
                      className={"subscription-block"}
                      disabled={!this.state.stanbtn}
                    >
                      <FormGroup>
                        <Typography component="h2" className={"border-line"}>
                          Privacy
                        </Typography>
                        <Typography component="p">
                          Control who see these details on your profile
                        </Typography>
                        <Privacy
                          userId={this.props.userId}
                          statusBtn={this.state.stanbtn}
                        />
                      </FormGroup>
                    </Grid>
                    <Grid className={"subscription-block"}>
                      <FormGroup>
                        <Typography className={"border-line"} component="h2">
                          Tell People why they should stan you
                        </Typography>
                        <Typography component="p" className={"pforteen mt-10"}>
                          Let the Stan.Me community know more about you. This is
                          your opportunity to let them know what your content is
                          about and why they should Stan and support you. If you
                          wish, you can do this in a video.{" "}
                        </Typography>
                        <Grid className={"attachment-container"}>
                          <TextareaAutosize
                            rows={"10"}
                            placeholder={"Write Something ....."}
                            onChange={this.handleChange("presentyourself")}
                            value={this.state.presentyourself}
                            disabled={!this.state.stanbtn}
                          />
                          {this.state.errors["presentyourself"] && (
                            <Typography
                              component="p"
                              color="error"
                              className={"error-input attached-error"}
                            >
                              {" "}
                              <Icon color="error" className={classes.error}>
                                error
                              </Icon>
                              {this.state.errors["presentyourself"]}
                            </Typography>
                          )}

                          <Grid className={"add-video-box"}>
                            <Typography
                              component="p"
                              className={"add-videotitle"}
                            >
                              Add a Video (Optional)
                            </Typography>
                            <Typography
                              component="div"
                              className={"attachment-icon add_video_blk"}
                            >
                              <TextField
                                className={"video-url"}
                                placeholder={
                                  "Type or paste one video URL (embedded supported such as youtube, vimeo or more)"
                                }
                                onChange={this.handleChange("videourl")}
                                value={this.state.videourl}
                                disabled={!this.state.stanbtn}
                              />
                            </Typography>
                            {this.state.errors["videourl"] && (
                              <Typography
                                component="div"
                                className={"error-input"}
                                color="error"
                              >
                                {" "}
                                <Icon color="error" className={classes.error}>
                                  error
                                </Icon>{" "}
                                {this.state.errors["videourl"]}
                              </Typography>
                            )}
                          </Grid>
                        </Grid>
                      </FormGroup>
                    </Grid>
                  </Typography>

                  <CustomButton
                    label="Save"
                    onClick={this.clickSubmit}
                    className={"Primary_btn_blk flt-rt"}
                    disabled={this.state.SideLoader}
                  />
                  {this.state.SideLoader && <SideLoader />}
                </CardContent>
              </Card>
            </Grid>
            <Snackbar
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right"
              }}
              open={this.state.open}
              onClose={this.handleRequestClose}
              autoHideDuration={1000}
              message={<span>{this.state.SubscriptionandPitch}</span>}
            />
          </Grid>
        </div>
      </section>
    );
  }
}
SubscriptionandPitch.propTypes = {
  classes: PropTypes.object.isRequired
  // SubscriptionandPitch: PropTypes.array.isRequired,
};

export default withStyles(styles)(SubscriptionandPitch);
