import React, { Component } from 'react'
import auth from './../auth/auth-helper'
import Card, { CardHeader, CardContent, CardActions } from 'material-ui/Card'
import Typography from 'material-ui/Typography'
import Avatar from 'material-ui/Avatar'
import IconButton from 'material-ui/IconButton'
import DeleteIcon from 'material-ui-icons/Delete'
import FavoriteIcon from 'material-ui-icons/Favorite'
import FavoriteBorderIcon from 'material-ui-icons/FavoriteBorder'
import CommentIcon from 'material-ui-icons/Comment'
import AttachMoney from 'material-ui-icons/AttachMoney'
import MoreHoriz from 'material-ui-icons/MoreHoriz'
import Divider from 'material-ui/Divider'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import { Link } from 'react-router-dom'
import { remove, like, unlike, poll } from './api-post.js'
import Comments from './Comments'
import Grid from '@material-ui/core/Grid';
import Preview from './../common/Preview'
import Button from 'material-ui/Button'
import Popover from '@material-ui/core/Popover';
import AttachFile from 'material-ui-icons/AttachFile'
import OwlCarousel from 'react-owl-carousel2';
import Popper from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import DeletePost from './DeletePost'
import { FacebookShareButton, FacebookIcon, TwitterShareButton, TwitterIcon } from 'react-share';
import Snackbar from 'material-ui/Snackbar'
import ReportPost from "./ReportPost";
import { SITE_URL } from '../common/Constants';
import config from "../../config/config";

const styles = theme => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    marginBottom: theme.spacing.unit * 3,
    backgroundColor: 'rgba(0, 0, 0, 0.06)'
  },
  cardContent: {
    backgroundColor: 'white',
    padding: `${theme.spacing.unit * 2}px 0px`
  },
  cardHeader: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit
  },
  text: {
    margin: theme.spacing.unit * 2
  },
  photo: {
    textAlign: 'center',
    backgroundColor: '#f2f5f4',
    padding: theme.spacing.unit
  },
  media: {
    height: 200
  },
  button: {
    margin: theme.spacing.unit,
  },
  pop_positon: {
    marginTop: "7px",
  },

})

