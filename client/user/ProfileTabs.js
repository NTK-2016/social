import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Button from "material-ui/Button";
import { Link } from "react-router-dom";
import AppBar from "material-ui/AppBar";
import Typography from "material-ui/Typography";
import Tabs, { Tab } from "material-ui/Tabs";
import FollowGrid from "./../user/FollowGrid";
import PostList from "./../post/PostList";
import ShopGrid from "./ShopGrid";
import auth from "./../auth/auth-helper";

class ProfileTabs extends Component {
  state = {
    tab: 0,
    posts: [],
    shop: []
  };

  componentWillReceiveProps = props => {
    this.setState({ tab: 0 });
  };
  handleTabChange = (event, value) => {
    this.setState({ tab: value });
  };

  render() {
    return (
      <div className={"post-shop-section tab_for_all"}>
        <AppBar position="static" color="default" style={{ width: "100%" }}>
          <Tabs
            className={"post-shop-section-inner"}
            value={this.state.tab}
            onChange={this.handleTabChange}
            indicatorColor="primary"
            textColor="secondary"
            fullWidth
            indicatorColor="secondary"
          >
            <Tab label="Posts" onClick={this.props.addScroll} />
            {((this.props.isCreator && (auth.isAuthenticated().user._id === this.props.user._id)) || this.props.isShop || (!this.props.isCreator && (auth.isAuthenticated().user._id === this.props.user._id))) && (
              <Tab label="Shop" onClick={this.props.removeScroll} />
            )}
            {/*  <Tab label="Following" /> 
            <Tab label="Followers" /> */}
          </Tabs>
        </AppBar>
        {this.state.tab === 0 && (
          <TabContainer>
            <PostList
              removeUpdate={this.props.removePostUpdate}
              posts={this.props.posts}
              userId={this.props.userId}
              name="profile"
              username={this.props.user.username}
              postloader={this.props.postloader}
            />
          </TabContainer>
        )}

        {this.state.tab === 1 && (
          <TabContainer>
            <ShopGrid
              shop={this.props.shop}
              isShop={this.props.isShop}
              isCreator={this.props.isCreator}
              removeUpdate={this.props.removePostUpdate}
              removeProductUpdate={this.props.removeProductUpdate}
              userId={this.props.userId}
            />
          </TabContainer>
        )}
        {/*{this.state.tab === 2 && <TabContainer><FollowGrid people={this.props.user.following}/></TabContainer>}
        {this.state.tab === 2 && <TabContainer><FollowGrid people={this.props.user.followers}/></TabContainer>} */}
      </div>
    );
  }
}

ProfileTabs.propTypes = {
  user: PropTypes.object.isRequired,
  removePostUpdate: PropTypes.func.isRequired,
  posts: PropTypes.array.isRequired,
  shop: PropTypes.array.isRequired
};

const TabContainer = props => {
  return (
    // <Typography component="div" style={{ padding: 8 * 2 }}>
    <Typography component="div">{props.children}</Typography>
  );
};

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};

export default ProfileTabs;
