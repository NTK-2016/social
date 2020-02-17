import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Button from "material-ui/Button";
import { Link } from "react-router-dom";
import AppBar from "material-ui/AppBar";
import Typography from "material-ui/Typography";
import Tabs, { Tab } from "material-ui/Tabs";
import PostDisplayList from "./PostDisplayList";
import List, {
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText
} from "material-ui/List";
import Avatar from "material-ui/Avatar";
import auth from "./../auth/auth-helper";
import { useAsync } from "react-async";
import { spacing } from "@material-ui/system";
import Grid from "material-ui/Grid";
import CustomMessage from "./../common/CustomMessage";

const styles = {
  tabheaddes: {
    boxShadow: "none",
    backgroundColor: "transparent",
    borderBottom: "3px solid #F2F2F2",
    maxWidth: "668px",
    margin: "0px auto",
    height: "49px"
  },
  addmoretitle: {
    fontSize: "16px",
    lineHeight: "20px",
    color: "#000",
    marginBottom: "25px"
  },
  addspan: {
    color: "#5A07FF",
    marginLeft: "10px"
  },

  gap: {
    marginBottom: "30px",
    textAlign: "center"
  },
  gap1: {
    textAlign: "center"
  },

  tabtext: {
    fontSize: "14px",
    color: "#2E2E2E",
    marginTop: "5px",
    fontFamily: "Helvetica",
    fontWeight: "normal",
    textTransform: "uppercase",
  }
};

const jwt = auth.isAuthenticated();

class PostTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: Number(this.props.tab),
      posts: []
    };
    // console.log("tabs1 :"+this.state.tab)
  }
  // state = {
  //   tab: 0,
  //   posts: []
  // }

  componentWillReceiveProps = props => {
    // console.log("tabs 4:"+this.state.tab)
    this.setState({ tab: this.state.tab });
    setTimeout(
      function () {
        // console.log("tabs 2:"+this.state.tab)
      }.bind(this),
      2000
    );
  };

  handleTabChange = (event, value) => {
    // console.log(value)
    this.setState({ tab: value });
    setTimeout(
      function () {
        // console.log("tabs 3:"+this.state.tab)
      }.bind(this),
      2000
    );
  };

  // updateState = (value) =>
  // {
  //   console.log(value)
  //   this.setState({ tab: value })
  // }

  render() {
    return (
      <div className={"mytab posttabsec"}>
        <AppBar position="static" color="default" style={styles.tabheaddes}>
          <Tabs
            value={this.state.tab}
            onChange={this.handleTabChange}
            textColor="secondary"
            className={"wallet-tab tab_for_all posttabs-section"}
            fullWidth
            indicatorColor="secondary"

          >
            >
            <Tab
              label={
                <span>
                  Create
                </span>
              }
            />
            <Tab
              label={
                <span>
                  Draft
                </span>
              }
            />
            <Tab
              label={
                <span>
                  Scheduled
                </span>
              }
            />
            <Tab
              label={
                <span>
                  Published
                </span>
              }
            />
          </Tabs>
        </AppBar>
        {this.state.tab == 0 && (
          <TabContainer>
            <div className={"posttab-container create-post"}>
              <Typography component="h2" >
                Choose a post type
              </Typography>
              {/* <Grid container spacing={3} style={styles.gap}> */}
              <Grid container spacing={8} className={"posttab-spacing"} >
                <Grid item xs>
                  <Link to={"/text/"}>
                    <div className={"postimg"}>
                      <i className={"fal fa-edit"}></i>
                    </div>

                    <h3 style={styles.tabtext}>Text</h3>
                  </Link>
                </Grid>
                <Grid item xs>
                  <Link to={"/image/"}>
                    <div className={"postimg"}>
                      <i className={"fal fa-image"}></i>
                    </div>

                    <h3 style={styles.tabtext}>Image</h3>
                  </Link>
                </Grid>
                <Grid item xs>
                  <Link to={"/audio/"}>
                    <div className={"postimg"}>
                      <i className={"fal fa-headphones"}></i>
                    </div>
                    <h3 style={styles.tabtext}>Audio</h3>
                  </Link>
                </Grid>
              </Grid>
              {/* <Grid container spacing={3} style={styles.gap}> */}
              <Grid container spacing={8} className={"posttab-spacing"} >
                <Grid item xs>
                  <Link to={"/video/"}>
                    <div className={"postimg"}>
                      <i className={"fal fa-video"}></i>
                    </div>
                    <h3 style={styles.tabtext}>Video</h3>
                  </Link>
                </Grid>
                <Grid item xs>
                  <Link to={"/article/"}>
                    <div className={"postimg"}>
                      <i className={"fal fa-newspaper"}></i>
                    </div>
                    <h3 style={styles.tabtext}>Articles</h3>
                  </Link>
                </Grid>
                <Grid item xs>
                  <Link to={"/poll/"}>
                    <div className={"postimg"}>
                      <i className={"fal fa-poll"}></i>
                    </div>
                    <h3 style={styles.tabtext}>Polls</h3>
                  </Link>
                </Grid>
              </Grid>
              {/* <Grid container spacing={8} className={"pttab-lt-s"} >
                <Grid item xs>
                  <Link to={"/link/"}>
                    <div className={"postimg"}>
                      <i className={"fal fa-paperclip"}></i>
                    </div>
                    <h3 style={styles.tabtext}>Links</h3>
                  </Link>
                </Grid>
                <Grid item xs></Grid>
                <Grid item xs></Grid>
              </Grid> */}

              <div className={"become_creator_link_blk"}>
                <Typography component="h2">
                  Add to your shop
                </Typography>
                <Typography component="div" className={"add-creator mb-30"}>
                  {auth.isAuthenticated().user.creator == 0 && (
                    <CustomMessage
                      message="Become a creator to start selling on your online store"
                      link={true}
                      linkurl={
                        "../becomecreator/" + auth.isAuthenticated().user._id
                      }
                      linkmessage="Become a creator"
                    />
                  )}{" "}
                </Typography>
                <fieldset
                  disabled={auth.isAuthenticated().user.creator == 0}
                  className={
                    auth.isAuthenticated().user.creator == 0 ? "blur_tab" : ""
                  }
                >
                  <div>
                    {/* <Typography component="h2" style={styles.addmoretitle}>
                  To set up your shop   <Link to={""}><span style={styles.addspan}>Add bank details</span>  </Link>
                </Typography> */}
                    {/* <Grid container spacing={3} style={styles.gap1}> */}
                    <Grid container spacing={8} style={styles.gap1} className={"post-product"}>
                      <Grid item xs={6} md={4}>
                        <Link to={auth.isAuthenticated().user.creator == 0 ? "createpost" : "/product/digital"}>
                          <div className={"postimg"}>
                            <i className={"fal fa-tv"}></i>
                          </div>
                          <h3 style={styles.tabtext}>Digital Product</h3>
                        </Link>
                      </Grid>
                      <Grid item xs={6} md={4}>
                        <Link to={auth.isAuthenticated().user.creator == 0 ? "createpost" : "/product/physical"}>
                          <div className={"postimg"}>
                            <i className={"fal fa-shopping-cart"}></i>
                          </div>
                          <h3 style={styles.tabtext}>Physical Product</h3>
                        </Link>
                      </Grid>
                      <Grid item xs={6} md={4}></Grid>
                    </Grid>
                  </div>
                </fieldset>
              </div>
            </div>
          </TabContainer>
        )}
        {this.state.tab === 1 && (
          <TabContainer>
            <PostDisplayList
              removeUpdate={this.props.removeDraftUpdate}
              posts={this.props.drafts}
              type="draft"
            />
          </TabContainer>
        )}
        {this.state.tab === 2 && (
          <TabContainer>
            <PostDisplayList
              removeUpdate={this.props.removeScheduleUpdate}
              posts={this.props.schedules}
              type="schedule"
            />
          </TabContainer>
        )}
        {this.state.tab === 3 && (
          <TabContainer>
            <PostDisplayList
              removeUpdate={this.props.removePostUpdate}
              posts={this.props.posts}
              type="publish"
            />
          </TabContainer>
        )}
      </div>
    );
  }
}

PostTabs.propTypes = {
  removePostUpdate: PropTypes.func.isRequired,
  posts: PropTypes.array.isRequired
};

const TabContainer = props => {
  return (
    <Typography component="div" style={{ padding: 8 * 2 }}>
      {props.children}
    </Typography>
  );
};

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};

export default PostTabs;
