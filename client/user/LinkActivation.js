import React, {Component} from 'react'
import Card, {CardActions, CardContent} from 'material-ui/Card'
import Button from 'material-ui/Button'
import Icon from 'material-ui/Icon'
import Typography from 'material-ui/Typography'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import {Link} from 'react-router-dom'
import {activatelink} from './api-user.js'
import CustomButton from "./../common/CustomButton";

const styles = theme => ({
  card: {
    maxWidth: "400px",
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing.unit * 5,
    padding:"20px",
	borderRadius:"8px 8px 0 0",
	justifyContent: "center",
    display:"flex",
	boxShadow:'none',
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
    width: "300",
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing.unit * 2
  },
  text:
  {
    color:"#000",
      textAlign:"center",
      margin:"0px 0px 25px 0px",
      fontSize:"18px",
	  fontWeight:"normal",
      fontFamily:"Helvetica"
  }
})

class LinkActivation extends Component {
    constructor({match}) {
        super()
        this.state = {
            status: 1,
            token: Math.floor(Math.random(100) * 1000000000)+new Date().getTime(),
            error: '',
            
          }
        this.match = match
      }
  componentDidMount = () => 
   {
       const user = {
       token : this.state.token || undefined
       }
       activatelink({
        userId: this.match.params.userId
        },user).then((data) => {
            if (data.error) {
            this.setState({error: data.error})
            } 
        })

  }
  

  render() {
    const {classes} = this.props
    return (<section className={"successfully_activated"}>
      <Card className={classes.card} >
        <CardActions>
            <Typography component="div" className={"link-activation"}>  
            <Typography  component="h2" className={classes.text}>
              <Icon className={"material-icons"}>done</Icon>
                Your account is successfully activated.
                </Typography>
                    <Link to="/signin">
					{/** <Button color="primary"  variant="raised">
                    Sign In
                    </Button>**/}
					 <CustomButton
                    label="Sign In"
                  
                    className={"Primary_btn_blk"}
                  />
                </Link>
            </Typography>
        </CardActions>
      </Card>
    </section>)
  }
}

LinkActivation.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(LinkActivation)
