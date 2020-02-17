import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import auth from '../../auth/auth-helper'
import { read } from '../api-user'
import { Redirect, Link } from 'react-router-dom'
import { listByUser, listProductsByUser, countLikesByUser } from '../../post/api-post'
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card'
import Grid from 'material-ui/Grid'
import Typography from "material-ui/Typography";
import StripeCheckout from 'react-stripe-checkout';
import { becomeStan } from '../../user/api-user';
import CustomLoader from '../../common/CustomLoader'
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { getVatByCountry, fetchCountrylist } from "../../user/api-user";
import Select from '@material-ui/core/Select';
import config from "../../../config/config";
import MenuItem from '@material-ui/core/MenuItem';
import Fourzerofour from "./../../common/404";

var followingcount = 0, followerscount = 0, counter = 0, countlikes = 0;
const styles = theme => ({
  root: theme.mixins.gutters({
    maxWidth: 1200,
    margin: '0 auto',
    padding: 0,
    marginTop: theme.spacing.unit * 5,
    marginBottom: theme.spacing.unit * 5,
    textAlign: 'center',
  }),
  title: {
    margin: `${theme.spacing.unit * 2}px ${theme.spacing.unit}px 0`,
    color: theme.palette.protectedTitle,
    fontSize: '1em'
  },
  hconfirmationtitle:
  {
    fontSize: '25px',
    lineHeight: '30px',
    fontFamily: 'Helvetica-Bold',
    fontWeight: 'normal',
    color: '#000',
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: 10
  },
  grid: {

    flexGrow: 1,
    margin: 30,
    float: 'screenLeft',
    width: 1250

  },
  card: {
    maxWidth: 600,
    margin: 'auto',
    marginTop: theme.spacing.unit * 5
  },
  title: {
    padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 2.5}px ${theme.spacing.unit * 2}px`,
    color: theme.palette.text.secondary
  },
  media: {
    minHeight: 450
  },
  stanbtn: {
    backgroundColor: "#5907FF"
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: '8px 8px 0 0',
    boxShadow: 'none',
    position: 'relative',
    maxWidth: '390px',
    textAlign: 'center',
    padding: '30px 20px',
    boxSizing: 'border-box',
  },

  parasection: {
    padding: '0 15px',
  },
  btnsection: {
    padding: '20px 0 20px 40px',
    display: 'flex',
    flexDirection: 'row-reverse',
    justifyContent: 'space-evenly',
  },
  close1:
  {
    position: 'absolute',
    right: '20px',
    top: '10px',
    fontSize: '25px',
    cursor: 'pointer',
    lineHeight: '25px',
  },


})

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}
const ststatus = false;
class Stanprofile extends Component {
  constructor({ match }) {
    super()
    this.state = {
      user: { following: [], followers: [] },
      redirectToSignin: false,
      following: false,
      posts: [],
      shop: [],
      stan: false,
      count: 0,
      location: '',
      nofstan: '',
      nofstan: '',
      noffollowing: '',
      noffollowers: '',
      income: '',
      goal: '',
      liked: 0,
      subscriptionPitch: '',
      name: '',
      username: '',
      planInfo: '',
      amount: '',
      stripeKey: config.stripe_test_api_key,
      stans: '',
      stanStatus: false,
      loading: true,
      creatorId: '',
      creatorImage: '',
      videoId: '',
      about: '',
      open: false,
      vat: 0,
      code: '',
      country: [],
      invalid: false
    }
    this.match = match
  }

  init = (userId) => {
    this.setState({ creatorId: userId })
    const jwt = auth.isAuthenticated()
    sleep(500).then(() => {
      read({
        userId: userId
      }, { t: jwt.token }).then((data) => {
        if (data.error) {
          this.setState({ redirectToSignin: true, invalid: true })
        } else {
          if (data.creater.status != 1 && data.subscriptionpitch.stanbtn) {
            this.setState({ redirectToSignin: true })
          }
          this.setState({ subscriptionPitch: data.subscriptionpitch, planInfo: data.subscriptionpitch.planInfo, name: data['name'], username: data['username'], about: data.subscriptionpitch.presentyourself, creatorImage: data['photo'] })
          this.state.planInfo.forEach(res => {
            if (res.status == 1) {
              this.setState({ planInfo: res })

            }
          })
          this.setState({ stans: data.stan })
          this.state.stans.forEach(res => {
            if (res.ref_id == auth.isAuthenticated().user._id && res.status == 1) {
              this.setState({ stanStatus: true });

            }
            else if (
              res.ref_id == auth.isAuthenticated().user._id &&
              res.status == 0
            ) {
              var today = new Date()
              var stan_date = new Date(res.stan_date);
              stan_date.setMonth(stan_date.getMonth() + 1);
              const date1 = today
              const date2 = new Date(res.periodEnd);//new Date(stan_date);
              const diffTime = Math.abs(date2 - date1);
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              if (date2 > date1) {
                this.setState({ stanStatus: true });
              }
            }
          })
          var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
          var match = data.subscriptionpitch.videourl.match(regExp);
          var videoId
          if (match && match[2].length == 11) {
            videoId = match[2];
          }
          this.setState({ loading: false, videoId: videoId })
        }
      })
    })
  }

  componentWillReceiveProps = (props) => {
    this.init(props.match.params.userId)
  }
  componentDidMount = () => {
    //console.log(this.match)
    this.init(this.match.params.userId)
    this.getCountryList();
    //this.getCountryVatCharges();
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
      if (data.length > 0) {
        this.setState({ vat: data[0].vat_per, code: data[0].code })
      }
      //setVat(data[0].vat_per)
    });

  }

  getCountryVatCharges = (event) => {
    this.setState({ vat: 0 })
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
        this.setState({ vat: data[0].vat_per, code: data[0].code })
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

  getCountryList = () => {
    let countries = [];
    // Get Country List 
    const jwt = auth.isAuthenticated();
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
        this.setState({ country: countries })
      }
    });

  }

  checkFollow = (user) => {
    const jwt = auth.isAuthenticated()
    const match = user.followers.find((follower) => {
      return follower._id == jwt.user._id
    })
    return match
  }
  clickFollowButton = (callApi) => {
    const jwt = auth.isAuthenticated()
    callApi({
      userId: jwt.user._id
    }, {
      t: jwt.token
    }, this.state.user._id).then((data) => {
      if (data.error) {
        this.setState({ error: data.error })
      } else {
        this.setState({ user: data, following: !this.state.following })
      }
    })
  }


  loadPosts = (user) => {
    const jwt = auth.isAuthenticated()

    listByUser({
      userId: user
    }, {
      t: jwt.token
    }).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        this.setState({ posts: data })
        const result = Object.values(data)
        counter = result.length
      }
    })
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  becomeStan = () => {
    console.log("Stan Clicked")
  }
  handlechange = (token, carddata) => {
    if (token) {
      this.setState({ loading: true })
      const jwt = auth.isAuthenticated();
      var vatvalue = this.state.planInfo.amount * this.state.vat / 100
      var amount = this.state.planInfo.amount + vatvalue
      //setPaymentToken(token.id);
      becomeStan({
        userId: jwt.user._id,
        creatorId: this.match.params.userId,
        email: auth.isAuthenticated().user.email,
        userToken: token.id,
        planId: this.state.planInfo.planId,
        vat: vatvalue,
        countryCode: this.state.code,
        amount: this.state.planInfo.amount
        //postId: props.postId
      },
        {
          t: jwt.token
        }).then((data) => {
          if (data.error) {
            console.log(data)
            //this.setState({ stanStatus: true })
            this.setState({ loading: false })
          }
          else {
            this.setState({ stanStatus: true, open: true })
            this.setState({ loading: false })
            console.log(data)
          }
        })
    }

  }


  render() {
    if (this.state.invalid) {
      return <Fourzerofour />;
    }
    const { classes } = this.props
    const photoUrl = this.state.creatorImage ? config.profileImageBucketURL + this.state.creatorImage : config.profileDefaultPath
    // this.state.creatorId
    //   ? `/api/users/photo/${this.state.creatorId}?${new Date().getTime()}`
    //   : '/api/users/defaultphoto'
    const redirectToSignin = this.state.redirectToSignin
    if (redirectToSignin) {
      return <Redirect to='/signin' />
    }
    if (this.state.loading) {
      return <CustomLoader />
    }
    return (

      <Grid className={classes.root}>
        <Grid container className={"stan-profile-container"}>
          <Grid item xs={12} className={"stan-profile-bio"}>
            <Grid className={"inner-profile-container"}>

              <Typography component="div" className={"stanprofile-bg"}>

                <div className={"stan-picture"}>
                  <img src={photoUrl} className={classes.bigAvatar} />
                </div>

                <Grid className={"stan-profile-bio"}>
                  <Typography component="h1" className={"title-30"}> <span className={""}></span> {this.state.name}</Typography>
                  <Typography component="h2" className={"stan-subscribe"}>Subscribe to {this.state.username} for  ${this.state.planInfo.amount} per month</Typography>
                  <GridList cellHeight={160} className={"become-stan-list"} cols={3}>
                    <GridListTile style={{ 'height': 25, 'width': '100%', }}>
                      <Typography component="p">Access exclusive content</Typography>
                    </GridListTile>
                    <GridListTile style={{ 'height': 45, 'width': '100%', }} className={"stanlist-2"}>
                      <Typography component="p">Get Stans-only discounts for products in their online shop </Typography>
                    </GridListTile>
                  </GridList>

                  <CardContent className={"stan-user-price"}>
                    <div className={"stan-price-box"}>
                      {
                        auth.isAuthenticated().user && auth.isAuthenticated().user._id == this.state.user._id
                          ? (null)
                          : (<div className="checkout">
                            {this.state.stanStatus ? <Typography variant="h1" component="h1">Stanned</Typography>

                              : <StripeCheckout stripeKey={this.state.stripeKey}
                                label={"Stan for $" + this.state.planInfo.amount}
                                locale={"auto"}
                                token={this.handlechange}
                                className={"Primary_btn bestan-btn"}
                                email={auth.isAuthenticated().user.email} variant="raised" color="secondary"
                              />

                            }

                            {/* <Typography className={"cancel-stan"} component="p">Cancel anytime</Typography> */}

                            {/* new design start */}
                            <Grid item className={"stanprofile_below_blk"}>
                              <Typography component="div" component="div">
                                <Typography component="span" component="span">Your card will be charged monthly for <Typography component="span" component="span" className={"black_txt"}>${this.state.planInfo.amount + this.state.planInfo.amount * this.state.vat / 100},</Typography><br /> including <Typography component="span" component="span" className={"black_txt"}>${this.state.planInfo.amount * this.state.vat / 100}</Typography> for VAT in<br />
                                  <Select
                                    className={"profile_select"}
                                    disableUnderline={true}
                                    value={this.state.code}
                                    onChange={this.getCountryVatCharges}>
                                    {this.state.country.map((item, i) => {
                                      return <MenuItem key={i} value={item.code} selected={item.code == this.state.code}>{item.country}</MenuItem>;
                                    })}
                                  </Select>
                                  <br />Cancel anytime</Typography>
                              </Typography>
                            </Grid>

                            {/* new design end */}





                            {/* <Button variant="raised" color="secondary" onClick={this.becomeStan}>Stan for ${this.state.amount}</Button> */}
                          </div>)
                      }
                      {/* <Select
                        native
                        onChange={this.getCountryVatCharges}>
                        <option value="">Select Country</option>
                        {this.state.country.map((item, i) => {
                          return <option key={i} value={item.country} selected={item.code == this.state.code}>{item.country}</option>;
                        })}
                      </Select>
                      vat will be {this.state.planInfo.amount * this.state.vat / 100} $ */}
                    </div>
                  </CardContent>
                </Grid>
              </Typography>
              {this.state.about &&
                <Typography component="div" className={"stanprofile-about"}>
                  <Typography component="h2">
                    About {this.state.name}
                  </Typography>
                  <Typography component="p">
                    {this.state.about}

                  </Typography>

                </Typography>}
            </Grid>

            {this.state.subscriptionPitch.videourl ? <iframe width="100%" height="487" src={'https://www.youtube.com/embed/' + this.state.videoId} frameBorder="0" allowFullScreen></iframe> : ""}
            {/* <ReactPlayer url='https://www.youtube.com/watch?v=R2YtLjBBLzQ&t=1s' playing /> */}
          </Grid>

          {/**   <Grid item xs={12} className={"stan-user-price"}>
            <Grid className={"stan-price-box"}>

              <h2>     ${this.state.planInfo.amount}    </h2>
              <Typography className={"cancel-stan"} component="p"> Cancel anytime</Typography>
              <Typography>
                Get access to limited content<br />
                Buy exclusive Products<br />
                Receive Broadcast messages<br />
                Discount from the store
          </Typography>

             

            </Grid>
          </Grid>**/}
        </Grid>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={this.state.open}
          onClose={this.handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={this.state.open}>
            <div className={"stanprofile-paper"}>
              <img src="../dist/svg_icons/confetti.svg" className={"stanprofile-img"} />
              <Typography variant="h1" component="h1" className={classes.hconfirmationtitle}>THANK YOU </Typography>
              <Typography component="div" className={classes.close1}> <i className={"fal fa-times"} onClick={this.handleClose}></i> </Typography>
              <Typography component="div" className={classes.parasection}>
                <Typography variant="p" component="p" className={"hurray_txt"}>
                  You are now {this.state.name} stan and have access to their premium content
						 </Typography>
                <Link to={"/profile/" + this.state.username} className={"Primary_btn_blk"}>Go to profile</Link>
                <Typography component="div" className={classes.btnsection}>
                </Typography>
                {/**
						<Button variant="raised" color="secondary" onClick={props.onStanChange}>No,Go Back</Button>
								   <Button variant="raised" color="secondary" onClick={handleClose}>Yes,Cancel</Button>**/}
              </Typography>

            </div>

          </Fade>
        </Modal>
      </Grid>


    )
  }
}
Stanprofile.propTypes = {
  classes: PropTypes.object.isRequired
}
export default withStyles(styles)(Stanprofile)
