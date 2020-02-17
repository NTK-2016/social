import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Typography from "material-ui/Typography";
import Grid from "material-ui/Grid";
import auth from "./../auth/auth-helper";
import TextField from "material-ui/TextField";
import Box from '@material-ui/core/Box';
import CustomButton from '../common/CustomButton'
import Snackbar from "material-ui/Snackbar";
import { required, vaildateEmail, countError } from "./../common/ValidatePost";
import { sendfeedback } from "./api-user.js";
import { Redirect } from 'react-router-dom'
import CustomLoader from '../common/CustomLoader'

const styles = theme => ({
    container: {
        display: 'flex',
        position: 'relative',
    },
    paper: {
        textAlign: 'center',
    },
    snack: {
        color: theme.palette.protectedTitle
    }
});

class Feedback extends Component {
    state = {
        message: '',
        errors: {},
        loader: false,
        successMessage: ''
    }

    handleChange = name => event => {
        event.target.value ? this.setState({ [name]: event.target.value, errors: {} }) :
            this.setState({ [name]: event.target.value, errors: {} })
    }

    sendlink = () => {
        this.setState({ loader: true })
        sendfeedback({
            message: this.state.message,
            userId: auth.isAuthenticated().user._id
        }).then(data => {
            if (data) {
                this.setState({
                    message: '',
                    loader: false,
                    successMessage: "Feedback sent",
                });
            }
        });
    }


    render() {
        const { classes } = this.props;
        return (
            <div>
                <section className={"full_width_blk feedback_section"}>
                    <Grid container className={"feedback_section_inner"}>
                        <Grid item xs={12} sm={12} md={12} className={"referral_left"}>
                            <Box boxShadow={0} className={"left_content"}>
                                <Box variant="h4" component="h4">We value your feedback!</Box>
                                <Typography variant="body2" className="txt gray_txt">
                                    Share your thoughts about Stan.me to help us improve your experience.
                                </Typography>
                                <Typography variant="body2" className="txt">
                                    Message
                                </Typography>
                                <Grid className={"feedback_email_outer"} component="div">                                    
                                        <TextField className={"input_field_ref"}
                                        className={classes.input}
                                        rows="7"
                                        multiline
                                            InputProps={{
                                                disableUnderline: true, classes: { input: this.props.classes['input'] }, style: {
                                                    padding: 0
                                                }
                                            }}
                                            placeholder="Write something here.."
                                            value={this.state.message}
                                            onChange={this.handleChange("message")}
                                        />

                                    
                                    <Box variant="div" component="div" className="error-input">{this.state.errors && <Typography>{this.state.errors['message']}</Typography>}</Box>
                                    <Box variant="div" component="div">{this.state.successMessage && <Typography>{this.state.successMessage}</Typography>}</Box>
                                </Grid>
                                <Box variant="div" component="div" className={"copy_share_link_blk"}>
                                    {!this.state.loader &&
                                        <CustomButton label="Send Feedback" className={"Primary_btn_blk"} onClick={() => this.sendlink()} disabled={this.state.message == ""} />
                                    }
                                    {this.state.loader &&
                                        <CustomLoader height={30} width={30} customclass={"refer-loader"} />
                                    }
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </section>
            </div>
        );
    }
}

Feedback.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Feedback);
