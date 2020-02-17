import React, { Component } from "react";
import { withStyles, typography } from "material-ui/styles";
import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "material-ui/Typography";
import AppBar from "material-ui/AppBar";
import { Link } from "react-router-dom";
import { fetchmyShopOrder } from "../api-user";
import auth from "../../auth/auth-helper";
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

class MyOrders extends Component {
  constructor({ match }) {
    super(match);
    this.state = {
      userId: "",
      tab: 0,
      tipsdata: [],
      orderdata: [],
      stanningData: [],
      propStanningData: [],
      orderData: []
    };
    this.match = match;
  }
  componentWillReceiveProps = props => {
    this.setState({
      tab: this.state.tab
    });
  };

  /*Start Get All My Orders */
  GetMyOrders = () => {
    const jwt = auth.isAuthenticated();
    fetchmyShopOrder(
      {
        userId: this.props.userId
      },
      {
        t: jwt.token
      }
    ).then(data => {
      if (data.error) {
        console.log(data);
      } else {
        console.log(data);
        this.setState({ orderData: data.reverse() });
      }
    });
  };
  /* End Get All Transaction Statement */
  componentDidMount = () => {
    this.GetMyOrders();
  };
  render() {
    const { classes } = this.props;
    return (
      <section>
        <Grid className={"wallet-main "}>

          <Grid container>
            <Grid item xs={12}>
              <AppBar
                position="static"
                className={"tab_for_all"}
                color="default"
                style={styles.tabheaddes}
              ></AppBar>
              {this.state.tab == 0 && (
                <TabContainer>
                  <div
                    style={styles.spacePadding}
                    className={"boxshadow_0 manage-order-container"}
                  >
                    <Table className={"table-payments"} size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell className={"statement-th"}>
                            Order Id
                          </TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>Product Name</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Quantity</TableCell>
                          <TableCell>Amount</TableCell>
                          <TableCell>Vat</TableCell>
                          <TableCell>Shipping charge</TableCell>
                          <TableCell>Total</TableCell>
                          <TableCell className={"statement-th-rt"}>
                            Status
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {this.state.orderData
                          .map((elements, i) => {
                            return (
                              <TableRow key={i}>
                                <TableCell className={"text-bold"} data-th="Order Id">
                                  #{elements.orderId}
                                </TableCell>
                                <TableCell data-th="Date">
                                  {monthNames[
                                    new Date(elements.created).getMonth()
                                  ] +
                                    " " +
                                    new Date(elements.created).getDate() +
                                    ", " +
                                    new Date(elements.created).getFullYear()}
                                </TableCell>
                                <TableCell data-th="Product Name">{elements.productid.text} {elements.attributes ? "(" + elements.attributes + ")" : ''}</TableCell>
                                <TableCell data-th="Type">{elements.product_type}</TableCell>
                                <TableCell data-th="Quantity">{elements.quantity}</TableCell>
                                <TableCell data-th="Amount">${(elements.price - elements.discount).toFixed(2)}</TableCell>
                                <TableCell data-th="VAT">
                                  {elements.product_type != "physical"
                                    ? "$" + elements.vat.toFixed(2)
                                    : "N/A"}
                                </TableCell>
                                <TableCell data-th="Shipping Charge">
                                  {elements.product_type == "physical"
                                    ? "$" + elements.shippingCharges.toFixed(2)
                                    : "N/A"}
                                </TableCell>
                                <TableCell data-th="Total">
                                  ${((elements.price * elements.quantity) + elements.vat + elements.shippingCharges - elements.discount).toFixed(2)}
                                </TableCell>
                                <TableCell data-th="Status">{elements.status}</TableCell>
                              </TableRow>
                            );
                          })
                          .sort((a, b) => a - b)}
                        {!this.state.orderData.length && (
                          <TableRow>
                            <TableCell colSpan={12}>No Record Found</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
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

export default withStyles(styles)(MyOrders);
