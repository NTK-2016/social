import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Grid from "material-ui/Grid";
import Paper from "material-ui/Paper";
// import List, {
//   ListItem,
//   ListItemAvatar,
//   ListItemSecondaryAction,
//   ListItemText
// } from "material-ui/List";
// import Avatar from "material-ui/Avatar";
import IconButton from "material-ui/IconButton";
import Button from "material-ui/Button";
import Typography from "material-ui/Typography";
//import Divider from "material-ui/Divider";
import auth from "./../auth/auth-helper";
import {
  creatorcategory,
  categoryuser,
  searchuser
} from "./../user/api-user.js";
import { Redirect, Link } from "react-router-dom";

//import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
//import HomeSearch from "./HomeSearch";
import TextField from "material-ui/TextField";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
//import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
//import OwlCarousel from "react-owl-carousel2";
//import Box from "@material-ui/core/Box";
import CustomButton from './../common/CustomButton'
import CustomLoader from "./../common/CustomLoader";
import { Scrollbars } from 'react-custom-scrollbars';
import config from "../../config/config";
var category1 = new Array();
var category2 = new Array();
const styles = theme => ({
  root: theme.mixins.gutters({
    // maxWidth: 1200,
    // margin: "30px auto",
    // padding: "30px 0",
    // boxShadow: "none",
    // background: "transparent",
    // boxSizing: "border-box"
  }),
  root1: theme.mixins.gutters({
    maxWidth: "100%",
    margin: "0 auto",
    boxShadow: "none",
    padding: "0px !important"
  }),
  root2: theme.mixins.gutters({

    padding: "0px 0px 20px 0!important"
  }),
  root4: theme.mixins.gutters({

    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: "420px",
    padding: "0",
    color: "black",
    boxShadow: "none",
    textAlign: "center"
  }),
  title: {
    //margin: `${theme.spacing.unit * 2}px ${theme.spacing.unit}px 0`,
    color: theme.palette.protectedTitle,
    fontSize: "1em"
  },
  bigAvatar: {
    width: 70,
    height: 70,
    border: "2px solid #000",
    margin: "0 auto",
    borderRadius: "50%"
  },
  card: {
    maxWidth: 383
  },
  media: {
    height: 100
  }
});

// const options = {
//   margin: 0,
//   items: 3,
//   nav: true,
//   rewind: true,
//   autoplay: false,
//   loop: false,
//   autoWidth: true,
//   responsive: {
//     0: {
//       items: 3
//     },
//     600: {
//       items: 3
//     },
//     1000: {
//       items: 6.5
//     }
//   }
// };

