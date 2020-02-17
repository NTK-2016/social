import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Post from "./Post";
import Grid from "material-ui/Grid";
import Card, { CardActions, CardContent } from "material-ui/Card";
import Typography from "material-ui/Typography";
import { Link } from "react-router-dom";
import Button from "material-ui/Button";
import auth from "./../auth/auth-helper";
import CustomLoader from "./../common/CustomLoader";
import CustomButton from "./../common/CustomButton";

const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

class PostList extends Component {
  //  constructor(props) {
  //   super(props);
  //   this.state = {
  //       popanchor:null,
  //       popopen:false,
  //       id:undefined,
  //       pid:undefined
  //     }
  //   //this.handleClose = this.handleClose.bind(this);
  // }

  state = {
    openid: "",
    popanchor: null,
    popopen: false,
    id: undefined,
    pid: undefined,
    share: false,
    blank: true,
    abc: "",
    audiostate: "",
    play: true,
    pause: false,
    playing: false,
    loader: true
  };

  componentDidMount() {
  }

  componentDidUpdate() {
    console.log()
  }


  componentWillReceiveProps = props => {
    // sleep(1000).then(() => {

    // })
    // if (this.props.posts.length > 0) {
    //   this.setState({ loader: false })
    // }
    // console.log("called")
    // if (this.props.posts.length >= 0 && !this.props.postloader) {
    //   console.log("called 1")
    //   this.setState({ loader: false })
    // }
  };

  // componentWillUnmount() {
  //   window.removeEventListener('mousedown', this.handleClose);
  // }
  checkingPlay = playId => {
    if (this.state.abc != "") {
      this.state.abc.pause();
      // this.state.audiostate.play = false
      // this.state.audiostate.pause = true
      // this.state.audiostate.playing = false
      this.setState({ abc: playId, play: false, pause: true, playing: true });
      setTimeout(() => {
        console.log("returned");
      }, 1000);
    } else {
      console.log("first");
      this.setState({ abc: playId, play: false, pause: true, playing: true });
      setTimeout(() => {
        console.log("returned");
      }, 1000);
      console.log("a first");
    }
  };

  handleMore = (event, openid) => {
    console.log("popopen" + this.state.popopen);
    if (this.state.popopen) {
      this.setState({
        openid: openid,
        popanchor: event.currentTarget,
        popopen: true,
        pid: "simple-popper"
      });
      // console.log("openid"+openid)
      // this.setState({openid: openid})
      // this.setState({popanchor: event.currentTarget})
      // this.setState({popopen: true})
      // //this.setState({id: 'simple-popover'})
      // this.setState({pid: 'simple-popper'})
    } else {
      this.setState({ openid: openid });
      this.setState({ popanchor: event.currentTarget });
      this.setState({ popopen: true });
      //this.setState({id: 'simple-popover'})
      this.setState({ pid: "simple-popper" });
    }
  };

  handleClose = event => {
    //console.log("popanchor"+this.state.popanchor)
    if (
      this.state.popanchor.current &&
      this.state.popanchor.current.contains(event.target)
    ) {
      return;
    }
    this.setState({ openid: "" });
    this.setState({ popanchor: null });
    this.setState({ popopen: false });
    // this.setState({id: undefined})
    this.setState({ pid: undefined });
    this.setState({ share: false });

    // this.setState({openid: openid})
    // this.setState({popanchor: event.currentTarget})
    // this.setState({popopen: true})
    // //this.setState({id: 'simple-popover'})
    // this.setState({pid: 'simple-popper'})
  };

  handleClosee = event => { };

  showShare = () => {
    this.setState({ share: true });
  };

  updateComments = comments => {
    this.props.posts["comments"] = comments;
    //console.log(this.props.posts['comments'])
  };
  removeBlank = () => {
    this.setState({ blank: false });
  };

