import React, { Component } from 'react'
import Card, { CardHeader, CardContent, CardActions } from 'material-ui/Card'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import Typography from 'material-ui/Typography'
import Avatar from 'material-ui/Avatar'
import Icon from 'material-ui/Icon'
import PropTypes from 'prop-types'
import { lighten, withStyles } from '@material-ui/core/styles';
import auth from './../../auth/auth-helper'
import IconButton from 'material-ui/IconButton'
import MoreHoriz from 'material-ui-icons/MoreHoriz'
import PhotoCamera from 'material-ui-icons/PhotoCamera'
import Audiotrack from 'material-ui-icons/Audiotrack'
import AttachFile from 'material-ui-icons/AttachFile'
import Radio from 'material-ui/Radio'
import Select from 'material-ui/Select'
import Snackbar from 'material-ui/Snackbar'
import { readpost, readorder, getShippingCharges } from './../api-post.js'
import { Link } from 'react-router-dom'
import Grid from '@material-ui/core/Grid';
import Rating from '@material-ui/lab/Rating';
import { rating } from './../api-post.js'
import OwlCarousel from 'react-owl-carousel2';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import LinearProgress from '@material-ui/core/LinearProgress'
import CustomButton from '../../common/CustomButton'
import CustomLoader from './../../common/CustomLoader'
import Popper from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import DeletePost from './../DeletePost'
import { FacebookShareButton, FacebookIcon, TwitterShareButton, TwitterIcon } from 'react-share';
import Divider from 'material-ui/Divider'
import Fourzerofour from "./../../common/404";
import ReportPost from "./../ReportPost";
import { SITE_URL } from '../../common/Constants';
import config from "../../../config/config";

const BorderLinearProgress = withStyles({
  root: {
    height: 10,
    backgroundColor: lighten('#ff6c5c', 0.5),
  },
  bar: {
    borderRadius: 20,
    backgroundColor: '#ff6c5c',
  },
})(LinearProgress);

const styles = theme => ({

  card: {
    maxWidth: 600,
    margin: 'auto',
    //marginBottom: theme.spacing.unit * 3,
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
    //marginLeft: theme.spacing.unit * 2,
    //marginRight: theme.spacing.unit * 2,
    width: '90%'
  },
  submit: {
    //margin: theme.spacing.unit * 2
  },
  filename: {
    verticalAlign: 'super'
  },
  snack: {
    color: theme.palette.protectedTitle
  },
  // margin: {
  //   margin: theme.spacing(1),
  //   backgroundColor:'rgba(0, 0, 0, 0.26)',
  // },
  pop_positon: {
    marginTop: "17px",
  },
  pop_positon_mob: {
    marginTop: "9px",
  },
})

const options = {
  margin: 32,
  items: 3,
  nav: true,
  rewind: true,
  autoplay: true,
  loop: false,
  //autoHeight: true,
  responsive: {
    0: {
      items: 1
    },
    600: {
      items: 1
    },
    1000: {
      items: 1
    }
  }
};

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

var names = [];
class ProductDetails extends Component {
  constructor({ match }) {
    super()
    this.state = {
      id: '',
      photo: '',
      name: '',
      description: '',
      price: '',
      userId: '',
      userProfile: '',
      userName: '',
      rating: '',
      quantity: 1,
      baseprice: '',
      producttype: '',
      shipping: [],
      one: 0,
      two: 0,
      three: 0,
      four: 0,
      five: 0,
      notpurchased: true,
      loading: true,
      openid: '',
      popanchor: null,
      popopen: false,
      id: undefined,
      pid: undefined,
      share: false,
      deleteClick: false,
      attributeNames: [],
      selectAttributeValue: [],
      invalid: false,
      isReported: false,
      isMobile: false,
      isUploaded: false,
    }

    this.match = match
  }

  onReport = () => {
    this.setState({ isReported: true })
  }


  componentDidMount = () => {
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      this.setState({ isMobile: true })
    }

