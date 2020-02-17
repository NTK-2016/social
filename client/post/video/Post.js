import React, { Component } from 'react'
import auth from './../../auth/auth-helper'
import Typography from 'material-ui/Typography'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import { Link } from 'react-router-dom'
import Preview from "../../common/Preview"
import config from "../../../config/config";
const styles = theme => ({
  cardContent: {
    backgroundColor: 'white',
    padding: `${theme.spacing.unit * 2}px 0px`
  },
  text: {
    margin: theme.spacing.unit * 2
  },
  media: {
    height: 200
  },
  button: {
    margin: theme.spacing.unit,
  }
})
class Post extends Component {
  state = {
    preview: '',
    read: true,
    hide: false,
    show: false,
  }

  //const preview = ''
  preview = (res) => {
    console.log(res)
    this.setState({ preview: res })
    console.log(this.state.preview.items[0].snippet.thumbnails.default.url);
  }

  componentDidMount = () => {
    /*var videoUrl = this.props.post.url
              
    let VID_REGEX = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    var ytApiKey = "AIzaSyCkh0ZkPVFfbR9rkQPSQCRhIrIVaqukB3Q";
    var videoId = videoUrl.match(VID_REGEX)[1];
   
    jQuery.get("https://www.googleapis.com/youtube/v3/videos?fields=items(id,snippet(title,description,thumbnails))&part=snippet&id=" + videoId + "&key=" + ytApiKey, 
      this.preview);  */
  }

  render() {
    const { classes } = this.props
    var postId = this.props.post._id
    var videoUrl = this.props.post.url
    if (this.props.post.url.includes("youtube") || this.props.post.url.includes("vimeo")) {
      let VID_REGEX = /(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/;
      var videoId = videoUrl.match(VID_REGEX);
      if (videoId) {
        videoId = videoId[6]
        console.log(videoId)
      }
      else {
        videoId = ''
      }
    }
    return (
      <div className={"video-postnew"}>
        <div className={"new-post-video"}>
          {this.props.post.text && <div className={"post-image-text"}>
            <Typography component="h1" className={"post-title-header"}>
              {this.props.post.text}
            </Typography>
          </div>}
          {this.props.post.subheading && <div className={"post-image-subtext"}>
            <Typography component="p" className={"post-text"}>
              {!this.props.read && this.props.post.subheading.substring(0, 300)}
              {!this.props.read && this.state.show && this.props.post.subheading.substring(300)}
              {!this.props.read && this.state.read && this.props.post.subheading.length > 300 && <span><span>...&nbsp;</span><Link to={'/post/' + this.props.post._id}>Read more</Link></span>}
              {!this.props.read && this.state.hide && <a onClick={this.LessText}>Read Less</a>}
              {this.props.read && this.props.post.subheading}
              {/* {this.props.post.subheading.substring(0, 300)}
              {this.props.post.subheading.length > 300 && <span><span>...&nbsp;</span><Link to={'/post/' + this.props.post._id}>Read more</Link></span>} */}
            </Typography>
          </div>}
          {/* <div className={classes.photo}>
            <Preview url={this.props.post.url} />

          </div> */}
        </div>
        {this.props.post.url && !this.props.post.video &&
          <div className={"youtubevideo"}>

            {this.props.post.url && this.props.post.url.includes("youtube") &&
              <div className={"videoWrapper"}>
                <iframe src={'https://www.youtube.com/embed/' + videoId}></iframe>
              </div>}
            {this.props.post.url && this.props.post.url.includes("vimeo") &&
              <div className={"videoWrapper"}>
                <iframe src={"https://player.vimeo.com/video/" + videoId}></iframe>
              </div>}
            {this.props.post.url && !this.props.post.url.includes("youtube") && !this.props.post.url.includes("vimeo") &&
              <div className={"video-controls"}>
                <video controls controlsList="nodownload" className={"video-second"}>
                  <source src={this.props.post.url} type="video/mp4" />
                  Your browser does not support HTML5 video.
            </video>
              </div>
            }

          </div>

        }
        {this.props.post.url && this.props.post.video &&
          <div className={"video-controls"}>

            <video controls controlsList="nodownload" className={"video-second"} poster={config.videoThumbnailBucketURL + postId + "_1.jpg"}>
              <source src={this.props.post.url} type="video/mp4" />
              Your browser does not support HTML5 video.
            </video>
            {/* /* <iframe src={this.props.post.url}></iframe> */}


          </div>
        }




      </div>
    )
  }
}

Post.propTypes = {
  classes: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
}

export default withStyles(styles)(Post)
