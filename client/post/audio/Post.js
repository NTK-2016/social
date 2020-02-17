import React, { Component } from 'react'
import auth from './../../auth/auth-helper'
import Typography from 'material-ui/Typography'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Preview from "../../common/Preview"
import { Link } from 'react-router-dom'
import config from "../../../config/config";

const styles = theme => ({

  media: {
    height: 200
  },

})


//var audio+"" +this.props.post._id
let intervalID = 0
class Post extends Component {

  state = {
    play: this.props.play,
    pause: this.props.pause,
    playing: this.props.playing,
    playingId: '',
    audio: '',
    width: 0,
    duration: "0:00",
    read: true,
    hide: false,
    show: false,
  }


  startAudio = (playingId) => {

    clearInterval(intervalID);
    if (!this.state.playing) {
      let currentaudio = new Audio(config.audioBucketURL + this.props.post.audio);
      this.props.checkPlay(currentaudio)
      this.setState({ audio: currentaudio, width: '0%', duration: '0:00', playing: true, playingId: playingId, playing: true })
      setTimeout(() => {
        this.playAudio();
      }, 1000);
    }
    else {
      this.props.checkPlay(this.state.audio)
      this.playAudio();
    }
  }

  componentDidMount = () => {
    // audio = new Audio('/dist/uploads/audios/' + this.props.post.audio);
  }

  playAudio = () => {
    this.state.audio.play();

    // this.setState({ play: false, pause: true })
    this.showDuration();
  }


  pauseAudio = () => {
    this.state.audio.pause();
    clearInterval(intervalID);
    //this.setState({ play: true, pause: false })
  }

  volumeAudio = () => {
    this.state.audio.volume = parseFloat(4 / 10);
  }

  showDuration = () => {

    intervalID = setInterval(() => {
      var s = parseInt(this.state.audio.currentTime % 60);
      var m = parseInt(this.state.audio.currentTime / 60) % 60;
      if (s < 10) {
        s = '0' + s;
      }
      var value = 0;
      if (this.state.audio.currentTime > 0) {
        value = Math.floor((100 / this.state.audio.duration) * this.state.audio.currentTime);
      }
      this.setState({ width: value + '%', duration: m + ':' + s })
      if (this.state.audio.currentTime == this.state.audio.duration) {
        clearInterval(intervalID);
      }
    }, 1000);

  }
  // componentWillReceiveProps = (props) => {
  //   this.setState({ audio: props.post.audio })
  // }

  render() {
    const { classes } = this.props
    var postId = this.props.post._id
    return (
      <div>

        <div className={"audio-post"}>

          {this.props.post.text && <div className={"post-image-text"}>
            <Typography component="h1" className={"post-title-header"}>
              {this.props.post.text}
            </Typography>
          </div>}
          {this.props.post.subheading && <div className={"post-image-subtext"}>
            <Typography component="div" className={"post-text"}>
              {!this.props.read && this.props.post.subheading.substring(0, 300)}
              {!this.props.read && this.state.show && this.props.post.subheading.substring(300)}
              {!this.props.read && this.state.read && this.props.post.subheading.length > 300 && <span><span>...&nbsp;</span><Link to={'/post/' + this.props.post._id}>Read more</Link></span>}
              {!this.props.read && this.state.hide && <a onClick={this.LessText}>Read Less</a>}
              {this.props.read && this.props.post.subheading}


              {/* {this.props.post.subheading.substring(0, 300)}
              {this.props.post.subheading.length > 300 && <span><span>...&nbsp;</span><Link to={'/post/' + this.props.post._id}>Read more</Link></span>} */}
            </Typography>
          </div>}
        </div>


        {/* audio starts here
          <div className="audioplay-custom">
            <div id="audio-player">

              <div className="audio-customization">
                <div id="buttons">
                  <span>
                    {this.state.play &&
                      <button id="play" onClick={() => this.startAudio(this.props.post._id)}></button>}
                    {this.state.pause &&
                      <button id="pause" onClick={this.pauseAudio}></button>}

                  </span>
                </div>
                <div className="playlist">
                  <div id="audio-info">
                    <p><span className="artist"></span> </p>
                    <p> <span className="title"></span></p>
                  </div>
                  <div id="tracker">
                    <div id="progress-bar"> <span id="progress" style={{ width: this.state.width }}></span> </div>
                    <span className="audio-duration" id="duration">{this.state.duration}</span>
                  </div>
                </div>
              </div>
              {this.state.pause &&
                <input id="volume" type="range" min="0" max="10" value="4" onChange={this.volumeAudio}></input>
              }
            </div>
            <ul id="playlist" className="hidden">
              <li song={this.props.post.audio} cover="cover1.jpg" artist="Title of the Song">{this.props.post.audio}</li>
            </ul>
          </div>
          {/* audio end here */}


        {this.props.post.photo &&
          <div className={"post-photo post-img-sec"}>
            <img
              className={classes.media}
              src={config.photoBucketURL + this.props.post.photo}
            />
          </div>
        }
        {
          !this.props.post.url &&
          <audio controls className={"audio-post-inner"} controlsList="nodownload">
            <source src={this.props.post.url ? this.props.post.url : config.audioBucketURL + this.props.post.audio} type="audio/mpeg" />
            Your browser does not support the audio element.
                  </audio>
        }
        {this.props.post.url && this.props.post.url.includes("soundcloud") && <div className={"youtubevideo"}>
          <div className={"videoWrapper"}>
            {
              this.props.post.url && !this.props.post.url.includes("soundcloud") &&
              <Preview url={this.props.post.url} />
            }
            {this.props.post.url && this.props.post.url.includes("soundcloud") &&
              <iframe width="100%" height="100" scrolling="no" frameborder="no" allow="autoplay"
                src={"https://w.soundcloud.com/player/?url=" + this.props.post.url + "&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"}>
              </iframe>}
          </div>
        </div>}
      </div>
    )
  }
}

Post.propTypes = {
  classes: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired
}

export default withStyles(styles)(Post)
