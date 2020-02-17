import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Typography from "material-ui/Typography";
import Grid from "material-ui/Grid";
import Box from '@material-ui/core/Box';
const styles = theme => ({
    // root: {
    //     flexGrow: 1,
    //     width: 1200,
    //     margin: '0 auto',
    //     boxShadow: 'none',
    // },
    container: {
        display: 'flex',
        position: 'relative',
    },
    paper: {
        textAlign: 'center',
    },

});

class Home_before_last_sec extends Component {

    render() {
        const { classes } = this.props;
        return (
            <section className={"full_width_black_bg footer_section"}>
                <Grid container className={"inner_container"}>
                    <Grid item xs={12} sm={12}>
                        <Box boxShadow={0} className={"footer_inner_blk"}>
                            <Typography  component="ul" className={"fot_links"}>
                                <Typography component="li"><a target="_blank" href="http://help.stan.me/#faq-terms-and-conditions">Terms and Condition</a></Typography>
                                <Typography component="li"><a target="_blank" href="http://help.stan.me/#faq-privacy-policy">Privacy policy</a></Typography>
                            </Typography>

                            <Typography  component="ul" className={"fot_social"}>
                                <Typography  component="li" className={"instagram"}><a href="https://www.instagram.com/standotme/" target="_blank"><i className={"fab fa-instagram"}></i>Instagram</a></Typography>
                                <Typography  component="li" className={"twitter"}><a href="https://twitter.com/standotme" target="_blank"><i className={"fab fa-twitter"}></i>Twitter</a></Typography>
                                <Typography  component="li" className={"facebook"}><a href="https://www.facebook.com/standotme/" target="_blank"><i className={"fab fa-facebook-f"}></i>Facebook</a></Typography>
                            </Typography>

                            <Typography  component="ul" className={"fot_links"}>
                                <Typography component="li"><a target="_blank" href="http://help.stan.me/#faq-contact-us">Contact us</a></Typography>
                                <Typography component="li"><a target="_blank" href="http://help.stan.me">Help</a></Typography>
                                {/* <Typography component="li"><a href="javascript:void(0);">About</a></Typography> */}
                            </Typography>

                        </Box>
                        <Box boxShadow={0} className={"footer_inner_blk copy_txt"}>
                            <Typography component="p"><a href="https://stan.me/">Stan.Me</a> &copy; 2020 by Ximius Limited All Rights Reserved. </Typography>
                        </Box>
                    </Grid>



                </Grid>
            </section>
        );
    }
}

Home_before_last_sec.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Home_before_last_sec);