    localStorage.removeItem("checkout");
    const jwt = auth.isAuthenticated()
    readorder({
      userId: jwt.user._id,
      productId: this.match.params.productId
    }, { t: jwt.token }).then((data) => {
      if (data.error) {
        this.setState({ error: data.error })
      } else {
        if (data.length > 0) {
          console.log("purchased")
          this.setState({ notpurchased: false })
        }
      }
    })

    var valueone = 0
    var valuetwo = 0
    var valuethree = 0
    var valuefour = 0
    var valuefive = 0
    var rating = 0;
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    this.rateData = new FormData()
    sleep(100).then(() => {
      readpost({
        postId: this.match.params.productId,
        id: jwt.user._id,
      }, { t: jwt.token }).then((data) => {
        if (data.error) {
          this.setState({
            error: data.error, invalid: true,
            loader: false
          })
        } else {
          var ratelength = data.rated.length
          if (ratelength > 0) {

            data.rated.forEach(element => {
              if (element.postedBy === jwt.user._id) {
                this.setState({ notpurchased: true })
              }
              if (element.rate == 5) {
                valuefive++;
              }
              if (element.rate == 4) {
                valuefour++;
              }
              if (element.rate == 3) {
                valuethree++;
              }
              if (element.rate == 2) {
                valuetwo++;
              }
              if (element.rate == 1) {
                valueone++;
              }
            });
            rating = (valuefive + valuefour + valuethree + valuetwo + valueone) / ratelength
            if (rating < 1) {
              rating = 1
            }
            rating = rating * 100
            valuefive = valuefive / ratelength * 100
            valuefour = valuefour / ratelength * 100
            valuethree = valuethree / ratelength * 100
            valuetwo = valuetwo / ratelength * 100
            valueone = valueone / ratelength * 100
          }
          var shipping = []
          if (data.producttype == "physical") {
            shipping = data.shippinginfo
            if (typeof window !== "undefined") {
              localStorage.setItem('shipping', JSON.stringify(shipping))
            }
          }

          let attributeNames = data.attributeNames;
          let selectAttributeValue = this.state.selectAttributeValue
          attributeNames.map((item, mindex) => {
            let temp = [];
            item.attributeValue.split("###").map((item, index) => {
              temp.push(item);
              if (index == 0) {
                selectAttributeValue[mindex] = item
              }
            })
            item.attributeValue = temp;
          })
          if (data.report.length > 0) {
            data.report.map((item, i) => {
              if (item == auth.isAuthenticated().user._id) {
                this.setState({ isReported: true })
              }
            })
          }
          this.setState({
            id: data._id,
            photo: data.photo.split(",").length > 1 ? data.photo.split(",") : data.photo,
            name: data.text,
            description: data.description,
            baseprice: data.price,
            price: data.price,
            producttype: data.producttype,
            attributeNames: attributeNames,
            shipping: shipping,
            userId: data.postedBy._id,
            userProfile: data.postedBy.photo,
            userName: data.postedBy.name,
            profileUserName: data.postedBy.username,
            five: Number(valuefive.toFixed(2)),
            four: Number(valuefour.toFixed(2)),
            three: Number(valuethree.toFixed(2)),
            two: Number(valuetwo.toFixed(2)),
            one: Number(valueone.toFixed(2)),
            rating: rating,
            loading: false,
            selectAttributeValue,
            isUploaded: data.isUploaded
          })
        }
      })
      // getShippingCharges({
      //   userId: jwt.user._id
      // }, { t: jwt.token }).then((data) => {
      //   if (data.error) {
      //     this.setState({ error: data.error })
      //   } else {
      //     this.setState({ shipping: data[0].shopenable.shippinginfo, loading: false })
      //     if (typeof window !== "undefined") {
      //       localStorage.setItem('shipping', JSON.stringify(data[0].shopenable.shippinginfo))
      //     }
      //   }
      // })
    })
  }

  onRemove = () => {
    window.location = "/";
  }

  handleChange = name => event => {
    const value = event.target.value
    this.rateData.set('rating', value)
    this.setState({ rating: value })
    setTimeout(function () {
      this.submitRating()
    }.bind(this), 100)
  }


  // Attributes 

  handleAttributes = i => e => {
    console.log(this.state.attributeNames[i].attributeValue);
    //let attributeValue =this.state.attributeNames[i].attributeValue;
    let attributeNames = this.state.attributeNames;
    let selectAttributeValue = this.state.selectAttributeValue;
    this.state.attributeNames[i].attributeValue.map((item, key) => {
      console.log(item + " == " + e.target.value);
      if (item == e.target.value) {
        console.log("found");
        attributeNames[i]['selectAttributeValue'] = key;
        selectAttributeValue[i] = item
      }
    });
    console.log("RRR", attributeNames);
    this.setState({
      attributeNames,
      selectAttributeValue
    });
    console.log("sss", this.state.attributeNames);
  };

  submitRating = () => {
    const jwt = auth.isAuthenticated()
    rating({
      userId: jwt.user._id
    },
      {
        t: jwt.token
      }, this.state.id, { rate: this.state.rating }).then((data) => {
        if (data.error) {
          this.setState({ error: data.error })
        }
        else {
          this.setState({ open: true, successMessage: 'Rated Successfully !!', notpurchased: true })
        }
      })
  }

  quantity = (value) => {
    var qty = value > 0 ? this.state.quantity + 1 : this.state.quantity - 1
    value > 0 ? this.setState({ quantity: qty, price: this.state.baseprice * qty }) : this.setState({ quantity: qty, price: this.state.baseprice * qty })

  }
  checkout = () => {
    var checkout = { productid: this.state.id, quantity: this.state.quantity, selectAttributeValue: this.state.selectAttributeValue }
    if (typeof window !== "undefined") {
      localStorage.setItem('checkout', JSON.stringify(checkout))
    }
  }

  copyToClipboard = (postId) => {
    var textField = document.createElement('textarea')
    textField.innerText = SITE_URL + 'productdetails/' + postId
    document.body.appendChild(textField)
    textField.select()
    document.execCommand('copy')
    textField.remove()
    this.setState({
      open: true,
      successMessage: "copied to clipboard !!",
    });
  }

  handleRequestClose = (event, reason) => {
    this.setState({ open: false });
  };

  handleMore = event => {
    console.log("here")
    if (this.state.popopen) {
      this.setState({
        popanchor: event.currentTarget,
        popopen: true,
        pid: 'simple-popper',
      })
    }
    else {
      this.setState({ popanchor: event.currentTarget, popopen: true, pid: 'simple-popper' })
    }
  }

  handleClose = (event) => {
    if (this.state.popanchor.current && this.state.popanchor.current.contains(event.target)) {
      return;
    }
    if (!this.state.deleteClick) {
      this.setState({
        popopen: false,
        // popanchor: null,
        // popopen: false,
        // pid: undefined,
        // share:false,
      })
    }
    this.setState({ deleteClick: false })
  }

  handleClosee = (event) => {
  }

  onClose = () => {
  }

  showShare = () => {
    if (!this.state.share)
      this.setState({ share: true })
    else
      this.setState({ share: false })
  }

  deleteClick = () => {
    this.setState({ deleteClick: true })
  }

  render() {
    if (this.state.invalid) {
      return <Fourzerofour />;
    }
    const { classes } = this.props
    var postId = this.state.id
    const shareUrl = SITE_URL + 'productdetails/' + postId;
    if (this.state.loading) {
      return <CustomLoader />
    }
    else {
      return (<div className={"shop-detail-add"}>
        <Grid container className={"shop-post-detail-container"}>

          <Grid item xs={12} sm={7} md={9} className={"shop-detail-left"}>
            <Card className={"shop-post-grid shop-post-detail-grid"}>
              <CardHeader
                avatar={
                  <Avatar src={this.state.userProfile ? config.profileImageBucketURL + this.state.userProfile : config.profileDefaultPath}
                  // src={'/api/users/photo/' + this.state.userId} 
                  />
                }
                action={
                  //this.props.post.postedBy._id === auth.isAuthenticated().user._id &&
                  //onClick={handleClick}
                  <div className={"post-share-head"}>
                    <IconButton>
                      <MoreHoriz onClick={this.handleMore} aria-describedby={this.state.pid} variant="contained" />
                    </IconButton>
                    <Popper
                      id={this.state.pid}
                      open={this.state.popopen}
                      anchorEl={this.state.popanchor}
                      placement={'bottom-end'}
                      className={this.state.isMobile ? classes.pop_positon_mob : classes.pop_positon}
                      transition>
                      {({ TransitionProps }) => (
                        <Fade {...TransitionProps} timeout={350}>
                          <Paper className={classes.post_menu} className={"post-menu"}>
                            <ClickAwayListener onClickAway={this.handleClose}>
                              <MenuList>
                                {/* <MenuItem onClick={this.showShare}>Share</MenuItem>  */}
                                <MenuItem className={"post-share"}>
                                  <FacebookShareButton
                                    url={shareUrl}
                                    quote={this.state.name}
                                    className="Demo__some-network__share-button">
                                    <FacebookIcon
                                      size={32}
                                      round />
                                  </FacebookShareButton>
                                  <TwitterShareButton
                                    url={shareUrl}
                                    title={this.state.name}
                                    className="Demo__some-network__share-button">
                                    <TwitterIcon
                                      size={32}
                                      round />
                                  </TwitterShareButton>
                                </MenuItem>
                                <MenuItem onClick={() => this.copyToClipboard(postId)}>Copy Link</MenuItem>
                                {this.state.userId !=
                                  auth.isAuthenticated().user._id && !this.state.isReported &&
                                  <MenuItem onClick={this.reportClick}>
                                    <ReportPost
                                      postId={postId}
                                      onReport={this.onReport}
                                      type="Product"
                                    />
                                  </MenuItem>
                                }
                                {this.state.userId == auth.isAuthenticated().user._id &&
                                  <MenuList>
                                    <MenuItem><Link to={"/productedit/" + postId}>Edit</Link></MenuItem>
                                    <MenuItem onClick={this.deleteClick}>
                                      <DeletePost
                                        postId={postId}
                                        onDelete={this.onRemove}
                                        display="text"
                                        onClose={this.onClose}
                                        type="product"
                                        from="single" /></MenuItem>
                                  </MenuList>
                                }
                              </MenuList>
                            </ClickAwayListener>

                            {/* {this.state.userId == auth.isAuthenticated().user._id &&
                              <ClickAwayListener onClickAway={this.handleClosee}>
                                <MenuList>
                                  <MenuItem><Link to={"/productedit/" + postId}>Edit</Link></MenuItem>
                                  <MenuItem onClick={this.deleteClick}>
                                    <DeletePost
                                      postId={postId}
                                      onDelete={this.onRemove}
                                      display="text"
                                      onClose={this.onClose}
                                      type="product"
                                      from="single" /></MenuItem>
                                </MenuList>
                              </ClickAwayListener>
                            } */}
                          </Paper>
                        </Fade>
                      )}
                    </Popper>
                  </div>
                }

                title={<Typography component="h3" className={""}> <Link to={"/profile/" + this.state.profileUserName}>{this.state.userName}</Link></Typography>}
                className={"post-cardheader"}
              />

              <CardContent className={this.state.isUploaded ? "post-grid-bottom" : "post-grid-bottom pt-live-s"}>
                <div className={"photo-grid-slider"}>
                  {
                    !this.state.isUploaded &&
                    <Typography component="div" className={"pro-live-c"}>
                      <Typography component="h3" className={""}>Product is being reviewed</Typography>
                      <Typography component="h4" className={""}>it should be live shortly</Typography>
                    </Typography>
                  }

                  {

                    this.state.isUploaded && Array.isArray(this.state.photo) &&
                    <OwlCarousel ref="car" options={options}>
                      {
                        this.state.photo.map((item, i) => {
                          return <img key={i}
                            className={classes.media}
                            src={config.productBucketURL + item}
                          />
                          // return <Typography key={i} className={"item"} component="div" style={{ backgroundImage: 'url(/dist/uploads/photos/' + item + ')', }}>
                          // </Typography>
                        })
                      }
                    </OwlCarousel>
                  }
                  {/* {
                    this.state.photo.split(",").length == 1 &&
                    <div className={"photo-grid-slider"}>
                      {this.state.photo.slice(0, 1).map((item, i) => {
                        return 
                      }
                      )}
                    </div>
                  } */}
                  <div className={"photo_singel_img"}>
                    {
                      !Array.isArray(this.state.photo) &&
                      <img src={config.productBucketURL + this.state.photo} />
                    }
                  </div>
                </div>





              </CardContent>
            </Card>


            <div className={"shop-detail-content"}>

              <Typography component="h2">
                {this.state.name}
              </Typography>
              <Typography component="div" variant="body1" className={"shop-desc"}>
                {this.state.description}
              </Typography>

            </div>


          </Grid>

          <Grid item xs={12} sm={5} md={3}>

            <div variant="body1" className={"shop-detail-rating-outer"}>
              <div variant="body1" className={"shop-detail-rating"}>
                <ExpansionPanel>
                  <ExpansionPanelSummary className={"rat_blk"}
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header">
                    <Grid variant="body1" className={classes.heading}>
                      <Rating
                        name="simple-controlled"
                        value={this.state.rating}
                        onChange={this.handleChange('rating')}
                        disabled={this.state.notpurchased}
                      />
                    </Grid>
                    <Typography component="div" variant="body1" className={"ratings_txt"}>ratings</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails className={"rating_section"}>
                    <Typography component="div" variant="body1" className={"rat_list"}>
                      <Typography component="div" variant="body1" className={"first"}>5 Star <Typography component="span" variant="body1">{this.state.five}%</Typography></Typography>
                      <Typography component="div" variant="body1" className={"second"}><BorderLinearProgress
                        className={"pro_line"}
                        variant="determinate"
                        color="secondary"
                        value={this.state.five} /></Typography>
                    </Typography>

                    <Typography component="div" variant="body1" className={"rat_list"}>
                      <Typography component="div" variant="body1" className={"first"}>4 Star <Typography component="span" variant="body1">{this.state.four}%</Typography></Typography>
                      <Typography component="div" variant="body1" className={"second"}><BorderLinearProgress
                        className={"pro_line"}
                        variant="determinate"
                        value={this.state.four} /></Typography>
                    </Typography>

                    <Typography component="div" variant="body1" className={"rat_list"}>
                      <Typography component="div" variant="body1" className={"first"}>3 Star <Typography component="span" variant="body1">{this.state.three}%</Typography></Typography>
                      <Typography component="div" variant="body1" className={"second"}>
                        <BorderLinearProgress
                          className={"pro_line"}
                          variant="determinate"
                          value={this.state.three} />
                      </Typography>
                    </Typography>

                    <Typography component="div" variant="body1" className={"rat_list"}>
                      <Typography component="div" variant="body1" className={"first"}>2 Star <Typography component="span" variant="body1">{this.state.two}%</Typography></Typography>
                      <Typography component="div" variant="body1" className={"second"}><BorderLinearProgress
                        className={"pro_line"}
                        variant="determinate"
                        color="secondary"
                        value={this.state.two} /></Typography>
                    </Typography>

                    <Typography component="div" variant="body1" className={"rat_list"}>
                      <Typography component="div" variant="body1" className={"first"}>1 Star <Typography component="span" variant="body1">{this.state.one}%</Typography></Typography>
                      <Typography component="div" variant="body1" className={"second"}><BorderLinearProgress
                        className={"pro_line"}
                        variant="determinate"
                        color="secondary"
                        value={this.state.one} /></Typography>
                    </Typography>

                  </ExpansionPanelDetails>
                </ExpansionPanel>
              </div>
            </div>
            {this.state.producttype == "physical" && this.state.shipping.length > 0 &&
              <div variant="body1" className={"shop-detail-rating-outer"}>
                <div variant="body1" className={"shop-detail-rating"} shop-detail-rating={"true"}>
                  <ExpansionPanel>
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography component="div" variant="body1" className={"ratings_txt"}>Shipping info</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails className={"rating_section"}>
                      <Typography component="div" variant="body1" className={"shiping_section"} >
                        <Typography component="div" variant="body1" className={"shi_list"}>
                          {
                            this.state.shipping.map((item, i) => {
                              return <div key={i}>
                                <Typography component="div" variant="body1" className={"first"}>
                                  {item.country} </Typography>
                                <Typography component="div" variant="body1" className={"second"}>
                                  ${item.charges}
                                </Typography>
                              </div>
                            })
                          }
                        </Typography>
                      </Typography>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                </div>
              </div>}
            {this.state.producttype == "physical" && this.state.attributeNames.length > 0 &&
              <div variant="body1" className={"shop-detail-rating-outer"}>
                <div variant="body1" className={"shop-detail-rating attributes_blk"}>
                  <ExpansionPanel expanded>
                    <ExpansionPanelSummary
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                      className={"attributes_height_auto"}
                    >
                      {/* <Typography component="div" className={"ratings_txt"}>Attributes</Typography> */}
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails className={"rating_section"}>
                      <Typography variant="body1" component="div" className={"shiping_section"} >
                        <Typography variant="body1" component="div" className={"shi_list attributes_select_blk"}>
                          {
                            this.state.attributeNames.map((item, index) => {
                              return <div key={index}>
                                <Typography variant="body1" component="div" className={"form-label"}>
                                  {item.attributeName}
                                </Typography>
                                <Typography variant="body1"
                                  component="div"
                                  className={"prod-select"}
                                  key={index}
                                >
                                  {(item.attributeValue.length < 2) ?
                                    item.attributeValue[0] :
                                    <Select
                                      displayEmpty
                                      disableUnderline={true}
                                      value={(item.selectAttributeValue == undefined) ? item.attributeValue[0] : item.attributeValue[item.selectAttributeValue]}
                                      fullWidth={true}
                                      onChange={this.handleAttributes(index)}
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
                                      {item.attributeValue.map((item, i) => {
                                        return (
                                          <MenuItem value={item} key={i}>
                                            {item}
                                          </MenuItem>
                                        );
                                      })}
                                    </Select>
                                  }
                                </Typography>
                              </div>

                            })
                          }
                        </Typography>
                      </Typography>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                </div>
              </div>}


            <Typography component="div" variant="body1" className={"quantity_Outer"}>
              {this.state.producttype == "physical" &&
                <button disabled={this.state.quantity > 1 ? false : true} onClick={() => this.quantity(0)}>-</button>
              }
              <Typography component="div" variant="body1" className={"qun_inner"}>
                <Typography component="span" variant="body1" className={"pro-quan"}>Quantity</Typography> <Typography component="span" variant="body1" className="qun_txt">{this.state.quantity}</Typography>
              </Typography>
              {this.state.producttype == "physical" &&
                <button onClick={() => this.quantity(1)}>+</button>
              }
            </Typography>

            <Typography component="div" variant="body1" className={"shop-detail-pricing"}>
              <Typography component="h2" variant="body1">Total</Typography>
              <Grid item xs={12} sm={12} className={"total_list_blk"}>
                <Typography component="span" variant="body1">Total price</Typography>
                <Typography component="span" variant="body1" className="bold_txt">$ {this.state.price}</Typography>
              </Grid>
              {this.state.userId != auth.isAuthenticated().user._id &&
                <Typography component="div" variant="body1" className={"button_sec_det"}>
                  <Link to={"/checkout"}>
                    <CustomButton className={"Primary_btn"} onClick={this.checkout} label="Buy Now" />
                    {/* <Button color="primary" variant="raised" className={classes.submit} onClick={this.checkout}>Buy Now</Button> */}
                  </Link>
                  {/* <Button color="primary" variant="raised" className={classes.submit} onClick={this.checkout}>Buy Now</Button> */}
                </Typography>
              }
            </Typography>
          </Grid>

        </Grid>
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
      </div >)
    }
  }
}

ProductDetails.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(ProductDetails)
