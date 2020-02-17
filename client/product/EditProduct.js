import React, { Component } from 'react'
import Card, { CardHeader, CardContent, CardActions } from 'material-ui/Card'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import Typography from 'material-ui/Typography'
import Avatar from 'material-ui/Avatar'
import Icon from 'material-ui/Icon'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import auth from './../auth/auth-helper'
import IconButton from 'material-ui/IconButton'
import PhotoCamera from 'material-ui-icons/PhotoCamera'
import Radio from 'material-ui/Radio'
import Select from 'material-ui/Select'
import Snackbar from 'material-ui/Snackbar'
import { readpost, updatepost, readcategory } from './pi-product.js'
import SplitButton from "../../common/SplitButton";

const styles = theme => ({
  root: {
    backgroundColor: '#efefef',
    padding: `${theme.spacing.unit * 3}px 0px 1px`
  },
  card: {
    maxWidth: 600,
    margin: 'auto',
    marginBottom: theme.spacing.unit * 3,
    backgroundColor: 'rgba(65, 150, 136, 0.09)',
    boxShadow: 'none'
  },
  cardContent: {
    backgroundColor: 'white',
    paddingTop: 0,
    paddingBottom: 0
  },
  cardHeader: {
    paddingTop: 8,
    paddingBottom: 8
  },
  photoButton: {
    height: 30,
    marginBottom: 5
  },
  input: {
    display: 'none',
  },
  textField: {
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    width: '90%'
  },
  submit: {
    margin: theme.spacing.unit * 2
  },
  filename: {
    verticalAlign: 'super'
  },
  snack: {
    color: theme.palette.protectedTitle
  }
})


const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

var names = [];

