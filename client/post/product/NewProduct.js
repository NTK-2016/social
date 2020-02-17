import React, { Component } from "react";
import Card, { CardHeader, CardContent, CardActions } from "material-ui/Card";
import Button from "material-ui/Button";
import TextField from "material-ui/TextField";
import Typography from "material-ui/Typography";
import Avatar from "material-ui/Avatar";
import Icon from "material-ui/Icon";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import { create, readcategory } from "./../api-post.js";
import { fetchCountrylist } from "../../user/api-user";
import auth from "./../../auth/auth-helper";
import IconButton from "material-ui/IconButton";
import AttachFile from "material-ui-icons/AttachFile";
import Radio from "material-ui/Radio";
import Select from "material-ui/Select";
import Snackbar from "material-ui/Snackbar";
import {
  required,
  requiredwith,
  requiredwithblank,
  countError
} from "./../../common/ValidatePost";
import SplitButton from '../../common/SplitButton'
import CustomButton from "./../../common/CustomButton";
import SideLoader from "./../../common/SideLoader";
import "date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker
} from "@material-ui/pickers";

import DateFnsUtils from "@date-io/date-fns";
import Attribute from "./Attribute.js";
import CustomBack from "./../../common/CustomBack";
import Fourzerofour from "./../../common/404";
import MenuItem from '@material-ui/core/MenuItem'
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

