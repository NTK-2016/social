import React, { Component } from "react";
import PropTypes from "prop-types";
import AppBar from "material-ui/AppBar";
import Typography from "material-ui/Typography";
import Grid from "@material-ui/core/Grid";
import Tabs, { Tab } from "material-ui/Tabs";
import Button from "@material-ui/core/Button";
import auth from "../../auth/auth-helper";
import CustomButton from "../../common/CustomButton";
import {
  fetchFollowerCount,
  fetchStanCount,
  fetchTipsByUser,
  fetchmanageOrders,
  fetchProductSales,
  ReviewSubmit,
  getTransStatementByUser
} from "../../user/api-user";
import Analytics from "./Analytics";
import SubscriptionandPitch from "./SubscriptionandPitch";
import CreatorShop from "./CreatorShop";
import ManageOrder from "./ManageOrder";
import Snackbar from "material-ui/Snackbar";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { typography } from "material-ui/styles";
import { withStyles } from "material-ui/styles";
import { Link } from "react-router-dom";
import config from "../../../config/config";
let date = "";
const styles = theme => ({
  spacePadding: {
    padding: "0px 0px",
    backgroundColor: "#fff",
    boxShadow: "none"
  },

  titleh2: {
    fontSize: "25px",
    lineHeight: "33px",
    color: "#000",
    marginBottom: "50px",
    borderBottom: "1px solid #D6D6D6",
    paddingBottom: "20px"
  },

  tabheaddes: {
    boxShadow: "none",
    backgroundColor: "transparent",
    borderBottom: "3px solid #ededed",
    maxWidth: "1200px",
    margin: "15px auto",
    height: "48px",
    fontSize: "18px"
  },

  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: "8px 8px 0 0",
    boxShadow: "none",
    position: "relative",
    maxWidth: "580px",
    textAlign: "center",
    padding: "45px 20px",
    boxSizing: "border-box"
  },

  parasection: {
    padding: "18px 100px 0 100px;"
  },
  btnsection: {
    padding: "35px 0 25px 40px",
    display: "flex",
    flexDirection: "row-reverse",
    justifyContent: "space-evenly"
  },
  close1: {
    position: "absolute",
    right: "-10px",
    top: "-10px",
    fontSize: "25px",
    cursor: "pointer"
  },
  graycolor: {
    color: "#CCCCCC",
    fontSize: "12px",
    letterSpacing: "0.08px"
  },
  headtitle: {
    padding: "0 150px"
  }
});
// let stanCount = 0;
// let totalEarnings = 0;
// let followerCount = 0;