class EditImage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      posts: [],
      text: '',
      subheading: '',
      photo: '',
      posttype: '1',
      viewtype: '',
      description: '',
      categories: [],
      names: [],
      id: '',
      error: '',
      errors: {},
      postname: 'image',
      url: '',
      user: {},
      showImage: false,
      imagePath: '',
      open: false
    }
    // this.match = match
    // console.log("post ID 3:"+this.props.postId)
  }

  init = () => {


  }
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
    this.postData = new FormData()
    //this.setState({user: auth.isAuthenticated().user})
    console.log("post ID 2 :" + this.props.postId)
    const jwt = auth.isAuthenticated()
    // console.log("jwt "+jwt.token)
    readpost({
      postId: this.props.postId,
      id: jwt.user._id
    }, { t: jwt.token }).then((data) => {
      if (data.error) {
        this.setState({ error: data.error })
      } else {
        // Input time in UTC
        var inputInUtc = data.scheduled_datetime;
        var dateInUtc = new Date(inputInUtc);
        //Print date in UTC time
        //console.log("Date in UTC : " + dateInUtc.toISOString()+"<br>");
        var dateInLocalTz = this.convertUtcToLocalTz(dateInUtc);
        //Print date in local time
        //console.log("Date in Local : " + dateInLocalTz.toISOString());
        var scheduled_datetime = dateInLocalTz.toISOString().substr(0, 16);
        console.log(data.subheading)
        this.postData.set("text", data.text)
        this.postData.set("subheading", data.subheading)
        this.postData.set("description", data.description)
        this.postData.set("categories", data.categories)
        this.postData.set("viewtype", data.viewtype)
        this.postData.set("posttype", data.posttype)
        this.postData.set("url", data.url)
        this.postData.set("scheduled_datetime", scheduled_datetime)
        if (data.posttype == "2") {
          this.setState({ showDate: true })
        }
        else {
          this.setState({ showDate: false })
        }
        var cat = []
        if (data.categories) {
          cat = data.categories.split(',')

        }
        // if(data.photo!='')
        // {
        //     this.setState({showImage: true })
        // }
        this.setState({ id: data._id, text: data.text, subheading: data.subheading, description: data.description, categories: cat, viewtype: data.viewtype, posttype: data.posttype, url: data.url, scheduled_datetime: scheduled_datetime })
      }
    })
    //const jwt = auth.isAuthenticated()
    readcategory({
      userId: jwt.user._id
    }, { t: jwt.token }).then((data) => {
      if (data.error) {
        this.setState({ redirectToSignin: true })
      } else {
        var categories = [];
        for (var i = 0; i < data.length; i++) {
          if (data[i].categories != undefined) {
            categories[i] = data[i].categories.split(',');
          }
        }

        var categories = [].concat.apply([], categories);
        names = Array.from(new Set(categories));
        names.shift()
      }
    })
    sleep(500).then(() => {
      this.setState({ names: names })
      console.log(names)
      console.log("finish")
    })
  }
  convertUtcToLocalTz(dateInUtc) {
    //Convert to local timezone
    return new Date(dateInUtc.getTime() - dateInUtc.getTimezoneOffset() * 60 * 1000);
  }

  handleValidation() {
    let errors = {};
    let formIsValid = true;
    if (this.state.photo == '' && this.state.url == '') {
      formIsValid = false;
      errors["image"] = "Photo is Missing"
    }
    if (this.state.viewtype == '') {
      formIsValid = false;
      errors["viewtype"] = "who can see this post is Missing"
    }
    if (this.state.posttype == '') {
      formIsValid = false;
      errors["posttype"] = "Post Type is Missing"
    }
    if (this.state.posttype == '2' && this.state.scheduled_datetime == '') {
      formIsValid = false;
      errors["Date"] = "Schedule Date is Missing"
    }
    if (this.state.scheduled_datetime == 'undefined' || this.state.scheduled_datetime == '') {
      this.setState({ scheduled_datetime: Date.now })
    }
    this.setState({ errors: errors });
    return formIsValid;
  }

  clickPost = () => {
    this.setState({ error: "" })
    if (this.handleValidation()) {
      const jwt = auth.isAuthenticated()
      const user = {
        text: this.state.text || undefined,
        subheading: this.state.subheading || undefined,
        description: this.state.description || undefined,
        categories: this.state.categories || undefined,
        viewtype: this.state.viewtype || undefined,
        posttype: this.state.posttype || undefined
      }
      updatepost({
        postId: this.state.id
      }, {
        t: jwt.token
      }, this.postData).then((data) => {
        if (data.error) {
          this.setState({ error: data.error })
        } else {
          //this.setState({id: data._id})
          // this.setState({text:'', photo: '',posttype: '',viewtype: '',description: '',categories: ''})
          //this.props.addUpdate(data)

          this.setState({ open: true, successMessage: `Updated Successfully!` })
          // window.location.reload();
        }
      })
    }
  }
  handleChange = name => event => {
    this.setState({ error: "" })

    if (name === 'photo') {
      var extension = ["image/jpeg", "image/png", "image/jpg"];
      if (event.target.files[0].size > 1000000) {
        this.setState({ error: "File is too large. Max size is 1 MB" })
        return false;
      }
      if (!extension.includes(event.target.files[0].type)) {
        this.setState({ error: "Invalid File Type, only Allowed image/jpeg, image/png, image/jpg" })
        return false;
      }
    }
    const value = name === 'photo'
      ? event.target.files[0]
      : event.target.value
    if (name == "photo") {
      this.setState({ showImage: true })
      this.setState({ imagePath: '' })
      var file = event.target.files[0]
      var reader = new FileReader()
      var url = reader.readAsDataURL(file)

      reader.onloadend = function (e) {
        this.setState({
          imagePath: [reader.result]
        })
      }.bind(this)
    }
    this.postData.set(name, value)
    this.postData.set('postname', this.state.postname)
    const did = name === 'url'
      ? this.postData.set("photo", '')
      : ''
    this.setState({ [name]: value })
    setTimeout(function () { //Start the timer
      //After 1 second, set render to true
      console.log(name + "-" + value)
      if (this.state.posttype == "2") {
        this.setState({ showDate: true })
      }
      else {
        let errors = {};
        errors["Date"] = ""
        this.setState({ errors: errors })
        this.setState({ showDate: false })
      }
    }.bind(this), 100)

  }
  handleRequestClose = (event, reason) => {
    this.setState({ open: false })
  }
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

  render() {
    const { classes } = this.props
    return (<div className={classes.root}>
      <Card className={classes.card}>
        <CardHeader

          title='Edit Image'
          className={classes.cardHeader}
        />
        {/*avatar={
              <Avatar src={'/api/users/photo/'+this.state.user._id}/>
            } */}
        <CardContent className={classes.cardContent}>
          <TextField
            id="standard-full-width"
            label="Title"
            style={{ margin: 8 }}
            placeholder="Title"
            fullWidth
            value={this.state.text}
            onChange={this.handleChange('text')}
            className={classes.textField}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            id="standard-full-width"
            label="Sub Heading"
            style={{ margin: 8 }}
            placeholder="Sub Heading"
            fullWidth
            value={this.state.subheading}
            onChange={this.handleChange('subheading')}
            className={classes.textField}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />

          {!this.state.showImage && <div className={classes.photo}>
            <img
              className={classes.media}
              src={this.state.url ? this.state.url : '/api/posts/photo/' + this.state.id} style={{ width: 250 }}
            />
          </div>}
          {this.state.showImage && <div className={classes.photo}>
            <img
              className={classes.media}
              src={this.state.imagePath} style={{ width: 250 }}
            />
          </div>}
          <input accept="image/*" onChange={this.handleChange('photo')} className={classes.input} id="icon-button-file" type="file" multiple />
          <label htmlFor="icon-button-file">
            <IconButton color="secondary" className={classes.photoButton} component="span">
              <PhotoCamera />
            </IconButton>
          </label>
          <span className={classes.filename}>{this.state.photo ? this.state.photo.name : ''}</span>
          {this.state.errors["image"] &&
            <Typography component="p" color="error">
              <Icon color="error" className={classes.error}>error</Icon>
              {this.state.errors["image"]}
            </Typography>}
          <TextField
            id="standard-full-width"
            label="Image URL"
            style={{ margin: 8 }}
            placeholder="Image URL"
            fullWidth
            value={this.state.url}
            onChange={this.handleChange('url')}
            className={classes.textField}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Select
            multiple
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
          </Select>
          <Typography>
            Who can see this post ?
        </Typography>
          <input type="radio" value="public" fullWidth
            checked={this.state.viewtype === "public"}
            onChange={this.handleChange('viewtype')} /> Public
        <input type="radio" value="stans" fullWidth
            checked={this.state.viewtype === "stans"}
            onChange={this.handleChange('viewtype')} /> Stans Only
        {this.state.errors["viewtype"] &&
            <Typography component="p" color="error">
              <Icon color="error" className={classes.error}>error</Icon>
              {this.state.errors["viewtype"]}
            </Typography>}
          <SplitButton
            onType={this.handleType}
            onDate={this.handleDate}
            onClick={this.clickPost}
          />
          {this.state.errors["posttype"] &&
            <Typography component="p" color="error">
              <Icon color="error" className={classes.error}>error</Icon>
              {this.state.errors["posttype"]}
            </Typography>}
          {this.state.error && (<Typography component="p" color="error">
            <Icon color="error" className={classes.error}>error</Icon>
            {this.state.error}
          </Typography>)
          }

        </CardContent>
      </Card>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={this.state.open}
        onClose={this.handleRequestClose}
        autoHideDuration={6000}
        message={<span className={classes.snack}>{this.state.successMessage}</span>}
      />
    </div>)
  }
}

EditProduct.propTypes = {
  classes: PropTypes.object.isRequired,
  addUpdate: PropTypes.func.isRequired
}

export default withStyles(styles)(EditProduct)
