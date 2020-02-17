import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Typography from "material-ui/Typography";
import Grid from "material-ui/Grid";
import Box from '@material-ui/core/Box';
import CustomButton from '../common/CustomButton'
import { Link } from "react-router-dom";

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
