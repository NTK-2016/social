import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
// import Card, { CardContent, CardMedia } from "material-ui/Card";
import Typography from "material-ui/Typography";
// import seashellImg from "./../assets/images/seashell.jpg";
import { Link } from "react-router-dom";
import Grid from "material-ui/Grid";
// import auth from "./../auth/auth-helper";
// import RightSide from "./../user/RightSide";
// import FindPeople from "./../user/FindPeople";
// import Newsfeed from "./../post/Newsfeed";
// import Divider from "material-ui/Divider";

// import Paper from '@material-ui/core/Paper';
// import Container from '@material-ui/core/Container';
 import Box from '@material-ui/core/Box';
import { styled } from '@material-ui/core/styles';
import { compose, spacing, palette } from '@material-ui/system';
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

// const Box = styled('div')(
//     compose(
//       spacing,
//       palette,
//     ),
//   );

class Home_before_login_nav extends Component {

    render() {
        const { classes } = this.props;
        return (
            <section className={"full_width_white_bg padding10"}>
                <Grid className={"inner_container_full"}>
                    <Grid item xs={12} sm={12}>
                        <Box boxShadow={0} className={"nav_inner_blk"} >
                            <Typography component="div" className={"logo_top"}>
                                <Link to="/"><img
                                    className={"tool_work3_img tool_img"}
                                    src="/dist/header_logo.svg"
                                    alt="Stan.Me Logo"
                                />Stan.Me</Link>
                            </Typography>

                            <Typography component="ul" className={"links_top"}>
                                <Typography component="li" className={"login"}> <Link to="/signin"><CustomButton label="LOG IN" className={"top_menu_btn"} /></Link></Typography>
                                <Typography component="li" className={"signup"}><Link to="/signup"><CustomButton label="SIGN UP" className={"top_menu_btn_blk"} /></Link></Typography>
                            </Typography>

                        </Box>

                    </Grid>



                </Grid>
            </section>
        );
    }
}

Home_before_login_nav.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Home_before_login_nav);
