import React, { Component } from "react";
import { withStyles, typography } from "material-ui/styles";
import Grid from "@material-ui/core/Grid";
import Button from "material-ui/Button";
import PropTypes from "prop-types";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import Select from "material-ui/Select";
import TableRow from "@material-ui/core/TableRow";
import CustomButton from "../../common/CustomButton";
import Typography from "material-ui/Typography";
import auth from "../../auth/auth-helper";
import Icon from "material-ui/Icon";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import {
  fetchTipsByUser,
  stanTome,
  fetchmyShopOrder,
  getEarning,
  getTotalWithdrawal,
  earningStmtFilter,
  getTransStatementByUser,
  makeWithDrawalByStripeId,
  calculateProcessFee
} from "../api-user";
import TextField from "material-ui/TextField";
import AppBar from "material-ui/AppBar";
import { Redirect, Link } from "react-router-dom";
import Tabs, { Tab } from "material-ui/Tabs";
import Divider from "material-ui/Divider";
import SideLoader from "../../common/SideLoader";
import CustomLoader from "../../common/CustomLoader";
import { parseJSON } from "date-fns";
import Fourzerofour from "./../../common/404";

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec"
];

let tipsArrFrom = [],
  stanToMe = [],
  myShopOrder = [],
  status = "";
let onSelectValue = "";
const styles = theme => ({
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(12, 1fr)",
    gridGap: 5
  },
  paper: {
    marginTop: "auto",
    width: "100%",
    overflowX: "auto",
    marginBottom: "auto"
  },
  table: {
    minWidth: 650
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
});

const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