const options = {
  margin: 32,
  items: 3,
  nav: true,
  rewind: true,
  autoplay: true,
  loop: true,
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

// const [anchorEl, setAnchorEl] = '';//React.useState(null);

// function handleClick(event) {
//   setAnchorEl(event.currentTarget);
// }

// function handleClose() {
//   setAnchorEl(null);
// }

// const open = Boolean(anchorEl);
// const id = open ? 'simple-popover' : undefined;

class Product extends Component {
  state = {
    openid: '',
    popanchor: null,
    popopen: false,
    id: undefined,
    pid: undefined,
    share: false,
    deleteClick: false,
    isReported: false
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


  onReport = () => {
    this.setState({ isReported: true })
  }

  handleMore = (event, openid) => {
    if (this.state.popopen) {
      this.setState({
        openid: openid,
        popanchor: event.currentTarget,
        popopen: true,
        pid: 'simple-popper',
      })
    }
    else {
      this.setState({ openid: openid, popanchor: event.currentTarget, popopen: true, pid: 'simple-popper' })
    }
  }

  handleClose = (event) => {
    if (this.state.popanchor.current && this.state.popanchor.current.contains(event.target)) {
      return;
    }
    if (!this.state.deleteClick) {
      this.setState({
        openid: -1
      })

    }
    this.setState({ deleteClick: false })
  }

  handleClosee = (event) => {
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

  componentDidMount = () => {
    if (this.props.post.report.length > 0) {
      this.props.post.report.map((item, i) => {
        if (item == auth.isAuthenticated().user._id) {
          this.setState({ isReported: true })
        }
      })
    }
  };



  render() {
    const { classes } = this.props
    var postId = this.props.post._id
    const shareUrl = SITE_URL + 'productdetails/' + postId;
    return (

      <Grid item xs={12} sm={6} md={6} className={"shop-inner-grid post-grid-bottom_shop"}>
        <Card className={"shop-post-grid"}>
          {/* <CardHeader */
            /**action={*/
              //this.props.post.postedBy._id === auth.isAuthenticated().user._id &&
              //onClick={handleClick}
              // <div className={"post-share-head"}>
              //   <IconButton onClick={(e) => this.handleMore(e, this.props.popid)}>
              //     <MoreHoriz aria-describedby={this.state.pid} variant="contained" />
              //   </IconButton>
              //   <Popper
              //     id={this.state.pid}
              //     open={this.state.openid === this.props.popid}
              //     anchorEl={this.state.popanchor}
              //     placement={'bottom-end'}
              //     className={classes.pop_positon}
              //     transition>
              //     {({ TransitionProps }) => (
              //       <Fade {...TransitionProps} timeout={350}>
              //         <Paper className={"post-menu"}>
              //           <ClickAwayListener onClickAway={this.handleClose}>
              //             <MenuList>
                            /* <MenuItem onClick={this.showShare}>Share</MenuItem> */
                            /*postId*/
                            /* {this.state.share && ( */
                            /* <MenuItem className={"post-share"}>
                              <FacebookShareButton
                                url={shareUrl}
                                quote={this.props.post.text}
                                className="Demo__some-network__share-button">
                                <FacebookIcon
                                  size={32}
                                  round />
                              </FacebookShareButton>
                              <TwitterShareButton
                                url={shareUrl}
                                title={this.props.post.text}
                                className="Demo__some-network__share-button">
                                <TwitterIcon
                                  size={32}
                                  round />
                              </TwitterShareButton>
                            </MenuItem> */}
          {/* )} */}
          {/* <MenuItem onClick={() => this.copyToClipboard(postId)}>Copy Link</MenuItem>
                            {this.props.post.postedBy._id !=
                              auth.isAuthenticated().user._id && !this.state.isReported &&
                              <MenuItem onClick={this.reportClick}>
                                <ReportPost
                                  postId={postId}
                                  onReport={this.onReport}
                                  type="Product"
                                />
                              </MenuItem>
                            }

                          </MenuList>
                        </ClickAwayListener>

                        {this.props.post.postedBy._id == auth.isAuthenticated().user._id &&
                          <ClickAwayListener onClickAway={this.handleClosee}>
                            <MenuList>
                              {this.props.post.postname != 'thought' &&
                                <MenuItem><Link to={"/" + this.props.post.postname + "edit/" + postId}>Edit</Link></MenuItem>}
                              <MenuItem onClick={this.deleteClick}>
                                <DeletePost
                                  postId={postId}
                                  post={this.props.post}
                                  onProductDelete={this.props.onProductRemove}
                                  display="text" type="product" />
                              </MenuItem>
                            </MenuList>
                          </ClickAwayListener>
                        }
                      </Paper>
                    </Fade>
                  )}
                </Popper>
              </div>
            } */}

          {/* //subheader={(new Date(this.props.post.created)).toDateString()}
          //   className={"post-cardheader"}
          // /> */}

          {((this.props.post.viewtype == "public") || (this.props.post.viewtype == "stans" && this.props.post.postedBy._id === auth.isAuthenticated().user._id)) &&

            <CardContent className={"post-grid-bottom"}>
              <Link to={"/productdetails/" + this.props.post._id}>
                {/*<Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              <Typography className={classes.typography}>The content of the Popover.</Typography>
            </Popover> */}
                {/* photo for all start */}
                {this.props.post.photo &&
                  (<div className={"photo-grid-slider"}>
                    {this.props.productimage.slice(0, 1).map((item, i) => {
                      return <img src={config.productBucketURL + item} />
                    }
                    )}
                    {/* <OwlCarousel ref="car" options={options}>
                      {
                        this.props.productimage.slice(0, 1).map((item, i) => {
                          //  return <img key={i}
                          // className={classes.media}
                          // className={"d"}
                          // src={'/dist/uploads/photos/'+item}
                          // />
                          return <Typography className={"item"} component="div" style={{ backgroundImage: 'url(/dist/uploads/photos/' + item + ')', }}>

                          </Typography>
                        })
                      }


                    </OwlCarousel> */}
                    {/*<img
                  className={classes.media}
                  src={'/dist/uploads/photos/'+this.props.post.photo}
                  />*/}
                  </div>)}
                {/* photo for all end */}

                <Grid container className={"photo-grid-footer"}>
                  <Grid item className={"shop_pro_title"}>
                    {this.props.post.text &&
                      <Typography className={"shop-product-name"} component="h1">
                        {this.props.post.text}
                      </Typography>

                    }
                  </Grid>

                  <Grid item className={"shop_pro_price"}>
                    {this.props.post.price &&
                      <Typography className={"shop-product-price"} component="h1">
                        ${this.props.post.price}
                      </Typography>
                    }</Grid>

                </Grid>

              </Link>
            </CardContent>}
          {this.props.post.viewtype == "stans" && this.props.post.postedBy._id != auth.isAuthenticated().user._id &&
            <CardContent className={classes.cardContent}>
              <Typography component="p" className={classes.text}>
                Unlock this image post by becoming a stan <br />
                <Link to="/create">
                  <Button color="primary" variant="raised">
                    become a stan.me for $5
                              </Button>
                </Link>
              </Typography>
            </CardContent>

          }

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
      </Grid>


    )
  }
}

Product.propTypes = {
  classes: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired
}

export default withStyles(styles)(Product)