  render() {
    // console.log(this.props.posts['comments'])
    //console.log(this.props.posts);
    return (
      <div className={"profilepost-div"}>
        {
          this.props.postloader &&
          <CustomLoader customclass={"loader_bottom"} width={30} height={30} />
        }
        {this.props.posts.length > 0 && !this.props.postloader && (
          <Grid>
            {this.props.posts.map((item, i) => {
              var matches = "";
              if (item.text) matches = item.text.match(/\bhttps?:\/\/\S+/gi);

              let arr = [];
              if (item.categories) arr = item.categories.split(",");

              let attach = [];
              if (item.attach) attach = item.attach.split(",");
              attach = attach.filter(Boolean);
              var viewpost = true
              // if (item.postedBy.stan = null && typeof item.postedBy.stan != "undefined") {
              //   if (item.viewtype == "stans" && item.postname == "thought") {
              //     viewpost = false;
              //   }
              // }
              if (typeof item.postedBy.stan == "undefined" && item.viewtype == "stans" && item.postname == "thought") viewpost = false
              if (item.postedBy._id === auth.isAuthenticated().user._id) viewpost = true

              if (viewpost) {
                return (
                  <Post
                    post={item}
                    key={i}
                    popid={i}
                    onRemove={this.props.removeUpdate}
                    categories={arr}
                    attach={attach}
                    updateComments={this.updateComments}
                    matches={matches}
                    checkingPlay={this.checkingPlay}
                    {...this.state}
                    top={this.props.top}
                  />
                );
              }
              else {
                return ''
              }
            })}
          </Grid>
        )}
        {this.props.posts.length == 0 && this.props.name != "profile" && !this.props.postloader &&
          (
            <div className={"blank-post"}>
              {/**<div className={"blank-post-close"}>
                <i className={"fal fa-times"} onClick={this.removeBlank}></i>
				</div>**/}

              <div>
                <Typography component="p">
                  It looks a bit empty! Follow other people to see their posts here.
                </Typography>

                {/**<CardContent className={"blank-post-profile"}>
                  <Grid>
                    <Link to="/createpost" className={"profile-post-link"}>
                      {/** <Button color="primary" autoFocus="autoFocus" variant="raised">
                      Create
				  </Button>
                      <CustomButton label="Create" className={"Primary_btn"} />
                      Create
                    </Link>
                  </Grid>
                </CardContent>**/}
              </div>
            </div>
          )}
        {
          this.props.posts.length == 0 && this.props.name == "profile" && !this.props.postloader && this.props.username != auth.isAuthenticated().user.username &&
          this.props.userId != auth.isAuthenticated().user._id &&
          <div className={"blank-post-yet"}>
            <div>
              <Typography component="p" className={"para-sixteen"}><span className={"text-capital"}>{this.props.username} </span>has not posted anything yet </Typography>
            </div>
          </div>
        }
        {
          this.props.posts.length == 0 && this.props.name == "profile" && !this.props.postloader && this.props.username == auth.isAuthenticated().user.username &&
          <div className={"blank-post-yet"}>
            <div>
              <Typography component="p" className={"para-sixteen"}>It looks empty! Create your first post</Typography>
            </div>
          </div>
        }

        {/* {this.props.posts.length == 0 && !this.state.loader &&
          this.props.userId != auth.isAuthenticated().user._id ? (
            <div className={"blank-post-yet"}>
              <div>
                <Typography component="p" className={"para-sixteen"}><span className={"text-capital"}>{this.props.username} </span>has not posted anything yet </Typography>
              </div>
            </div>
          ) :
          (this.props.posts.length == 0 && this.props.name == "profile" && !this.state.loader) && (
            <div className={"blank-post-yet"}>
              <div>
                <Typography component="p" className={"para-sixteen"}>It looks empty! Create your first post</Typography>
              </div>
            </div>
          )

        } */}
      </div>
    );
  }
}
PostList.propTypes = {
  posts: PropTypes.array.isRequired
  //removeUpdate: PropTypes.func.isRequired
};
export default PostList;
