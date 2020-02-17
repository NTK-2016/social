import React, { Component } from "react";
import StripeCheckout from "react-stripe-checkout";
import IconButton from 'material-ui/IconButton';
import { payTip, getShippingCharges } from "../../post/api-post";
import auth from "../../auth/auth-helper";
import { readpost } from "./../../post/api-post.js";
import {
  placeorder,
  fetchCountrylist,
  checkStan,
  findStanning,
  getVatByCountry
} from "./../api-user.js";
import { Grid } from "@material-ui/core";
import TextField from "material-ui/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import Typography from "material-ui/Typography";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Select from "material-ui/Select";
import Icon from "material-ui/Icon";
import { required, countError } from "./../../common/ValidatePost";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { withStyles } from "material-ui/styles";
import config from "../../../config/config";
import CustomButton from "./../../common/CustomButton";
import { Link } from "react-router-dom";

const styles = theme => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  // close1: {
  //   position: "absolute",
  //   right: "20px",
  //   top: "10px",
  //   fontSize: "25px",
  //   cursor: "pointer"
  // },

  // parasection: {
  //   padding: "20px 25px"
  // },

});

const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};
let countries = [];
class CheckoutForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      creatorname: '',
      amount: 100,
      user: auth.isAuthenticated(),
      stripeKey: config.stripe_test_api_key,
      productId: "",
      productname: "",
      quantity: 0,
      total: 0,
      userId: "",
      baseprice: 0,
      billname: "",
      billaddressone: "",
      billaddresstwo: "",
      billcity: "",
      billstate: "",
      billzip: "",
      billcountry: "",
      shipname: "",
      shipaddressone: "",
      shipaddresstwo: "",
      shipcity: "",
      shipstate: "",
      shipzip: "",
      shipcountry: "",
      same: false,
      country: [],
      shipping: 0,
      grandtotal: 0,
      enable: true,
      discount: 0,
      vatCharge: 0,
      errors: {},
      showStripe: false,
      formIsValid: true,
      producttype: "",
      attributes: [],
      open: false,
      digitalfiles: []
    };
  }

  submit = ev => {
    // User clicked submit
  };

  handlePopClose = () => {
    this.setState({
      open: false,
    });
  };


  componentDidMount = () => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    this.CheckoutData = new FormData();

    if (localStorage.getItem("checkout"))
      var productDetails = JSON.parse(localStorage.getItem("checkout"));
    this.setState({
      productId: productDetails.productid,
      quantity: productDetails.quantity,
      attributes: productDetails.selectAttributeValue
    });
    const jwt = auth.isAuthenticated();
    sleep(500).then(() => {
      readpost(
        {
          postId: this.state.productId,
          id: jwt.user._id
        },
        { t: jwt.token }
      ).then(data => {
        if (data.error) {
          this.setState({ error: data.error });
        } else {
          var total = this.state.quantity * data.price;
          var discount = 0;
          if (data.postedBy.subscriptionpitch.stanbtn) {
            findStanning(
              {
                userId: jwt.user._id
              },
              { t: jwt.token }
            ).then(stan => {
              if (stan.error) {
                this.setState({ error: stan.error });
              } else {
                stan.stanning.forEach(element => {
                  if (
                    data.postedBy._id === element.creatorId._id &&
                    element.status == 1
                  ) {
                    discount =
                      (total * data.postedBy.shopenable.standiscount) / 100;
                  }
                });
              }
            });
          }
          sleep(500).then(() => {
            var grandtotal = total - discount;
            this.setState({
              creatorname: data.postedBy.name,
              productId: data._id,
              productname: data.text,
              producttype: data.producttype,
              baseprice: data.price,
              userId: data.postedBy._id,
              total: total,
              grandtotal: grandtotal,
              enable: data.postedBy.shopenable.shopstatus,
              discount: discount,
              digitalfiles: data.attach
            });
          });
        }
      });

      fetchCountrylist(
        {
          userId: jwt.user._id
        },
        { t: jwt.token }
      ).then(data => {
        if (data.error) {
          this.setState({ redirectToSignin: true });
        } else {
          data.forEach(element => {
            countries.push({ "country": element.country, "code": element.code });
            //countries = element.name;
          });

          this.setState({ country: countries });
        }
      });
    });

    // checkStan({
    //   userId: jwt.user._id
    // }, { t: jwt.token }).then((stans) => {
    //   if (stans.error) {
    //     this.setState({ redirectToSignin: true })
    //   } else {
    //     console.log(stans)
    //   }
    // })
  };
  download = () => {
    var flag = false;
    console.log(this.state.digitalfiles)
    if (this.state.digitalfiles.includes(",")) {
      var digitalfiles = this.state.digitalfiles.split(",")
      var link = document.createElement('a');
      link.setAttribute('download', '');
      link.style.display = 'none';
      document.body.appendChild(link);
      for (var i = 0; i < digitalfiles.length; i++) {
        link.setAttribute('href', config.attachmentBucketURL + digitalfiles[i]);
        link.click();
        if (digitalfiles.length == i + 1) {
          flag = true
        }
      }
      document.body.removeChild(link);
    }
    else {
      var link = document.createElement('a');
      link.setAttribute('download', '');
      link.style.display = 'none';
      document.body.appendChild(link);
      link.setAttribute('href', config.attachmentBucketURL + this.state.digitalfiles);
      link.click();
      document.body.removeChild(link);
      flag = true
    }
    sleep(1000).then(() => {
      flag ? window.location = "/payments_transaction/" + auth.isAuthenticated().user._id + "/2" : ''
    })
  }
  clickOrder = () => {
    const jwt = auth.isAuthenticated();
    this.CheckoutData.set("quantity", this.state.quantity);
    this.CheckoutData.set("price", this.state.baseprice);
    this.CheckoutData.set("discount", this.state.discount);
    this.CheckoutData.set("vat", this.state.vatCharge);
    this.CheckoutData.set("shippingCharges", this.state.shipping);
    this.CheckoutData.set("productid", this.state.productId);
    this.CheckoutData.set("customer_name", jwt.user.name);
    this.CheckoutData.set("customer_email", jwt.user.email);
    this.CheckoutData.set("product_type", "Physical");
    this.CheckoutData.set("status", "Processing");
    this.CheckoutData.set("ordered_by", jwt.user._id);
    this.CheckoutData.set("user_id", this.state.userId);
    this.CheckoutData.set("productname", this.state.productname);

    placeorder(
      {
        t: jwt.token
      },
      this.CheckoutData
    ).then(data => {
      if (data.error) {
        this.setState({ error: data.error });
      } else {
        this.setState({ open: true })
        //alert(`Order Successfully!`);
      }
    });
  };

  handleChange = name => event => {
    let errors = this.state.errors
    errors[name] = false
    var value = event.target.value;
    this.CheckoutData.set(name, value);
    this.setState({ [name]: value, errors: errors });
    if (this.state.same) {
      var shipvaribale = name.substring(4);
      if (name === "billcountry") {
        this.state.country.map((item, i) => {
          if (value === item.code) {
            value = item.country;
            return false
          }
        })
      }
      errors["ship" + shipvaribale] = false
      this.CheckoutData.set("ship" + shipvaribale, value);
      this.setState({ ["ship" + shipvaribale]: value, errors: errors });
      sleep(100).then(() => {
        "ship" + shipvaribale === "shipcountry"
          ? this.getCountryShippingCharges()
          : "";
        if (name == "billcountry") {
          this.handleValidation();
        }
      });
    }
    sleep(100).then(() => {
      name === "shipcountry" ? this.getCountryShippingCharges() : "";
      if (name === "billcountry" && this.state.producttype == "digital") {
        this.getCountryVatCharges(value);
        this.handleValidation();
      }
      if (name == "shipcountry") {
        this.handleValidation();
      }
    });
  };
  /* Start Get Country Vat Charges */
  getCountryVatCharges(value) {
    const jwt = auth.isAuthenticated();
    getVatByCountry(
      {
        code: value,
        event: 'change',
      },
      { t: jwt.token }
    ).then(data => {
      if (data.error) {
        this.setState({ redirectToSignin: true });
      } else {
        let vat_per = 0;
        data.forEach(element => {
          vat_per = element.vat_per;
        });
        this.setState({
          grandtotal: this.state.grandtotal - this.state.vatCharge,
          vatCharge: 0
        });
        let vatCharge = (this.state.grandtotal * vat_per) / 100;
        let grandTotal = vatCharge + this.state.grandtotal;
        this.setState({
          vatCharge: vatCharge,
          grandtotal: grandTotal
        });
      }
    });
  }

  /* End Country Vat Charges */
  getCountryShippingCharges() {
    this.setState({
      grandtotal: this.state.grandtotal - this.state.shipping,
      shipping: 0
    });
    var country = this.state.shipcountry;
    if (localStorage.getItem("shipping"))
      var charges = JSON.parse(localStorage.getItem("shipping"));
    if (typeof charges != "undefined") {
      charges.map((item, i) => {
        if (item.country == country) {
          var gtotal = this.state.grandtotal + item.charges;
          this.setState({ shipping: item.charges, grandtotal: gtotal });
        }
      });
      if (this.state.shipping == 0) {
        charges.map((item, i) => {
          if (item.country == "Eleswhere") {
            var gtotal = this.state.grandtotal + item.charges;
            this.setState({ shipping: item.charges, grandtotal: gtotal });
          }
        });
      }
    }
  }

  handleValidation() {
    let errors = {};
    let res = [];
    let formIsValid = true;
    errors["billname"] = required(this.state.billname, "Name is required");
    res.push(required(this.state.billname, "Name is required"));
    errors["billaddressone"] = required(
      this.state.billaddressone,
      "Address Line 1 is required"
    );
    res.push(required(this.state.billaddressone, "Address Line 1 is required"));
    errors["billaddresstwo"] = required(
      this.state.billaddresstwo,
      "Address Line 2 is required"
    );
    res.push(required(this.state.billaddresstwo, "Address Line 2 is required"));
    errors["billcity"] = required(this.state.billcity, "City is required");
    res.push(required(this.state.billcity, "City is required"));
    errors["billstate"] = required(this.state.billstate, "State is required");
    res.push(required(this.state.billstate, "State is required"));
    errors["billzip"] = required(this.state.billzip, "Zip Code is required");
    res.push(required(this.state.billzip, "Zip Code is required"));
    errors["billcountry"] = required(
      this.state.billcountry,
      "Country is required"
    );
    res.push(required(this.state.billcountry, "Country is required"));
    if (this.state.producttype == "physical") {
      errors["shipname"] = required(this.state.shipname, "Name is required");
      res.push(required(this.state.shipname, "Name is required"));
      errors["shipaddressone"] = required(
        this.state.shipaddressone,
        "Address Line 1 is required"
      );
      res.push(
        required(this.state.shipaddressone, "Address Line 1 is required")
      );
      errors["shipaddresstwo"] = required(
        this.state.shipaddresstwo,
        "Address Line 2 is required"
      );
      res.push(
        required(this.state.shipaddresstwo, "Address Line 2 is required")
      );
      errors["shipcity"] = required(this.state.shipcity, "City is required");
      res.push(required(this.state.shipcity, "City is required"));
      errors["shipstate"] = required(this.state.shipstate, "State is required");
      res.push(required(this.state.shipstate, "State is required"));
      errors["shipzip"] = required(this.state.shipzip, "Zip Code is required");
      res.push(required(this.state.shipzip, "Zip Code is required"));
      errors["shipcountry"] = required(
        this.state.shipcountry,
        "Country is required"
      );
      res.push(required(this.state.shipcountry, "Country is required"));
    }
    var count = countError(res);
    if (count > 0) {
      formIsValid = false;
      this.setState({ errors: errors, formIsValid: true });
    } else {
      this.setState({ formIsValid: false, errors: errors });
    }
    return formIsValid;
  }

  handleCheckout = (token, carddata) => {
    this.setState({ errors: "" });
    if (this.handleValidation()) {
      const jwt = auth.isAuthenticated();
      this.CheckoutData.set("quantity", this.state.quantity);
      this.CheckoutData.set("price", this.state.baseprice);
      this.CheckoutData.set("discount", this.state.discount);
      this.CheckoutData.set("vat", this.state.vatCharge);
      this.CheckoutData.set("shippingCharges", this.state.shipping);
      this.CheckoutData.set("productid", this.state.productId);
      this.CheckoutData.set("customer_name", jwt.user.name);
      this.CheckoutData.set("customer_email", jwt.user.email);
      this.CheckoutData.set("product_type", this.state.producttype);
      this.CheckoutData.set("status", "Processing");
      this.CheckoutData.set("ordered_by", jwt.user._id);
      this.CheckoutData.set("user_id", this.state.userId);
      this.CheckoutData.set("userToken", token.id);
      this.CheckoutData.set("productname", this.state.productname);
      this.CheckoutData.set("attributes", this.state.attributes);
      placeorder(
        {
          t: jwt.token
        },
        this.CheckoutData
      ).then(data => {
        if (data.error) {
          this.setState({ error: data.error });
        } else {
          this.setState({ open: true })
          // alert(`Order Successfully!`);
          if (localStorage.hasOwnProperty("checkout")) {
            localStorage.removeItem("checkout");
            localStorage.removeItem("shipping");
          }
          //window.location = "/payments_transaction/" + auth.isAuthenticated().user._id + "/2";
        }
      });
      // console.log(token.id)
      // console.log(this.CheckoutData.get('userToken'))
    }
  };

  handleCheckbox = event => {
    if (event.target.checked) {
      var shipcountryvalue = this.state.billcountry
      this.state.country.map((item, i) => {
        if (this.state.billcountry === item.code) {
          shipcountryvalue = item.country;
          return false
        }
      })

      this.setState({
        shipname: this.state.billname,
        shipaddressone: this.state.billaddressone,
        shipaddresstwo: this.state.billaddresstwo,
        shipcity: this.state.billzip,
        shipstate: this.state.billstate,
        shipzip: this.state.billzip,
        shipcountry: shipcountryvalue,
        same: true
      });
      sleep(100).then(() => {
        this.getCountryShippingCharges();
      });
    } else {
      this.setState({
        shipname: "",
        shipaddressone: "",
        shipaddresstwo: "",
        shipcity: "",
        shipstate: "",
        shipzip: "",
        shipcountry: "",
        same: false,
        grandtotal: this.state.grandtotal - this.state.shipping,
        shipping: 0
      });
    }
    sleep(100).then(() => {
      this.handleValidation();
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <section>
        <div className="checkout my_full_container">
          <Grid container>
            <Grid item xs={12} sm={12}>  <Box mb={2} mt={0} variant="h1" component="h1" className={"product_title_che"}>
              {this.state.productname}&nbsp;
                {this.state.attributes &&
                this.state.attributes.map((item, index) => {
                  return <Typography variant="span" component="span">{item}</Typography>
                })
              }
            </Box>
            </Grid>
            <Grid item xs={12} sm={8} className={"checkout-12"}>

              <Grid container className={"form_blk_section"}>
                <Box mb={3} mt={0} component="h2">
                  Billing Details
                </Box>
                <Grid item xs={12} sm={12} >
                  <Grid container className={"full_line"}>
                    <Grid item xs={12} sm={4}>
                      <Typography component="div" className={"ch-req"}>
                        <Box className={"form-label"}>Name</Box>
                        <Typography className={"req_txt"}>*</Typography>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Box component="div" className={"textFieldforms_full"}>
                        <TextField
                          id="standard-full-width"
                          value={this.state.billname}
                          placeholder="Name"
                          margin="normal"
                          InputLabelProps={{ shrink: true }}
                          onChange={this.handleChange("billname")}
                          autoComplete="off"
                        />
                        {this.state.errors["billname"] && (
                          <Typography
                            component="div"
                            color="error"
                            className={"error-input"}
                          >
                            <Icon color="error">error</Icon>
                            {this.state.errors["billname"]}
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  </Grid>

                  <Grid container className={"full_line"}>
                    <Grid item xs={12} sm={4}>
                      <Typography component="div" className={"ch-req"}>
                        <Box className={"form-label"}>Address Line 1</Box>
                        <Typography component="div" className={"req_txt"}>
                          *
                      </Typography>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Box component="div" className={"textFieldforms_full"}>
                        <TextField
                          id="standard-full-width"
                          placeholder="Address Line 1"
                          margin="normal"
                          InputLabelProps={{ shrink: true }}
                          onChange={this.handleChange("billaddressone")}
                          autoComplete="off"
                        />
                        {this.state.errors["billaddressone"] && (
                          <Typography
                            component="div"
                            color="error"
                            className={"error-input"}
                          >
                            <Icon color="error">error</Icon>
                            {this.state.errors["billaddressone"]}
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  </Grid>

                  <Grid container className={"full_line"}>
                    <Grid item xs={12} sm={4}>
                      <Typography component="div" className={"ch-req"}>
                        <Box className={"form-label"}>Address Line 2</Box>
                        <Typography component="div" className={"req_txt"}>
                          *
                      </Typography>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Box component="div" className={"textFieldforms_full"}>
                        <TextField
                          id="standard-full-width"
                          placeholder="Address Line 2"
                          margin="normal"
                          InputLabelProps={{ shrink: true }}
                          onChange={this.handleChange("billaddresstwo")}
                          autoComplete="off"
                        />
                        {this.state.errors["billaddresstwo"] && (
                          <Typography
                            component="div"
                            color="error"
                            className={"error-input"}
                          >
                            <Icon color="error">error</Icon>
                            {this.state.errors["billaddresstwo"]}
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  </Grid>

                  <Grid container className={"full_line"}>
                    <Grid item xs={12} sm={4}>
                      <Typography component="div" className={"ch-req"}>
                        <Box className={"form-label"}>City</Box>
                        <Typography component="div" className={"req_txt"}>
                          *
                      </Typography>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Box component="div" className={"textFieldforms_full"}>
                        <TextField
                          id="standard-full-width"
                          placeholder="City"
                          margin="normal"
                          InputLabelProps={{ shrink: true }}
                          onChange={this.handleChange("billcity")}
                          autoComplete="off"
                        />
                        {this.state.errors["billcity"] && (
                          <Typography
                            component="div"
                            color="error"
                            className={"error-input"}
                          >
                            <Icon color="error">error</Icon>
                            {this.state.errors["billcity"]}
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  </Grid>

                  <Grid container className={"full_line"}>
                    <Grid item xs={12} sm={4}>
                      <Typography component="div" className={"ch-req"}>
                        <Box className={"form-label"}>State</Box>
                        <Typography component="div" className={"req_txt"}>
                          *
                      </Typography>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Box component="div" className={"textFieldforms_full"}>
                        <TextField
                          id="standard-full-width"
                          placeholder="State"
                          margin="normal"
                          InputLabelProps={{ shrink: true }}
                          onChange={this.handleChange("billstate")}
                          autoComplete="off"
                        />
                        {this.state.errors["billstate"] && (
                          <Typography
                            component="div"
                            color="error"
                            className={"error-input"}
                          >
                            <Icon color="error">error</Icon>
                            {this.state.errors["billstate"]}
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  </Grid>

                  <Grid container className={"full_line"}>
                    <Grid item xs={12} sm={4}>
                      <Typography component="div" className={"ch-req"}>
                        <Box className={"form-label"}>Zip Code</Box>
                        <Typography component="div" className={"req_txt"}>
                          *
                      </Typography>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Box component="div" className={"textFieldforms_full"}>
                        <TextField
                          id="standard-full-width"
                          placeholder="Zip Code"
                          margin="normal"
                          InputLabelProps={{ shrink: true }}
                          onChange={this.handleChange("billzip")}
                          autoComplete="off"
                        />
                        {this.state.errors["billzip"] && (
                          <Typography
                            component="div"
                            color="error"
                            className={"error-input"}
                          >
                            <Icon color="error">error</Icon>
                            {this.state.errors["billzip"]}
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                  <Grid container className={"full_line"}>
                    <Grid item xs={12} sm={4}>
                      <Typography component="div" className={"ch-req"}>
                        <Box className={"form-label"}> Country</Box>
                        <Typography component="div" className={"req_txt"}>
                          *
                      </Typography>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Box component="div" className={"textFieldforms_full"}>
                        <Select
                          native
                          onChange={this.handleChange("billcountry")}
                        >
                          <option value="">Select Country</option>
                          {this.state.country.map((item, i) => {
                            return (
                              <option key={i} value={item.code}>
                                {item.country}
                              </option>
                            );
                          })}
                        </Select>
                        {this.state.errors["billcountry"] && (
                          <Typography
                            component="div"
                            color="error"
                            className={"error-input"}
                          >
                            <Icon color="error">error</Icon>
                            {this.state.errors["billcountry"]}
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                  {this.state.producttype == "physical" && (
                    <Grid container className={"full_line"}>
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        className={"same_checkbox_blk"}
                      >
                        <Box>
                          <Checkbox
                            value="checkedC"
                            inputProps={{
                              "aria-label": "uncontrolled-checkbox"
                            }}
                            onChange={this.handleCheckbox}
                          />{" "}
                          Shipping Details same as billing Details
                        </Box>
                      </Grid>
                    </Grid>
                  )}
                  {this.state.producttype == "physical" && (
                    <fieldset disabled={this.state.same}>
                      <Box mb={3} mt={0} component="h2">
                        Shipping Details
                      </Box>
                      <Grid container className={"full_line"}>
                        <Grid item xs={12} sm={4}>
                          <Typography component="div" className={"ch-req"}>
                            <Box className={"form-label"}>Name</Box>
                            <Typography component="div" className={"req_txt"}>
                              *
                          </Typography>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={8}>
                          <Box
                            component="div"
                            className={"textFieldforms_full"}
                          >
                            <TextField
                              id="standard-full-width"
                              placeholder="Name"
                              value={this.state.shipname}
                              margin="normal"
                              InputLabelProps={{ shrink: true }}
                              onChange={this.handleChange("shipname")}
                              autoComplete="off"
                            />
                            {this.state.errors["shipname"] && (
                              <Typography
                                component="div"
                                color="error"
                                className={"error-input"}
                              >
                                <Icon color="error">error</Icon>
                                {this.state.errors["shipname"]}
                              </Typography>
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                      <Grid container className={"full_line"}>
                        <Grid item xs={12} sm={4}>
                          <Typography component="div" className={"ch-req"}>
                            <Box className={"form-label"}>Address Line 1</Box>
                            <Typography component="div" className={"req_txt"}>
                              *
                          </Typography>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={8}>
                          <Box
                            component="div"
                            className={"textFieldforms_full"}
                          >
                            <TextField
                              id="standard-full-width"
                              placeholder="Address Line 1"
                              value={this.state.shipaddressone}
                              margin="normal"
                              InputLabelProps={{ shrink: true }}
                              onChange={this.handleChange("shipaddressone")}
                              autoComplete="off"
                            />
                            {this.state.errors["shipaddressone"] && (
                              <Typography
                                component="div"
                                color="error"
                                className={"error-input"}
                              >
                                <Icon color="error">error</Icon>
                                {this.state.errors["shipaddressone"]}
                              </Typography>
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                      <Grid container className={"full_line"}>
                        <Grid item xs={12} sm={4}>
                          <Typography component="div" className={"ch-req"}>
                            <Box className={"form-label"}>Address Line 2</Box>
                            <Typography component="div" className={"req_txt"}>
                              *
                          </Typography>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={8}>
                          <Box
                            component="div"
                            className={"textFieldforms_full"}
                          >
                            <TextField
                              id="standard-full-width"
                              placeholder="Address Line 2"
                              value={this.state.shipaddresstwo}
                              margin="normal"
                              InputLabelProps={{ shrink: true }}
                              onChange={this.handleChange("shipaddresstwo")}
                              autoComplete="off"
                            />
                            {this.state.errors["shipaddresstwo"] && (
                              <Typography
                                component="div"
                                color="error"
                                className={"error-input"}
                              >
                                <Icon color="error">error</Icon>
                                {this.state.errors["shipaddresstwo"]}
                              </Typography>
                            )}
                          </Box>
                        </Grid>
                      </Grid>

                      <Grid container className={"full_line"}>
                        <Grid item xs={12} sm={4}>
                          <Typography component="div" className={"ch-req"}>
                            <Box className={"form-label"}>City</Box>
                            <Typography component="div" className={"req_txt"}>
                              *
                          </Typography>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={8}>
                          <Box
                            component="div"
                            className={"textFieldforms_full"}
                          >
                            <TextField
                              id="standard-full-width"
                              placeholder="City"
                              value={this.state.shipcity}
                              margin="normal"
                              InputLabelProps={{ shrink: true }}
                              onChange={this.handleChange("shipcity")}
                              autoComplete="off"
                            />
                            {this.state.errors["shipcity"] && (
                              <Typography
                                component="div"
                                color="error"
                                className={"error-input"}
                              >
                                <Icon color="error">error</Icon>
                                {this.state.errors["shipcity"]}
                              </Typography>
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                      <Grid container className={"full_line"}>
                        <Grid item xs={12} sm={4}>
                          <Typography component="div" className={"ch-req"}>
                            <Box className={"form-label"}>State</Box>
                            <Typography component="div" className={"req_txt"}>
                              *
                          </Typography>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={8}>
                          <Box
                            component="div"
                            className={"textFieldforms_full"}
                          >
                            <TextField
                              id="standard-full-width"
                              placeholder="State"
                              value={this.state.shipstate}
                              margin="normal"
                              InputLabelProps={{ shrink: true }}
                              onChange={this.handleChange("shipstate")}
                              autoComplete="off"
                            />
                            {this.state.errors["shipstate"] && (
                              <Typography
                                component="div"
                                color="error"
                                className={"error-input"}
                              >
                                <Icon color="error">error</Icon>
                                {this.state.errors["shipstate"]}
                              </Typography>
                            )}
                          </Box>
                        </Grid>
                      </Grid>

                      <Grid container className={"full_line"}>
                        <Grid item xs={12} sm={4}>
                          <Typography component="div" className={"ch-req"}>
                            <Box className={"form-label"}>Zip Code</Box>
                            <Typography component="div" className={"req_txt"}>
                              *
                          </Typography>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={8}>
                          <Box
                            component="div"
                            className={"textFieldforms_full"}
                          >
                            <TextField
                              id="standard-full-width"
                              placeholder="Zip Code"
                              value={this.state.shipzip}
                              margin="normal"
                              InputLabelProps={{ shrink: true }}
                              onChange={this.handleChange("shipzip")}
                              autoComplete="off"
                            />
                            {this.state.errors["shipzip"] && (
                              <Typography
                                component="div"
                                color="error"
                                className={"error-input"}
                              >
                                <Icon color="error">error</Icon>
                                {this.state.errors["shipzip"]}
                              </Typography>
                            )}
                          </Box>
                        </Grid>
                      </Grid>

                      <Grid container className={"full_line"}>
                        <Grid item xs={12} sm={4}>
                          <Typography component="div" className={"ch-req"}>
                            <Box className={"form-label"}>Country</Box>
                            <Typography component="div" className={"req_txt"}>
                              *
                          </Typography>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={8}>
                          <Box
                            component="div"
                            className={"textFieldforms_full"}
                          >
                            {/* <TextField
                          id="standard-full-width"
                          placeholder="Country"
                          value={this.state.shipcountry}
                          className={"textFieldforms_full"}
                          margin="normal"
                          InputLabelProps={{ shrink: true, }}
                          onChange={this.handleChange('shipcountry')} /> */}
                            <Select
                              value={this.state.shipcountry}
                              native
                              onChange={this.handleChange("shipcountry")}
                            >
                              <option value="">Select Country</option>
                              {this.state.country.map((item, i) => {
                                return (
                                  <option key={i} value={item.country}>
                                    {item.country}
                                  </option>
                                );
                              })}
                            </Select>
                            {this.state.errors["shipcountry"] && (
                              <Typography
                                component="div"
                                color="error"
                                className={"error-input"}
                              >
                                <Icon color="error">error</Icon>
                                {this.state.errors["shipcountry"]}
                              </Typography>
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                    </fieldset>
                  )}
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} sm={4} className={"checkout-2-12"}>
              <Grid container></Grid>

              <Grid container className={"total_box"}>
                <Typography component="div" className={"total_inner"}>
                  <Grid item xs={12} sm={12} className={"total_list"}>
                    <Typography component="span">Product Quantity</Typography>{" "}
                    <Typography component="span">
                      {this.state.quantity}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} className={"total_list"}>
                    <Typography component="span">Product Price</Typography>
                    <Typography component="span">
                      {this.state.baseprice}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} className={"total_list"}>
                    <Typography component="span">Total Price</Typography>
                    <Typography component="span">{this.state.total}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} className={"total_list"}>
                    <Typography component="span">Discount</Typography>
                    <Typography component="span">
                      {this.state.discount}
                    </Typography>
                  </Grid>
                  {this.state.producttype == "digital" && (
                    <Grid item xs={12} sm={12} className={"total_list"}>
                      <Typography component="span">Vat</Typography>
                      <Typography component="span">
                        {this.state.vatCharge > 0
                          ? parseFloat(this.state.vatCharge).toFixed(2)
                          : this.state.vatCharge}
                      </Typography>
                    </Grid>
                  )}
                  {this.state.producttype == "physical" && (
                    <Grid item xs={12} sm={12} className={"total_list"}>
                      <Typography component="span">Shipping Charges</Typography>
                      <Typography component="span">
                        {this.state.shipping}
                      </Typography>
                    </Grid>
                  )}
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    className={"total_list total_big_txt"}
                  >
                    <Typography component="h2">Total</Typography>
                    <Typography component="h2">
                      {parseFloat(this.state.grandtotal).toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} className={"button_outer"}>
                    <StripeCheckout
                      stripeKey={this.state.stripeKey}
                      label={"Pay"}
                      locale={"auto"}
                      token={this.handleCheckout}
                      amount={parseFloat(this.state.grandtotal * 100)}
                      id="StripeCheckout"
                      disabled={this.state.formIsValid}
                      email={auth.isAuthenticated().user.email}
                      className={"Primary_btn"}
                    />

                    {/*!this.state.formIsValid &&
                    <button onClick={this.CheckOrder}>Place Order</button>
                  */}
                  </Grid>
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </div>

        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={this.state.open}
          // onClose={this.handlePopClose}
          // closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500
          }}
        >
          <Fade in={this.state.open}>
            <Typography component="div" variant="div" className={"report-container model_popup_blk text_center"}>
              {/* <Typography component="h2" variant="h2">Report </Typography> */}
              {/* <Typography
                  component="div"
                  className={classes.close1}
                >
                  {" "}
                  <i
                    className="fal fa-times"
                    onClick={this.handlePopClose}
                  ></i>{" "}
                </Typography> */}
              {this.state.producttype == "physical" &&
                <Typography component="div" variant="div" className={"model_body_blk"}>
                  <Typography component="div" variant="div" className={"thank_you"}>
                    <Typography component="span" variant="span" className={"border_around arrow_box"}>THANK <br />YOU</Typography>
                  </Typography>
                  <Typography component="h2" variant="h2">Order successful </Typography>
                  <Typography component="p" variant="p">The receipt has been sent to your email address.<br />
                    {this.state.creatorname} might contact you for further details<br />
                    regarding this order.
                    </Typography>
                  <Link to={"/payments_transaction/" + auth.isAuthenticated().user._id + "/2"} className={"Primary_btn_blk"}>OK</Link>
                </Typography>
              }
              {this.state.producttype == "digital" &&
                <Typography component="div" variant="div" className={"model_body_blk"}>
                  <Typography component="div" variant="div" className={"thank_you"}>
                    <Typography component="span" variant="span" className={"border_around arrow_box"}>THANK <br />YOU</Typography>
                  </Typography>
                  <Typography component="h2" variant="h2">Thanks for your order</Typography>
                  <Typography component="p" variant="p">The receipt has been sent to your email address.<br />
                    Download your files from the link in the receipt, or click<br />
                    down below.
                    </Typography>
                  <Typography component="p" variant="p" className={"short_txt_gray"}>The link will expire in 7 days.</Typography>
                  <CustomButton label="DOWNLOAD FILES" className={"Primary_btn_blk"} onClick={this.download} />
                </Typography>
              }

            </Typography>
          </Fade>
        </Modal>
      </section>
    );
  }
}

export default withStyles(styles)(CheckoutForm);
