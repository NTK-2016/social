import React, { Component } from "react";
import { withStyles, typography } from "material-ui/styles";
import Grid from "@material-ui/core/Grid";
import Button from "material-ui/Button";
import PropTypes from "prop-types";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "material-ui/Typography";
import AppBar from "material-ui/AppBar";
import { Redirect, Link } from "react-router-dom";
import Tabs, { Tab } from "material-ui/Tabs";
import {
  fetchTipedByme,
  fetchmanageOrders,
  fetchstanningdata,
  getTransDebitStmtByUser
} from "../api-user";
import auth from "../../auth/auth-helper";
import ActiveSubscription from "./ActiveSubscriptions";
import MyOrders from "./MyOrders";
import Fourzerofour from "./../../common/404";

let orderArr = [],
  stanningArr = [],
  tipsArr = [];
let monthNames = [
  "Jan",
  "Feb",
  "March",
  "April",
  "May",
  "June",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec"
];
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

class Payments extends Component {
  constructor({ match }) {
    super(match);
    this.state = {
      userId: auth.isAuthenticated().user._id,
      tab: 0,
      tipsdata: [],
      orderdata: [],
      stanningData: [],
      propStanningData: [],
      transData: [],
      invalid: false
    };

    this.match = match;
  }
  componentWillReceiveProps = props => {
    this.setState({
      tab: Number(props.match.params.tab) ? Number(props.match.params.tab) : 0
    });
    props.match.params.tab >= 0 && props.match.params.tab <= 2 ? this.setState({ invalid: false }) : this.setState({ invalid: true });

  };
  // GetTipsByUser = () => {

  //     const jwt = auth.isAuthenticated();
  //     fetchTipedByme({
  //         userId: this.state.userId
  //     }, {
  //         t: jwt.token
  //     }).then((data) => {
  //         if (data.error) {
  //             console.log(data)
  //         } else {
  //             data.tips_data[0].tips.forEach(tipped => {
  //                 tipped['tippedto'] = data.tips_data[0].postedBy.name
  //                 tipped['tippedusername'] = data.tips_data[0].postedBy.username
  //                 tipped['tippedId'] = data.tips_data[0].postedBy._id
  //                 tipped["type"] ="TIPS"
  //                 tipsArr.push(tipped)
  //             })
  //             this.setState({ tipsdata: tipsArr });
  //         }
  //     })
  // }
  // GetTotalOrderonUser = () => {

  //     const jwt = auth.isAuthenticated();
  //     fetchmanageOrders({
  //         userId: this.state.userId
  //     }, {
  //         t: jwt.token
  //     }).then((data) => {
  //         if (data.error) {
  //             console.log(data)
  //         } else {
  //             orderArr = data;
  //             this.setState({
  //                 orderdata: orderArr
  //             })
  //         }
  //     })

  // }
  GetStanningList = () => {
    const jwt = auth.isAuthenticated();
    fetchstanningdata({
      userId: this.state.userId
    }, {
      t: jwt.token
    }).then((data) => {
      if (data.error) {
        console.log(data)
      } else {
        console.log()
        data.forEach(arr => {
          stanningArr = arr.stanning;

        });
        this.setState({ stanningData: stanningArr });
      }

      this.setState({ commonData: tipsArr.concat(stanningArr, orderArr) })
      // console.log(this.state.commonData.sort((a,b)=>(a-b)))
    })
  }
  /*Start Get All Transaction Statement */
  GetTransDebitStatement = () => {
    const jwt = auth.isAuthenticated();
    getTransDebitStmtByUser(
      {
        userId: this.state.userId
      },
      {
        t: jwt.token
      }
    ).then(data => {
      if (data.error) {
        console.log(data);
        this.setState({ invalid: true });
      } else {
        this.setState({ transData: data });
      }
    });
  };
  /* End Get All Transaction Statement */
  componentDidMount = () => {
    this.GetTransDebitStatement();
    this.GetStanningList();
    this.setState({
      tab: Number(this.props.match.params.tab) ? Number(this.props.match.params.tab) : 0
    });
  };
  handleTabChange = (event, value) => {
    this.setState({
      tab: value
    });
    setTimeout(function () { }.bind(this), 2000);
  };
  clickUnSubscribe = () => {
    alert("Unsubsribe");
  };

