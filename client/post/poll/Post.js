import React, { Component } from 'react'
import auth from './../../auth/auth-helper'
import Typography from 'material-ui/Typography'
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import PropTypes from 'prop-types'
import { lighten, withStyles } from '@material-ui/core/styles';
import { poll } from './../api-post.js'
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const BorderLinearProgress = withStyles({
  root: {
    height: 37,

  },
  bar: {
    borderRadius: 4,

    color: '#fff',
  },
})(LinearProgress);

const styles = theme => ({

})


class Post extends Component {
  state = {
    poll: [],
    option: '',
    total1: 0,
    total2: 0,
    total3: 0,
    total4: 0,
  }

  componentDidMount = () => {
    this.postData = new FormData()
    if (this.props.post.polled != '') {
      this.setState({ option: this.checkPoll(this.props.post.polled) })
    }
  }

  checkPoll = (polls) => {
    // console.log(polls) // submitted by all user
    const jwt = auth.isAuthenticated()
    var totalpolled = polls.length
    var myoption = ''
    var polled = []
    for (var i = 0; i < totalpolled; i++) {
      if (polls[i].postedBy == jwt.user._id) {
        myoption = polls[i].option
      }
      else {
        console.log("not found")
      }
      polled.push(polls[i].option) // option chossed by all person
    }
    const result = Object.values(this.props.post.options) // options given by creator
    var counter = result.length
    var totaloptions = 0

    var uniqueNames = []//this.getUnique(polled)
    polled.sort();
    var current = null;
    var cnt = 0;
    var totaloptionpolled = []
    for (var i = 0; i <= polled.length; i++) {
      if (polled[i] != current) {
        if (cnt > 0) {
          totaloptionpolled.push(cnt)
          uniqueNames.push(current)
          //document.write(current + ' comes --> ' + cnt + ' times<br>');
        }
        current = polled[i];
        cnt = 1;
      } else {
        cnt++;
      }
    }
    for (var i = 0; i < counter; i++) {
      if (result[i] != "") {
        totaloptions++
      }
    }
    var index = ''
    if (this.postData.get('option') != null || myoption != '') {
      var one = 0;
      var two = 0;
      var three = 0;
      var four = 0;
      for (var i = 0; i < totaloptions; i++) {
        if (uniqueNames[i]) {
          one = (uniqueNames[i] == "option1" && one == 0) ? (totaloptionpolled[i] / totalpolled * 100) : one
          two = (uniqueNames[i] == "option2" && two == 0) ? (totaloptionpolled[i] / totalpolled * 100) : two
          three = (uniqueNames[i] == "option3" && three == 0) ? (totaloptionpolled[i] / totalpolled * 100) : three
          four = (uniqueNames[i] == "option4" && four == 0) ? (totaloptionpolled[i] / totalpolled * 100) : four
        }
        // var optionresult = totaloptionpolled[i] / totalpolled * 100
        // optionresult = Math.round(optionresult);
        // optionresult > 0 ? optionresult : 0
        // console.log(optionresult)
        // if (result.includes(uniqueNames[i])) {
        //   index = result.indexOf(uniqueNames[i])
        // }
        // if (optionresult && index == 0)
        //   this.setState({ total1: optionresult })
        // if (optionresult && index == 1)
        //   this.setState({ total2: optionresult })
        // if (optionresult && index == 2)
        //   this.setState({ total3: optionresult })
        // if (optionresult && index == 3)
        //   this.setState({ total4: optionresult })
      }
      this.setState({ total1: one, total2: two, total3: three, total4: four })
    }
    return myoption
  }


  handlePollChange = name => event => {

    const value = event.target.value
    this.postData.set('option', value)
    this.setState({ option: value })
    setTimeout(function () {
      this.submitPoll()
    }.bind(this), 100)
    var json = { option: value }
    this.props.post.polled.push(json)
    this.checkPoll(this.props.post.polled)
  }


  submitPoll = () => {
    const jwt = auth.isAuthenticated()
    poll({
      userId: jwt.user._id
    },
      {
        t: jwt.token
      }, this.props.post._id, { option: this.state.option }).then((data) => {
        if (data.error) {
          this.setState({ error: data.error })
        }
        else {
          console.log("done")
        }
      })
  }

