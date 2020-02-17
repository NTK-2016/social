import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import TextField from "material-ui/TextField";
import Button from "material-ui/Button";
import StripeCheckout from "react-stripe-checkout";
import { payTip } from "../../post/api-post";
import { getVatByCountry, fetchCountrylist } from "../../user/api-user";
import auth from "../../auth/auth-helper";
import CheckIcon from "@material-ui/icons/Check";
import CustomLoader from "../../common/CustomLoader";
import Typography from "material-ui/Typography";
import CustomButton from "../../common/CustomButton";
import Select from "material-ui/Select";
import { Grid } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import { required, countError } from "./../../common/ValidatePost";
import Icon from "material-ui/Icon";
import config from "../../../config/config";
import { isAfter } from "date-fns";
import SideLoader from "./../../common/SideLoader";

const useStyles = makeStyles(theme => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    maxWidth: "540px",
    width: "95%",
    margin: "0 auto",
    borderRadius: "8px 8px 0px 0px",
    position: "relative !important"
  },
  loader_popup: {
    backgroundColor: theme.palette.background.paper,
    maxWidth: "100%",
    width: "150px",
    height: "150px",
    margin: "0 auto",
    borderRadius: "8px 8px 0px 0px",
    // width: "95%",
    position: "relative !important"
  },
  paper2: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: "8px 8px 8px 8px",
    boxShadow: "none",
    position: "relative",
    maxWidth: "480px",
    margin: "0 auto",
    width: "95%",
    padding: "30px 20px",
    boxSizing: "border-box"
  },
  close1: {
    textAlign: 'right',
    padding: '20px 20px 0 0',
    fontSize: '24px',
    lineHeight: '24px',
    cursor: 'pointer',
    position: 'absolute',
    top: '10px',
    right: 0,
  },
  headtitle: {
    fontSize: "18px",
    lineHeight: "22px",
    fontFamily: "Helvetica-bold",
    fontWeight: "normal",
    marginBottom: "6px",
  },
  adminname: {
    textTransform: "capitalize"
  },
  thanksbtn: {
    display: "flex",
    flexDirection: "row-reverse"
  },
  sechead1: {
    fontSize: "16px",
    lineHeight: "18px",
    fontFamily: "Helvetica",
    fontWeight: "normal",
    margin: "15px 0 25px 0"
  },
  sechead: {
    padding: "20px 0 0 0"
  },
  tip_textfield: {
    position: "relative",
    '&:after': {
      content: '"$"',
      position: 'absolute',
      fontSize: '14px',
      lineHeight: '40px',
      top: 2,
      left: 0,
      padding: '0 0px 0 12px',
    }
  },
  tip_price_input: {
    border: "1px solid #d6d6d6",
    borderRadius: "4px",
    padding: "0 10px 0 24px",
    marginRight: "20px",
    maxWidth: "100px",
    fontFamily: 'Helvetica',
    fontSize: '14px',
    lineHeight: '40px',
  }

}));