  render() {
    if (this.state.invalid) {
      return <Fourzerofour />;
    }
    const { classes } = this.props;
    return (
      <section>
        <Grid className={"wallet-main pb-40 payment-container"}>
          <div className={"wallet-heading"}>
            <Grid component="h1" variant="h1">
              Payments{" "}
            </Grid>
          </div>
          {/* <div className={"wallet-header"}>
                <div className={"wallet-headinner"}>
                    <div className={"from-wdate"}>
                        <Typography variant = "display2"
                    component = "h2" > From: </Typography> 
                    <TextField id="datetime-local" type="date"  className={"wallet-div"}
                         InputLabelProps={{
                    shrink: true,
                    }}
                    InputProps={{ disableUnderline: true  ,classes: {input: this.props.classes['input']},style: {padding: 0} }} 
                        /> 
                    </div>

                   <Button color="primary" variant="raised" >Search </Button> 
                </div>
                <div className={"wallet-headinner"}>
                    <div className={"wallet-btn"}>
                        {/* <Typography variant = "display2"
        component = "h2" > Balance: </Typography>
 
 <Typography  component="p">315 </Typography> 
                    <Button color="primary" variant="raised" >Withdraw </Button> 

                </div>
            </div>*/}

          <Grid container>
            <Grid item xs={12}>
              <AppBar
                position="static"
                className={"wallet-tab tab_for_all"}
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
                      <div
                        component="span"
                        variant="span"
                        className="tab-title"
                      >
                        {" "}
                        Transactions{" "}
                      </div>
                    }
                  />
                  <Tab
                    label={
                      <div
                        component="span"
                        variant="span"
                        className="tab-title"
                      >
                        {" "}
                        Active Subscriptions{" "}
                      </div>
                    }
                  />
                  <Tab
                    label={
                      <div
                        component="span"
                        variant="span"
                        className="tab-title"
                      >
                        My Orders
                      </div>
                    }
                  />
                </Tabs>
              </AppBar>
              {this.state.tab == 0 && (
                <TabContainer>
                  <div
                    style={styles.spacePadding}
                    className={"boxshadow_0 manage-order-container"}
                  >
                    <Table className={"table-payments"} size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell className={"statement-th"}> Date </TableCell>
                          <TableCell> Transaction ID </TableCell>
                          <TableCell>Description</TableCell>
                          <TableCell>Amount</TableCell>
                          <TableCell>VAT</TableCell>
                          <TableCell>Total</TableCell>
                          <TableCell className={"statement-th-rt"}>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {this.state.transData
                          .map((elements, i) => {
                            var amt = elements.amount
                            var oweneramt = elements.ownerAmount ? elements.ownerAmount : 0
                            var feeamt = elements.processFee ? elements.processFee : 0
                            var vatamt = elements.vat ? elements.vat : 0
                            var refamt = elements.referAmount ? elements.referAmount : 0
                            var subamt = amt + oweneramt + feeamt + refamt
                            var netamt = subamt + vatamt
                            return elements.type == "tip" ? (
                              <TableRow>
                                <TableCell data-th="Date">
                                  {monthNames[
                                    new Date(elements.created).getMonth()
                                  ] +
                                    " " +
                                    new Date(elements.created).getDate() +
                                    ", " +
                                    new Date(elements.created).getFullYear()}
                                </TableCell>
                                <TableCell data-th="Transaction ID" className={"text-case"}>{elements.transactionId}</TableCell>
                                <TableCell data-th="Description">
                                  Tips to{" "}
                                  <Link to={"/profile/" + elements.toId.username} className={"trans-desc"}>
                                    {elements.toId.name}
                                  </Link>
                                </TableCell>
                                <TableCell data-th="Amount">${subamt.toFixed(2)}</TableCell>
                                <TableCell data-th="VAT">${vatamt.toFixed(2)}</TableCell>
                                <TableCell data-th="Total">${netamt.toFixed(2)}</TableCell>
                                <TableCell data-th="Status">
                                  <i className={"fa fa-check"}></i>
                                </TableCell>
                              </TableRow>
                            ) : elements.type == "stan" ? (
                              <TableRow >
                                <TableCell data-th="Date">
                                  {monthNames[
                                    new Date(elements.created).getMonth()
                                  ] +
                                    " " +
                                    new Date(elements.created).getDate() +
                                    ", " +
                                    new Date(elements.created).getFullYear()}
                                </TableCell>
                                <TableCell data-th="Transaction ID" className={"text-case"}>{elements.transactionId}</TableCell>
                                <TableCell data-th="Description">
                                  Stan to{" "}
                                  <Link to={"/profile/" + elements.toId.username} className={"trans-desc"}>
                                    {elements.toId.name}
                                  </Link>
                                </TableCell>
                                <TableCell data-th="Amount">${subamt.toFixed(2)}</TableCell>
                                <TableCell data-th="VAT">${vatamt.toFixed(2)}</TableCell>
                                <TableCell data-th="Total">${netamt.toFixed(2)}</TableCell>
                                <TableCell data-th="Status">
                                  <i className={"fa fa-check"}></i>
                                </TableCell>
                              </TableRow>
                            ) : elements.type == "order" ? (
                              <TableRow>
                                <TableCell data-th="Date">
                                  {monthNames[
                                    new Date(elements.created).getMonth()
                                  ] +
                                    " " +
                                    new Date(elements.created).getDate() +
                                    ", " +
                                    new Date(elements.created).getFullYear()}
                                </TableCell>
                                <TableCell data-th="Transaction ID" className={"text-case"}>{elements.transactionId}</TableCell>
                                <TableCell data-th="Description">
                                  Order to{" "}
                                  <Link to={"/profile/" + elements.toId.username} className={"trans-desc"}>
                                    {elements.toId.name}
                                  </Link>
                                </TableCell>
                                <TableCell data-th="Amount">${subamt.toFixed(2)}</TableCell>
                                <TableCell data-th="VAT">${vatamt.toFixed(2)}</TableCell>
                                <TableCell data-th="Total">${netamt.toFixed(2)}</TableCell>
                                <TableCell data-th="Status">
                                  <i className={"fa fa-check"}></i>
                                </TableCell>
                              </TableRow>
                            ) : (
                                    <TableRow>
                                      <TableCell colSpan={7}>
                                        No Record Found
                                </TableCell>
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
                </TabContainer>
              )}
              {this.state.tab == 1 && (
                <TabContainer>
                  <div style={styles.spacePadding} className={"boxshadow_0"}>
                    <ActiveSubscription
                      propStanningData={this.state.stanningData}
                      userId={this.state.userId}
                      onUnSubscribe={this.clickUnSubscribe}
                    />
                  </div>
                </TabContainer>
              )}
              {this.state.tab == 2 && (
                <TabContainer>
                  <div style={styles.spacePadding} className={"boxshadow_0"}>
                    <MyOrders
                      userId={this.state.userId}
                    />
                  </div>
                </TabContainer>
              )}
            </Grid>
          </Grid>
        </Grid>
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

export default withStyles(styles)(Payments);
