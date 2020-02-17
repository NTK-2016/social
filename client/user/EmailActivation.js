import React, { Component } from "react";
import Card, { CardActions, CardContent } from "material-ui/Card";
import Button from "material-ui/Button";
import Typography from "material-ui/Typography";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import { Link } from "react-router-dom";
import { emailactivatelink } from "./api-user.js";

const styles = theme => ({
  card: {
    maxWidth: 600,
    margin: "auto",
    textAlign: "center",
    boxShadow: "none",
    // border: "1px solid #ccc",
    marginTop: theme.spacing.unit * 5,
    paddingBottom: theme.spacing.unit * 3,
     paddingTop: theme.spacing.unit * 3
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
    color: "green;",
    textAlign: "center",
    margin: "0px 0px 20px 0px",
    fontSize: "1.2em",
    fontFamily: "Helventica, sans-serif,Roboto"
  }
});

class EmailActivation extends Component {
  constructor({ match }) {
    super();
    this.state = {
      status: 1,
      token: Math.floor(Math.random(100) * 1000000000) + new Date().getTime(),
      error: ""
    };
    this.match = match;
  }
  componentDidMount = () => {
    console.log("component did mount");
    const user = {
      token: this.state.token || undefined
    };
    emailactivatelink(
      {
        userId: this.match.params.userId
      },
      user
    ).then(data => {
      if (data.error) {
        this.setState({ error: data.error });
      }
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <section>
        <Card className={classes.card}>
              <Typography component="div" className={classes.text}>
                Your Email is Activated Successfully.
              </Typography>

              <Link to="/signin">
                <Button color="primary"  variant="raised" className={"Primary_btn_blk"}>
                  Sign In
                </Button>
              </Link>
        </Card>
      </section>
    );
  }
}

EmailActivation.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(EmailActivation);
