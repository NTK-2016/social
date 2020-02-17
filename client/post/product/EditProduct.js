import React, { Component } from "react";
import Card, { CardHeader, CardContent, CardActions } from "material-ui/Card";
import Button from "material-ui/Button";
import TextField from "material-ui/TextField";
import Typography from "material-ui/Typography";
import Avatar from "material-ui/Avatar";
import Icon from "material-ui/Icon";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import auth from "./../../auth/auth-helper";
import IconButton from "material-ui/IconButton";
import PhotoCamera from "material-ui-icons/PhotoCamera";
import AttachFile from "material-ui-icons/AttachFile";
import Radio from "material-ui/Radio";
import Select from "material-ui/Select";
import Snackbar from "material-ui/Snackbar";
import { readpost, updatepost, readcategory } from "./../api-post.js";
import { fetchCountrylist } from "../../user/api-user";
import SplitButton from "../../common/SplitButton";
import Attribute from "./Attribute.js";
import {
  required,
  requiredwith,
  requiredwithblank,
  countError
} from "./../../common/ValidatePost";
import CustomButton from "./../../common/CustomButton";
import SideLoader from "./../../common/SideLoader";
import "date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker
} from "@material-ui/pickers";

import DateFnsUtils from "@date-io/date-fns";
import CustomLoader from "./../../common/CustomLoader";
import CustomBack from "./../../common/CustomBack";
import Fourzerofour from "./../../common/404";
import MenuItem from '@material-ui/core/MenuItem';
import config from "../../../config/config";
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
    display: "block",
    margin: "30px 0 15px 0",
    textAlign: "center"
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
class EditProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
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
      productType: "",
      scheduled_datetime: "",
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
      shippingcharges: [{ country: "", charges: "" }],
      SideLoader: false,
      showbutton: true,
      removeAttach: [],
      CustomLoader: true,
      newattachnames: [],
      attributeNames: [
        { attributeName: "color", label: "Add Colour", placeholder: "Select colour(s)", attributeValue: ["Black", "White", "Grey", "Red", "Blue", "Green", "Orange", "Yellow", "Purple", "Pink", "Brown"] },
        { attributeName: "size", label: "Add Size", placeholder: "Select size(s)", attributeValue: ["One size", "XXS", "XS", "S", "M", "L", "XL", "XXL", "UK 4", "UK 6", "UK 8", "UK 10", "UK 12", "UK 14", "UK 16", "UK 18", "UK 20", "UK 22", "other"] },
      ],
      attributeSelectedValue: [],
      arrayAttributeValues: ["", ""],
      invalid: false,
      uploadpercent: 0,
      response: false,
    };
    // this.match = match
    // console.log("post ID 3:"+this.props.postId)
  }

  init = () => { };
  // state = {
  //   text: '',
  //   photo: '',
  //   posttype: '',
  //   viewtype: '',
  //   description: '',
  //   categories: '',
  //   error: '',
  //   user: {},
  //   open: false
  // }

  componentDidMount = () => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    this.postData = new FormData();
    //this.setState({user: auth.isAuthenticated().user})
    console.log("post ID 2 :" + this.props.postId);
    const jwt = auth.isAuthenticated();
    // console.log("jwt "+jwt.token)
    readpost(
      {
        postId: this.props.postId,
        id: jwt.user._id,
      },
      { t: jwt.token }
    ).then(data => {
      if (data.error) {
        this.setState({ error: data.error, invalid: true });
      } else {
        // Input time in UTC
        if (data.scheduled_datetime) {
          var inputInUtc = data.scheduled_datetime;
          var dateInUtc = new Date(inputInUtc);
          //Print date in UTC time
          //console.log("Date in UTC : " + dateInUtc.toISOString()+"<br>");
          var dateInLocalTz = this.convertUtcToLocalTz(dateInUtc);
          //Print date in local time
          //console.log("Date in Local : " + dateInLocalTz.toISOString());
          var scheduled_datetime = dateInLocalTz.toISOString().substr(0, 16);
          console.log(scheduled_datetime);
        }
        // this.postData.set("text", data.text)
        // this.postData.set("subheading", data.subheading)
        // this.postData.set("description", data.description)
        // this.postData.set("categories", data.categories)
        // this.postData.set("viewtype", data.viewtype)
        // this.postData.set("posttype", data.posttype)
        // this.postData.set("url", data.url)
        // this.postData.set("scheduled_datetime", scheduled_datetime)
        var attachcount = "";
        if (data.attach) {
          if (data.attach.indexOf(",") > 0) {
            var attacharray = data.attach.split(",");
            attacharray = attacharray.filter(Boolean);
            this.setState({ attachnames: attacharray });
            this.setState({ choosed: false });
            for (var i = 0; i < attacharray.length; i++) {
              this.postData.set("attach" + i, attacharray[i]);
            }
            attachcount = attacharray.length;
            attachcount = attachcount + " files";
          } else {
            attachcount = "1 file";
            var attacharray = [];
            attacharray.push(data.attach);
            this.setState({ attachnames: attacharray });
            this.setState({ choosed: false });
            for (var i = 0; i < attacharray.length; i++) {
              this.postData.set("attach" + i, attacharray[i]);
            }
          }
        }
        // if (data.posttype == "2") {
        //   this.setState({ showDate: true });
        // } else {
        //   this.setState({ showDate: false });
        // }
        var cat = [];
        if (data.categories) {
          cat = data.categories.split(",");
        }
        if (data.photo != "") {
          var photos = data.photo.split(",");
          photos[0]
            ? this.setState({
              showImage1: true,
              imagePath1: config.productBucketURL + photos[0]
            })
            : "";
          photos[1]
            ? this.setState({
              showImage2: true,
              imagePath2: config.productBucketURL + photos[1]
            })
            : "";
          photos[2]
            ? this.setState({
              showImage3: true,
              imagePath3: config.productBucketURL + photos[2]
            })
            : "";
          photos[0] ? this.postData.set("photo1", photos[0]) : "";
          photos[1] ? this.postData.set("photo2", photos[1]) : "";
          photos[2] ? this.postData.set("photo3", photos[2]) : "";
        }
        var shippinginfo = [];
        if (data.shippinginfo) {
          shippinginfo = data.shippinginfo;
        }
        console.log(data);
        console.log("aaaaa");
        let attributeNames = data.attributeNames;
        console.log(attributeNames);
        if (typeof attributeNames != "undefined") {
          attributeNames.map((item, index) => {
            console.log(item.attributeName);
            let temp = [];
            item.attributeValue.split("###").map((item, index) => {
              console.log({ label: item, value: item });
              temp.push({ label: item, value: item });
            })
            console.log(temp);
            if (temp[0].value != "") {
              item.attributeValue = temp;
            } else {
              item.attributeValue = [];
            }

          })
        } else {
          attributeNames = [];
        }
        console.log(attributeNames);
        this.setState({
          id: data._id,
          text: data.text,
          description: data.description,
          categories: cat,
          price: data.price,
          productType: data.producttype,
          shippingcharges: shippinginfo.length > 0 ? shippinginfo : [{ country: "", charges: "" }],
          viewtype: data.viewtype,
          posttype: data.posttype,
          scheduled_datetime: scheduled_datetime,
          imagePath: config.productBucketURL + data.photo,
          photo1: config.productBucketURL + photos[0],
          attach: attachcount,
          CustomLoader: false,
          attributeSelectedValue: attributeNames,
        });
      }
    });
    //const jwt = auth.isAuthenticated()
    readcategory(
      {
        userId: jwt.user._id
      },
      { t: jwt.token }
    ).then(data => {
      if (data.error) {
        this.setState({ redirectToSignin: true });
      } else {
        var categories = [];
        for (var i = 0; i < data.length; i++) {
          if (data[i].name != undefined) {
            categories[i] = data[i].name;
          }
        }

        var categories = [].concat.apply([], categories);
        names = Array.from(new Set(categories));
        //names.shift()
      }
    });
    sleep(500).then(() => {
      if (this.state.productType == "physical") {
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
              countries.push({ "country": element.country, "code": element.code });
              //countries = element.name;
            });
            this.setState({ country: countries });
          }
        });
      }

      this.setState({ names: names });
      console.log(names);
      console.log("finish");
    });
  };
  convertUtcToLocalTz(dateInUtc) {
    //Convert to local timezone
    return new Date(
      dateInUtc.getTime() - dateInUtc.getTimezoneOffset() * 60 * 1000
    );
  }

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
    console.log("*****", this.state.shippingcharges);
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
    console.log(shippingcharges);
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

  // addAttribute = e => {
  //   e.preventDefault();
  //   if(this.state.attributeNames.length<3){
  //   let attributeNames = this.state.attributeNames.concat([
  //     { attributeName: "", attributeValue: [""] }
  //   ]);
  //   this.setState({
  //     attributeNames
  //   });
  // }
  // };

  // addAttributeValue = (i) => e => {
  //   e.preventDefault();
  //   console.log(i);
  //   let attributeNames=this.state.attributeNames;
  //   if(attributeNames[i].attributeValue.length<5){
  //   attributeNames[i].attributeValue = attributeNames[i].attributeValue.concat([""]);
  //   console.log(attributeNames);
  //   this.setState({
  //     attributeNames
  //   });
  // }
  // };

  // deleteAttributeValue = (i,aLen) => e => {
  //   //let errors = this.state.errors
  //   //errors["shippingcharges"] = false
  //   e.preventDefault();
  //   console.log(i);
  //   let attributeNames=this.state.attributeNames;
  //   console.log(attributeNames);
  //   if(aLen>0){
  //     attributeNames[i].attributeValue.pop();
  //     this.setState({
  //       attributeNames,
  //       //errors
  //     });
  //   }

  //   let arrayAttributeNames=[];
  //   let arrayAttributeValues=[];
  //   attributeNames.map((item,index)=>{
  //     console.log(item.attributeName);
  //     arrayAttributeNames.push(item.attributeName);
  //     let temp="";
  //     item.attributeValue.map((item,index)=>{
  //       console.log(item);
  //       temp+=item+"###";
  //     })
  //     temp = temp.substring(0,temp.length-3);
  //     arrayAttributeValues.push(temp);
  //   })
  //   console.log("*******",arrayAttributeNames);
  //   console.log("!!!!!!!",arrayAttributeValues);
  //   this.setState({
  //     arrayAttributeNames:arrayAttributeNames,
  //     arrayAttributeValues:arrayAttributeValues
  //   });

  // };

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

  // setAttributeName = (index,name,indexVal) => e => {
  //   let attributeNames=this.state.attributeNames;
  //   if(name=="name"){
  //     attributeNames[index].attributeName =e.target.value;
  //   }
  //   if(name=="value"){
  //     attributeNames[index].attributeValue[indexVal] =e.target.value;

  //   }
  //   this.setState({attributeNames});
  //   console.log(attributeNames);
  //   let arrayAttributeNames=[];
  //   let arrayAttributeValues=[];
  //   attributeNames.map((item,index)=>{
  //     console.log(item.attributeName);
  //     arrayAttributeNames.push(item.attributeName);
  //     let temp="";
  //     item.attributeValue.map((item,index)=>{
  //       console.log(item);
  //       temp+=item+"###";
  //     })
  //     temp = temp.substring(0,temp.length-3);
  //     arrayAttributeValues.push(temp);
  //   })
  //   console.log("*******",arrayAttributeNames);
  //   console.log("!!!!!!!",arrayAttributeValues);
  //   this.setState({
  //     arrayAttributeNames:arrayAttributeNames,
  //     arrayAttributeValues:arrayAttributeValues
  //   });
  //   //attributeNames =["color","size"];
  //   //attributeValues=["red###green","XL###XXL"];
  //   // {"_id":"5df24da95a6f7a09e836a260","country":"Albania","charges":12},{"_id":"5df24da95a6f7a09e836a25f","country":"Åland Islands","charges":21}

  //   this.postData.set("attributeNames", arrayAttributeNames);
  //   this.postData.set("attributeValues", arrayAttributeValues);

  // }

  setAttributeName = (value, name) => {
    console.log(this.state.attributeSelectedValue);
    let arrayAttributeValues = [];
    if (this.state.attributeSelectedValue.length > 0) {
      let val = "", val1 = "";
      this.state.attributeSelectedValue[0].attributeValue.map((item, index) => {
        val += item.value + "###";
      })
      this.state.attributeSelectedValue[1].attributeValue.map((item, index) => {
        val1 += item.value + "###";
      })

      arrayAttributeValues[0] = val.substring(0, val.length - 3);
      arrayAttributeValues[1] = val1.substring(0, val1.length - 3);
    }
    let attributeSelectedValue = [];
    if (this.state.attributeSelectedValue.length > 0) {
      attributeSelectedValue = this.state.attributeSelectedValue;
    } else {
      attributeSelectedValue = [
        { attributeName: "color", attributeValue: [] },
        { attributeName: "size", attributeValue: [] },
      ]
    }
    console.log(value);
    console.log(name);
    let val = "";
    if (value != null) {
      value.map((item, index) => {
        val += item.value + "###";
      })
      val = val.substring(0, val.length - 3);
    } else {
      val = ""
    }
    if (name == "color" && value != null) {
      console.log("ss");
      arrayAttributeValues[0] = val;
      attributeSelectedValue[0].attributeValue = value;
    }
    if (name == "size" && value != null) {
      console.log("vv");
      arrayAttributeValues[1] = val;
      attributeSelectedValue[1].attributeValue = value;
    }
    this.setState({ arrayAttributeValues, attributeSelectedValue });
    let arrayAttributeNames = [];
    console.log(arrayAttributeValues);
    arrayAttributeNames = ["color", "size"];
    console.log(arrayAttributeNames);
    this.postData.set("attributeNames", ["color", "size"]);
    this.postData.set("attributeValues", arrayAttributeValues);

  }


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
    errors["price"] = required(this.state.price, "Price is required");
    res.push(required(this.state.price, "Price is required"));
    if (this.state.price == 0) {
      errors["price"] = "Price must be greater than 0";
      res.push("Price must be greater than 0");
    }
    errors["viewtype"] = required(this.state.viewtype, "Viewtype is required");
    res.push(required(this.state.viewtype, "Viewtype is required"));
    errors["posttype"] = required(this.state.posttype, "Posttype is required");
    res.push(required(this.state.posttype, "Posttype is required"));
    // if (this.state.photo1 == "" && this.state.photo2 == "" && this.state.photo3 == "") {
    errors["photoerror"] = required(this.state.photo1, "At least one image of the product is required in chronological order.");
    res.push(required(this.state.photo1, "At least one image of the product is required in chronological order."));
    // }
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

  clickPost = () => {
    this.setState({ error: "" });
    this.setState({ error: "", SideLoader: true, showbutton: false });
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

      // this.postData.set("attributeNames", this.state.arrayAttributeNames);
      // this.postData.set("attributeValues", this.state.arrayAttributeValues);
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
      const user = {
        text: this.state.text || undefined,
        subheading: this.state.subheading || undefined,
        description: this.state.description || undefined,
        categories: this.state.categories || undefined,
        viewtype: this.state.viewtype || undefined,
        posttype: this.state.posttype || undefined
      };
      updatepost(
        {
          postId: this.state.id
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
    //this.setState({id: data._id})
    // this.setState({text:'', photo: '',posttype: '',viewtype: '',description: '',categories: ''})
    //this.props.addUpdate(data)

    this.setState({
      open: true,
      successMessage: `Updated Successfully!`,
      SideLoader: false,
      showbutton: true
    });
    // window.location.reload();
    window.location = "/productdetails/" + data._id;
  }
  handleChange = name => event => {
    let errors = this.state.errors;

    var value = "";
    if (name === "photo1" || name === "photo2" || name === "photo3") {
      errors["photoerror"] = false;
      this.setState({ errors: errors });
      var extension = ["image/jpeg", "image/png", "image/jpg"];
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
    const did = name === "url" ? this.postData.set("photo", "") : "";
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
          errors["Date"] = "";
          this.setState({ errors: errors });
          this.setState({ showDate: false });
        }
      }.bind(this),
      100
    );
  };
  handleAttachChange = name => event => {
    this.setState({ choosed: false });
    // for (var i = 0; i < 5; i++) {
    //   this.postData.delete(["attach" + i]);
    // }
    let errors = this.state.errors;
    errors[name] = false
    this.setState({ errors: errors });
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
    var arr = this.state.attachnames.filter(Boolean);
    console.log(arr);
    attachcount = arr.length + attachcount + this.state.newattachnames.length;
    var minus = arr.length + this.state.newattachnames.length;
    if (attachcount > 5) {
      errors["attach"] = "Sorry, you can't upload more than 5 attachments";
      this.setState({ errors: errors });
      document.getElementById("icon-button-file-attach").value = "";
      return false;
    }
    if (attachcount <= 5 && attachcount > 0) {
      var attachname = [];
      var count = minus
      for (var i = 0; i < attachcount - minus; i++) {
        console.log(event.target.files[i].size);
        if (event.target.files[i].size > 210000000) {
          errors["attach"] = "File is too large. Max size is 200 MB";
          this.setState({ errors: errors });
          this.setState({ [name]: "" });
          document.getElementById("icon-button-file-attach").value = "";
          return false;
        }
        if (!extension.includes(event.target.files[i].type)) {
          errors["attach"] =
            "This file type is invalid. For valid file formats check Help page.";
          this.setState({ errors: errors });
          this.setState({ [name]: "" });
          document.getElementById("icon-button-file-attach").value = "";
          return false;
        }
        if (attachname[i] != "") {
          attachname[i] = event.target.files[i].name;
          for (var j = 0; j < 5; j++) {
            console.log("Get Value Of attach012345**");
            console.log(this.postData.get(["attach" + j]));
            if (this.postData.get(["attach" + j]) == null) {
              console.log("Set to postdata:", name + j);
              this.postData.set(name + j, event.target.files[i]);
              break;
            }
          }
        }
      }
      var joined = this.state.newattachnames.concat(attachname);
      this.setState({ newattachnames: joined });
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
  handleRequestClose = (event, reason) => {
    this.setState({ open: false });
  };
  handleAttachRemove = (attachId, attchName) => {
    var index = this.state.attachnames.indexOf(attchName);
    if (index > -1) {
      this.state.attachnames[index] = "";
      ///this.state.attachnames.splice(index, 1);
      /* image push to Unlink image */
      this.state.removeAttach.push(attchName);
      /* End Unlink Image */
    }
    this.setState({
      attachnames: this.state.attachnames
    });
    this.postData.delete(["attach" + attachId]);
    /* Start Unlink image */
    if (this.state.removeAttach.length > 0) {
      console.log(this.state.removeAttach);
      this.postData.set("removeAttach", this.state.removeAttach);
    }
    /* End Unlink Image */
    if (this.state.attachnames.length == 0) {
      this.setState({
        choosed: true
      });
    }
    var index = this.state.newattachnames.indexOf(attchName);
    if (index > -1) {
      this.state.newattachnames.splice(index, 1);
    }
    console.log("newattachnames", this.state.newattachnames);
    this.setState({ newattachnames: this.state.newattachnames });
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

  handleType = index => {
    let errors = this.state.errors;
    index = index + 1;
    this.postData.set("posttype", index);
    this.setState({ posttype: index });
    if (index != 2) {
      errors["Date"] = false;
      this.setState({ errors: errors });
    }
  };

  handleDate = date => {
    let errors = this.state.errors;
    date = date.toISOString();
    this.postData.set("scheduled_datetime", date);
    this.setState({ scheduled_datetime: date });
    if (date != "") {
      errors["Date"] = false;
      this.setState({ errors: errors });
    }
  };


  handlePopClose = () => {
    this.setState({
      open: false,
      reportLoader: false,
      reporttext: "",
      success: false
    });
    location.reload(true);
  };


  render() {
    if (this.state.invalid) {
      return <Fourzerofour />;
    }
    const { classes } = this.props;
    if (this.state.CustomLoader) {
      return <CustomLoader />
    }
    if (!this.state.CustomLoader) {
      return (
        <div className={classes.root}>
          <Card className={"cardcustom"}>
            <div className={"upload-back"}><CustomBack class={"fal fa-chevron-left"} backlink={"createpost"} />
              <CardHeader
                title={
                  this.state.productType == "physical"
                    ? "Edit Physical Product"
                    : "Edit Digital Product"
                }
                className={"cardheadercustom"}
              />
            </div>
            {/*avatar={
              <Avatar src={'/api/users/photo/'+this.state.user._id}/>
            } */}
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
                    style={{ margin: 8 }}
                    placeholder="Write Something.."
                    fullWidth
                    value={this.state.text}
                    onChange={this.handleChange("text")}
                    className={"textFieldforms"}
                    margin="normal"
                    autoComplete="off"
                    InputLabelProps={{
                      shrink: true
                    }}
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
                    value={this.state.description}
                    onChange={this.handleChange("description")}
                    className={"textFieldforms"}
                    margin="normal"
                    autoComplete="off"
                    // InputLabelProps={{
                    //   shrink: true
                    // }}
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

                {this.state.productType != "physical" && (
                  <div className={"attached-img input-div show_blk_section"}>
                    <Typography

                      component="h2"

                      className={"headsec form-label"}
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
                        <Typography
                          component="span"

                          className={"upload-text"}
                        >
                          Upload{" "}
                        </Typography>
                        <Typography
                          component="p"

                          className={"support-ct"}
                        >
                          Supported pdf,ebook
                    </Typography>
                      </div>
                    </div>
                    <div className={"img-holder prod-bor"}>
                      {this.state.attachnames.map((item, i) => {
                        return (
                          <p className={"file-holder"} key={i}>
                            {item != "" && <span>Attachment {i + 1}</span>}
                            {item != "" && (
                              <i
                                className={"fal fa-times"}
                                onClick={() => this.handleAttachRemove(i, item)}
                              ></i>
                            )}{" "}
                          </p>
                        );
                      })}
                      {this.state.newattachnames.map((item, i) => {
                        return (
                          <p className={"img-holder-content"} key={i}>
                            {item != "" && <span>{item}</span>}
                            {item != "" && (
                              <i
                                className={"fal fa-times"}
                                onClick={() => this.handleAttachRemove(i, item)}
                              ></i>
                            )}{" "}
                          </p>
                        );
                      })}
                      {this.state.choosed && (
                        <p className={"img-holder-content"}></p>
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
                  </div>)}
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
                        Drag and drop image here{" "}
                      </Typography>
                      <Typography component="p" >
                        or
                    </Typography>
                      <span className={"upload-text"}>Upload</span>
                      <Typography
                        component="p"

                        className={"supimg-prod"}
                      >
                        supported images png.jpeg.GIF only.
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
                          {this.state.errors["photo2"] && (
                            <Typography
                              component="p"

                              color="error"
                              className={"error-msg"}
                            >
                              <Icon color="error" className={classes.error}>
                                error
                            </Icon>
                              {this.state.errors["photo2"]}
                            </Typography>
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
                          {this.state.errors["photo3"] && (
                            <Typography
                              component="p"

                              color="error"
                              className={"error-msg"}
                            >
                              <Icon color="error" className={classes.error}>
                                error
                            </Icon>
                              {this.state.errors["photo3"]}
                            </Typography>
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
                {/* <Typography component="div" className={"shipping-published set_price_below_sec"}>
              <button onClick={this.addAttribute} className={"prodbtn-add atrributeAdd"}>
                    <i className="fal fa-plus"></i>Attribute
              </button>
              </Typography> */}

                {this.state.productType == "physical" && (
                  <Typography
                    component="div"
                    className={"shipping-published"}>
                    <Typography
                      component="div"
                      className={"publishtext-shipping"}>
                      {this.state.attributeNames.map((item, index) => (
                        <Typography component="div" className={"input_section_blk"}>
                          <Typography
                            component="div"
                            className={"prod-select"}
                            key={index}
                          >
                            <Typography component="div" className={"form-label"}>{item.label}
                              <Typography

                                component="span"
                                className={"gray-9 disinline"}
                              >
                                (Optional)
                  </Typography>
                            </Typography>
                            <Typography component="div" className={"select_blk_section"}>
                              <Attribute className={"select_blk_section_inner"} options={item.attributeValue} attribute={this.state.attributeSelectedValue.length > 0 && this.state.attributeSelectedValue[index].attributeValue} name={item.attributeName} setAttributeName={(value, name) => { this.setAttributeName(value, name) }} placeholder={item.placeholder} />
                            </Typography>

                            {/* {item.attributeValue.map((item, indexVal) => (
                        <Typography
                          component="div"
                          className={"shop-charge"}
                        >
                          <input
                            placeholder=""
                            onChange={this.setAttributeName(index,"value",indexVal)}
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
                      className={"prodbtn-add"}>
                      <i className="fal fa-plus"></i>
                    </button>
                    &nbsp;
                    <button
                      onClick={this.deleteAttributeValue(index,item.attributeValue.length-1)}
                      className={"prodbtn-add"}
                    >
                              <i className="fal fa-minus"></i>
                    </button>
                          <button
                            onClick={this.deleteAttributeRow(index,item.attributeValue.length)}
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
                  <Typography

                    component="div"
                    className={"setprice-content"}
                  >
                    {/* <TextField
                  id="standard-full-width"
                  placeholder=""
                  fullWidth
                  value={this.state.price}
                  onChange={this.handleChange('price')}
                  className={"textFieldforms"}
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    disableUnderline: true, classes: { input: this.props.classes['input'] }, style: {
                      padding: 0
                    }
                  }}
                /> */}

                    <input
                      id="standard-full-width"
                      placeholder=""
                      value={this.state.price}
                      className={"textFieldforms"}
                      margin="normal"
                      InputLabelProps={{
                        shrink: true
                      }}
                      InputProps={{
                        disableUnderline: true,
                        classes: { input: this.props.classes["input"] },
                        style: {
                          padding: 0
                        }
                      }}
                      type="text"
                      pattern="^\d*(\.\d{0,2})?$"
                      onInput={this.checkNumber.bind(this)}
                    />
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

                {/**  <Typography>
          Attachments
        </Typography>
        <input accept="image/*" onChange={this.handleAttachChange('attach')} className={classes.input} id="icon-button-file-attach" type="file" multiple />
        <label htmlFor="icon-button-file-attach">
          <IconButton color="secondary" className={classes.attachButton} component="span">
            <AttachFile />
          </IconButton>
        </label> 
        <span className={classes.filename}>{this.state.attach}</span>
         { this.state.errors["attach"] &&
          <Typography component="p" color="error" className={"error-input"}>
                <Icon color="error" className={classes.error}>error</Icon>
                  {this.state.errors["attach"]}
            </Typography> }**/}

                {/*
 <Select
}
multiple
fullWidth
value={this.state.categories}
onChange={this.handleChange('categories')}
inputProps={{
id: 'select-multiple-native',
}}
>
          {this.state.names.map(name => (
            <option key={name} value={name} selected={this.state.categories.includes(name)}>
              {name}
            </option>
          ))}
        </Select> */}
                {/*}
     <Typography  component="div" className={"form-label"}>
          Who can see this post ?
        </Typography>
        <input  type="radio" value="public" fullWidth
              checked={this.state.viewtype === "public"}
              onChange={this.handleChange('viewtype')}/> Public
        <input type="radio" value="stans" fullWidth
              checked={this.state.viewtype === "stans"}
              onChange={this.handleChange('viewtype')}/> Stans Only
        { this.state.errors["viewtype"] &&
        <Typography component="p" color="error" className={"error-input"}>
              <Icon color="error" className={classes.error}>error</Icon>
                {this.state.errors["viewtype"]}
        </Typography> */}
                {this.state.productType == "physical" && (
                  <Typography component="div" className={"shipping_full_sec"}>
                    <Typography component="div" className={"form-label"}>Shipping Price <Typography component="span" className={"gray-9 disinline"}>(Optional)</Typography></Typography>

                    <Typography

                      component="div"
                      className={"shipping-published"}
                    >
                      <Typography

                        component="div"
                        className={"publishtext-shipping"}
                      >



                        {this.state.shippingcharges.map((charges, index) => (
                          <Typography
                            component="div"
                            className={"prod-select"}
                            key={index}
                          >
                            <Select
                              displayEmpty
                              disableUnderline={true}
                              value={charges.country}
                              fullWidth
                              onChange={this.handleShippingCountry(index)}
                              inputProps={{
                                name: "age",
                                id: "age-simple"
                              }}
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
                            {/* <TextField placeholder=""
                        value={charges.charges}
                        className={"discount_box shop-charge"}
                        onChange={this.handleShippingCharges(index)}
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
                            <button
                              onClick={this.handleDelete(index)}
                              className={"prodbtn-margin"}
                            >
                              <i className={"fal fa-trash-alt"}></i>
                            </button>
                          </Typography>
                        ))}
                        <button
                          onClick={this.addShipping}
                          className={"prodbtn-add"}
                        >
                          <i className="fal fa-plus"></i>More
                    </button>
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
                      </Typography>
                    </Typography>

                  </Typography>
                )}
                {this.state.errors["shippingcharges"] &&
                  <Typography component="p" color="error" className={"error-input"}>
                    <Icon color="error" className={classes.error}>error</Icon>
                    {this.state.errors["shippingcharges"]}
                  </Typography>}
              </div>
              <div className={"publishtext "}>
                {this.state.SideLoader && <SideLoader uploadpercent={this.state.uploadpercent} />}
                {this.state.showbutton &&
                  <SplitButton
                    onType={this.handleType}
                    onDate={this.handleDate}
                    onClick={this.clickPost}
                    posttype={this.state.posttype}
                    scheduled_datetime={this.state.scheduled_datetime}
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
              </div>
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
}

EditProduct.propTypes = {
  classes: PropTypes.object.isRequired,
  addUpdate: PropTypes.func.isRequired
};

export default withStyles(styles)(EditProduct);