const BootstrapButton = withStyles({
  root: {
    boxShadow: "none",
    textTransform: "none",
    fontSize: "12px",
    margin: "0 4px",
    minHeight: "24px",
    padding: "0 4px",
    minWidth: "60px",
    border: "1px solid",
    borderRadius: "4px",
    color: "#fff",
    lineHeight: "24px",
    backgroundColor: "#000",
    borderColor: "#000",
    fontFamily: ['"Helvetica"', "Arial"].join(","),
    "&:hover": {
      backgroundColor: "#000",
      borderColor: "#000",
      color: "#fff",
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

class Search extends Component {
  constructor({ match }) {
    super();
    this.state = {
      categories: [],
      users: [],
      displaycategory: "",
      skip: 0,
      limit: 15,
      redirectToSignin: false,
      soon: false,
      loader: false,
      moreloader: false,
      categoryId: [],
      categoryName: 'All',
      search: '',
      enter: false,
      isRequested: false,
      response: true
    };
    this.match = match;
    this._handleKeyDown = this._handleKeyDown.bind(this);
  }
  init = () => {

    this.setState({ users: [], displaycategory: "" });
    const jwt = auth.isAuthenticated();
    creatorcategory(
      {
        userId: jwt.user._id
      },
      { t: jwt.token }
    ).then(data => {
      if (data.error) {
        this.setState({ redirectToSignin: true });
      } else {

        var category = [];
        var categoryId = [];
        for (var i = 0; i < data.length; i++) {
          //console.log(data[i]._id)
          category[i] = [data[i]._id, data[i].name];
          categoryId.push(data[i]._id)
        }
        category = category.sort();
        this.setState({ categories: category, categoryId: categoryId });
        this.categoryuser(categoryId)
      }
    });


  };

  categoryuser = (categoryId) => {
    if (this.state.response) {
      this.setState({ response: false });
      const jwt = auth.isAuthenticated();
      categoryuser(
        {
          category: categoryId,
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
          if (data.length > 0) {

            var count = data.length
            if (this.state.skip == 0) {
              this.setState({ users: data, displaycategory: "Search Results (" + count + ")", soon: false, skip: this.state.skip + 15, response: true, moreloader: false });
            }
            else {
              var joined = this.state.users.concat(data);
              this.setState({ users: joined, displaycategory: "Search Results (" + count + ")", soon: false, skip: this.state.skip + 15, response: true, moreloader: false });
            }
            if (data.length == 15) {
              console.log("scroll added")
              document.addEventListener('scroll', this.trackScrolling);
            }
          }
          else {
            this.setState({ soon: true, users: [], response: true })
          }
        }
      });
    }
  }

  displayCategory = (category, categoryName) => {
    if (!this.state.isRequested) {
      this.setState({ isRequested: true, loader: true })
      const jwt = auth.isAuthenticated();
      categoryuser(
        {
          category: category,
          skip: 0,
          limit: 0
        },
        {
          t: jwt.token
        }
      ).then(data => {
        if (data.error) {
          console.log(data[0].error);
        } else {
          var count = data.length
          this.setState({ users: data, displaycategory: "Search Results (" + count + ")", categoryName: categoryName, loader: false, isRequested: false });
        }
      });
    }
  };

  _handleKeyDown = e => {
    const value = e.target.value;
    console.log("value" + value)
    //this.setState({ search: value })
    if (e.key === "Enter") {
      this.setState({ enter: true })
      e.preventDefault()
      if (value != "") {
        const jwt = auth.isAuthenticated();
        searchuser(
          {
            value: value
          },
          {
            t: jwt.token
          }
        ).then(data => {
          if (data.error) {
            console.log(data[0].error);
          } else {
            if (data.length > 0) {
              var count = data.length
              this.setState({ users: data, displaycategory: "Search Results (" + count + ")", soon: false });
            }
            else {
              this.setState({ soon: true, users: [], displaycategory: "Search Results (0)" })
            }
          }
        });
      } else {
        this.displayCategory(this.state.categoryId, "All")
        //this.setState({ soon: true, users: [] })
      }
    }
  };


  handleChange = name => event => {
    const value = event.target.value;
    // console.log("value" + value)
    // this.setState({ search: value })
    // if (value != "") {
    //   const jwt = auth.isAuthenticated();
    //   searchuser(
    //     {
    //       value: value
    //     },
    //     {
    //       t: jwt.token
    //     }
    //   ).then(data => {
    //     if (data.error) {
    //       console.log(data[0].error);
    //     } else {
    //       if (data.length > 0) {
    //         var count = data.length
    //         this.setState({ users: data, displaycategory: "Search Results (" + count + ")", soon: false });
    //       }
    //       else {
    //         this.setState({ soon: true, users: [] })
    //       }
    //     }
    //   });
    // } else {
    //   this.displayCategory(this.state.categoryId, "All")
    //   //this.setState({ soon: true, users: [] })
    // }
  };
  componentWillReceiveProps = props => {
    //this.init(props.match.params.userId);
  };
  componentDidMount = () => {
    this.init();
    document.addEventListener('scroll', this.trackScrolling);
  };

  componentWillUnmount() {
    console.log("componentWillUnmount")
    document.removeEventListener('scroll', this.trackScrolling);
    this.setState({ skip: 0 })
  }

  isBottom(el) {
    return el.getBoundingClientRect().bottom <= window.innerHeight;
  }
  trackScrolling = () => {
    const wrappedElement = document.getElementById('searchdata');
    if (this.isBottom(wrappedElement) && this.state.response) {
      console.log("123")
      this.setState({ moreloader: true })
      this.categoryuser(this.state.categoryId)
      console.log('header bottom reached');
      document.removeEventListener('scroll', this.trackScrolling);
    }
  };


  showAll = () => {
    this.setState({ search: "", enter: false, users: [] })
    this.displayCategory(this.state.categoryId, "All")
    document.getElementById("search").value = ""
  }

  render() {
    const { classes } = this.props;
    var category = "";
    const redirectToSignin = this.state.redirectToSignin;
    if (redirectToSignin) {
      return <Redirect to="/signin" />;
    }
    return (
      <section component="div" variant="div" className={"search-page discover_page"}>
        <div className={classes.root1}>
          <Grid component="h1" variant="h1" className={"title_search"}>Discover</Grid>
          <Grid
            className={classes.grid}
            className={"search_full_blk"}
            component="div"
          >
            <TextField
              className={classes.input}
              placeholder="Search for people"
              onKeyDown={this._handleKeyDown}
              id="search"
              autoComplete="off"
            // onChange={this.handleChange("search")}
            // value={this.state.search}
            />
            <IconButton className={classes.iconButton} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Grid>

          {/* =====Discover button slider start====== */}
          {!this.state.enter &&
            < Grid className={"discover_button_blk"} component="div">
              <Scrollbars
                //onScroll={this.handleScroll}
                //onScrollFrame={this.handleScrollFrame}
                //onScrollStart={this.handleScrollStart}
                //onScrollSleft={this.handleScrollStop}
                //onUpdate={this.handleUpdate}
                //renderView={this.renderView}
                //renderTrackHorizontal={this.renderTrackHorizontal}
                //renderTrackVertical={this.renderTrackVertical}
                //renderThumbHorizontal={this.renderThumbHorizontal}
                //renderThumbVertical={this.renderThumbVertical}
                //autoHide
                //autoHideTimeout={0}
                //autoHideDuration={200}
                autoHeight
                autowidthmin={0}
                autowidthmax={'50'}
                thumbMinSize={30}
                //universal={true}              
                {...this.props}
                className={"my_scroll_bar"}>
                <div className={"button_inner_blk"}>
                  <CustomButton label="All" className={this.state.categoryName == "All" ? "Primary_btn_blk btn_with_white active" : "Primary_btn_blk btn_with_white"} onClick={() => this.displayCategory(this.state.categoryId, "All")} />
                </div>
                {
                  this.state.categories.map((item, i) => {
                    return (<div key={i} className={"button_inner_blk"}>
                      <CustomButton label={item[1]} className={this.state.categoryName == item[1] ? "Primary_btn_blk btn_with_white active" : "Primary_btn_blk btn_with_white"} onClick={() => this.displayCategory(item[0], item[1])} />
                    </div>)
                  })
                }
              </Scrollbars>
            </Grid>
          }

          {/* =====Discover button slider start end====== */}

          <div className={"outer-search-div"}>
            <div className={"inner-search-div"}>
              <div className={classes.root2}>
                <div className={classes.root} className={"inner_search_blk_part"}>
                  {this.state.enter &&
                    <div onClick={this.showAll} className={"back_arrow"}><i className={"far fal fa-long-arrow-alt-left"}></i><span className={"back_arrow_txt"}>Back</span></div>
                  }
                  {this.state.enter &&
                    <Grid component="div" variant="div" className={"title_search"}>
                      {this.state.displaycategory}
                    </Grid>
                  }
                  {this.state.users.length > 0 && (
                    <Grid container className={"full_con_section"} id="searchdata">
                      {this.state.users.map((item, i) => {
                        return (
                          <Grid item
                            xs={4}
                            className={"full_con_child"}
                            key={i}>
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
                                    title={item.username}
                                  />
                                </CardActionArea>
                                <CardContent className={"art_oval_outer"}>
                                  <Grid className={"art_oval_icon"}>
                                    <CardMedia className={"art_oval_img"}
                                      image={item.photo ? config.profileImageBucketURL + item.photo : config.profileDefaultPath}
                                      // image={
                                      //   item._id
                                      //     ? `/api/users/photo/${
                                      //     item._id
                                      //     }?${new Date().getTime()}`
                                      //     : "/api/users/defaultphoto"
                                      // }
                                      className={classes.bigAvatar}
                                    />
                                    {item.creater.status == 1 && (
                                      <div className={"profile-verified"}>
                                        <Grid component="div" variant="div" className={"circle_blk"}>c</Grid>
                                        {/* <img src="/dist/create/certified.svg" /> */}

                                      </div>
                                    )}
                                  </Grid>
                                  <Typography
                                    gutterBottom
                                    className={"art_title"}
                                    component="title"
                                    variant="title"
                                    align="center">
                                    {item.name}
                                    <span>@{item.username}</span>
                                  </Typography>

                                  <Typography component="title"
                                    variant="title" className={"art_btn"}>
                                    {item.creatorcategory &&
                                      item.creatorcategory.map(
                                        (singlecategory, j) => {
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
                                        }
                                      )}

                                    {/*<BootstrapButton size="small" variant="contained" color="primary" className={classes.button}>                                            
                                                {this.state.displaycategory != "Search Results" ?  "actor" : 'Actor'}
                                        </BootstrapButton> */}
                                  </Typography>
                                  {item.about &&
                                    <Grid variant="div" component="div" className={"art_bio_about"}>
                                      {item.about.substring(0, 150)}
                                      {item.about.length > 150 && <span>...</span>}
                                    </Grid>
                                  }
                                </CardContent>
                              </Card>
                            </Link>
                          </Grid>
                        );
                      })}
                    </Grid>
                  )}

                  {this.state.users.length == 0 &&
                    this.state.displaycategory != "" && (
                      <div className={"search-blk-hide"}>
                        <Paper className={classes.root4}>
                          <Typography component="div" variant="div" className={"coming-title"}>
                            No results
                          </Typography>
                        </Paper>
                      </div>
                    )}
                  {this.state.loader && <CustomLoader />}
                  {
                    this.state.moreloader && this.state.skip > 0 &&
                    <CustomLoader customclass={"loader_bottom"} width={30} height={30} />
                  }
                </div>
              </div>
            </div>
          </div>
        </div>


      </section >
    );
  }
}
Search.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Search);
