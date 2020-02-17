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
import { Link } from "react-router-dom";
import { Redirect } from 'react-router-dom'

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
        errors: {}
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
            this.setState({ errors: errors, formIsValid: false });
        }
        return formIsValid;
    }

    sendlink = () => {
        if (this.validateTextFields()) {
            sendreferinvitation({
                email: this.state.email,
                link: auth.isAuthenticated().user.username
            }).then(data => {
                if (data) {
                    this.setState({
                        open: true,
                        successMessage: "Invitation sent",
                        email: ''
                    });
                }
            });

        }
    }


    render() {
        const { classes } = this.props;
        return (
            <div>
                <section className={"full_width page_404"}>
                    <Grid container className={"inner_container"}>
                        <Grid item xs={12} sm={12}>
                            <Box boxShadow={0} className={"page_404_inner text-center"}>
                                <Typography variant="display4" component="h4">Error: 404 Unexpected Error</Typography>
                                <Typography variant="display2" component="h2">
                                    4
                                    <img className={"d-block w-100"} src="/dist/404_img.svg" alt="" />
                                    4
                                </Typography>
                                <Typography component="div" variant="div" className={"txt"}>Sorry! something went wrong, we couldn’t find this page</Typography>
                                <Link to="/"><CustomButton label="GO BACK TO HOMEPAGE" className={"Primary_btn_blk"} /></Link>
                            </Box>
                        </Grid>

                        
                       
                    </Grid>
                </section>

            </div>
        );
    }
}

Refer.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Refer);