export default function TipsModal(props) {
  const classes = useStyles();
  const [value, setValue] = useState("");
  const [open, setOpen] = React.useState(false);
  const [vat, setVat] = React.useState(0);
  const [code, setCode] = React.useState('');
  const [billname, setBillName] = React.useState('');
  const [address1, setAddress1] = React.useState('');
  const [address2, setAddress2] = React.useState('');
  const [city, setCity] = React.useState('');
  const [state, setState] = React.useState('');
  const [zipcode, setZipcode] = React.useState('');
  const [billcountry, setBillCountry] = React.useState('');
  const [country, setCountry] = React.useState([]);
  const [errors, setErrors] = React.useState([]);
  const [loader, setLoader] = React.useState(false);


  const handleOpen = () => {
    const jwt = auth.isAuthenticated();
    var getCountry = getVatByCountry(
      {
        country: "Croatia",
        event: "click"
      },
      {
        t: jwt.token
      }
    ).then((data) => {
      setVat(data[0].vat_per)
      setCode(data[0].code)
      setBillCountry(data[0].country)
      return data
    });

    // setTimeout(() => {
    //   console.log("getcountry",getCountry);
    // }, 3000);

    // setTimeout(() => {
    //   getCountry.then(data => {
    //     if (data.error) {
    //       console.log(data);
    //     } else {
    //       console.log("level3");
    //       console.log("response",data);
    //       //setShowThankYou(true);
    //       //setValue(0);
    //       //setPaySuccess(true);

    //       //handleClose();
    //     }
    //   });
    // }, 5000);

    let countries = [];
    // Get Country List 
    fetchCountrylist(
      {
        userId: jwt.user._id
      },
      { t: jwt.token }
    ).then(data => {
      if (data.error) {
        // this.setState({ redirectToSignin: true });
      } else {
        //  console.log(data);
        data.forEach(element => {
          countries.push({ "country": element.country, "code": element.code });
        });
        //console.log(countries)
        setCountry(countries);
        // country =  countries;
      }
    });
    /**
     * END
     */
    setOpen(true);
  };

  const getCountryVatCharges = (event) => {
    const jwt = auth.isAuthenticated();
    const value = event.target.value;
    getVatByCountry(
      {
        code: value,
        event: 'change',
      },
      { t: jwt.token }
    ).then(data => {
      if (data.error) {
        // this.setState({ redirectToSignin: true });
      } else {
        console.log(data);
        setVat(data[0].vat_per)
        setCode(data[0].code)
        // let vat_per = 0;
        // data.forEach(element => {
        //   vat_per = element.vat_per;
        // });
        // this.setState({
        //   grandtotal: this.state.grandtotal - this.state.vatCharge,
        //   vatCharge: 0
        // });
        // let vatCharge = (this.state.grandtotal * vat_per) / 100;
        // let grandTotal = vatCharge + this.state.grandtotal;
        // this.setState({
        //   vatCharge: vatCharge,
        //   grandtotal: grandTotal
        // });
      }
    });
  };



  /**
   * FOR GET COUNTRY LIST START
   */



  const [showThankYou, setShowThankYou] = useState(false);
  const [showFail, setShowFail] = useState(false);
  const [stripeKey] = useState(config.stripe_test_api_key);
  // const [stripeKey, setStripeValue] = useState('pk_test_3Y8GStXmEoPOic8094YHVFFZ00aEB4CUyJ');
  const [user] = useState(auth.isAuthenticated());
  const [paymentToken, setPaymentToken] = useState("");
  const [paymentSuccess, setPaySuccess] = useState("");
  const handleClose = () => {
    setOpen(false);
    setShowThankYou(false);
    setShowFail(false)
    setLoader(false)
    setValue(0);
    setErrors([])
  };
  const setInputValue = (amount) => {
    // /^\d*(\.\d{0,2})?$/.test(event.target.value)
    // if (validateTextFields()) {
    //   setValue(amount)
    // }
    // else {
    //   document.getElementById('amount').value = ''
    // }
    setValue(amount)
  }

  const checkNumber = evt => {
    // var iKeyCode = (event.which) ? event.which : event.keyCode
    // if (iKeyCode != 46 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57))

    // return true;
    const price = evt.target.validity.valid
      ? evt.target.value
      : value;
    setValue(price);
    //postData.set("price", price);
    //let errors = this.state.errors;
    //errors["price"] = false;
    // this.setState({ errors: errors });
  };
  const validateTextFields = () => {
    let errors = {};
    let res = [];
    let formIsValid = true;
    errors["billname"] = required(billname, "Name is required");
    res.push(required(billname, "Name is required"));
    errors["address1"] = required(address1, "Address line 1 is required");
    res.push(required(address1, "Address line 1 is required"));
    errors["address2"] = required(address2, "Address line 2 is required");
    res.push(required(address2, "Address line 2 is required"));
    errors["city"] = required(city, "City is required");
    res.push(required(city, "City is required"));
    errors["state"] = required(state, "State is required");
    res.push(required(state, "State is required"));
    errors["zipcode"] = required(zipcode, "zipcode is required");
    res.push(required(zipcode, "zipcode is required"));


    var count = countError(res);
    if (count > 0) {
      formIsValid = false;
      setErrors(errors);
    }
    return formIsValid;
  };
  const handlechange = (token, carddata) => {
    setLoader(true)

    console.log("token");
    console.log(token);
    console.log(carddata);
    if (token) {
      const jwt = auth.isAuthenticated();
      setPaymentToken(token.id);
      let vatvalue = value * vat / 100
      let amount = +value + +vatvalue
      payTip(
        {
          userId: user.user._id,
          userToken: token.id,
          amount: +amount.toFixed(2),
          vat: +vatvalue.toFixed(2),
          postId: props.postId,
          // name: billname,
          // street: address1 + "," + address2,
          // city: city,
          // userstate: state,
          // zipcode: zipcode,
          // country: billcountry,
        },
        {
          t: jwt.token
        }
      ).then(data => {
        if (!data._id) {
          console.log(data);
          setLoader(false)
          setShowFail(true);
          setValue(0);
        } else {
          setLoader(false)
          setShowThankYou(true);
          setValue(0);
          setPaySuccess(true);
          var jwt = JSON.parse(localStorage.jwt);
          jwt.user.name = jwt.user.name;
          jwt.user.username = jwt.user.username;
          jwt.user.email = jwt.user.email;
          jwt.user.creator = jwt.user.creator;
          jwt.user.address = true
          localStorage.setItem("jwt", JSON.stringify(jwt));
          //handleClose();
        }
      });
    }
  };
  // const onAmountChange = ()=>{
  //     console.log(this.refs.tipAmount.getValue());
  // }
  // if (value == 0) {
  if (props.postedBy == auth.isAuthenticated().user._id) {
    return (
      <span className="span-tips">
        <span>
          <i className="fal fa-usd-circle"></i>
        </span>
        <span className={"post-action-title"}>{props.tipAmount.toFixed(2)}</span>
      </span>
    );
  } else {
    return (
      <div className={paymentSuccess || props.tipStatus ? "span-tips tipp" : "span-tips"}>
        <span onClick={handleOpen}>
          {paymentSuccess || props.tipStatus ? (
            <i className="fas fa-usd-circle"></i>
          ) : (
              <i className="fal fa-usd-circle"></i>
            )}
        </span>
        {paymentSuccess || props.tipStatus ? (
          <span className={"post-action-title"}>Tipped</span>
        ) : (
            <span className={"post-action-title"}>Tip</span>
          )}
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500
          }}
        >
          <Fade in={open}>
            <div className={"tips-containbox"}>
              {loader && <div className={classes.loader_popup}><SideLoader className={"side_load_main"} /></div>}
              {!loader && !showThankYou && !showFail && (
                <div className={classes.paper}>
                  <Grid className={"tip_form_main_con"}>
                    <Typography component="h2"
                      className={"tips-head"}
                      id="transition-modal-title">
                      Tip {props.postedByName}
                    </Typography>
                    <Typography
                      variant="body1"
                      component="div" className={"close_btn_blk"}
                      className={classes.close1}
                    >
                      <i
                        className={"fal fa-times"}
                        onClick={handleClose}
                      ></i>
                    </Typography>
                    <div className={"vat-section "}>

                      {!auth.isAuthenticated().user.address &&
                        <Grid container className={"form_blk_section"}>
                          <Box mb={3} mt={0} component="h2" >
                            Billing Details
                      </Box>
                          <Grid container className={"tip_form_section"}>
                            <Grid item className={"full_line"}>
                              <Grid className={"field_label"}>
                                <Typography component="div" className={"ch-req"}>
                                  <Box className={"form-label"}>Name <Typography className={"req_txt"}>*</Typography></Box>
                                </Typography>
                              </Grid>
                              <Grid item className={"field_input"}>
                                <Box component="div" className={"textFieldforms_full"}>
                                  <TextField
                                    id="standard-full-width"
                                    //  value={this.state.billname}
                                    placeholder="Name"
                                    margin="normal"
                                    InputLabelProps={{ shrink: true }}
                                    onChange={event => setBillName(event.target.value)}
                                    autoComplete="off"
                                  />
                                  {errors["billname"] && (
                                    <Typography
                                      component="div"
                                      color="error"
                                      className={"error-input"}
                                    >
                                      <Icon color="error">error</Icon>
                                      {errors["billname"]}
                                    </Typography>
                                  )}
                                </Box>
                              </Grid>
                            </Grid>

                            <Grid item className={"full_line"}>
                              <Grid className={"field_label"}>
                                <Typography component="div" className={"ch-req"}>
                                  <Box className={"form-label"}>Address Line 1 <Typography component="div" className={"req_txt"}>*</Typography></Box>
                                </Typography>
                              </Grid>
                              <Grid className={"field_input"}>
                                <Box component="div" className={"textFieldforms_full"}>
                                  <TextField
                                    id="standard-full-width"
                                    placeholder="Address Line 1"
                                    margin="normal"
                                    InputLabelProps={{ shrink: true }}
                                    onChange={event => setAddress1(event.target.value)}
                                    autoComplete="off"
                                  />
                                  {errors["address1"] && (
                                    <Typography
                                      component="div"
                                      color="error"
                                      className={"error-input"}
                                    >
                                      <Icon color="error">error</Icon>
                                      {errors["address1"]}
                                    </Typography>
                                  )}
                                </Box>
                              </Grid>
                            </Grid>

                            <Grid item className={"full_line"}>
                              <Grid className={"field_label"}>
                                <Typography component="div" className={"ch-req"}>
                                  <Box className={"form-label"}>Address Line 2 <Typography component="div" className={"req_txt"}>*</Typography></Box>
                                </Typography>
                              </Grid>
                              <Grid className={"field_input"}>
                                <Box component="div" className={"textFieldforms_full"}>
                                  <TextField
                                    id="standard-full-width"
                                    placeholder="Address Line 2"
                                    margin="normal"
                                    InputLabelProps={{ shrink: true }}
                                    onChange={event => setAddress2(event.target.value)}
                                    autoComplete="off"
                                  />
                                  {errors["address2"] && (
                                    <Typography
                                      component="div"
                                      color="error"
                                      className={"error-input"}
                                    >
                                      <Icon color="error">error</Icon>
                                      {errors["address2"]}
                                    </Typography>
                                  )}
                                </Box>
                              </Grid>
                            </Grid>

                            <Grid item className={"full_line"}>
                              <Grid className={"field_label"}>
                                <Typography component="div" className={"ch-req"}>
                                  <Box className={"form-label"}>City <Typography component="div" className={"req_txt"}>*</Typography></Box>
                                </Typography>
                              </Grid>
                              <Grid className={"field_input"}>
                                <Box component="div" className={"textFieldforms_full"}>
                                  <TextField
                                    id="standard-full-width"
                                    placeholder="City"
                                    margin="normal"
                                    InputLabelProps={{ shrink: true }}
                                    onChange={event => setCity(event.target.value)}
                                    autoComplete="off"
                                  />
                                  {errors["city"] && (
                                    <Typography
                                      component="div"
                                      color="error"
                                      className={"error-input"}
                                    >
                                      <Icon color="error">error</Icon>
                                      {errors["city"]}
                                    </Typography>
                                  )}
                                </Box>
                              </Grid>
                            </Grid>

                            <Grid item className={"full_line"}>
                              <Grid className={"field_label"}>
                                <Typography component="div" className={"ch-req"}>
                                  <Box className={"form-label"}>State <Typography component="div" className={"req_txt"}>*</Typography></Box>
                                </Typography>
                              </Grid>
                              <Grid className={"field_input"}>
                                <Box component="div" className={"textFieldforms_full"}>
                                  <TextField
                                    id="standard-full-width"
                                    placeholder="State"
                                    margin="normal"
                                    InputLabelProps={{ shrink: true }}
                                    onChange={event => setState(event.target.value)}
                                    autoComplete="off"
                                  />
                                  {errors["state"] && (
                                    <Typography
                                      component="div"
                                      color="error"
                                      className={"error-input"}
                                    >
                                      <Icon color="error">error</Icon>
                                      {errors["state"]}
                                    </Typography>
                                  )}
                                </Box>
                              </Grid>
                            </Grid>

                            <Grid item className={"full_line"}>
                              <Grid className={"field_label"}>
                                <Typography component="div" className={"ch-req"}>
                                  <Box className={"form-label"}>Zip Code <Typography component="div" className={"req_txt"}>*</Typography></Box>
                                </Typography>
                              </Grid>
                              <Grid className={"field_input"}>
                                <Box component="div" className={"textFieldforms_full"}>
                                  <TextField
                                    id="standard-full-width"
                                    placeholder="Zip Code"
                                    margin="normal"
                                    InputLabelProps={{ shrink: true }}
                                    onChange={event => setZipcode(event.target.value)}
                                    autoComplete="off"
                                  />
                                  {errors["zipcode"] && (
                                    <Typography
                                      component="div"
                                      color="error"
                                      className={"error-input"}
                                    >
                                      <Icon color="error">error</Icon>
                                      {errors["zipcode"]}
                                    </Typography>
                                  )}
                                </Box>
                              </Grid>
                            </Grid>

                            <Grid item className={"full_line"}>
                              <Grid className={"field_label"}>
                                <Typography component="div" className={"ch-req"}>
                                  <Box className={"form-label"}> Country <Typography className={"req_txt"}>*</Typography></Box>
                                </Typography>
                              </Grid>
                              <Grid className={"field_input"}>
                                <Box component="div" className={"textFieldforms_full"}>
                                  <Select
                                    native
                                    disableUnderline={true}
                                    className={"vat-tips"}
                                    onChange={getCountryVatCharges.bind(this)}>
                                    {country.map((item, i) => {
                                      return <option key={i} value={item.country} selected={item.code == code}>{item.country}</option>;
                                    })}

                                  </Select>

                                </Box>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>

                      }
                      <Grid item className={"tip_price_full_blk"}>
                        <Typography component="div" className={classes.tip_textfield}>
                          <input
                            className={classes.tip_price_input}
                            id="amount"
                            placeholder="Enter amount"
                            value={value}
                            margin="normal"
                            autoComplete="on"
                            type="text"
                            pattern="^\d*(\.\d{0,2})?$"
                            onChange={checkNumber.bind(this)} />
                          {/* <TextField
                            id="amount"
                            type="number"
                            placeholder=" Enter amount"
                            className={"tip-textfield"}
                            //onChange={event => setValue(parseInt(event.target.value))}
                            onChange={event => setInputValue(parseInt(event.target.value))}
                            //value={value}
                            margin="normal"
                            InputProps={{
                              disableUnderline: true,
                              classes: { input: "tips-input" }
                            }}
                          /> */}

                        </Typography>
                        {/* <Grid container className={"full_line"}>
                      <Grid>
                        <Typography component="div" className={"ch-req"}>
                          <Box className={"form-label"}>VAT:</Box>
                        </Typography>
                      </Grid>
                      <Grid item >
                        <Box component="div" className={"textFieldforms_full"}>
                          {(value > 0 && value != "") ? value * vat / 100 : 0}
                          
                        </Box>
                      </Grid>
                    </Grid> */}
                        {/* <Grid container className={"full_line bold_txt"}>
                      <Grid>
                        <Typography component="div" className={"ch-req"}>
                          <Box className={"form-label"}>Total:</Box>
                        </Typography>
                      </Grid>
                      <Grid>
                        <Box component="div" className={"textFieldforms_full"}>
                          {(value > 0 && value != "") ? value + value * vat / 100 : 0}
                         
                        </Box>
                      </Grid>
                      </Grid> */}


                        <Grid container className={"price_button"}>
                          <Typography component="div" className={"tips-content"}>
                            <Typography component="div" className="checkout tips-check">
                              <StripeCheckout
                                name="Stan.me" // the pop-in header title
                                description="Pay Tip" // the pop-in header subtitle
                                image="/dist/logo-128x128-2.png" // the pop-in header image (default none)
                                ComponentClass="div"
                                panelLabel="PAY"
                                stripeKey={stripeKey}
                                label={"Tip"}
                                locale={"auto"}
                                token={handlechange}
                                email={auth.isAuthenticated().user.email}
                                className={
                                  value > 0 && value <= 1000
                                    ? "Primary_btn"
                                    : "Primary_btn blur_tab"
                                }
                                disabled={value > 0 && value <= 1000 ? false : true}
                              />
                            </Typography>
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid item className={"tip_price_below_blk"}>
                        <Grid container className={"full_line_hor"}>
                          <Typography component="div" component="div">
                            <Typography component="span" component="span">Your card will be charged <Typography component="span" component="span" className={"black_txt"}>US${(value > 0 && value != "") ? (+value + +(value * vat / 100)).toFixed(2) : "0.0"},</Typography></Typography>
                          </Typography>
                          <Typography component="div" component="div">
                            <Typography component="span" component="span">including <Typography component="span" component="span" className={"black_txt"}>US${(value > 0 && value != "") ? (value * vat / 100).toFixed(2) : "0.0"}</Typography> for VAT in {"    "}
                              <Select native
                                disableUnderline={true}
                                defaultValue={code}
                                //value={code}
                                className={"vat-tips"}
                                onChange={getCountryVatCharges.bind(this)}>
                                {country.map((item, i) => {
                                  return <option key={i} value={item.code} selected={item.code == code}>{item.country}</option>;
                                })}

                              </Select>
                            </Typography>
                          </Typography>
                        </Grid>
                      </Grid>

                    </div>



                  </Grid>
                </div>
              )}

              {showThankYou && (
                <div className={classes.paper2}>
                  <Typography
                    component="h2" variant="h2"
                    className={classes.headtitle}>
                    Thank you for supporting {props.postedByName}
                  </Typography>

                  <Typography
                    variant="p"
                    component="p"
                    className={classes.sechead1}
                    id="transition-modal-title"
                  >
                    <span className={classes.adminname}>
                      {props.postedByName}
                    </span>{" "}
                    will receive your tip payment shortly.You can review all
                    your transactions in the payment page.
                  </Typography>
                  <Typography

                    component="div"
                    className={classes.thanksbtn}
                  >
                    <CustomButton
                      label="Done"
                      onClick={handleClose}
                      className={"Primary_btn_blk"}
                    />
                  </Typography>
                </div>
              )}
              {showFail && (
                <div className={classes.paper2}>
                  <Typography
                    variant="p"
                    component="p"
                    className={classes.sechead1}
                    id="transition-modal-title"
                  >
                    There was an issue in processing the payment.Please try after some time.
                  </Typography>
                  <Typography

                    component="div"
                    className={classes.thanksbtn}
                  >
                    <CustomButton
                      label="Done"
                      onClick={handleClose}
                      className={"Primary_btn_blk"}
                    />
                  </Typography>
                </div>
              )}
            </div>
          </Fade>
        </Modal>
      </div>
      //     </Fade>
      //   </Modal>
      // </div>
    );
  }
  // } else if (paymentSuccess) {
  //     return (
  //         <div>
  //             <span><i class="fal fa-usd-circle" ></i></span><span className={"post-action-title"} >Tipped</span>
  //         </div>
  //     );
  // }
  // else {
  //     return (
  //         <div>
  //             <span><i class="fal fa-usd-circle" ></i></span><span className={"post-action-title"} onClick={handleOpen}>Tip</span>
  //             <Modal
  //                 aria-labelledby="transition-modal-title"
  //                 aria-describedby="transition-modal-description"
  //                 className={classes.modal}
  //                 open={open}
  //                 onClose={handleClose}
  //                 closeAfterTransition
  //                 BackdropComponent={Backdrop}
  //                 BackdropProps={{
  //                     timeout: 500,
  //                 }}
  //             >
  //                 <Fade in={open}>
  //                     <div className={classes.paper}>
  //                         <h2 id="transition-modal-title">Tip </h2>
  //                         $<TextField id="email" type="number" label="Enter Amount" className={classes.textField} onChange={event => setValue(event.target.value)} value={value} margin="normal" /><br />

  //                     </div>

  //                 </Fade>
  //             </Modal>
  //         </div>
  //     );
  // }
}
