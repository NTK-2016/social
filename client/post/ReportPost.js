import React, { Component } from 'react'
import PropTypes from 'prop-types'
import IconButton from 'material-ui/IconButton'
import { withStyles } from 'material-ui/styles'
import Button from 'material-ui/Button'
import DeleteIcon from 'material-ui-icons/Delete'
import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog'
import auth from './../auth/auth-helper'
import { remove } from './api-post.js'
import { Redirect, Link } from 'react-router-dom'
import CustomButton from './../common/CustomButton'
import { profilereport } from "../user/api-user.js";
import { Grid } from "@material-ui/core";
import CustomLoader from "./../common/CustomLoader";
import Typography from "material-ui/Typography";

const sleep = milliseconds => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
};

const styles = theme => ({
    paper: {
        backgroundColor: theme.palette.background.paper,
        borderRadius: '8px 8px 0 0',
        boxShadow: 'none',
        position: 'relative',
        maxWidth: '360px',
        textAlign: 'left',
        padding: '0 0 30px',
        boxSizing: 'border-box',
    },
})


class ReportPost extends Component {
    state = {
        redirect: false,
        reportopen: false,
        reportLoader: false,
        success: false
    }
    clickButton = () => {
        console.log("open report")
        this.setState({ reportopen: true })
    }

    reportPost = () => {
        this.setState({ reportLoader: true });
        const jwt = auth.isAuthenticated()
        profilereport(
            {
                fromId: jwt.user._id,
                postId: this.props.postId,
                type: this.props.type
            },
            { t: jwt.token }
        ).then(data => {
            if (data.error) {
                //console.log(data.error);
            } else {
                sleep(200).then(() => {
                    this.setState({
                        reportLoader: false,
                        success: true
                    });
                });
            }
        });
    }

    handleRequestClose = () => {
        console.log("handleRequestClose")
        this.setState({ reportopen: false, reportLoader: false, })
        if (this.state.success) {
            this.props.onReport()
        }
        else {
            this.props.onClose()
        }
    }
    render() {
        const redirect = this.state.redirect
        const { classes } = this.props
        if (redirect) {
            return <Redirect to='/' />
        }

        return (<span>
            <span onClick={this.clickButton}>Report</span>

            <Dialog open={this.state.reportopen} onClose={this.handleRequestClose} className={"delete-container"} >
                <Grid className={"report_full_con"} className={classes.paper}>
                    <DialogTitle className={"delete-head"}>{"Report post"}
                        <IconButton className={"delete-close"}>
                            <i class="fal fa-times" onClick={this.handleRequestClose}></i>
                        </IconButton>
                    </DialogTitle>
                    <DialogContent className={"delete-content"}>
                        {!this.state.success && (
                            <DialogContentText>
                                Are you sure you want to report this post?
                        </DialogContentText>
                        )}
                        {this.state.success && (
                            <DialogContentText>
                                Thank you for submitting your report on this post
                        </DialogContentText>
                        )}
                    </DialogContent>
                    <DialogActions className={"deletepost-action"}>
                        {/* {!this.state.reportLoader && !this.state.success && (
                            <CustomButton
                                label="Cancel"
                                onClick={this.handleRequestClose}
                                className={"Primary_btn_border"}
                            />
                        )} */}
                        {!this.state.reportLoader && !this.state.success && (
                            <CustomButton
                                label="Confirm"
                                onClick={this.reportPost}
                                className={"Primary_btn_blk mar-space"}
                            />
                        )}
                        {this.state.reportLoader && (
                            <CustomLoader height={30} width={30} />
                        )}
                        {/* {this.state.success && (
                            <CustomButton
                                label="Ok"
                                onClick={this.handleRequestClose}
                                className={"Primary_btn_blk mar-space"}
                            />
                        )} */}
                    </DialogActions>
                    {/* {this.state.success && (
                        <Typography variant="p" Component="p" className={"submit_txt"}>
                            Submitted Successfully !!
                        </Typography>
                    )} */}
                </Grid>
            </Dialog>
        </span>)
    }
}
ReportPost.propTypes = {
    postId: PropTypes.string.isRequired,
    //onRemove: PropTypes.func.isRequired
}

export default withStyles(styles)(ReportPost)
