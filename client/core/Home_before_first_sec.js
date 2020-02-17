import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Typography from "material-ui/Typography";
import { Link } from "react-router-dom";
import Grid from "material-ui/Grid";
import Box from '@material-ui/core/Box';
import CustomButton from '../common/CustomButton'

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

class Home_before_first_sec extends Component {

    render() {
        const { classes } = this.props;
        return (
            <section className={"full_width first_section"}>
                <Grid container className={"inner_container"}>
                    <Grid item xs={12} sm={12} md={6} className={"left_blk_inner"}>
                        <Box boxShadow={0} className={"left_inner_content"}> 
                            <Typography component="h2">Stan.Me</Typography>
                            <Typography variant="body2" component="p" className="big_txt">
                                The one-stop place to get discovered, <br />
                                build a community and monetise your <br />creations.
                            </Typography>
                            {/* <Typography variant="body2" component="p" className="short_txt">Join now to get reduced 5% lifetime commission on your earnings. </Typography> */}
                            <Link to="/signup"><CustomButton label="SIGN UP" className={"Primary_btn_blk"} /></Link>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} className={"right_blk_inner"}>
                        <Box boxShadow={0}>
                            {/* <img className={"_pic"} alt="" src="../dist/assets/img/stan_me_right_img.png" /> */}
                            <img
                                className={"top_right_img"}
                                src="/dist/stan_me_right_img.svg"
                                alt=""
                            />
                        </Box>
                    </Grid>
                </Grid>
            </section>
        );
    }
}

Home_before_first_sec.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Home_before_first_sec);
