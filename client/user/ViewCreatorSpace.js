import React, { Component } from "react";
import Card, { CardActions, CardContent } from "material-ui/Card";
import Button from "material-ui/Button";
import Grid from "material-ui/Grid";
import Box from "@material-ui/core/Box";
import Avatar from "material-ui/Avatar";
import auth from "../auth/auth-helper";
import Typography from "material-ui/Typography";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import { Link } from "react-router-dom";
import { payment, getAccountIdByCodeId } from "./api-user.js";
import config from "../../config/config";

const styles = theme => ({
  card: {
    maxWidth: 600,
    margin: "auto",
    textAlign: "center",
    marginTop: theme.spacing.unit * 5,
    paddingBottom: theme.spacing.unit * 2
  },
  error: {
    verticalAlign: "middle"
  },
  title: {
    marginTop: theme.spacing.unit * 2,
    color: theme.palette.openTitle
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 300
  },
  submit: {
    margin: "auto",
    marginBottom: theme.spacing.unit * 2
  },
  text: {
    color: "#fca726",
    textAlign: "center",
    margin: "10px 120px 0px 120px",
    fontSize: "1.2em",
    fontFamily: "Helventica, sans-serif,Roboto"
  }
});

class ViewCreatorSpace extends Component {
  constructor({ match }) {
    super();
    this.state = {
      status: 1,
      token: Math.floor(Math.random(100) * 1000000000) + new Date().getTime(),
      error: "",
      noResponse: true
    };
    this.match = match;
  }
  componentDidMount = () => {
    this.userData = new FormData();
    console.log("component did mount" + this.props.match.params.codeId);
    const jwt = auth.isAuthenticated();
    // var codeId = this.props.match.params.codeId.split("=")
    getAccountIdByCodeId(
      {
        codeId: this.props.match.params.codeId
      },
      {
        t: jwt.token
      }
    ).then(data => {
      if (data.error) {
        this.setState({ error: data.error });
      }
      console.log(data + " length " + data.length);
      //if (data.length > 0) {
      var creatorcategory = JSON.parse(localStorage.creatorcategory);
      console.log(creatorcategory)
      this.userData.set('creatorcategory', creatorcategory)
      this.userData.set("stripe_user_id", data.stripe_user_id);
      this.userData.set("payouttype", 2);
      /* Save Stripe_User_id */
      payment(
        {
          userId: jwt.user._id
        },
        {
          t: jwt.token
        },
        this.userData
      ).then(data => {
        if (data.error) {
          this.setState({ error: data.error });
        } else {
          console.log("Success payment :" + data);
          /* Update local storage value */
          var jwt = JSON.parse(localStorage.jwt);
          jwt.user.name = jwt.user.name;
          jwt.user.username = jwt.user.username;
          jwt.user.email = jwt.user.email;
          jwt.user.creator = 1;
          localStorage.setItem("jwt", JSON.stringify(jwt));
          localStorage.removeItem("creatorcategory");
          this.setState({ noResponse: false })
          /* End Upadte local storage value */
        }
      });
      /* End Save Stripe user Id */
      // }
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <section>
        <Typography component="div">
          <Grid container className={"bec_cre_bkl creator_set_resp"}>
            <Grid
              item
              xs={12}
              lg={12}
              className={"left_part_bla_bg fourth_left_step_sec"}
            >
              <input
                type="hidden"
                className="form-control"
                name="firstname"
                placeholder="First Name"
                onChange={this.update}
              />
              {/** <Box mb={4} fontStyle="normal" className={"cre_pic"}>
                <Avatar
                  className={"bigAvatar"}
                  src={'/api/users/photo/' + auth.isAuthenticated().user._id}
                />
                <Typography component="span" className="circle_blk">
                  C
                </Typography>
              </Box>**/}
              <Box fontSize="h6.fontSize" className={"left_text_blk"}>
                <Typography component="h2" className={"title_big"}>
                  You are all set!{" "}
                </Typography>


              </Box>
              <Typography component="ul" className={"line_indicator"}>
                <Typography component="li"></Typography>
                <Typography component="li"></Typography>
                <Typography component="li"></Typography>
                <Typography
                  component="li"
                  className={"active_line"}
                ></Typography>
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              lg={12}
              className={"right_part_whi_bg button_link fourth_right_step_sec"}
            >
              <Box
                mb={4}
                mt={0}
                variant="h4"
                component="h5"
                className={"title_big20"}
              >
                Browse the creators space{" "}
              </Box>
              <center>
                <Box mb={4} mt={0} component="p">
                  Check out how to add Stans subscription and open the online
                  store. Setting these up early in the process will ensure you
                  are off to a great start.
                </Box>
              </center>


              <Button className={"btn_sec_full_black"} disabled={this.state.noResponse}>
                <Link to={"/creatorspace"}>
                  Visit the Creators Space
                    </Link>
              </Button>


            </Grid>
          </Grid>
        </Typography>
      </section>
    );
  }
}

ViewCreatorSpace.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ViewCreatorSpace);