let orderArr = [];
class CreatorSpace extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: "",
      posts: [],
      user: auth.isAuthenticated(),
      totalposts: 0,
      stanCount: 0,
      totalEarnings: 0,
      followersCount: 0,
      newStanCount: 0,
      lostThismonthSTan: 0,
      earning: 0,
      unFollowersCount: 0,
      followthismonth: 0,
      totaltips: 0,
      tipcount: 0,
      tipthismonth: 0,
      thismonthTipEarning: 0,
      totalproductsales: 0,
      countSales: 0,
      productthismonth: 0,
      salesthismonth: 0,
      customerName: "",
      OrderStatus: "",
      ProductType: "",
      order_id: 0,
      date: "",
      qty: 0,
      createdDate: "",
      price: 0,
      orderdata: [],
      open: false,
      successMessage: "",
      featured: 0,
      loader: true,
      open: false,
      isCreator: false,
      tab: 0,
      remainingTotalEarning: 0
    };
  }
  handleRequestClose = (event, reason) => {
    this.setState({ open: false });
  };

  GetStanData = () => {
    const jwt = auth.isAuthenticated();
    fetchStanCount(
      {
        userId: this.state.user.user._id
      },
      {
        t: jwt.token
      }
    ).then(data => {
      if (data.error) {
        console.log(data);
      } else {
        this.setState({
          stanCount: data.stanCount,
          totalEarnings: data.totalEarnings,
          tab: 0,
          newStanCount: data.thisMonthStan,
          lostThismonthSTan: data.lostStan,
          earning: data.earning,
          featured: data.featured,
          loader: false
        });
      }
    });
  };

  GetFollowerCount = () => {
    const jwt = auth.isAuthenticated();
    fetchFollowerCount(
      {
        userId: this.state.user.user._id
      },
      {
        t: jwt.token
      }
    ).then(data => {
      if (data.error) {
        console.log(data);
      } else {
        this.setState({
          followersCount: data.followerCount,
          unFollowersCount: data.unFollowersCount,
          followthismonth: data.followthismonth,
          loader: false
        });
        this.setState({
          tab: 0
        });
      }
    });
  };
  GetTipsByUser = () => {
    const jwt = auth.isAuthenticated();
    fetchTipsByUser(
      {
        userId: this.state.user.user._id
      },
      {
        t: jwt.token
      }
    ).then(data => {
      if (data.error) {
        console.log(data);
      } else {
        this.setState({
          totaltips: data.tipamount,
          tipcount: data.tipcount,
          tipthismonth: data.countthismonthtips,
          thismonthTipEarning: data.thismothamount,
          // totalproductsales: data.totalproductsales,
          // countSales: data.countSales,
          // productthismonth: data.productthismonth,
          // salesthismonth: data.salesthismonth,
          totalposts: data.totalposts > 10 ? 10 : data.totalposts,
          loader: false
        });
        // this.setState({
        //   totalproductsales: data.totalproductsales,
        //   countSales: data.countSales,
        //   productthismonth: data.productthismonth,
        //   salesthismonth: data.salesthismonth
        // })
      }
    });
  };
  GetTotalProductSales = () => {
    const jwt = auth.isAuthenticated();
    fetchProductSales(
      {
        userId: this.state.user.user._id
      },
      {
        t: jwt.token
      }
    ).then(data => {
      if (data.error) {
        this.setState({ error: data.error });
      } else {
        console.log(data);
        this.setState({
          totalproductsales: data.totalproductsales,
          countSales: data.countSales,
          productthismonth: data.productthismonth,
          salesthismonth: data.salesthismonth
        });
      }
    });
  };
  GetTotalOrderonUser = () => {
    const jwt = auth.isAuthenticated();
    fetchmanageOrders(
      {
        userId: this.state.user.user._id
      },
      {
        t: jwt.token
      }
    ).then(data => {
      if (data.error) {
        console.log(data);
      } else {
        orderArr = data;
        this.setState({
          orderdata: orderArr.reverse()
        });
      }
    });
  };
  ReviewSubmit = () => {
    const jwt = auth.isAuthenticated();
    ReviewSubmit(
      {
        userId: jwt.user._id
      },
      {
        t: jwt.token
      }
    ).then(data => {
      if (data.error) {
        this.setState({ error: data.error });
      } else {
        data.count ? this.setState({ open: true }) : "";
      }
    });
  };
  handleClose = () => {
    this.setState({ open: false });
  };

  componentDidMount = () => {
    const jwt = auth.isAuthenticated();
    getTransStatementByUser(
      {
        userId: this.state.user.user._id
      },
      {
        t: jwt.token
      }
    ).then(data => {
      if (data.error) {
        //console.log(data);
      } else {
        var totalEarning = 0
        var totalWithdrawal = 0
        var remainingTotalEarning = 0
        data.forEach(element => {
          if (element.tranStatus == 0) {
            totalEarning = totalEarning + element.amount
          }
          else {
            totalWithdrawal = totalWithdrawal + element.amount
          }
        })
        remainingTotalEarning = totalEarning - totalWithdrawal
        this.setState({ remainingTotalEarning: remainingTotalEarning });
      }
    });
    this.setState({ isCreator: jwt.user.creator });
    //this.GetStanData();
    //this.GetFollowerCount();
    this.GetTipsByUser();
    this.GetTotalOrderonUser();
    //this.GetTotalProductSales();
  };

  componentWillReceiveProps = props => {
    this.setState({
      tab: Number(props.match.params.tab) ? Number(props.match.params.tab) : 0
    });
    setTimeout(function () { }.bind(this), 2000);
  };

  handleTabChange = (event, value) => {
    this.setState({
      tab: value
    });
    setTimeout(function () { }.bind(this), 2000);
  };

  render() {
    const { classes } = this.props;
    const photoUrl = this.state.user.user._id
      ? `/api/users/photo/${this.state.user.user._id}?${new Date().getTime()}`
      : "/api/users/defaultphoto";
    return (
      <section>
        <div className={"creatorspace-container"}>
          <Typography className={"mob-creatortitle"}>Creator space</Typography>
          <Grid container className={"cre_top_container"} spacing={0}>
            <Grid
              item
              xs={12}
              sm={12}
              className={
                this.state.isCreator == 0 ? "left_part blur_tab" : "left_part"
              }
            >
              <Typography component="div" className={"left_img"}>
                <img
                  src={this.state.user.user.photo ? config.profileImageBucketURL + this.state.user.user.photo : config.profileDefaultPath}
                // src={
                //   this.state.croppedimage ? this.state.croppedimage : photoUrl
                // }
                />

                {auth.isAuthenticated().user.creator > 0 && (
                  <div className={"profile-verified"}>
                    <div className={"creator-img-middle"}>
                      c
						  </div>
                  </div>
                )}
              </Typography>

              <Typography component="div" className={"right_txt"}>
                <Typography
                  component="h2"

                  className={"creator_title"}
                >
                  {" "}
                  {this.state.user.user.name}
                </Typography>
                <Typography component="p" >
                  $ {this.state.remainingTotalEarning.toFixed(2)} Total earnings
                </Typography>
              </Typography>
            </Grid>
            {this.state.isCreator == 2 && (
              <Grid item xs={7}>
                <Grid className={"right_part"}>
                  <Typography
                    component="div"

                    className={"right_part_left"}
                  >
                    <Typography
                      component="h2"

                      className={"creator_title"}
                    >
                      Get Featured on the discovery page
                    </Typography>
                    <Typography component="p" >
                      Once you reach ten post, enter your chance to get featured
                      on Stan.Me explore page We update it weekly!
                    </Typography>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={this.ReviewSubmit}
                      color="primary"
                      className={"Secondary_btn"}
                      disabled={!(this.state.totalposts == 10 &&
                        (this.state.featured == 0 ||
                          this.state.featured == 3))}
                    >
                      Submit for review
                        </Button>

                  </Typography>
                  <Typography
                    component="div"

                    className={"right_part_right"}
                  >
                    <Typography
                      component="h2"

                      className={"pos_num"}
                    >
                      {this.state.totalposts} / 10
                    </Typography>
                    <Typography component="p" >
                      posts{" "}
                    </Typography>
                  </Typography>
                </Grid>
              </Grid>
            )}
          </Grid>

          <AppBar
            position="static"
            className={
              this.state.isCreator == 0
                ? "creator-tabs tab_for_all wallet-tab blur_tab"
                : "creator-tabs tab_for_all wallet-tab"
            }
            color="default"
            style={styles.tabheaddes}
          >
            <Tabs
              value={this.state.tab}
              onChange={this.handleTabChange}
              indicatorColor="secondary"
              textColor="secondary"

            >
              <Tab
                label={
                  <Typography

                    component="div"
                    className="tab_title"
                  >
                    Subscription Plan
                    </Typography>
                }
              />
              <Tab
                label={
                  <Typography

                    component="div"
                    className="tab_title"
                  >
                    Shop
                  </Typography>
                }
              />
              <Tab
                label={
                  <Typography

                    component="div"
                    className="tab_title"
                  >
                    Manage Orders
                  </Typography>
                }
              />
              <Tab
                label={
                  <Typography

                    component="div"
                    className="tab_title"
                  >
                    Analytics
                  </Typography>
                }
              />
            </Tabs>{" "}
          </AppBar>
          {this.state.isCreator == 1 && (
            <div>
              {this.state.tab === 0 && (
                <TabContainer>
                  <div style={styles.spacePadding}>
                    <SubscriptionandPitch userId={this.state.user.user._id} />
                  </div>
                </TabContainer>
              )}{" "}
              {this.state.tab === 1 && (
                <TabContainer>
                  <div style={styles.spacePadding}>
                    <CreatorShop userId={this.state.user.user._id} />{" "}
                  </div>
                </TabContainer>
              )}{" "}
              {this.state.tab === 2 && (
                <TabContainer>
                  <div style={styles.spacePadding}>
                    <ManageOrder
                      userId={this.state.user.user._id}
                      orderdata={this.state.orderdata}
                    />{" "}
                  </div>
                </TabContainer>
              )}
              {this.state.tab == 3 && (
                <TabContainer>
                  <div
                    style={styles.spacePadding}
                    className={"boxshadow_0 analytics-container"}
                  >
                    <Analytics
                      stanCount={this.state.stanCount}
                      totalEarnings={this.state.totalEarnings}
                      followersCount={this.state.followersCount}
                      newStanCount={this.state.newStanCount}
                      lostThismonthSTan={this.state.lostThismonthSTan}
                      earning={this.state.earning}
                      unFollowersCount={this.state.unFollowersCount}
                      followthismonth={this.state.followthismonth}
                      totaltips={this.state.totaltips}
                      tipcount={this.state.tipcount}
                      tipthismonth={this.state.tipthismonth}
                      thismonthTipEarning={this.state.thismonthTipEarning}
                      totalproductsales={this.state.totalproductsales}
                      countSales={this.state.countSales}
                      productthismonth={this.state.productthismonth}
                      salesthismonth={this.state.salesthismonth}
                      loader={this.state.loader}
                    />
                  </div>
                </TabContainer>
              )}
            </div>
          )}
          {this.state.isCreator == 0 && (
            <div className={"become-creator"}>
              <Typography component="p">
                Become a creator to get full access to the creator space
              </Typography>
              <Typography component="p">
                You
                       can manage your personal online store, set up Stan's
                       Subscription and check out your progress
			     </Typography>
              <Typography component="div" className={"mt-20"}>
                <Link to={"/becomecreator/" + auth.isAuthenticated().user._id}>
                  <CustomButton
                    label="Become a creator"
                    className={"Primary_btn"}
                  />
                </Link>
              </Typography>
            </div>
          )}
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={this.state.open}
            onClose={this.handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500
            }}
          >
            <Fade in={this.state.open}>
              <div className={classes.paper}>
                <Typography

                  component="div"
                  className={classes.close1}
                >
                  {" "}
                  <i
                    className="fal fa-times-circle"
                    onClick={this.handleClose}
                  ></i>{" "}
                </Typography>
                <Typography

                  component="div"
                  className={classes.headcontainer}
                >
                  <Typography

                    component="h2"
                    className={classes.headtitle}
                  >
                    Your profile has been submitted for review
                  </Typography>
                  <Typography

                    component="div"
                    className={classes.parasection}
                  >
                    <Typography component="p">
                      Stan.Me Team is busy browsing your content and will get
                      back to you shortly via email to let you know if you have
                      made it to the discover page
                    </Typography>{" "}
                  </Typography>{" "}
                </Typography>

                <Typography

                  component="div"
                  className={classes.btnsection}
                >
                  <CustomButton
                    label="Done"
                    onClick={this.handleClose}
                    className={"Primary_btn_blk"}
                  />
                </Typography>
                <Typography

                  component="p"
                  className={classes.graycolor}
                >
                  *Should you not be selected at this time,you can submit your
                  profile again for review in the next 30 working days.
                </Typography>
              </div>
            </Fade>
          </Modal>
        </div>
      </section>
    );
  }
}

const TabContainer = props => {
  return <Typography component="div"> {props.children} </Typography>;
};
TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};

export default withStyles(styles)(CreatorSpace);
