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

class Home_before_third_sec extends Component {
    
    render() {
        const { classes } = this.props;
        return (                
            <section className={"full_width_gray_bg third_section"}>
                <Grid container className={"inner_container"}> 
                    <Grid item xs={12} sm={12}>
                        <Box boxShadow={0} className={"tool_work_full_sec"}>
                            <Typography variant="display4" component="h4" className={"text-center"}>Tools that work for you</Typography>
                            <Typography variant="body2" component="p" className="txt" className={"txt text-center"}>Share creations in any format you like and pick the earning model that <br />works best for you.</Typography>
                        </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={12} md={4} className={"tool_work"}>
                        <Box boxShadow={0} className={"tool_work_inner text-center"}>
                            <Box className={"content_blk_img"}>
                            <img
                                className={"tool_work1_img tool_img"}
                                src="/dist/content_icon.svg"
                                alt=""
                            />
                            </Box>
                            <Grid className={"content_blk"}>
                                <Typography  component="h5">Monetise your content</Typography>                             
                                <Typography variant="body2" component="p" className="txt">Share your creations publicly and enable tipping, or set up a subscription plan to offer exclusive content to your subscribers, your Stans. </Typography>
                            </Grid>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} className={"tool_work"}>
                        <Box boxShadow={0} className={"tool_work_inner text-center"}>
                            <Box className={"content_blk_img"}>
                            <img
                                className={"tool_work2_img tool_img"}
                                src="/dist/online_store_icon.svg"
                                alt=""
                                />
                            </Box>
                            <Grid className={"content_blk"}>
                                <Typography  component="h5">Your own online store</Typography>                            
                                <Typography variant="body2" component="p" className="txt">
                                Maximise your revenue with a personal online store for digital and physical products.
                                </Typography>
                            </Grid>   
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} className={"tool_work"}>
                        <Box boxShadow={0} className={"tool_work_inner text-center"}>
                            <Box className={"content_blk_img"}>
                                <img
                                    className={"tool_work3_img tool_img"}
                                    src="/dist/earning_icon.svg"
                                    alt=""
                                    />
                            </Box>
                            <Grid className={"content_blk"}>
                                <Typography  component="h5">Your Earnings</Typography>
                                <Typography variant="body2" component="p" className={"txt text-center"}>Get paid directly into your bank account, at any time.</Typography>
                            </Grid>
                        </Box>
                    </Grid>                    
                </Grid>                
            </section>
        );
    }
}

Home_before_third_sec.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Home_before_third_sec);