class Wallet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: auth.isAuthenticated().user._id,
      dropYear: [],
      tips: [],
      stan: [],
      order: [],
      commonData: [],
      withamount: Number,
      tab: 0,
      select: "",
      creatorStatus: 0,
      totalEarning: 0,
      totalWithdrawalAmount: 0,
      remainingTotalEarning: 0,
      alertMsg: "",
      successMsg: "",
      filterType: "",
      filterYear: "",
      filterMonth: "",
      transData: [],
      stripeUserId: "",
      sideLoader: 0,
      buttonStatus: 0,
      processFeeStatus: false,
      processFeeMsg: "",
      payouttype: 0,
      invalid: false,
      loginlink: ''
    };
    this.match = props.match;
  }

  /*Start Get All Transaction Statement */
  GetTransactionStatement = () => {
    const jwt = auth.isAuthenticated();
    getTransStatementByUser(
      {
        userId: this.state.userId
      },
      {
        t: jwt.token
      }
    ).then(data => {
      if (data.error) {
        //console.log(data);
        this.setState({ invalid: true })
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
        this.setState({ transData: data, remainingTotalEarning: remainingTotalEarning });
      }
    });
  };
  /* End Get All Transaction Statement */

  /*Start Get Stripe User Id by userId */
  // GetStripeUserId = () => {
  //   const jwt = auth.isAuthenticated();
  //   getTransStatementByUser(
  //     {
  //       userId: this.state.userId
  //     },
  //     {
  //       t: jwt.token
  //     }
  //   ).then(data => {
  //     if (data.error) {
  //       //console.log(data);
  //     } else {
  //       this.setState({ transData: data });
  //     }
  //   });
  // };
  /* End Get Stripe User Id by userId */
  onClickWithdraw = () => {
    const jwt = auth.isAuthenticated();
    console.log(" this.state.withamount " + this.state.withamount);
    if (this.state.withamount >= 10 && this.state.remainingTotalEarning >= 10) {
      if (
        this.state.withamount <= this.state.remainingTotalEarning &&
        this.state.processFeeStatus
      ) {
        this.setState({ sideLoader: 1 });
        /* Start To Withdrawal */
        makeWithDrawalByStripeId(
          {
            amount: this.state.withamount,
            stripe_user_id: this.state.stripeUserId,
            userId: this.state.userId,
            approvalStatus: 0,
            status: 1,
            payouttype: this.state.payouttype
          },
          {
            t: jwt.token
          }
        ).then(data => {
          if (data.error) {
            this.setState({ error: data.error });
          } else {
            // console.log("data ");
            //console.log(data);
            if (data.status) {
              let withdrawalamount = data.amount;
              let currRemainingAmount =
                this.state.remainingTotalEarning - withdrawalamount;
              sleep(100).then(() => {
                this.setState({
                  error: "",
                  successMsg: "You amount have been withdraw successfully.",
                  remainingTotalEarning: currRemainingAmount,
                  withamount: Number,
                  alertMsg: "",
                  sideLoader: 0,
                  processFeeMsg: ""
                });
              });
            } else {
              this.setState({
                error: "",
                alertMsg: "Failed to withdraw amount."
              });
            }
          }
        });
        /* End Withdrawal */
      } else {
        this.setState({
          alertMsg:
            "You have exceeded the withdrawal amount than current amount.",
          withamount: 0,
          successMsg: "",
          sideLoader: 0
        });
      }
    } else {
      this.setState({
        alertMsg: "Please enter the amount to Withdraw.",
        successMsg: "",
        withamount: Number,
        sideLoader: 0
      });
    }
  };

  componentDidMount = () => {
    this.GetTransactionStatement();
    const jwt = auth.isAuthenticated();
    this.userData = new FormData();
    this.setState({ creatorStatus: jwt.user.creator });
    /* Start Get Total Earning */
    let remainingTotalEarning = 0;
    getEarning(
      {
        userId: this.state.userId
      },
      { t: jwt.token }
    ).then(data => {
      if (data.error) {
        this.setState({ redirectToSignin: true });
      } else {
        //console.log(data);
        data.forEach(element => {

          let orderAmount = 0;
          // console.log(
          //   "element.payment.stripe_user_id " + element.payment.stripe_user_id
          // );
          this.setState({ stripeUserId: element.payment.stripe_user_id, loginlink: element.payment.link, payouttype: element.payment.payouttype });

          // if (element.orders.length > 0 && element.orders[0] != null) {
          //   console.log(element.orders.length);
          //   console.log(element.orders);
          //   element.orders.forEach(element1 => {
          //     orderAmount =
          //       orderAmount +
          //       (typeof element1.price != " undefined"
          //         ? element1.price * element1.quantity
          //         : "") - element1.ownerAmount - element1.processFee;
          //   });
          // }
          //console.log(orderAmount);
          // let tipAmount = 0;
          // if (element.posts.length > 0 && element.posts[0] != null) {
          //   element.posts.forEach(element1 => {
          //     element1.tips.forEach(element2 => {
          //       tipAmount = tipAmount + element2.amount;
          //     });
          //   });
          // }
          // let stanAmount = 0;
          // if (element.stan.length > 0) {
          //   element.stan.forEach(element1 => {
          //     stanAmount = stanAmount + element1.amount;
          //   });
          // }

          //let totalEarning = orderAmount + tipAmount + stanAmount;

          //remainingTotalEarning = totalEarning - this.state.totalWithdrawalAmount;

          // console.log(
          //   "remainingTotalEarning  " +
          //     remainingTotalEarning +
          //     " this.state.totalWithdrawalAmount " +
          //     this.state.totalWithdrawalAmount
          // );
          //sleep(100).then(() => {
          // this.setState({
          //   //totalEarning: totalEarning,
          //   payouttype: element.payment.payouttype
          //   // remainingTotalEarning: remainingTotalEarning
          // });
          // });

          // this.userData.set("withamount", this.state.totalEarning);
        });
      }
    });
    /* End Total Earning */
    let YEARS = [];
    this.years = startYear => {
      var currentYear = new Date().getFullYear(),
        years = [];
      startYear = startYear || 1980;
      while (startYear <= currentYear) {
        years.push(startYear++);
      }
      return years;
    };
    YEARS = this.years(new Date().getFullYear() - 10);
    this.setState({ dropYear: YEARS });
    /* Start Get Total Withdrawal */
    // sleep(1000).then(() => {
    //   getTotalWithdrawal(
    //     {
    //       userId: this.state.userId
    //     },
    //     { t: jwt.token }
    //   ).then(data => {
    //     if (data.error) {
    //       this.setState({ redirectToSignin: true });
    //     } else {
    //       //console.log(data);
    //       let withdrawalAmount = 0;
    //       data.forEach(element => {
    //         if (element.amount) {
    //           withdrawalAmount = withdrawalAmount + element.amount;
    //         }
    //       });
    //       //let remainingTotalEarning = 0;
    //       // remainingTotalEarning = remainingTotalEarning - withdrawalAmount;
    //       remainingTotalEarning = this.state.totalEarning - withdrawalAmount;
    //       sleep(100).then(() => {
    //         this.setState({
    //           totalWithdrawalAmount: withdrawalAmount,
    //           remainingTotalEarning: remainingTotalEarning
    //         });
    //         console.log(" withdrawalAmount " + withdrawalAmount);
    //         console.log(
    //           "remainingTotalEarning " + this.state.remainingTotalEarning
    //         );
    //       });
    //     }
    //   });
    // });
    /* End Get Total withdrawal */
  };
  onSelectOption = name => event => {
    onSelectValue = event.target.value;
    //console.log(" onSelectValue " + onSelectValue + " event " + name);
    let selectType = "";
    if (name === "filterType") {
      selectType = onSelectValue.toLowerCase();
      // if (onSelectValue === "STAN") {
      //   selectType = onSelectValue;
      //   //this.setState({ filterType: onSelectValue });
      // } else if (onSelectValue === "TIP") {
      //   selectType = onSelectValue;
      //   //this.setState({ filterType: onSelectValue });
      // } else if (onSelectValue === "ORDER") {
      //   selectType = onSelectValue;
      //   //this.setState({ filterType: onSelectValue });
      // } else if (onSelectValue === "ORDER") {
      //   selectType = onSelectValue;
      //   //this.setState({ filterType: onSelectValue });
      // }
      this.setState({ filterType: selectType });
    }
    if (name === "year") {
      if (selectType === "" || selectType === "-1") {
        //console.log(" inside if year");
        sleep(100).then(() => {
          this.setState({
            filterYear: onSelectValue.toLowerCase(),
            filterType: this.state.filterType
          });
        });
      } else {
        //console.log(" inside else year");
        sleep(100).then(() => {
          this.setState({ filterYear: onSelectValue.toLowerCase() });
        });
      }
    }
    if (name === "month") {
      if (selectType === "" || selectType === "-1") {
        //console.log(" inside if year");
        sleep(100).then(() => {
          this.setState({
            filterMonth: onSelectValue,
            filterType: this.state.filterType
          });
        });
      } else {
        sleep(100).then(() => {
          this.setState({ filterMonth: onSelectValue });
        });
      }
    }

    //this.setState({ select: onSelectValue });

    sleep(100).then(() => {
      //console.log(" filterType " + this.state.filterType);
      /*Start Get Filteration */
      const jwt = auth.isAuthenticated();
      earningStmtFilter(
        {
          userId: this.state.userId,
          type: this.state.filterType,
          month: this.state.filterMonth,
          year: this.state.filterYear
        },
        { t: jwt.token }
      ).then(data => {
        //console.log(data);
        if (data.error) {
          this.setState({ redirectToSignin: true, error: data.error });
        } else {
          //console.log("transData " + JSON.stringify(data));
          this.setState({ transData: data.reverse() });
        }
      });
      /* End Get Filteration */
    });
  };
  handleTabChange = (event, value) => {
    this.setState({
      tab: value
    });
    setTimeout(function () { }.bind(this), 2000);
  };
  handleChange = name => event => {
    const value = event.target.value;
    //console.log(value + "name" + name);
    this.userData.set(name, value);
    this.setState({
      [name]: value,
      alertMsg: "",
      successMsg: ""
    });
  };

  checkNumber = evt => {
    // var iKeyCode = (event.which) ? event.which : event.keyCode
    // if (iKeyCode != 46 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57))
    //   return false;
    // return true;

    const withamount = evt.target.validity.valid
      ? evt.target.value
      : this.state.withamount;
    // console.log(
    //   "withamount " +
    //     withamount +
    //     " !isNaN(withamount) " +
    //     /^\d+$/.test(withamount)
    // );
    if (withamount >= 10 && /^\d+$/.test(withamount)) {
      //if (!isNaN(withamount)) {
      if (withamount < this.state.remainingTotalEarning) {
        this.setState({
          alertMsg: "",
          processFeeMsg: "",
          sideLoader: 0
        });
        /*Start Calculate Process Fee */
        if (this.state.payouttype == 2) {
          const jwt = auth.isAuthenticated();
          calculateProcessFee(
            {
              userId: this.state.userId,
              withamount: withamount
            },
            { t: jwt.token }
          ).then(data => {
            if (data.error) {
              this.setState({
                redirectToSignin: true,
                error: data.error
              });
            } else {
              console.log(data);
              console.log(" processFee " + data.processFee);
              if (data.retStatus == true) {
                let processFeeMsg =
                  "The processing fee to withdraw this amount will be $" + data.processFee + ".For more information about processing fees click here."
                // "Process fee would be $" +
                // data.processFee +
                // " for this withdraw amount.";
                this.setState({
                  processFeeStatus: true,
                  processFeeMsg: processFeeMsg,
                  successMsg: ""
                });
              } else {
                this.setState({
                  processFeeStatus: false,
                  alertMsg: "Withdraw amount should be more than or equal to 10.",
                  processFeeMsg: "",
                  successMsg: ""
                });
              }
            }
          });
        }
        else {
          this.setState({
            processFeeStatus: true,
            processFeeMsg: "",
            successMsg: ""
          });
        }
        /* End Calculate Process Fee */
      } else {
        this.setState({
          processFeeStatus: false,
          alertMsg:
            "The amount you are trying to withdraw exceeds the available funds.",
          processFeeMsg: "",
          successMsg: ""
        });
      }
    } else if (withamount == "") {
      this.setState({
        alertMsg: "",
        successMsg: "",
        processFeeMsg: "",
        processFeeStatus: false,
        sideLoader: 0
      });
    } else {
      this.setState({
        alertMsg:
          "The minimum amount you can withdraw must be $10 or more.",
        successMsg: "",
        processFeeMsg: "",
        processFeeStatus: false,
        sideLoader: 0
      });
    }
    this.setState({ withamount });
  };

  render() {
    if (this.state.invalid) {
      return <Fourzerofour />;
    }
    const { classes } = this.props;
    return (
      <section>
        <Grid className={"wallet-main earning-container"}>

          <Typography component="h1" className={"h-title-30"}>
            Earnings
            </Typography>

          <AppBar
            position="static"
            className={
              this.state.creatorStatus == 1
                ? "wallet-tab tab_for_all"
                : "wallet-tab tab_for_all blur_tab"
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
              {/* <Tab
                label={
                  <Typography component="span" className="tab_title">
                    {" "}
                    Wallet{" "}
                  </Typography>
                }
              /> */}
              <Tab
                label={
                  <Typography component="span" className="tab_title">
                    {" "}
                    Statement{" "}
                  </Typography>
                }
                onClick={() => this.GetTransactionStatement()}
              />
            </Tabs>
          </AppBar>
          {this.state.tab == 1 && this.state.creatorStatus == 1 && (
            <TabContainer>
              <div style={styles.spacePadding} className={"boxshadow_0"}>
                <Grid container>
                  <Grid container>
                    <Grid item xs={12} sm={12} className={"left_txt"}>
                      <Grid>
                        <Typography component="h2">Enter the amount you would like to withdraw
                        </Typography>
                        <div className={"wallet-payment"}>
                          <Grid>
                            <Typography component="h4">
                              CHOOSE THE PAYMENT METHOD
                                  </Typography>
                          </Grid>
                          <Typography
                            component="div"
                            className={"wallet-paycontainer"}
                          >
                            <Typography
                              component="span"
                              className={"wallet-span"}
                            >
                              How would you like to get paid?
                                  </Typography>
                            {/* {this.state.payouttype == 1 &&
                              <Typography
                                component="span"
                                className={"wallet-span"}
                              >
                                Stripe
                                  </Typography>
                            }
                            {this.state.payouttype == 2 &&
                              <Typography
                                component="span"
                                className={"wallet-span"}
                              >
                                Direct Deposit
                                  </Typography>
                            } */}
                            {/*   <input
                            type="radio"
                            value="bankaccount"
                            defaultChecked
                          />
						   
                          Direct Deposit
						  
                          <input type="radio" value="bankaccount"  />
                        Stripe */}
                            <RadioGroup
                              aria-label="bankact"
                              name="bankact"
                              className={"radio-wallet"}
                            >
                              <FormControlLabel
                                control={<Radio />}
                                label="Stripe"
                                checked={this.state.payouttype == 1}
                                disabled
                              />
                              <FormControlLabel
                                control={<Radio />}
                                label="Direct Deposit"
                                checked={this.state.payouttype == 2}
                                disabled
                              />
                              <Typography
                                component="span"
                                className={"ws"}
                              >
                                {/* Payment fee is $0.00 USD per payout{" "} */}
                              </Typography>
                            </RadioGroup>
                          </Typography>
                        </div>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <Grid>
                        <div className={"wallet-account"}>
                          <Typography
                            component="div"
                            className={"account-heading"}
                          >
                            <Typography component="h4">
                              Current Account Balance
                                  </Typography>
                            <Typography component="h1" variant="display1">
                              $
                                    {this.state.remainingTotalEarning.toFixed(
                                2
                              )}
                            </Typography>
                          </Typography>
                          <Divider />
                          <div className={"wallet-act"}>
                            {/* <TextField
                                    id="amount"
                                    value={this.state.withamount}
                                    onChange={this.handleChange("withamount")}
                                    InputProps={{
                                      disableUnderline: true,
                                      classes: {
                                        input: this.props.classes["input"]
                                      }
                                    }}
                                  /> */}
                            <Typography
                              component="div"
                              className={"act-bal"}
                            >
                              <input
                                id="amount"
                                value={this.state.withamount}
                                inputprops={{
                                  disableUnderline: true,
                                  classes: {
                                    input: this.props.classes["input"]
                                  }
                                }}
                                type="text"
                                pattern="[0-9]*"
                                onChange={this.checkNumber.bind(this)}
                                placeholder={0}
                              />
                            </Typography>
                            {!this.state.sideLoader ? (
                              <CustomButton
                                label="Withdraw"
                                disabled={
                                  this.state.withamount < 10 ||
                                  this.state.processFeeStatus == false
                                }
                                onClick={this.onClickWithdraw}
                                className={"Secondary_btn"}
                              />
                            ) : (
                                <SideLoader />
                              )}
                            {/* <Button
                                variant="raised"
                                className={"btn_sec_full_black"}
                                onClick={this.onClickWithdraw}
                              >
                                Withdraw
                              </Button>*/}
                            {!this.state.sideLoader &&
                              this.state.alertMsg == "" &&
                              this.state.processFeeMsg == "" &&
                              this.state.successMsg == "" ? (
                                <Typography
                                  component="div"
                                  className={"enter-amt"}
                                >
                                  Please enter the amount you want to withdraw</Typography>
                              ) : (
                                ""
                              )}
                            {this.state.processFeeMsg != "" && (
                              <Typography component="p" variant="p">
                                {this.state.processFeeMsg}
                              </Typography>
                            )}
                            {this.state.alertMsg !== "" && (
                              <Typography
                                component="p"
                                className={"error-input"}
                              >
                                <Icon
                                  color="error"
                                  className={classes.error}
                                >
                                  error
                                      </Icon>
                                {this.state.alertMsg}
                              </Typography>
                            )}
                            {this.state.successMsg !== "" &&
                              !this.state.sideLoader && (
                                <Typography component="p" variant="p">
                                  {this.state.successMsg}
                                </Typography>
                              )}
                          </div>



                        </div>
                        <Typography
                          component="div"
                          className={"enter_amt_below"}>To change your Bank details,<br />
                          name, and mobile number. <a className={"bule_link"} href={this.state.loginlink} target="_blank">Click here</a></Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </div>
            </TabContainer>
          )}
          {this.state.tab == 0 && this.state.creatorStatus == 1 && (
            <TabContainer>
              <Typography
                component="div"
                className={"enter_amt_below"}>To change your Bank details, name, and mobile number. <a className={"bule_link"} href={this.state.loginlink} target="_blank">Click here</a></Typography>
              <br />
              <div className={"manage-order-container wallet-statement"}>
                <div className={"wallet-header"}>
                  <div className={"wallet-headinner"}>
                    <div className={"from-wdate"}>

                      <Typography component="p" className={"show-fromdate"}>
                        {" "}
                        SHOW{" "}
                      </Typography>
                      <Select
                        native
                        disableUnderline={true}
                        className={"wallet-seldropdown"}
                        onChange={this.onSelectOption("filterType")}
                      >
                        <option value={"ALL"} key={0}>
                          ALL
                          </option>
                        <option value={"TIP"} key={1}>
                          TIP
                          </option>
                        <option value={"STAN"} key={2}>
                          STAN
                          </option>
                        <option value={"Order"} key={3}>
                          ORDER
                          </option>
                      </Select>
                      <Select
                        native
                        disableUnderline={true}
                        className={"wallet-seldropdown sel-1"}
                        onChange={this.onSelectOption("year")}
                      >
                        <option value={-1}>SELECT YEAR</option>
                        {this.state.dropYear
                          .map((year, i) => {
                            return <option value={year}>{year}</option>;
                          })
                          .reverse()}
                      </Select>
                      <Select
                        native
                        disableUnderline={true}
                        className={"wallet-seldropdown sel-2"}
                        onChange={this.onSelectOption("month")}
                      >
                        <option value={-1}>ALL MONTHS</option>
                        {monthNames.map((name, i) => {
                          return (
                            <option value={i + 1} key={i}>
                              {name}{" "}
                            </option>
                          );
                        })}
                      </Select>
                    </div>

                    <div className={"from-wdate"}></div>
                    {/* <div className={"export-pdf"}>
                        <Typography component="p">
                          <Link to={"/"}> Export to pdf</Link>
                        </Typography>
                      </div> */}
                  </div>
                </div>
                <div style={styles.spacePadding} className={"boxshadow_0"}>
                  <Table className={"statement-table"} size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell className={"statement-th"}>
                          {" "}
                          Date{" "}
                        </TableCell>
                        <TableCell> Type </TableCell>
                        <TableCell>Buyer</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Comission</TableCell>
                        <TableCell > Processing fees </TableCell>
                        <TableCell className={"statement-th-rt"}>Net Earning</TableCell>
                        {/* <TableCell className={"statement-th-rt"}>
                            Status
                          </TableCell> */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.transData
                        .map((dt, i) => {
                          if (dt.type == "Withdraw") {
                            var amt = dt.amount ? dt.amount : 0
                            var oamt = dt.ownerAmount ? dt.ownerAmount : 0
                            var famt = dt.processFee ? dt.processFee : 0
                            var refamt = dt.referAmount ? dt.referAmount : 0
                            var tamt = amt
                            amt = amt - famt
                          }
                          else {
                            var amt = dt.amount ? dt.amount : 0
                            var oamt = dt.ownerAmount ? dt.ownerAmount : 0
                            var famt = dt.processFee ? dt.processFee : 0
                            var refamt = dt.referAmount ? dt.referAmount : 0
                            var tamt = amt + oamt + famt + refamt
                            oamt = oamt + refamt
                          }

                          return (
                            <TableRow>
                              <TableCell component="td" scope="column" data-th="Date">
                                {monthNames[new Date(dt.created).getMonth()] +
                                  " " +
                                  new Date(dt.created).getDate() +
                                  ", " +
                                  new Date(dt.created).getFullYear()}
                              </TableCell>
                              <TableCell data-th="Type" component="td" scope="column" className={"statement-order"}>
                                {dt.type}
                              </TableCell>
                              <TableCell data-th="Buyer" component="td" scope="column">
                                {dt.fromId ? dt.fromId.name : "N/A"}
                              </TableCell>
                              <TableCell data-th="Amount" component="td" scope="column">
                                ${tamt.toFixed(2)}
                              </TableCell>
                              <TableCell
                                component="td"
                                scope="column"
                                data-th="Comission"
                              >
                                ${oamt.toFixed(2)}
                              </TableCell>
                              <TableCell component="td" scope="column" data-th="Processing fees">
                                ${famt.toFixed(2)}
                              </TableCell>
                              <TableCell component="td" scope="column" data-th="Net Earning">
                                ${(amt).toFixed(2)}
                              </TableCell>
                              {/* <TableCell component="td" scope="column">
                                  <i className={"fa fa-check"}></i>
                                </TableCell> */}
                            </TableRow>
                          );
                        })
                        .sort((a, b) => a - b)}
                      {!this.state.transData.length && (
                        <TableRow>
                          <TableCell colSpan={7}>No Record Found</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabContainer>
          )}
          {this.state.creatorStatus == 0 && (
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
        </Grid>

      </section >
    );
  }
}
const TabContainer = props => {
  return <Typography component="div"> {props.children} </Typography>;
};
TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};
Wallet.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Wallet);
