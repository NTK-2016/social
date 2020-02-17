import React, { Component } from "react";
import { withStyles } from "material-ui/styles";
import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Modal from "@material-ui/core/Modal";
import Button from "material-ui/Button";
import { Divider } from "@material-ui/core";
import Typography from "material-ui/Typography";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import auth from "../../auth/auth-helper";
import { sendPurchaseNote } from "../../user/api-user";
import CustomButton from "../../common/CustomButton";
import Moment from "react-moment";
import SideLoader from "./../../common/SideLoader";

const value = "ters";
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
  },
  close1: {
    position: "absolute",
    right: "28px",
    top: "28px",
    fontSize: "25px",
    cursor: "pointer"
  }
});

class ManageOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: "",
      open: false,
      message: "",
      openid: "",
      msgboxopen: false,
      msgbox: -1,
      closepop: "",
      isClickButton: false,
      alertMsg: "",
      buttonText: "Shipping-button",
      loader: false
    };
    this.props = props;
  }
  componentDidMount = () => {
    this.userData = new FormData();
    // this.props.orderdata.map((element, i) => {
    //   this.userData.set("message", element.message);
    // });
  };
  handlePopup = key => {
    this.setState({ openid: key });
  };
  handleClosePopup = () => {
    this.setState({ openid: -1 });
    this.setState({ open: false });
  };
  handlemsgbox = key => event => {
    const buttons = event.target.parentNode.parentNode.parentNode.children;
    for (let i = 0; i < buttons.length; i++) {
      //here you set all buttons to default color
      buttons[i].classList.remove("changed-color");
    }
    //here you add active class(color) to button you originally clicked
    event.target.parentNode.parentNode.classList.add("changed-color");
    this.setState({
      msgbox: key,
      isClickButton: false,
      message: "",
      alertMsg: "",
      buttons: buttons
    });
  };
  handeCloseMsgBox = () => {
    const buttons = this.state.buttons;
    for (let i = 0; i < buttons.length; i++) {
      //here you set all buttons to default color
      buttons[i].classList.remove("changed-color");
    }
    this.setState({ msgbox: -1 });
    this.setState({ msgboxopen: false });
  };
  handleChange = name => event => {
    const value = event.target.value;
    this.userData.set(name, value);
    this.setState({ [name]: value });
    console.log(" name " + name + " && value :" + value);
  };
  onClickSendBtn = orderId => {
    console.log(this.state.message + " orderId :" + orderId);
    if (this.state.message) {
      this.setState({ loader: true });
      const jwt = auth.isAuthenticated();
      console.log(this.userData);
      sendPurchaseNote(
        {
          order_id: orderId,
          messages: this.state.message
        },
        {
          t: jwt.token
        }
      ).then(data => {
        if (data.error) {
          this.setState({ error: data.error });
        } else {
          this.setState({
            isClickButton: true,
            buttonText: "Re-send shipping note",
            alertMsg: "",
            loader: false,
            message: ""
          });
          //this.setState({'redirectToProfile': false})
        }
      });
    } else {
      this.setState({ alertMsg: "Please enter text!" });
    }
  };
  render() {
    const { classes } = this.props;
    return (
      <Grid className={"wallet-main pt-30"}>
        <Grid container className={"manage-order-container "}>
          <Grid item xs={12} className={"creator-order"}>
            <Table className={classes.table} size="small">
              <TableHead>
                <TableRow>
                  <TableCell className={"statement-th"}>Order</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Product Type</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Shipping charge</TableCell>
                  <TableCell>Total</TableCell>
                  {/* <TableCell>Vat</TableCell>
                  <TableCell>Processing Fees</TableCell> */}
                  <TableCell>Status</TableCell>
                  <TableCell className={"statement-th-rt"}>Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {this.props.orderdata.map((element, i) => {
                  return (
                    <TableRow key={i}>
                      <TableCell className={"text-bold"} data-th="Order">
                        <a onClick={() => this.handlePopup(i)} className={"cursor-add"}>
                          #{element.orderId} {element.address.shipping_address.name}
                        </a>
                      </TableCell>
                      <TableCell data-th="Date">
                        <Moment format="D MMM YYYY">
                          {new Date(element.created).toString()}
                        </Moment>
                      </TableCell>
                      <TableCell data-th="Product Type">{element.product_type}</TableCell>
                      <TableCell data-th="Quantity">{element.quantity}</TableCell>
                      <TableCell data-th="Price">${element.price - element.discount}</TableCell>
                      <TableCell data-th="Shipping Charges">{element.shippingCharges
                        ? "$" + element.shippingCharges
                        : "N/A"}</TableCell>
                      <TableCell data-th="Total">{element.shippingCharges
                        ? "$" + (((element.quantity * element.price) - element.discount) + element.shippingCharges)
                        : "$" + (element.price - element.discount)}</TableCell>
                      {/* <TableCell>
                        {element.product_type != "physical" && element.vat
                          ? "$" + element.vat
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {element.processFee != "" && element.processFee != null
                          ? "$" + element.processFee
                          : ""}
                      </TableCell> */}
                      <TableCell data-th="Status">{element.status}</TableCell>
                      {element.messages.length > 0 ? (
                        <TableCell>
                          {/* <Button onClick={() => this.handlemsgbox(i)} value={this.state.msgboxopen} className={"shipping-button"} >Re-send shipping note</Button> */}
                          <CustomButton
                            onClick={this.handlemsgbox(i)}
                            //onClick={this.handleClick}
                            key={i}
                            value={this.state.msgboxopen}
                            label="Re-send shipping note"
                          //className={this.state.msgbox>=0 ? "changed-color" : ""}
                          />
                        </TableCell>
                      ) : (
                          <TableCell>
                            {/* <Button onClick={() => this.handlemsgbox(i)} value={this.state.msgboxopen} className={"shipping-button"} >send shipping note</Button> */}
                            <CustomButton
                              key={i}
                              onClick={this.handlemsgbox(i)}
                              value={this.state.msgboxopen}
                              label="Send shipping note"
                            //  className={this.state.msgbox>=0 ? "changed-color" : ""}
                            />
                          </TableCell>
                        )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            {this.props.orderdata.map((element, i) => {
              return (
                <Modal
                  value={this.state.openid === i}
                  key={i}
                  aria-labelledby="transition-modal-title"
                  aria-describedby="transition-modal-description"
                  open={this.state.openid === i}
                  onClose={this.handleClosePopup}
                  className={classes.modal}
                >
                  <Grid container className={"manage-order-popup-container"}>
                    <Grid item xs={6} className={"manage-order-popup"}>
                      <Grid className={"popup-top-header"}>
                        <Typography component="div" className={"close-manage-popup"}>
                          {" "}
                          <i
                            className={"fal fa-times"}
                            onClick={this.handleClosePopup}
                          ></i>{" "}
                        </Typography>

                        <Grid container>
                          <Grid item xs={8}>
                            {" "}
                            <Typography component="h2">
                              Order # {element.orderId}
                            </Typography>{" "}
                          </Grid>
                          <Grid item xs={4}>
                            {" "}
                            <Typography component="h2">
                              {" "}
                              {element.status}
                            </Typography>{" "}
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid className={"shippingdetail-cont"}>
                        <Typography
                          component="h2"
                          className={"shipping-details"}
                        >
                          Shipping Details
                        </Typography>
                        <Typography component="p" className={"manageship-name"}>
                          <Typography component="p" className={"shipping-name"}>
                            {element.address.shipping_address.name}
                          </Typography>
                        </Typography>
                        <Typography component="p">
                          <Typography component="span" variant="span">
                            {" "}
                            Street Name{" "}
                          </Typography>{" "}
                          <Typography component="span" variant="span">
                            {element.address.shipping_address.street}
                          </Typography>{" "}
                        </Typography>
                        <Typography component="p">
                          <Typography component="span" variant="span">
                            {" "}
                            Town{" "}
                          </Typography>
                          <Typography component="span" variant="span">
                            {element.address.shipping_address.city}
                          </Typography>{" "}
                        </Typography>
                        <Typography component="p">
                          <Typography component="span" variant="span">
                            Country
                          </Typography>
                          <Typography component="span" variant="span">
                            {element.address.shipping_address.country}
                          </Typography>
                        </Typography>
                        <Typography component="p">
                          <Typography component="span" variant="span">
                            Postalcode
                          </Typography>
                          <Typography component="span" variant="span">
                            {element.address.shipping_address.zipcode}
                          </Typography>{" "}
                        </Typography>
                      </Grid>

                      <Grid className={"shipping-method"}>
                        <Typography component="h2">Shipping Method</Typography>
                        <Typography component="p">UK Delivery </Typography>
                      </Grid>
                      <Typography
                        component="div"
                        className={"wallet-main remove-border"}
                      >
                        <Table
                          className={classes.table}
                          className={"manage-order-container remove-margin"}
                          size="small"
                        >
                          <TableHead>
                            <TableRow>
                              <TableCell align="left">Date</TableCell>
                              <TableCell align="left">Product Name</TableCell>
                              <TableCell align="right">Quantity</TableCell>
                              <TableCell align="right">Type</TableCell>
                              <TableCell align="right">Shipping</TableCell>
                              <TableCell align="right">Price</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody className={""}>
                            <TableRow>
                              <TableCell align="left" data-th="Date">
                                <Moment format="D MMM YYYY HH:mm">
                                  {new Date(element.created).toString()}
                                </Moment>
                              </TableCell>
                              <TableCell align="right" data-th="Product Name">
                                {element.productid && element.productid.text} {element.attributes ? "(" + element.attributes + ")" : ''}
                              </TableCell>
                              <TableCell align="right" data-th="Quantity">
                                {element.quantity}
                              </TableCell>
                              <TableCell align="right" data-th="Type">
                                {element.product_type}
                              </TableCell>
                              <TableCell align="right" data-th="Shipping">
                                ${element.shippingCharges}
                              </TableCell>
                              <TableCell align="right" data-th="Price">
                                ${element.price}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </Typography>
                    </Grid>
                  </Grid>
                </Modal>
              );
            })}
            {this.props.orderdata.map((element, i) => {
              return (
                <Modal
                  key={i}
                  value={this.state.msgboxopen}
                  aria-labelledby="transition-modal-title"
                  aria-describedby="transition-modal-description"
                  open={this.state.msgbox === i}
                >
                  <Grid container className={"manage-order-popup-container"}>
                    {!this.state.isClickButton && (
                      <Grid
                        item
                        xs={5}
                        className={"manage-order-popup shipping-popup note_popup"}
                      >
                        <Typography component="div" className={classes.close1}>
                          {" "}
                          <i
                            className={"fal fa-times"}
                            onClick={this.handeCloseMsgBox}
                          ></i>{" "}
                        </Typography>

                        <Typography component="h2">
                          Write a note to {element.customer_name}
                        </Typography>
                        <Typography component="p">
                          Thank your customer for the purchase and include any
                          relevant information regarding the delivery.
                        </Typography>
                        <TextareaAutosize
                          rows={"7"}
                          placeholder="Enter a message"
                          onChange={this.handleChange("message")}
                          value={this.state.message}
                        />
                        {this.state.alertMsg !== "" && (
                          <Typography
                            component="p"
                            className={"error-message text-left"}
                          >
                            {this.state.alertMsg}
                          </Typography>
                        )}
                        {/** <Button
                            className={"save-button"}
                            color="primary"
                            onClick={() => this.onClickSendBtn(element._id)}
                          >
						
                            Send
						</Button>**/}
                        {!this.state.loader &&
                          <CustomButton
                            label="Send"
                            onClick={() => this.onClickSendBtn(element._id)}
                            className={"Primary_btn_blk mt-10"}
                            disabled={this.state.message == ""}
                          />
                        }
                        {this.state.loader &&
                          <SideLoader className={"Primary_btn_blk mt-10"} />
                        }
                      </Grid>
                    )}
                    {this.state.isClickButton && (
                      <Grid
                        item
                        xs={5}
                        className={"manage-order-popup textcenter"}
                      >
                        <Grid className={"popup-close"}>
                          <i
                            className="fa fa-times"
                            aria-hidden="true"
                            onClick={this.handeCloseMsgBox}
                          ></i>
                        </Grid>
                        <Typography component="h2">
                          Shipping note has been Sent!
                        </Typography>
                        <Typography
                          component="h3"
                          variant="h3"
                          className={"pb-20"}
                        >
                          Shipping note has been sent to your customer and they
                          will
                          <br /> receive it via email.
                        </Typography>
                        <CustomButton
                          label="Done"
                          onClick={this.handeCloseMsgBox}
                          className={"Primary_btn_blk"}
                        />

                        <Typography
                          component="p"
                          className={"pop-hind popup_gray_txt"}
                        >
                          * Should your customer not have received an email, you
                          can re-send shipping note again until their receive
                          it.
                          <br />
                          <a href="#">Contact us</a> if you help and we will
                          resolve this issue for you.
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Modal>
              );
            })}
            {this.props.orderdata.length == 0 && (
              <Grid className={"wallet-main pb-30"}>
                <Grid container className={"manage-order-container"}>
                  <Grid item xs={12}>
                    <Typography component="h3" className={"textcenter ana-h3"}>
                      There are no orders yet
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    );
  }
}
ManageOrder.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ManageOrder);
