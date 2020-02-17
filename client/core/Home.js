import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Grid from "material-ui/Grid";
import auth from "./../auth/auth-helper";
import RightSide from "./../user/RightSide";
import FindPeople from "./../user/FindPeople";
import Newsfeed from "./../post/Newsfeed";
import Home_before_first_sec from './Home_before_first_sec';
import Home_before_second_sec from './Home_before_second_sec';
import Home_before_third_sec from './Home_before_third_sec';
import Home_before_fourth_sec from './Home_before_fourth_sec';
import Home_before_last_sec from './Home_before_last_sec';
import CustomLoader from './../common/CustomLoader';
const styles = theme => ({
  card: {
    maxWidth: 600,
    margin: "auto",
    marginTop: theme.spacing.unit * 5
  },

  title: {
    padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 2.5}px ${theme
      .spacing.unit * 2}px`,
    color: theme.palette.text.secondary
  },
  media: {
    minHeight: 330
  }
});

class Home extends Component {
  state = {
    defaultPage: true,
    loader: true
  };
  init = () => {
    if (auth.isAuthenticated()) {
      this.setState({ defaultPage: false, loader: false });
    } else {
      this.setState({ defaultPage: true, loader: false });
    }
  };
  componentWillReceiveProps = () => {
    this.init();
  };
  componentDidMount = () => {

    //localStorage.removeItem('jwt');
    this.init();
  };
  render() {
    const { classes } = this.props;
    return (
      <div>
        {this.state.defaultPage && (
          <Grid container className={"home_before_part"}>
            {this.state.loader && <CustomLoader height={30} width={30} />}
            {!this.state.loader && <div>
              <Home_before_first_sec />
              <Home_before_second_sec />
              <Home_before_third_sec />
              <Home_before_fourth_sec />
              <Home_before_last_sec />
            </div>}
          </Grid>
        )}
        {!this.state.defaultPage && (
          <Grid container className={"homepost-container inner_container"} height={"700px"}>
            <Grid item xs={12} sm={7} md={8} className={"home-left"}>
              <Newsfeed />
            </Grid>
            <Grid item xs={12} sm={5} md={4} className={"home-right"}>
              {
                !auth.isAuthenticated().user.creator ? (<RightSide />) : ''
              }
              <FindPeople />
            </Grid>
          </Grid>
        )}
      </div>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Home);
