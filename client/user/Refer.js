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
import { sendreferinvitation } from "./api-user.js";
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



class Refer extends Component {
    state = {
        open: false,
        successMessage: '',
        emailNotValid: true,
        email: '',
        errors: {},
        loader: false
    }

    handleChange = name => event => {
        event.target.value ? this.setState({ [name]: event.target.value, emailNotValid: false, errors: {} }) : this.setState({ [name]: event.target.value, emailNotValid: true, errors: {} })
    }

    copyToClipboard = () => {
        var textField = document.createElement("textarea");
        textField.innerText = "stan.me/join/" + auth.isAuthenticated().user.username;
        document.body.appendChild(textField);
        textField.select();
        document.execCommand("copy");
        textField.remove();
        this.setState({
            open: true,
            successMessage: "copied to clipboard !!",
        });
    };

    handleRequestClose = (event, reason) => {
        this.setState({ open: false });
    };

    validateTextFields = () => {
        let errors = {};
        let res = [];
        let formIsValid = true;
        errors["email"] = required(this.state.email, "Email is required");
        res.push(required(this.state.email, "Email is required"));
        errors["formatEmail"] = vaildateEmail(
            this.state.email,
            "Enter a valid email address"
        );
        res.push(vaildateEmail(this.state.email, "Enter a valid email address"));
        var count = countError(res);
        if (count > 0) {
            formIsValid = false;
            this.setState({ errors: errors, formIsValid: false, loader: false });
        }
        return formIsValid;
    }

    sendlink = () => {
        this.setState({ loader: true })
        if (this.validateTextFields()) {
            sendreferinvitation({
                email: this.state.email,
                link: auth.isAuthenticated().user.username
            }).then(data => {
                if (data) {
                    this.setState({
                        open: true,
                        successMessage: "Invitation sent",
                        email: '',
                        loader: false,
						
                    });
                }
            });

        }
    }


    render() {
        if (auth.isAuthenticated().user.creator == 0) {
            return (<Redirect to={"/"} />)
        }
        const { classes } = this.props;
        return (
            <div>
                <section className={"full_width_blk referral_friend_section"}>
                    <Grid container className={"referral_containerbox"}>
                        <Grid item xs={12} sm={6} md={5} className={"referral_left"}>
                            <Box boxShadow={0} className={"left_content"}>
                                <Box variant="h4" component="h4">Invite a friend to join<br />
                                    Stan.Me today and Earn
                                </Box>
                                <Box className="txt" variant="div" component="div">
                                    Share the link below with your friends! Once they <br />
                                    start earning on Stan.Me, we will pay you 2% lifetime <br />
                                    commission based on their sales.<br />
                                    Find out more on how it works <a target="_blank" href="http://help.stan.me/#faq-refer-a-friend">here</a>
                                </Box>
                                <Grid className={"referral_email_outer"} component="div">
                                    <Grid className={"referral_email_blk"} component="div">
                                        <TextField className={"input_field_ref"}
                                            className={classes.input}
                                            InputProps={{
                                                disableUnderline: true, classes: { input: this.props.classes['input'] }, style: {
                                                    padding: 0
                                                }
                                            }}
                                            placeholder="Enter email address"
                                            value={this.state.email}
                                            onChange={this.handleChange("email")}
                                        />
                                        {!this.state.loader &&
                                            <CustomButton label="Send invite" className={"Primary_btn_blk"} onClick={() => this.sendlink()} disabled={this.state.emailNotValid} />
                                        }
                                        {this.state.loader &&
                                            <CustomLoader height={30} width={30} customclass={"refer-loader"} />
                                        }
                                    </Grid>
                                    <Box variant="div" component="div" className="error-input">{this.state.errors && <div>{this.state.errors['email']}{this.state.errors['formatEmail']}</div>}</Box>
                                    <Box variant="div" component="div">{this.state.successMessage && <div>{this.state.successMessage}</div>}</Box>
                                </Grid>
                                <Grid variant="div" component="div" className={"copy_share_link_blk"}>
                                    <Box variant="div" component="div" className={"stan_me_link"}>
                                        Stan.Me/join/{auth.isAuthenticated().user.username}
                                    </Box>
                                    <Box variant="div" component="div" className={"copy_link"} onClick={() => this.copyToClipboard()}>
                                        Copy link
                                    </Box>
                                    {/* <Typography variant="div" component="div" className={"Share_link"}>
                                        Share
                                    </Typography> */}
                                </Grid>


                            </Box>
                        </Grid>

                        <Grid item xs={12} sm={6} md={7} className={"referral_right"}>
                            <Box boxShadow={0} className={"right_content"}>
                                <img
                                    className={"d-block w-100"}
                                    src="/dist/email_template_welcome_sign_up_img.png"
                                    alt=""
                                />
                                {/* <img
                                        className={"d-block w-100"}
                                        src="/dist/referral_right_img.svg"
                                        alt="02"
                                    /> */}
                            </Box>
                        </Grid>

                    </Grid>
                </section>

                <section className={"full_width_black_bg footer_section referral_footer"}>
                    <Grid container className={"inner_container"}>
                        <Grid item xs={12} sm={12}>
                            <Box boxShadow={0} className={"footer_inner_blk"}>
                                <Typography component="ul" className={"fot_links"}>
                                    <Box component="li" variant="li"><a target="_blank" href="http://help.stan.me/#faq-terms-and-conditions">Terms and Condition</a></Box>
                                    <Box component="li" variant="li"><a target="_blank" href="http://help.stan.me/#faq-privacy-policy">Privacy policy</a></Box>
                                </Typography>

                                <Typography component="ul" className={"fot_social"}>
                                    <Box component="li" variant="li" className={"instagram"}><a href="https://www.instagram.com/standotme/" target="_blank"><i className={"fab fa-instagram"}></i>Instagram</a></Box>
                                    <Box component="li" variant="li" className={"twitter"}><a href="https://twitter.com/standotme" target="_blank"><i className={"fab fa-twitter"}></i>Twitter</a></Box>
                                    <Box component="li" variant="li" className={"facebook"}><a href="https://www.facebook.com/standotme/" target="_blank"><i className={"fab fa-facebook-f"}></i>Facebook</a></Box>
                                </Typography>

                                <Typography component="ul" className={"fot_links"}>
                                    <Box component="li" variant="li"><a target="_blank" href="http://help.stan.me/#faq-contact-us">Contact us</a></Box>
                                    <Box component="li" variant="li"><a target="_blank" href="http://help.stan.me">Help</a></Box>
                                    {/* <Box component="li" variant="li"><a href="javascript:void(0);">About</a></Box> */}
                                </Typography>
                            </Box>
                            <Box boxShadow={0} className={"footer_inner_blk copy_txt"}>
                                <Box component="p" variant="p"><a href="https://stan.me/">Stan.Me</a> &copy; 2019 by Ximius Limited All Rights Reserved. </Box>
                            </Box>
                        </Grid>
                    </Grid>
                    {/* <Snackbar
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right"
                        }}
                        className={"snack-class"}
                        open={this.state.open}
                        onClose={this.handleRequestClose}
                        autoHideDuration={1000}
                        message={
                            <span className={classes.snack}>{this.state.successMessage}</span>
                        }
                    /> */}
                </section>
            </div>
        );
    }
}

Refer.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Refer);