const styles = theme => ({
  headtitle: {
    fontSize: "18px",
    fontWeight: "normal",
    lineHeight: "22px",
    fontFamily: "Helvetica-bold",
    color: "#000",
    padding: "20px 25px",
    borderBottom: "1px solid #d6d6d6"
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  parasection: {
    padding: "20px 25px"
  },
  btnsection: {
    padding: "0px",
    display: "flex",
    margin: "30px 0 15px 0"
  },
  close1: {
    position: "absolute",
    right: "20px",
    top: "10px",
    fontSize: "25px",
    cursor: "pointer"
  }
});

const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

var names = [];
let countries = [];
var intervalID = ''
var uploaddata = ''
class NewProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photo1: "",
      photo2: "",
      photo3: "",
      text: "",
      description: "",
      attach: "",
      categories: [],
      names: [],
      posttype: "1",
      viewtype: "public",
      postname: "product",
      producttype: "",
      scheduled_datetime: new Date(),
      error: "",
      errors: {},
      open: false,
      showDate: false,
      showImage1: false,
      imagePath1: "",
      showImage2: false,
      imagePath2: "",
      showImage3: false,
      imagePath3: "",
      price: "",
      attachnames: [],
      choosed: true,
      country: [],
      shipping: [],
      shippingcharges: [{ country: "", charges: "" }],
      SideLoader: false,
      showbutton: true,
      attributeNames: [
        { attributeName: "color", label: "Add Colour", placeholder: "Select colour(s)", attributeValue: ["Black", "White", "Grey", "Red", "Blue", "Green", "Orange", "Yellow", "Purple", "Pink", "Brown"] },
        { attributeName: "size", label: "Add Size", placeholder: "Select size(s)", attributeValue: ["One size", "XXS", "XS", "S", "M", "L", "XL", "XXL", "UK 4", "UK 6", "UK 8", "UK 10", "UK 12", "UK 14", "UK 16", "UK 18", "UK 20", "UK 22", "other"] },
      ],
      arrayAttributeValues: ["", ""],
      invalid: false,
      uploadpercent: 0,
      response: false,
    };
  }

  //async
  init = () => {
    console.log("init");
    this.postData.set("posttype", this.state.posttype);

    // const jwt = auth.isAuthenticated()
    // await
    // readcategory({
    //   userId: jwt.user._id
    // }, { t: jwt.token }).then((data) => {
    //   if (data.error) {
    //     this.setState({ redirectToSignin: true })
    //   } else {
    //     console.log(data)
    //     var categories = [];
    //     for (var i = 0; i < data.length; i++) {
    //       if (data[i].name != undefined) {
    //         categories[i] = data[i].name;
    //       }
    //     }

    //     var categories = [].concat.apply([], categories);
    //     names = Array.from(new Set(categories));
    //     //names.shift()

    //     console.log(names)
    //     //let following = this.checkFollow(data)
    //   }
    // })
    sleep(500).then(() => {
      this.setState({ names: names });
      console.log(names);
      console.log("finish");
    });
  };

  componentDidMount = () => {
    if (this.props.productType == "digital" || this.props.productType == "physical") {
      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
      this.postData = new FormData();
      this.setState({
        user: auth.isAuthenticated().user,
        producttype: this.props.productType
      });
      this.postData.set("producttype", this.props.productType);
      this.init();
      if (this.props.productType == "physical") {
        const jwt = auth.isAuthenticated();
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
              // countries = element.name;
              countries.push({ "country": element.country, "code": element.code });
            });
            this.setState({ country: countries });
          }
        });
      }
    }
    else {
      this.setState({ invalid: true })
    }
  };
  handleValidation() {
    let errors = {};
    let res = [];
    let formIsValid = true;
    errors["text"] = required(this.state.text, "Title is required");
    res.push(required(this.state.text, "Title is required"));
    errors["description"] = required(
      this.state.description,
      "Description is required"
    );
    res.push(required(this.state.description, "Description is required"));
    //if (this.state.photo1 == "" && this.state.photo2 == "" && this.state.photo3 == "") {
    errors["photoerror"] = required(this.state.photo1, "At least one image of the product is required in chronological order.");
    res.push(required(this.state.photo1, "At least one image of the product is required in chronological order."));
    // }
    errors["price"] = required(this.state.price, "Price is required");
    res.push(required(this.state.price, "Price is required"));
    errors["viewtype"] = required(this.state.viewtype, "Viewtype is required");
    res.push(required(this.state.viewtype, "Viewtype is required"));
    errors["posttype"] = required(this.state.posttype, "Posttype is required");
    res.push(required(this.state.posttype, "Posttype is required"));
    // errors["image"] = required(this.state.photo,"Photo is missing")
    // res.push(required(this.state.photo,"Photo is missing"))
    errors["Date"] = requiredwith(
      this.state.posttype,
      this.state.scheduled_datetime,
      "Schedule date is required"
    );
    res.push(
      requiredwith(
        this.state.posttype,
        this.state.scheduled_datetime,
        "Schedule date is required"
      )
    );
    if (this.state.price == 0 && this.state.price != "") {
      errors["price"] = "Price must be greater than 0";
      res.push("Price must be greater than 0");
    }
    if (this.state.price > 999999.99) {
      errors["price"] = "Price must be less than 999999.99";
      res.push("Price must be less than 999999.99");
    }
    this.state.shippingcharges.map((charges, index) => {
      if (index > 0 && (charges.country == "" || charges.charges == "")) {
        errors["shippingcharges"] = "country or charges missing";
        res.push("country or charges missing");
      }
      if (index > 0 && (this.state.shippingcharges[0].country == "" || this.state.shippingcharges[0].charges == "")) {
        errors["shippingcharges"] = "country or charges required";
        res.push("country or charges required");
      }
    });
    if (this.props.productType == "digital" && this.state.attachnames.length == 0) {
      errors["attach"] = "Please attach your digital files.";
      res.push("Please attach your digital files.");
    }

    console.log(res);
    var count = countError(res);
    if (count > 0) {
      formIsValid = false;
      this.setState({ errors: errors, SideLoader: false, showbutton: true });
    }
    console.log(formIsValid);
    return formIsValid;
  }
  handleAttachChange = name => event => {
    this.setState({ choosed: false });
    let errors = this.state.errors;
    errors[name] = false;
    var extension = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "application/pdf",
      "audio/mp3",
      "video/mp4",
      "image/gif",
      "audio/aac",
      "audio/m4a",
      "video/mpeg",
      "audio/mpeg",
      "audio/ogg",
      "video/ogg",
      "application/ogg",
      "audio/wav",
      "audio/x-ms-wma",
      "audio/x-m4a",
      "audio/x-wav",
      "application/octet-stream",
      "application/epub+zip",
      "application/x-compressed",
      "application/x-zip-compressed",
      "application/zip",
      "multipart/x-zip",
      "image/vnd.adobe.photoshop",
      "application/x-photoshop"
    ];
    let attachments = Array.from(event.target.files);
    console.log(attachments);
    var attachcount = attachments.length;
    console.log(attachcount);
    attachcount = this.state.attachnames.length + attachcount;
    if (attachcount > 5) {
      errors["attach"] = "Sorry, you can't upload more than 5 attachments";
      this.setState({ errors: errors });
      document.getElementById("icon-button-file-attach").value = "";
      return false;
    }
    if (attachcount <= 5 && attachcount > 0) {
      var attachname = [];
      var count = this.state.attachnames.length;
      for (var i = 0; i < attachcount - this.state.attachnames.length; i++) {
        console.log(event.target.files[i].size);
        if (event.target.files[i].size > 210000000) {
          errors["attach"] = "File is too large. Max size is 200 MB";
          this.setState({ errors: errors });
          this.setState({ [name]: "" });
          document.getElementById("icon-button-file-attach").value = "";
          return false;
        }
        console.log(event.target.files[i].type)
        if (!extension.includes(event.target.files[i].type)) {
          errors["attach"] =
            "This file type is invalid. For valid file formats check Help page.";
          this.setState({ errors: errors });
          this.setState({ [name]: "" });
          document.getElementById("icon-button-file-attach").value = "";
          return false;
        }
        attachname[i] = event.target.files[i].name;
        this.postData.set(name + count, event.target.files[i]);
        count++;
      }
      var joined = this.state.attachnames.concat(attachname);
      this.setState({ attachnames: joined });
      this.postData.set("attachcount", attachcount);
      //attachname = ltrim(attachname,",");
      console.log(attachments);
      // const value = attachname//event.target.files[0]
      // this.postData.set(name, attachments)
      console.log(attachcount + " Files");
      this.setState({ [name]: attachcount + " Files" });
      console.log(attachcount + " Files");
    }
    document.getElementById("icon-button-file-attach").value = "";
  };

  handleAttachRemove = (attachId, attchName) => {
    var index = this.state.attachnames.indexOf(attchName);
    if (index > -1) {
      this.state.attachnames.splice(index, 1);
    }
    this.setState({ attachnames: this.state.attachnames });
    this.postData.delete(["attach" + attachId]);
    if (this.state.attachnames.length == 0) {
      this.setState({ choosed: true });
    }
  };

  handleShippingCountry = i => e => {
    console.log(this.state.shippingcharges);
    this.state.shippingcharges.map((item, key) => {
      if (item.country == e.target.value) {
        console.log("found");
        e.target.value = "";
      } else {
        let shippingcharges = [...this.state.shippingcharges];
        shippingcharges[i]["country"] = e.target.value;
        this.setState({
          shippingcharges
        });
      }
    });
  };

  handleShippingCharges = i => e => {
    let shippingcharges = [...this.state.shippingcharges];
    var value = e.target.validity.valid ? e.target.value : shippingcharges;
    if (e.target.validity.valid) {
      shippingcharges[i]["charges"] = value;
      this.setState({
        shippingcharges
      });
    }
  };

  handleDelete = i => e => {
    let errors = this.state.errors
    errors["shippingcharges"] = false
    e.preventDefault();
    let shippingcharges = [
      ...this.state.shippingcharges.slice(0, i),
      ...this.state.shippingcharges.slice(i + 1)
    ];
    this.setState({
      shippingcharges,
      errors
    });
  };

  addShipping = e => {
    e.preventDefault();
    let shippingcharges = this.state.shippingcharges.concat([
      { country: "", charges: "" }
    ]);
    this.setState({
      shippingcharges
    });
  };

  addAttribute = e => {
    e.preventDefault();
    if (this.state.attributeNames.length < 3) {
      let attributeNames = this.state.attributeNames.concat([
        { attributeName: "", attributeValue: [""] }
      ]);
      this.setState({
        attributeNames
      });
    }
  };

  addAttributeValue = (i) => e => {
    e.preventDefault();
    console.log(i);
    let attributeNames = this.state.attributeNames;
    if (attributeNames[i].attributeValue.length < 5) {
      attributeNames[i].attributeValue = attributeNames[i].attributeValue.concat([""]);
      console.log(attributeNames);
      this.setState({
        attributeNames
      });
    }
  };

  deleteAttributeValue = (i, aLen) => e => {
    //let errors = this.state.errors
    //errors["shippingcharges"] = false
    e.preventDefault();
    console.log(i);
    let attributeNames = this.state.attributeNames;

    // attributeNames[i].attributeValue = [
    //   ...attributeNames[i].attributeValue.slice(0, aLen-2)
    // ];
    console.log(attributeNames);
    if (aLen > 0) {
      attributeNames[i].attributeValue.pop();
      this.setState({
        attributeNames,
        //errors
      });
    }

  };

  deleteAttributeRow = i => e => {
    //let errors = this.state.errors
    //errors["shippingcharges"] = false
    e.preventDefault();
    let attributeNames = [
      ...this.state.attributeNames.slice(0, i),
      ...this.state.attributeNames.slice(i + 1)
    ];
    this.setState({
      attributeNames,
      //errors
    });
  };

  // setAttributeName = (index, name, indexVal) => e => {
  //   let attributeNames = this.state.attributeNames;
  //   if (name == "name") {
  //     attributeNames[index].attributeName = e.target.value;
  //   }
  //   if (name == "value") {
  //     attributeNames[index].attributeValue[indexVal] = e.target.value;

  //   }
  //   this.setState({ attributeNames });
  //   console.log(attributeNames);
  //   let arrayAttributeNames = [];
  //   let arrayAttributeValues = [];
  //   attributeNames.map((item, index) => {
  //     console.log(item.attributeName);
  //     arrayAttributeNames.push(item.attributeName);
  //     let temp = "";
  //     item.attributeValue.map((item, index) => {
  //       console.log(item);
  //       temp += item + "###";
  //     })
  //     temp = temp.substring(0, temp.length - 3);
  //     arrayAttributeValues.push(temp);
  //   })
  //   console.log("*******", arrayAttributeNames);
  //   console.log("!!!!!!!", arrayAttributeValues);
  //   //attributeNames =["color","size"];
  //   //attributeValues=["red###green","XL###XXL"];
  //   // {"_id":"5df24da95a6f7a09e836a260","country":"Albania","charges":12},{"_id":"5df24da95a6f7a09e836a25f","country":"Åland Islands","charges":21}

  //   this.postData.set("attributeNames", arrayAttributeNames);
  //   this.postData.set("attributeValues", arrayAttributeValues);

  // }
  setAttributeName = (value, name) => {
    let arrayAttributeValues = this.state.arrayAttributeValues;
    console.log(value);
    console.log(name);
    let val = "";
    if (value != null) {
      value.map((item, index) => {
        val += item.value + "###";
      })
      val = val.substring(0, val.length - 3);
    }
    if (name == "color" && value != null) {
      console.log("ss");
      arrayAttributeValues[0] = val
    }
    if (name == "size" && value != null) {
      console.log("vv");
      arrayAttributeValues[1] = val
    }
    this.setState({ arrayAttributeValues });
    let arrayAttributeNames = [];
    console.log(arrayAttributeValues);
    arrayAttributeNames = ["color", "size"];
    this.postData.set("attributeNames", arrayAttributeNames);
    this.postData.set("attributeValues", arrayAttributeValues);

  }



  clickPost = () => {
    this.setState({ error: "" });
    this.setState({ errors: {}, SideLoader: true, showbutton: false });
    if (this.handleValidation()) {

      var shippingcountry = [];
      this.state.shippingcharges.map((charges, index) =>
        shippingcountry.push(charges.country)
      );
      var shippingcharges = [];
      this.state.shippingcharges.map((charges, index) =>
        shippingcharges.push(charges.charges)
      );
      console.log(shippingcharges);
      this.postData.set("shippingcountry", shippingcountry);
      this.postData.set("shippingcharges", shippingcharges);
      var percent = 0;
      if (this.state.attachnames.length > 0) {
        intervalID = setInterval(() => {
          percent = +percent + 1 //Math.floor((Math.random() * 10) + 1);
          percent = percent <= 100 ? percent : 100
          this.setState({ uploadpercent: percent })
          if (percent == 100 && this.state.response) {
            clearInterval(intervalID);
            this.uploadpercent(uploaddata)
          }
        }, 50);
      }
      const jwt = auth.isAuthenticated();
      create(
        {
          userId: jwt.user._id
        },
        {
          t: jwt.token
        },
        this.postData
      ).then(data => {
        if (data.error) {
          this.setState({
            error: data.error,
            SideLoader: false,
            showbutton: true
          });
        } else {
          uploaddata = data
          this.setState({ response: true })
          percent = 100
          if (this.state.attachnames.length == 0) {
            this.uploadpercent(uploaddata)
          }
        }
      });
    }
  };
  uploadpercent = (data) => {
    this.setState({
      text: "",
      description: "",
      photo1: "",
      photo2: "",
      photo3: "",
      posttype: "",
      imagePath1: "",
      imagePath2: "",
      imagePath3: "",
      showImage1: false,
      showImage2: false,
      showImage3: false,
      viewtype: "",
      price: "",
      scheduled_datetime: "",
      showDate: false,
      error: "",
      categories: [],
      attachnames: []
    });
    this.props.addUpdate(data);
    this.setState({ open: true, successMessage: `Published` });
    window.location = "./../productdetails/" + data._id;
  }
  handleChange = name => event => {
    let errors = this.state.errors;
    var value = "";
    if (name === "photo1" || name === "photo2" || name === "photo3") {
      // if (this.state.photo1 == "") {
      //   name = "photo1"
      // }
      // else if (this.state.photo2 == "") {
      //   name = "photo2"
      // }
      var extension = ["image/jpeg", "image/png", "image/jpg"];
      errors["photoerror"] = false;
      this.setState({ errors: errors });
      if (event.target.files[0].size > 10500000) {
        errors["photoerror"] = "File is too large. Max size is 10 MB";
        this.setState({ errors: errors });
        return false;
      }
      if (!extension.includes(event.target.files[0].type)) {
        errors["photoerror"] = "This file type is invalid. File formats allowed jpeg, png,jpg,gif.";
        this.setState({ errors: errors });
        return false;
      }
      value = event.target.files[0];

      //this.setState({imagePath: '' })
      var file = event.target.files[0];
      var reader = new FileReader();
      var url = reader.readAsDataURL(file);

      reader.onloadend = function (e) {
        var value1 =
          name === "photo1"
            ? this.setState({ showImage1: true, imagePath1: [reader.result] })
            : "";
        var value2 =
          name === "photo2"
            ? this.setState({ showImage2: true, imagePath2: [reader.result] })
            : "";
        var value3 =
          name === "photo3"
            ? this.setState({ showImage3: true, imagePath3: [reader.result] })
            : "";
      }.bind(this);
    } else {
      value = name == "scheduled_datetime" ? event : event.target.value;
      value = name == "scheduled_datetime" ? value.toISOString() : value;
    }
    if (value != "") {
      errors[name] = false;
      this.setState({ errors: errors });
    }
    this.postData.set(name, value);
    this.postData.set("postname", this.state.postname);

    this.setState({ [name]: value });
    setTimeout(
      function () {
        //Start the timer
        //After 1 second, set render to true
        this.postData.set("viewtype", this.state.viewtype);
        console.log(name + "-" + value);
        if (this.state.posttype == "2") {
          this.setState({ showDate: true, scheduled_datetime: new Date() });
        } else {
          this.setState({ showDate: false });
        }
      }.bind(this),
      100
    );
  };

  handleRequestClose = (event, reason) => {
    this.setState({ open: false });
  };

  removeImage = name => {
    var value1 =
      name === "photo1"
        ? this.setState({ showImage1: false, imagePath1: "", [name]: "" })
        : "";
    var value2 =
      name === "photo2"
        ? this.setState({ showImage2: false, imagePath2: "", [name]: "" })
        : "";
    var value3 =
      name === "photo3"
        ? this.setState({ showImage3: false, imagePath3: "", [name]: "" })
        : "";
    document.getElementById(name).value = "";
    this.postData.delete([name]);
  };

  checkNumber = evt => {
    // var iKeyCode = (event.which) ? event.which : event.keyCode
    // if (iKeyCode != 46 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57))
    //   return false;

    // return true;
    const price = evt.target.validity.valid
      ? evt.target.value
      : this.state.price;
    this.setState({ price });
    this.postData.set("price", price);
    let errors = this.state.errors;
    errors["price"] = false;
    this.setState({ errors: errors });
  };

  handleType = (index) => {
    let errors = this.state.errors
    index = index + 1;
    this.postData.set("posttype", index);
    this.setState({ "posttype": index });
    if (index != 2) {
      errors["Date"] = false;
      this.setState({ errors: errors })
    }

    console.log("index" + index)
  }

  handleDate = (date) => {
    let errors = this.state.errors
    date = date.toISOString()
    this.postData.set("scheduled_datetime", date);
    this.setState({ "scheduled_datetime": date });
    if (date != "") {
      errors["Date"] = false;
      this.setState({ errors: errors })
    }
    console.log("index" + date)
  }

  handlePopClose = () => {
    this.setState({
      open: false,
      reportLoader: false,
      reporttext: "",
      success: false,
      SideLoader: false,
      showbutton: true
    });
    location.reload(true);
  };

  render() {
    if (this.state.invalid) {
      return <Fourzerofour />;
    }
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Card className={"cardcustom"}>
          <div className={"upload-back"}><CustomBack class={"fal fa-chevron-left"} backlink={"createpost"} />
            <CardHeader
              title={
                this.props.productType == "physical"
                  ? "Physical Product"
                  : "Digital Product"
              }
              className={"cardheadercustom"}
            />
          </div>
          <CardContent className={"cardcontentcustom"}>
            <div className={"maininner"}>
              <div className={"input-div"}>
                <Typography

                  component="div"
                  className={"form-label"}
                >
                  Title
                </Typography>
                <TextField
                  id="standard-full-width"
                  placeholder="Write Something.."
                  fullWidth={true}
                  value={this.state.text}
                  onChange={this.handleChange("text")}
                  className={"textFieldforms"}
                  margin="normal"
                  autoComplete="off"
                  // InputLabelProps={{
                  //   shrink: true
                  // }}
                  InputProps={{
                    disableUnderline: true,
                    classes: { input: this.props.classes["input"] }
                  }}
                />
                {this.state.errors["text"] && (
                  <Typography
                    component="p"
                    color="error"
                    className={"error-input"}
                  >
                    <Icon color="error" className={classes.error}>
                      error
                    </Icon>
                    {this.state.errors["text"]}
                  </Typography>
                )}
              </div>
              <div className={"input-div"}>
                <Typography

                  component="div"
                  className={"form-label"}
                >
                  Description
                </Typography>
                <TextField
                  id="standard-full-width"
                  placeholder="Write product information.."
                  fullWidth={true}
                  multiline
                  rows="7"
                  value={this.state.subheading}
                  onChange={this.handleChange("description")}
                  className={"textFieldforms"}
                  margin="normal"
                  autoComplete="off"
                  InputProps={{
                    disableUnderline: true,
                    classes: { input: this.props.classes["input"] },
                    style: {
                      padding: 0
                    }
                  }}
                />
                {this.state.errors["description"] && (
                  <Typography
                    component="p"
                    color="error"
                    className={"error-input"}
                  >
                    <Icon color="error" className={classes.error}>
                      error
                    </Icon>
                    {this.state.errors["description"]}
                  </Typography>
                )}
              </div>
              {this.props.productType != "physical" && (
                <div className={"attached-img input-div show_blk_section"}>
                  <Typography

                    component="h2"

                    className={" form-label"}
                  >
                    Upload File
				<Typography

                      component="span"
                      className={"gray-9 disinline"}
                    >
                      (s)
                  </Typography>
                  </Typography>
                  <div className={"audio-container"}>
                    <div className={"prodfile-attachment"}>
                      <input
                        onChange={this.handleAttachChange("attach")}
                        className={classes.input}
                        id="icon-button-file-attach"
                        type="file"
                        multiple
                      />
                      <Typography component="span" >
                        Drag and drop file attachments here
                      </Typography>
                      <Typography component="span" >
                        or
                    </Typography>
                      <Typography component="span" className={"upload-text"}>Upload  </Typography>
                      {/* <Typography
                        component="p"

                        className={"support-ct"}
                      >
                        Upload{" "}
                      </Typography>
                      <Typography component="p" className={"support-ct"}>
                        Supported pdf,ebook
                      </Typography> */}
                    </div>
                  </div>
                  <div className={"img-holder prod-bor"}>
                    {this.state.attachnames.map((item, i) => {
                      return (
                        <p className={"file-holder"} key={i}>
                          {" "}
                          <span>{item}</span>{" "}
                          <i
                            className={"fal fa-trash-alt"}
                            onClick={() => this.handleAttachRemove(i, item)}
                          ></i>{" "}
                        </p>
                      );
                    })}
                    {this.state.choosed && (
                      <p className={"img-holder-content"}> </p>
                    )}
                    {this.state.errors["attach"] && (
                      <Typography
                        component="p"

                        color="error"
                        className={"error-input"}
                      >
                        <Icon color="error" className={classes.error}>
                          error
                        </Icon>
                        {this.state.errors["attach"]}
                      </Typography>
                    )}
                  </div>
                </div>
              )}
              <div className={"input-div"}>
                <Typography

                  component="div"
                  className={"form-label"}
                >
                  Upload Product Image<Typography component="span" className={"gray-9 disinline"}>(s)</Typography>
                </Typography>
                <div className={"audio-container"}>
                  <div className={"audio-continner1 prod-img-con"}>
                    <Typography component="p" >
                      Drag and drop images {" "}
                    </Typography>
                    <Typography component="p" >
                      or
                    </Typography>
                    <span className={"upload-text"}>Upload</span>
                    <Typography
                      component="p"

                      className={"supimg-prod"}
                    >
                      Supported formats png, jpeg, jpg, gif
                    </Typography>
                  </div>
                  <div className={"prod-img-overview"}>
                    <div className={"prod-inner-div"}>
                      <div className={"img-prodview"}>
                        {this.state.showImage1 && (
                          <i
                            className={"fal fa-times cross-prod"}
                            aria-hidden="true"
                            onClick={() => this.removeImage("photo1")}
                          ></i>
                        )}
                        <input
                          accept="image/*"
                          onChange={this.handleChange("photo1")}
                          className={classes.input}
                          id="photo1"
                          type="file"
                        />
                        {!this.state.showImage1 && (
                          <i className={"fal fa-plus plus-img"}></i>
                        )}

                        {this.state.showImage1 && (
                          <div className={classes.photo}>
                            <img
                              className={classes.media}
                              src={this.state.imagePath1}
                              style={{ width: "100%" }}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className={"prod-inner-div"}>
                      <div className={"img-prodview"}>
                        {this.state.showImage2 && (
                          <i
                            className={"fal fa-times cross-prod"}
                            aria-hidden="true"
                            onClick={() => this.removeImage("photo2")}
                          ></i>
                        )}
                        <input
                          accept="image/*"
                          onChange={this.handleChange("photo2")}
                          className={classes.input}
                          id="photo2"
                          type="file"
                        />
                        {!this.state.showImage2 && (
                          <i className={"fal fa-plus plus-img"}></i>
                        )}

                        {this.state.showImage2 && (
                          <div className={classes.photo}>
                            <img
                              className={classes.media}
                              src={this.state.imagePath2}
                              style={{ width: "100%" }}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className={"prod-inner-div"}>
                      <div className={"img-prodview"}>
                        {this.state.showImage3 && (
                          <i
                            className={"fal fa-times cross-prod"}
                            aria-hidden="true"
                            onClick={() => this.removeImage("photo3")}
                          ></i>
                        )}
                        <input
                          accept="image/*"
                          onChange={this.handleChange("photo3")}
                          className={classes.input}
                          id="photo3"
                          type="file"
                        />
                        {!this.state.showImage3 && (
                          <i className={"fal fa-plus plus-img"}></i>
                        )}

                        {this.state.showImage3 && (
                          <div className={classes.photo}>
                            <img
                              className={classes.media}
                              src={this.state.imagePath3}
                              style={{ width: "100%" }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {this.state.errors["photoerror"] && (
                  <Typography
                    component="p"

                    color="error"
                    className={"error-input"}
                  >
                    <Icon color="error" className={classes.error}>
                      error
                    </Icon>
                    {this.state.errors["photoerror"]}
                  </Typography>
                )}
              </div>



              {/* Add Atrribute Code Start */}
              {/* {this.props.productType == "physical" && (
                <Typography component="div" className={"shipping-published set_price_below_sec"}>
                  <button onClick={this.addAttribute} className={"prodbtn-add atrributeAdd"}>
                    <i className="fal fa-plus"></i>Attribute
              </button>
                </Typography>
              )} */}

              {this.props.productType == "physical" && (
                <Typography
                  component="div"
                  className={"shipping-published"}>
                  <Typography
                    component="div"
                    className={"publishtext-shipping"}>
                    {this.state.attributeNames.map((item, index) => (
                      <Typography component="div" key={"A" + index} className={"input_section_blk"}>
                        <Typography
                          component="div"
                          className={"prod-select"}
                          key={index}
                        >
                          {/* <Typography

                          component="div"
                          className={"form-label"}
                          >
                          Title
                          </Typography> */}
                          <Typography component="div" className={"form-label"}>{item.label}
                            <Typography

                              component="span"
                              className={"gray-9 disinline"}
                            >
                              (Optional)
                  </Typography>
                          </Typography>
                          <Typography component="div" className={"select_blk_section"}>
                            <Attribute className={"select_blk_section_inner"} options={item.attributeValue} name={item.attributeName} setAttributeName={(value, name) => { this.setAttributeName(value, name) }} placeholder={item.placeholder} />
                          </Typography>

                          {/* {item.attributeValue.map((item, indexVal) => (
                            <Typography
                              component="div"
                              className={"shop-charge"}
                              key={"SH"+index}
                            >
                           
                              <input
                                placeholder=""
                                onChange={this.setAttributeName(index, "value", indexVal)}
                                value={item}
                                name="attributeValue"
                                type="text"
                              />
                            </Typography>
                          ))} */}

                        </Typography>
                        {/* <Typography component="div"  className={"button_right_blk"}>
                          <button
                            onClick={this.addAttributeValue(index)}
                            className={"prodbtn-add"}
                          >
                            <i className="fal fa-plus"></i>
                          </button>
                          &nbsp;
                    <button
                            onClick={this.deleteAttributeValue(index, item.attributeValue.length - 1)}
                            className={"prodbtn-add"}>
                            <i className="fal fa-minus"></i>
                          </button>
                          <button
                            onClick={this.deleteAttributeRow(index, item.attributeValue.length)}
                            className={"prodbtn-margin"}
                          >
                            <i className="fal fa-trash-alt"></i>
                          </button>
                        </Typography> */}

                      </Typography>
                    ))}

                  </Typography>
                </Typography>
              )}

              {/* End Atrribute Code Start */}


              <div className={"input-div setprice"}>
                <Typography

                  component="div"
                  className={"form-label"}
                >
                  Set Price
                </Typography>
                <Typography component="div" className={"setprice-content"}>
                  <input
                    id="standard-full-width"
                    placeholder=""
                    value={this.state.price}
                    className={"textFieldforms"}
                    margin="normal"
                    autoComplete="off"
                    type="text"
                    pattern="^\d*(\.\d{0,2})?$"
                    onChange={this.checkNumber.bind(this)} />
                </Typography>
                {this.state.errors["price"] && (
                  <Typography
                    component="p"
                    color="error"
                    className={"error-input"}
                  >
                    <Icon color="error" className={classes.error}>
                      error
                    </Icon>
                    {this.state.errors["price"]}
                  </Typography>
                )}
              </div>


              {/* <Typography  component="div" className={"form-label"}>
          Categories
        </Typography> 
       <Select
          multiple
          fullWidth={true}
		  disableUnderline={true} 
          value={this.state.categories}
          onChange={this.handleChange('categories')}
          InputProps={{
            id: 'select-multiple-native',
          }}
		  className={"inputsel"}
MenuProps=
{{
classes: { paper: classes.dropdownStyle },
getContentAnchorEl: null,
anchorOrigin: {
vertical: "bottom",
horizontal: "left",
}
}}
        >
          {this.state.names.map(name => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </Select> */}
              {/* <InputLabel htmlFor="select-multiple-chip">Chip</InputLabel>

  <Select
          multiple
          value={personName}
          onChange={handleChange}
          input={<Input id="select-multiple-chip" />}
          renderValue={selected => (
            <div className={classes.chips}>
              {selected.map(value => (
                <Chip key={value} label={value} className={classes.chip} />
              ))}
            </div>
          )}
          MenuProps={MenuProps}
        >
          {names.map(name => (
            <MenuItem key={name} value={name} style={getStyles(name, personName, theme)}>
              {name}
            </MenuItem>
          ))}
        </Select> */}
              {this.props.productType == "physical" && (
                <Typography

                  component="div"
                  className={"shipping-published"}
                >
                  <Typography

                    component="div"
                    className={"publishtext-shipping"}
                  >
                    <Typography component="div" className={"form-label"}>Shipping Price <Typography component="span" className={"gray-9 disinline"}>(Optional)</Typography>
                    </Typography>

                    {this.state.shippingcharges.map((charges, index) => (
                      <Typography

                        component="div"
                        className={"prod-select"}
                        key={index}
                      >
                        {/* <input
                      type="text"
                      onChange={this.handleText(index)}
                      value={charges}
                    /> */}
                        <Select
                          displayEmpty
                          disableUnderline={true}
                          value={charges.country}
                          fullWidth={true}
                          onChange={this.handleShippingCountry(index)}
                          // InputProps={{
                          //   name: "age",
                          //   id: "age-simple"
                          // }}
                          className={"selectdropdown"}
                          MenuProps={{
                            classes: { paper: "upload-dropdown" },
                            getContentAnchorEl: null,
                            anchorOrigin: {
                              vertical: "bottom",
                              horizontal: "left"
                            },
                            transformOrigin: {
                              vertical: "top",
                              horizontal: "left"
                            }
                          }}
                        >
                          <MenuItem value="" disabled>Select your country</MenuItem>
                          <MenuItem value="Eleswhere">Eleswhere/International</MenuItem>
                          {this.state.country.map((item, i) => {
                            return (
                              <MenuItem value={item.country} key={i}>{item.country} </MenuItem>
                            );
                          })}
                        </Select>
                        {/* <TextField
                          placeholder=""
                          value={charges.charges}
                          className={"discount_box shop-charge"}

                        /> */}
                        <Typography
                          component="div"
                          className={"discount_box shop-charge"}
                        >
                          <input
                            placeholder=""
                            value={charges.charges}
                            type="text"
                            pattern="^\d*(\.\d{0,2})?$"
                            onChange={this.handleShippingCharges(index)}
                          //  onInput={this.checkNumber.bind(this)}
                          />
                        </Typography>
                        {index > 0 &&
                          <button
                            onClick={this.handleDelete(index)}
                            className={"prodbtn-margin"}
                          >
                            <i className="fal fa-trash-alt"></i>
                          </button>
                        }
                      </Typography>
                    ))}
                    <button
                      onClick={this.addShipping}
                      className={"prodbtn-add"}
                    >
                      <i className="fal fa-plus"></i> More
                    </button>
                  </Typography>
                </Typography>
              )}
              {this.state.errors["shippingcharges"] &&
                <Typography component="p" color="error" className={"error-input"}>
                  <Icon color="error" className={classes.error}>error</Icon>
                  {this.state.errors["shippingcharges"]}
                </Typography>}
            </div>
            {/*}  <Typography  component="div" className={"form-label"}>
          Who can see this post ? 
        </Typography>
				  <div className={"bottominner"}>
      <div className={"input1"}>  <input  type="radio" value="public" fullWidth={true}
              checked={this.state.viewtype === "public"}
              onChange={this.handleChange('viewtype')}/> Public</div>
       <div className={"input1"}> <input type="radio" value="stans" fullWidth={true}
              checked={this.state.viewtype === "stans"}
              onChange={this.handleChange('viewtype')}/> Stans Only</div>

</div>
{ this.state.errors["viewtype"] &&
        <Typography component="p" color="error" className={"error-input"}>
              <Icon color="error" className={classes.error}>error</Icon>
                {this.state.errors["viewtype"]}
        </Typography> */}

            <div className={"publishtext "}>
              {this.state.SideLoader && <SideLoader uploadpercent={this.state.uploadpercent} />}
              {this.state.showbutton &&
                <SplitButton
                  onType={this.handleType}
                  onDate={this.handleDate}
                  onClick={this.clickPost}
                />
              }
              {this.state.errors["posttype"] && (
                <Typography
                  component="p"

                  color="error"
                  className={"error-input"}
                >
                  <Icon color="error" className={classes.error}>
                    error
                  </Icon>
                  {this.state.errors["posttype"]}
                </Typography>
              )}

              {/*this.state.showDate ? <TextField
                id="datetime-local"
                label="Schedule"
                type="datetime-local"
                onChange={this.handleChange('scheduled_datetime')}
                className={"schedule-time"}
                InputLabelProps={{
                  shrink: true,
                }}

                InputProps={{
                  disableUnderline: true, classes: { input: this.props.classes['input'] }, style: {
                    padding: 0
                  }
                }}
              />
              : null*/}
              {this.state.showDate ? (
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <div className={"picker-container"}>
                    <KeyboardDatePicker
                      id="date-picker-dialog"
                      format="MM/dd/yyyy"
                      value={this.state.scheduled_datetime}
                      onChange={this.handleChange("scheduled_datetime")}
                      KeyboardButtonProps={{
                        "aria-label": "change date"
                      }}
                      InputProps={{
                        disableUnderline: true
                      }}
                      className={"month-picker"}
                    />
                    <KeyboardTimePicker
                      id="time-picker"
                      value={this.state.scheduled_datetime}
                      onChange={this.handleChange("scheduled_datetime")}
                      KeyboardButtonProps={{
                        "aria-label": "change time"
                      }}
                      className={"time-picker"}
                      InputProps={{
                        disableUnderline: true
                      }}
                    />
                  </div>
                </MuiPickersUtilsProvider>
              ) : null}
              {this.state.errors["Date"] && (
                <Typography
                  component="p"
                  color="error"

                  className={"error-input"}
                >
                  <Icon color="error" className={classes.error}>
                    error
                  </Icon>
                  {this.state.errors["Date"]}
                </Typography>
              )}
            </div>
            {this.state.error && (
              <Typography
                component="p"

                color="error"
                className={"error-input"}
              >
                <Icon color="error" className={classes.error}>
                  error
                </Icon>
                {this.state.error}
              </Typography>
            )}
          </CardContent>
        </Card>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right"
          }}
          open={this.state.open}
          onClose={this.handleRequestClose}
          autoHideDuration={6000}
          message={
            <span className={classes.snack}>{this.state.successMessage}</span>
          }
        />
        {/* <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={this.state.open}
          onClose={this.handlePopClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500
          }}
        >
          <Fade in={this.state.open}>
            <div className={"report-container"}>
              <Typography
                component="h2"
                className={classes.headtitle}
              >
                Product Review
              </Typography>
              <Typography
                component="div"
                className={classes.close1}
              >
                {" "}
                <i
                  className="fal fa-times-circle"
                  onClick={this.handlePopClose}
                ></i>{" "}
              </Typography>
              <Typography
                component="div"
                className={classes.parasection}
              >
                <Typography
                  component="p"
                  className={classes.parasec1}
                >
                  Your product submission is under review and will be visible on the platform approximately after 10 mins. So please come back again to check.
                                </Typography>

                <Typography
                  component="div"
                  className={classes.btnsection}
                >
                  <CustomButton
                    label="Ok"
                    onClick={this.handlePopClose}
                    className={"Primary_btn_blk rep-btn"}
                  />
                </Typography>
              </Typography>
            </div>
          </Fade>
        </Modal> */}
      </div>
    );
  }
}

NewProduct.propTypes = {
  classes: PropTypes.object.isRequired,
  addUpdate: PropTypes.func.isRequired
};

export default withStyles(styles)(NewProduct);
