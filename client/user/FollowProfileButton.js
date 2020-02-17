import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Button from "material-ui/Button";
import { unfollow, follow } from "./api-user.js";
import CustomButton from "./../common/CustomButton";
class FollowProfileButton extends Component {
  followClick = () => {
    this.props.onButtonClick(follow);
  };
  unfollowClick = () => {
    this.props.onButtonClick(unfollow);
  };
  render() {
    return (
      <div>
        {this.props.following ? (
          <CustomButton
            label="Following"
            onClick={this.unfollowClick}
            className={"Primary_btn_blk"}
          />
        ) : (
            <CustomButton
              label="Follow"
              onClick={this.followClick}
              className={"Secondary_btn"}
            />
          )}
      </div>
    );
  }
}
FollowProfileButton.propTypes = {
  following: PropTypes.bool.isRequired,
  onButtonClick: PropTypes.func.isRequired
};
export default FollowProfileButton;
