import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Typography from "material-ui/Typography";
import { Link } from "react-router-dom";
import Grid from "material-ui/Grid";
import Box from '@material-ui/core/Box';
import CustomButton from '../common/CustomButton';
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

class Home_before_fourth_sec extends Component {

    render() {
        const { classes } = this.props;
        return (
            <section className={"full_width_white_bg padding100 fourth_section"}>
                <Grid container className={"inner_container"}>
                    <Grid item xs={12} sm={12}>
                        <Box boxShadow={0} className={"tool_work_full_sec text-center"}>
                            <Typography variant="display3" component="h3">Join the community </Typography>
                            <Typography  component="ul" className={"join_ul"}>
                                <Typography  component="li">Be among the first creators to be in the spotlight</Typography>
                                <Typography  component="li">Reduced commissions at 5% flat for early sign ups</Typography>
                                <Typography  component="li">A simple process to start sharing your creations</Typography>
                            </Typography>
                            <Link to="/signup"><CustomButton label="SIGN UP" className={"Primary_btn_blk"} /></Link>
                        </Box>
                    </Grid>



                </Grid>
            </section>
        );
    }
}

Home_before_fourth_sec.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Home_before_fourth_sec);
