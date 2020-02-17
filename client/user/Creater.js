import React, {Component} from 'react'
import Card, {CardActions, CardContent} from 'material-ui/Card'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import TextField from 'material-ui/TextField'
import auth from './../auth/auth-helper'
import {becomecreater} from './api-user.js'
const styles = theme => ({
  card: {
    width:"330px",
 
  },
  error: {
    verticalAlign: 'middle'
  },
  title: {
    marginTop: theme.spacing.unit * 2,
    color: theme.palette.openTitle
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 300
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing.unit * 2
  }
})

class Creater extends Component {
    constructor({props}) {
        super(props)
        this.state = {
            userId: '',
            error: '',
            creater:[],
            status: 1
          }
        this.props = props
      }
  clickSubmit = () => {
    const jwt = auth.isAuthenticated()
    const user = {
      status : this.state.status || undefined
      }
      becomecreater({
        userId: this.props.userId
      },{
        t: jwt.token
      },user).then((data) => {
          if (data.error) {
          this.setState({error: data.error})
          } 
      })
  }
  render() {
    const {classes} = this.props
    return (<div className={classes.card} style={{ width:"300px" }}>
      <Card >
        <CardActions className={classes.card} >
            <Button color="secondary" variant="raised" onClick={this.clickSubmit}>Become creater</Button>
        </CardActions>
      </Card>
    </div>)
  }
}

Creater.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Creater)
