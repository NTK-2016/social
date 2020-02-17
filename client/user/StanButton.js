import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Button from 'material-ui/Button'
import auth from './../auth/auth-helper'
import { read } from './api-user.js'
var subscriber_amount;
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}
class StanButton extends Component {
  constructor(match) {
    super()
    this.state = {
      subscriber: '',
      error: '',
      userId: ''
    }
    this.match = match
  }
  componentDidMount = () => {


    const jwt = auth.isAuthenticated()

    read({
      userId: this.match.userId
    }, { t: jwt.token }).then((data) => {
      if (data.error) {
        this.setState({ error: data.error })
      } else {
        this.setState({ id: data._id, subscriber: data.payment.subscriber })
        subscriber_amount = data.payment.subscriber
      }
    })

  }
  stanClick = () => {
    this.props.onStanButtonClick(stan)
  }
  removeStanClick = () => {
    this.props.onStanButtonClick(unfollow)
  }
  render() {

    return (<div>
      {this.props.stan
        ? (<Button variant="raised" color="secondary" onClick={this.removeStanClick}>Stanned</Button>)
        : (<Button variant="raised" color="primary" onClick={this.stanClick}>Stan ${this.match.userId ? subscriber_amount : 5}</Button>)
      }
    </div>)

  }
}
StanButton.propTypes = {
  stan: PropTypes.bool.isRequired,
  onStanButtonClick: PropTypes.func.isRequired
}
export default StanButton
