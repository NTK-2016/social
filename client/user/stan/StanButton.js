import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Button from "material-ui/Button";
import { Link } from "react-router-dom";
import auth from "../../auth/auth-helper";
import { read } from "../api-user";
import UnStanModal from "./unStanModal";
import { removeStan } from "../../user/api-user";

var subscriber_amount;
const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};
class StanButton extends Component {
  constructor(match) {
    super();
    this.state = {
      subscriptionPitch: "",
      error: "",
      userId: "",
      planInfo: "",
      stanStatus: false,
      subscriptionId: "",
      closeModal: false,
      loading: false
    };
    this.match = match;
  }
  componentDidMount = () => {
    const jwt = auth.isAuthenticated();

    read(
      {
        userId: this.match.userId
      },
      { t: jwt.token }
    ).then(data => {
      if (data.error) {
        this.setState({ error: data.error });
      } else {
        this.setState({
          subscriptionPitch: data.subscriptionpitch,
          planInfo: data.subscriptionpitch.planInfo
        });

        this.state.planInfo.forEach(res => {
          if (res.status == 1) {
            this.setState({ planInfo: res });
          }
        });
        data.stan.forEach(res => {
          if (
            res.ref_id == auth.isAuthenticated().user._id &&
            res.status == 1
          ) {
            this.setState({ stanStatus: true });
            this.setState({ subscriptionId: res.subscriptionId });
          }
          //console.log(res)
        });
        this.setState({ stans: data.stan });
      }
    });
  };
  removeStan = evt => {
    this.setState({ loading: true });
    const jwt = auth.isAuthenticated();
    removeStan(
      {
        userId: jwt.user._id,
        subscriptionId: this.state.subscriptionId,
        creatorId: this.match.userId
      },
      { t: jwt.token }
    ).then(data => {
      if (data) {
        this.setState({ stanStatus: false });
        this.setState({ closeModal: true });
        this.props.handleStanStatus()
      } else {
      }
    });
    console.log(evt);
  };
  // stanClick = (stann) => {
  //   this.props.onStanButtonClick(stan)
  // }
  // removeStanClick = () => {
  //   this.props.onStanButtonClick(unfollow)
  // }

  render() {
    return (
      <div className={"button-stan"}>
        <div className={"btn-staninner"}>
          {this.state.stanStatus ? (
            <UnStanModal
              subscriptionId={this.state.subscriptionId}
              creatorId={this.match.userId}
              name={this.props.name}
              onStanChange={this.removeStan}
              closeModal={this.state.closeModal}
              stanRemoved={this.props.stanRemoved}
            />
          ) : (
              <Link
                to={`/becomestan/${this.match.userId}`}
                className={"stan-button Primary_btn"}
                activeclassname="active"
              >
                Stan
          </Link>
            )}
          {/* ${this.state.planInfo.amount} */}
        </div>
      </div>
    );
  }
}
StanButton.propTypes = {
  stan: PropTypes.bool.isRequired,
  onStanButtonClick: PropTypes.func.isRequired
};
export default StanButton;
