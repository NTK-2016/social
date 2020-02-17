import React, { Component } from "react";
import PropTypes from "prop-types";
//import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from "material-ui/styles";
//import Paper from "material-ui/Paper";
// import List, {
//   ListItem,
//   ListItemAvatar,
//   ListItemSecondaryAction,
//   ListItemText
// } from "material-ui/List";
import Avatar from "material-ui/Avatar";
// import IconButton from "material-ui/IconButton";
import Button from "material-ui/Button";
import Typography from "material-ui/Typography";
// import Divider from "material-ui/Divider";
import auth from "./../auth/auth-helper";
import { categoryuser } from "./../user/api-user.js";
import { Redirect, Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
// import InputBase from "@material-ui/core/InputBase";
// import SearchIcon from "@material-ui/icons/Search";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import OwlCarousel from "react-owl-carousel2";
import config from "../../config/config";
const styles = theme => ({
  title: {
    //margin: `${theme.spacing.unit * 2}px ${theme.spacing.unit}px 0`,
    color: theme.palette.protectedTitle,
    fontSize: "1em"
  },
  bigAvatar: {
    width: 136,
    height: 130,
    border: "3px solid #000"
  },
  card: {
    maxWidth: 383
  },
  media: {
    height: 144
  }
});

const options = {
  margin: 32,
  items: 3,
  nav: true,
  rewind: true,
  autoplay: false,
  loop: false,
  responsive: {
    0: {
      items: 1
    },
    600: {
      items: 2
    },
    1000: {
      items: 3
    }
  }
};

const BootstrapButton = withStyles({
  root: {
    boxShadow: "none",
    textTransform: "none",
    fontSize: "14px",
    margin: "0 7px",
    minHeight: "28px",
    padding: "0 10px",

    border: "1px solid",
    borderRadius: "8px",
    color: "#fff",
    lineHeight: "16px",
    backgroundColor: "#000",
    borderColor: "#000",
    fontFamily: ['"Helvetica"', "Arial"].join(","),
    "&:hover": {
      backgroundColor: "#fff",
      borderColor: "#000",
      color: "#000",
      border: "1px solid #000"
    },
    "&:active": {
      boxShadow: "none",
      backgroundColor: "#fff",
      borderColor: "#000"
    },
    "&:focus": {
      boxShadow: "0 0 0 0rem rgba(0,123,255,.5)"
    }
  }
})(Button);

class HomeSearch extends Component {
  constructor({ match }) {
    super();
    this.state = {
      users: [],
      skip: 0,
      limit: 6,
      redirectToSignin: false
    };
    this.match = match;
  }

  init = () => {
    const jwt = auth.isAuthenticated();
    categoryuser(
      {
        category: this.props.category[0],
        skip: this.state.skip,
        limit: this.state.limit
      },
      {
        t: jwt.token
      }
    ).then(data => {
      if (data.error) {
        //console.log(data[0].error);
        this.setState({ redirectToSignin: true });
      } else {
        this.setState({ users: data, skip: this.state.skip + 1 });
      }
    });
  };
  componentDidMount = () => {
    this.init();
  };

  render() {
    const { classes } = this.props;
    var category = [];
    const redirectToSignin = this.state.redirectToSignin;
    if (redirectToSignin) {
      return <Redirect to="/signin" />;
    }
    return (
      <div className={classes.root}>
        <Typography component="h1" variant="h1" className={"title_search"}>
          {this.props.category[1]}
        </Typography>
        {this.state.users.length > 0 && (
          <Grid container className={"full_con_sec"}>
            <OwlCarousel options={options}>
              {/* ref="car"  */}
              {this.state.users.map((item, i) => {
                return (
                  <Grid key={i} item xs={12} className={"full_con_child"}>
                    <Link to={"/profile/" + item.username}>
                      <Card className={classes.card}>
                        <CardActionArea>
                          <CardMedia
                            className={classes.media}
                            image={
                              item.banner ? config.bannerImageBucketURL + item.banner : config.bannerDefaultPath
                            }
                            // image={
                            //   item._id
                            //     ? `/api/users/banner/${
                            //     item._id
                            //     }?${new Date().getTime()}`
                            //     : "/api/users/defaultbanner"
                            // }
                            title="Contemplative Reptile"
                          />
                        </CardActionArea>
                        <CardContent className={"art_oval_outer"}>
                          <Typography
                            className={"art_oval_icon"}
                            component="div"
                            variant="div">
                            <Avatar
                              src={item.photo ? config.profileImageBucketURL + item.photo : config.profileDefaultPath}
                              className={classes.bigAvatar}
                            />
                            {item.creater.status == 1 && (
                              <span className={"circle_blk"}>C</span>
                            )}
                          </Typography>
                          <Typography
                            gutterBottom
                            className={"art_title"}
                            component="h2"
                            variant="h2"
                            align="center"
                          >
                            {item.name}
                            <span>@{item.username}</span>
                          </Typography>

                          <Typography variant="div" component="div" className={"art_btn"}>
                            {item.creatorcategory &&
                              item.creatorcategory.map((singlecategory, j) => {
                                return (
                                  j < 3 && (
                                    <BootstrapButton
                                      key={j}
                                      size="small"
                                      //variant="contained"
                                      color="primary"
                                      className={classes.button}
                                    >
                                      {singlecategory.name}
                                    </BootstrapButton>
                                  )
                                );
                              })}
                            {/*<BootstrapButton size="small" variant="contained" color="primary" className={classes.button}>                                            
                                                {this.props.category}
                                           </BootstrapButton> */}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Link>
                  </Grid>
                );
              })}

              <span onClick={this.init}></span>
            </OwlCarousel>
          </Grid>
        )}
        {this.state.users.length == 0 && (
          <Typography variant="span" component="span">Not found</Typography>
        )}
      </div>
    );
  }
}
HomeSearch.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(HomeSearch);
