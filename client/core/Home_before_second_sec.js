import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Typography from "material-ui/Typography";
import Grid from "material-ui/Grid";
import Box from '@material-ui/core/Box';
const styles = theme => ({
    root: {
        flexGrow: 1,
        margin: '0 auto',
        boxShadow: 'none',
    },
    container: {
        display: 'flex',
        position: 'relative',

    },
    paper: {
        textAlign: 'center',
    },

});

class Home_before_second_sec extends Component {

    render() {
        const { classes } = this.props;
        return (

            <section className={"full_width_blk second_section"}>
                <Grid container className={classes.root}>
                    
                     <Grid item xs={12} sm={12} md={6} className={"right_blk_sec_inner"}>
                        <Box boxShadow={0} className={"right_blk_gray"}>
                            <Typography variant="display4" component="h4">It’s for <br />
                                communities <br />
                                of creators
                            </Typography>
                            <Typography variant="body2" className="txt">
                                Stan.me is for upcoming and avid creators who want to share their work with the world. Use the platform’s flexible tools to set up and manage your online store, a subscription plan for exclusive content, and receive tips from your most dedicated supporters, the Stans.
                            </Typography>

                            <Typography variant="body2" component="div" className="home_word_img">
                                <img
                                    className={"top_right_img"}
                                    src="/dist/home_word_img.svg"
                                    alt=""
                                />
                            </Typography>

                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={12} md={6} className={"left_blk_inner"}>
                        <Box boxShadow={0} className={"left_inner_content"}>
                            <Box boxShadow={0} className={"communities_blk"}>
                                {/* <img
                                    className={"top_right_img"}
                                    src="/dist/2-layers.png"
                                    alt=""
                                /> */}


                                <div id="carouselExampleFade" className={"carousel slide carousel-fade"} data-ride="carousel" data-interval="1500">
                                    <div className={"carousel-inner"}>
                                        <div className={"carousel-item active"}>                                            
                                            <img
                                                className={"d-block w-100"}
                                                src="/dist/slide_com_01.png"
                                                alt="01"
                                            /> 
                                        </div>
                                        
                                        <div className={"carousel-item"}>
                                            <img
                                                className={"d-block w-100"}
                                                src="/dist/slide_com_02.png"
                                                alt="02"
                                            />  
                                        </div>
                                        <div className={"carousel-item"}>
                                            <img
                                                className={"d-block w-100"}
                                                src="/dist/slide_com_03.png"
                                                alt="03"
                                            />  
                                        </div>
                                        <div className={"carousel-item"}>
                                            <img
                                                className={"d-block w-100"}
                                                src="/dist/slide_com_04.png"
                                                alt="04"
                                            />  
                                        </div>
                                        <div className={"carousel-item"}>
                                            <img
                                                className={"d-block w-100"}
                                                src="/dist/slide_com_05.png"
                                                alt="05"
                                            />  
                                        </div>
                                        <div className={"carousel-item"}>
                                            <img
                                                className={"d-block w-100"}
                                                src="/dist/slide_com_06.png"
                                                alt="06"
                                            />  
                                        </div>
                                        
                                    </div>
				                </div>
                                
                                <Typography component="p"  className={"comm_txt"}>
                                    Designers <br />
                                    Illustrators <br />
                                    Artists <br />
                                    Musician <br />
                                    Writers <br />
                                    Directors <br />
                                </Typography>
                                <Typography component="p"  className={"comm_txt comm_sec_txt"}>
                                    Videos <br />
                                    Pictures<br />
                                    Anime<br />
                                    Books<br />
                                    Podcasts
                                </Typography>
                                <Typography component="p"  className={"comm_light_txt"}>
                                    & the list goes on..
                                </Typography>


                            </Box>

                            {/* <img
                                className={"top_right_img"}
                                src="/dist/2-layers.svg"
                                alt=""
                            /> */}

                        </Box>
                    </Grid>

                </Grid>

            </section>
        );
    }
}

Home_before_second_sec.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Home_before_second_sec);
