import React, {Component} from 'react'
import Card, { CardHeader, CardContent, CardActions } from 'material-ui/Card'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import Typography from 'material-ui/Typography'
import Avatar from 'material-ui/Avatar'
import Icon from 'material-ui/Icon'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import {create,readcategory} from './api-product.js'
import auth from './../auth/auth-helper'
import IconButton from 'material-ui/IconButton'
import PhotoCamera from 'material-ui-icons/PhotoCamera'
import Radio from 'material-ui/Radio'
import Select from 'material-ui/Select'
import Snackbar from 'material-ui/Snackbar'

const styles = theme => ({
  root: {
    backgroundColor: '#efefef',
    padding: `${theme.spacing.unit*3}px 0px 1px`
  },
  card: {
    maxWidth:600,
    margin: 'auto',
    marginBottom: theme.spacing.unit*3,
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
    marginLeft: theme.spacing.unit*2,
    marginRight: theme.spacing.unit*2,
    width: '90%'
  },
  submit: {
    margin: theme.spacing.unit * 2
  },
  filename:{
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

class NewImage extends Component {
  constructor() {
    super()
    this.state = {
        text: '',
        subheading: '',
        photo: '',
        posttype: '',
        viewtype: '',
        description: '',
        categories: [],
        names:[],
        postname: 'image',
        error: '',
        user: {},
        open: false,
        showDate:false,
        showImage:false,
        imagePath:'',
        url:'',
        scheduled_datetime:Date.now,
         errors:{}
      }
  }
  

   //async 
   init = () => {
    console.log("init")
    const jwt = auth.isAuthenticated()
   // await 
   readcategory({
      userId: jwt.user._id
    }, {t: jwt.token}).then((data) => {
      if (data.error) {
        this.setState({redirectToSignin: true})
      } else {
        console.log(data)
        var categories = [];
        for(var i =0;i<data.length;i++)
        {
          if(data[i].categories!=undefined)
          {
            categories[i] = data[i].categories.split(',');
          } 
        }

        var categories = [].concat.apply([], categories);
        names = Array.from(new Set(categories));
        names.shift()

        console.log(names)
        //let following = this.checkFollow(data)
      }
    })
    sleep(500).then(() => {
     this.setState({names: names})
     console.log(names)
     console.log("finish")
})
     
  }

  componentDidMount = () => {
    this.postData = new FormData()
    this.setState({user: auth.isAuthenticated().user})
     this.init()

  }
  handleValidation(){
   let errors = {};
   let formIsValid = true;
   if(this.state.photo == '' && this.state.url == '')
      {
        formIsValid = false;
        errors["image"] = "Photo is Missing"
      }
     if(this.state.viewtype == '')
      {
        formIsValid = false;
        errors["viewtype"] = "who can see this post is Missing"
      }
      if(this.state.posttype == '')
      {
        formIsValid = false;
        errors["posttype"] = "Post Type is Missing"
      }
      if(this.state.posttype == '2' && this.state.scheduled_datetime == '')
      {
        formIsValid = false;
        errors["Date"] = "Schedule Date is Missing"
      }
      if(this.state.scheduled_datetime == 'undefined' || this.state.scheduled_datetime == '')
      {
         this.setState({scheduled_datetime: Date.now })
      }
      this.setState({errors: errors});
      return formIsValid;
 }
  clickPost = () => {
    this.setState({error: "" })
    if(this.handleValidation()){
    const jwt = auth.isAuthenticated()
    create({
      userId: jwt.user._id
    }, {
      t: jwt.token
    }, this.postData).then((data) => {
      if (data.error) {
        this.setState({error: data.error})
      } else {
        this.setState({text:'',subheading:'', photo: '',posttype: '',imagePath: '',showImage:false,viewtype: '',description: '',categories: [],scheduled_datetime:'',showDate:false,error:'',url:''})
        this.props.addUpdate(data)
        this.setState({open: true, successMessage: `Added Successfully!`})
      }
    })
  }
  }
  handleChange = name => event => {
     let errors = {};
    this.setState({error: "" })
    if(name === 'photo'){
      var extension = ["image/jpeg","image/png","image/jpg"];
    if(event.target.files[0].size > 1000000)
    {
      this.setState({error: "Invalid File size, allowed X KB only" })
      return false;
    }
    if(!extension.includes(event.target.files[0].type))
    {
      this.setState({error: "Invalid File Type, only Allowed image/jpeg, image/png, image/jpg" })
      return false;
    }
  }
    const value = name === 'photo'
      ? event.target.files[0]
      : event.target.value
     if(name=="photo"){
      this.setState({showImage: true })
      this.setState({imagePath: '' })
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
    setTimeout(function() { //Start the timer
       //After 1 second, set render to true
      console.log(name+"-"+value)
       if(this.state.posttype=="2")
       {
          this.setState({showDate: true })
       }
       else
       {
         this.setState({showDate: false })
       }
     }.bind(this), 100)
  }
   handleRequestClose = (event, reason) => {
    this.setState({ open: false })
  }
  render() {
    const {classes} = this.props
    return (

      <div className={classes.root}>
      <Card className={classes.card}>
      <CardHeader
            
            title='Image'
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
        label="Caption"
        style={{ margin: 8 }}
        placeholder="Caption"
        fullWidth
        value={this.state.subheading}
        onChange={this.handleChange('subheading')}
        className={classes.textField}
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
      />
       
        <input accept="image/*" onChange={this.handleChange('photo')} className={classes.input} id="icon-button-file" type="file" multiple />
        <label htmlFor="icon-button-file">
          <IconButton color="secondary" className={classes.photoButton} component="span">
            <PhotoCamera />
          </IconButton>
        </label> 
        <span className={classes.filename}>{this.state.photo ? this.state.photo.name : ''}</span>
        { this.state.errors["image"] &&
      <Typography component="p" color="error">
            <Icon color="error" className={classes.error}>error</Icon>
              {this.state.errors["image"]}
            </Typography> }
            {this.state.showImage && <div className={classes.photo}>
              <img
                className={classes.media}
                src={this.state.imagePath}  style={{width:250}}
                />
        </div> }
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
          fullWidth
           value={this.state.categories}
         onChange={this.handleChange('categories')}
          inputProps={{
            id: 'select-multiple-native',
          }}
        >
          {this.state.names.map(name => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </Select>
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
        <Typography>
          Who can see this post ?
        </Typography>
        <input  type="radio" value="public" fullWidth
              checked={this.state.viewtype === "public"}
              onChange={this.handleChange('viewtype')}/> Public
        <input type="radio" value="stans" fullWidth
              checked={this.state.viewtype === "stans"}
              onChange={this.handleChange('viewtype')}/> Stans Only
{ this.state.errors["viewtype"] &&
        <Typography component="p" color="error">
              <Icon color="error" className={classes.error}>error</Icon>
                {this.state.errors["viewtype"]}
        </Typography> }
        <br/>
        <label>Post Type *</label>
       
        <Select
          value={this.state.posttype}
          fullWidth
          onChange={this.handleChange('posttype')}
          inputProps={{
            name: 'age',
            id: 'age-simple',
          }}
        >
          <option value={1}>Publish Now</option>
          <option value={2}>Schedule</option>
          <option value={3}>Save as Draft</option>
        </Select>
   { this.state.errors["posttype"] &&
      <Typography component="p" color="error">
            <Icon color="error" className={classes.error}>error</Icon>
              {this.state.errors["posttype"]}
            </Typography> }
        <br/>
        { this.state.showDate ? <TextField
        id="datetime-local"
        label="Scheduled Date & Time"
        type="datetime-local"
        defaultValue=""
        onMouseOut={this.handleChange('scheduled_datetime')}
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
      /> : null }
      { this.state.errors["Date"] &&
      <Typography component="p" color="error">
            <Icon color="error" className={classes.error}>error</Icon>
              {this.state.errors["Date"]}
            </Typography> }
         { this.state.error && (<Typography component="p" color="error">
            <Icon color="error" className={classes.error}>error</Icon>
              {this.state.error}
            </Typography>)
        }
      </CardContent>

      <CardActions>
        <Button color="primary" variant="raised" disabled={this.state.posttype === ''} onClick={this.clickPost} className={classes.submit}>POST</Button>
      </CardActions>
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

NewProduct.propTypes = {
  classes: PropTypes.object.isRequired,
  addUpdate: PropTypes.func.isRequired
}

export default withStyles(styles)(NewProduct)