  render() {
    const { classes } = this.props
    var postId = this.props.post._id
    var disable = this.state.total1 > 0 ? true : (this.state.total2 > 0 ? true : (this.state.total3 > 0 ? true : (this.state.total4 > 0 ? true : false)))
    return (
      <div>

        <div className={disable ? "poll-radio-btn disable-poll" : "poll-radio-btn"}>
          {this.props.post.text &&
            <Typography component="h1" className={"post-title-header"}>
              {this.props.post.text}
            </Typography>}
          <RadioGroup
            aria-label="gender"
            name="gender1"
            value={this.state.viewtype}
            onChange={this.handlePollChange("poll")}
          >
            {this.props.post.options.option1 &&
              <div className={"poll-input"}>
                <FormControlLabel
                  value="option1"
                  control={<Radio />}
                  className={"poll-input"}
                  checked={this.state.option == "option1"} disabled={this.state.option != ''}
                />
                <Typography component="div" className={this.state.total1 > 0 ? "poll-progress voted" : 'poll-progress'}>
                  <BorderLinearProgress
                    className={"pro_line"}
                    variant="determinate"

                    value={this.state.total1.toFixed(2)} />
                  <Typography component="span"> {this.props.post.options.option1} </Typography>
                </Typography>
                <p className={"poll-state"}>{this.state.total1.toFixed(2)} %</p>
              </div>
            }
            {this.props.post.options.option2 &&
              <div className={"poll-input"}>
                <FormControlLabel
                  value="option2"
                  control={<Radio />}

                  className={"poll-input"}
                  checked={this.state.option == "option2"} disabled={this.state.option != ''}
                />
                <Typography component="div" className={this.state.total2 > 0 ? "poll-progress voted" : 'poll-progress'}>
                  <BorderLinearProgress
                    className={"pro_line"}
                    variant="determinate"

                    value={this.state.total2.toFixed(2)} />
                  <Typography component="span">{this.props.post.options.option2} </Typography>
                </Typography>
                <p className={"poll-state"}>{this.state.total2.toFixed(2)} %</p>
              </div>
            }
            {this.props.post.options.option3 &&
              <div className={"poll-input"}>
                <FormControlLabel
                  value="option3"
                  control={<Radio />}
                  className={"poll-input"}

                  checked={this.state.option == "option3"} disabled={this.state.option != ''}
                />
                <Typography component="div" className={this.state.total3 > 0 ? "poll-progress voted" : 'poll-progress'}>
                  <BorderLinearProgress
                    className={"pro_line"}
                    variant="determinate"

                    value={this.state.total3.toFixed(2)} />
                  <Typography component="span"> {this.props.post.options.option3}</Typography> </Typography>
                <p className={"poll-state"}>{this.state.total3.toFixed(2)} %</p>
              </div>}
            {this.props.post.options.option4 &&
              <div className={"poll-input"}>
                <FormControlLabel
                  value="option4"
                  control={<Radio />}
                  className={"poll-input"}

                  checked={this.state.option == "option4"} disabled={this.state.option != ''}
                />
                <Typography component="div" className={this.state.total4 > 0 ? "poll-progress voted" : 'poll-progress'}>
                  <BorderLinearProgress
                    className={"pro_line"}
                    variant="determinate"

                    value={this.state.total4.toFixed(2)} />
                  <Typography component="span"> 	{this.props.post.options.option4}</Typography></Typography>
                <p className={"poll-state"}>{this.state.total4.toFixed(2)} %</p>
              </div>
            }
          </RadioGroup>

          {/** <Typography component="div" className={classes.text}>
            <div className={"poll-input"}>
              <input type="radio" value="option1" fullWidth
                checked={this.state.option == "option1"} disabled={this.state.option != ''}
                onChange={this.handlePollChange('poll')} />
              <Typography component="div" className={this.state.total1 > 0 ? "poll-progress voted" : 'poll-progress'}>
                <BorderLinearProgress
                  className={"pro_line"}
                  variant="determinate"

                  value={this.state.total1} />
                <Typography component="span"> {this.props.post.options.option1} </Typography>
              </Typography>
              <p className={"poll-state"}>{this.state.total1} %</p>
            </div>

          </Typography>
          <Typography component="div" className={classes.text}>
            <div className={"poll-input"}>
              <input type="radio" value="option2" fullWidth
                checked={this.state.option == "option2"} disabled={this.state.option != ''}
                onChange={this.handlePollChange('poll')} />
              <Typography component="div" className={this.state.total2 > 0 ? "poll-progress voted" : 'poll-progress'}>
                <BorderLinearProgress
                  className={"pro_line"}
                  variant="determinate"

                  value={this.state.total2} />
                <Typography component="span">{this.props.post.options.option2} </Typography>
              </Typography>
              <p className={"poll-state"}>{this.state.total2} %</p>
            </div>

          </Typography>
          {this.props.post.options.option3 &&
            <Typography component="div" className={classes.text}>
              <div className={"poll-input"}>
                <input type="radio" value="option3" fullWidth
                  checked={this.state.option == "option3"} disabled={this.state.option != ''}
                  onChange={this.handlePollChange('poll')} /><Typography component="div" className={this.state.total3 > 0 ? "poll-progress voted" : 'poll-progress'}>
                  <BorderLinearProgress
                    className={"pro_line"}
                    variant="determinate"

                    value={this.state.total3} />
                  <Typography component="span"> {this.props.post.options.option3}</Typography> </Typography>
                <p className={"poll-state"}>{this.state.total3} %</p>
              </div>

            </Typography>}
          {this.props.post.options.option4 &&
            <Typography component="div" className={classes.text}>
              <div className={"poll-input"}>
                <input type="radio" value="option4" fullWidth
                  checked={this.state.option == "option4"} disabled={this.state.option != ''}
                  onChange={this.handlePollChange('poll')} /> <Typography component="div" className={this.state.total4 > 0 ? "poll-progress voted" : 'poll-progress'}>
                  <BorderLinearProgress
                    className={"pro_line"}
                    variant="determinate"

                    value={this.state.total4} />
                  <Typography component="span"> 	{this.props.post.options.option4}</Typography></Typography>
                <p className={"poll-state"}>{this.state.total4} %</p>
              </div>

		  </Typography>}**/}
        </div>
      </div>

    )
  }
}

Post.propTypes = {
  classes: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
}

export default withStyles(styles)(Post)
