import React, { Component } from 'react'
import Card, { CardActions, CardContent } from 'material-ui/Card'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import Typography from 'material-ui/Typography'
import Icon from 'material-ui/Icon'
import Avatar from 'material-ui/Avatar'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import auth from './../../auth/auth-helper'
import { checkOrder } from './../api-post.js'
import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog'
import { Link } from 'react-router-dom'
import config from "../../../config/config";

const styles = theme => ({
    card: {
        maxWidth: 410,
        margin: 'auto',
        textAlign: 'center',
        marginTop: theme.spacing.unit * 5,
        paddingBottom: theme.spacing.unit * 2,
        boxShadow: 'none',
    },
    title: {
        fontSize: '30px',
        lineHeight: '30px',
        color: '#000',
        fontFamily: 'Helvetica-Bold',
        fontWeight: 'normal',
        paddingBottom: '40px',
    },
    error: {
        verticalAlign: 'middle'
    },

    textField: {
        // marginLeft: theme.spacing.unit,
        // marginRight: theme.spacing.unit,
        width: '100%'
    },
    submit: {
        margin: 'auto',
        marginBottom: theme.spacing.unit * 2
    },
    bigAvatar: {
        width: 60,
        height: 60,
        margin: 'auto'
    },
    input: {
        border: "1px solid #CCCCCC",
        borderRadius: "4px",
        padding: "7px 15px",
        boxSizing: "border-box",
        width: "100%",
        lineHeight: "21px",
        fontSize: "14px",
        fontFamily: "Helvetica",
        fontWeight: "normal",
        height: "42px"
    },
    cardcontent:
    {
        padding: '0px',
    },
    cardaction:
    {
        paddingLeft: '0px',
        paddingRight: '0px',
        paddingTop: '5px',
        paddingBottom: '30px',
    },
    filename: {
        marginLeft: '10px'
    }
})
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

class DownloadDigiFiles extends Component {
    constructor({ match }) {
        super()
        this.state = {
            valid: false,
            success: false,
        }
        this.match = match
    }
    componentDidMount = () => {
        const jwt = auth.isAuthenticated()
        checkOrder({
            value: this.match.params.orderId
        }, { t: jwt.token }).then((data) => {
            if (data) {
                var digitalfiles = data.productid.attach.split(",")
                var link = document.createElement('a');
                link.setAttribute('download', '');
                link.style.display = 'none';
                document.body.appendChild(link);
                for (var i = 0; i < digitalfiles.length; i++) {
                    link.setAttribute('href', config.attachmentBucketURL + digitalfiles[i]);
                    link.click();
                    if (digitalfiles.length == i + 1) {
                    }
                }
                document.body.removeChild(link);
                this.setState({ success: true })
            }
            else {
                this.setState({ valid: true })
            }
        })
    }

    render() {
        const { classes } = this.props
        return (<div>
            {this.state.valid &&
                <Card className={classes.card}>
                    <CardContent className={"invalid_link_txt"}>
                        <Typography type="headline" component="h2"  >
                            Invalid Link
                                </Typography>
                    </CardContent>
                </Card>
            }
            {this.state.success &&
                <Card className={classes.card}>
                    <CardContent className={"invalid_link_txt"}>
                        <Typography type="headline" component="span" className={"success_txt"}>
                            Your file's has Been successfully downloaded.
                                </Typography>
                    </CardContent>
                </Card>
            }
        </div>
        )
    }
}

DownloadDigiFiles.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(DownloadDigiFiles)
