import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from 'material-ui/Typography';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import { mergeClasses } from '@material-ui/styles';
import Box from '@material-ui/core/Box';
import Customloader from '../../common/CustomLoader'


const useStyles = makeStyles(theme => ({
    container: {
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridGap: theme.spacing(0),
    },
    paper: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        whiteSpace: 'nowrap',
        marginBottom: theme.spacing(1),
    },
    root:{
        maxWidth:1200,
        margin: '20px auto 60px',
    }

}));


export default function Analytics(props) {
    const classes = useStyles();
    if (props.loader)
    {
        return <Customloader/>
    }
    else
          return (    
	 
	  	<Typography  component="div" className={"analytics-cs"}>
                  <Typography component="h3" className={"textcenter pb-30 ana-h3"}>The analytics page is coming soon</Typography>
			<Typography  component="div" className={"displayhide"}>
        <Paper className={classes.root}>
            <Grid container spacing={0}>
		
                <Grid item xs={6} className={"total_stans_blk"}>
                    <Box boxShadow={0}>
                        <CardContent className={"CardContent_width"}>                           
                            <Typography gutterBottom component="h1"  className={"big_tit30b"}>
                                <center>Stans</center>
                            </Typography>
                      
                            <Grid container className={"total_stans_child"}>
							<Grid item xs={12} sm={4}>
							      <Typography className={classes.pos} component="p"  className={"sho_txt"}>
                                Lifetime
                             </Typography>
							</Grid>
                                <Grid item xs={12} sm={4}>
                                    <Typography component="h2" >
                                        <center>{props.stanCount}</center>
                                    </Typography>
                                    <Typography component="div"  className={"short_lig_title"}>
                                        <center>Total Stans</center>
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Typography component="h2" >
                                        <center>${props.totalEarnings}</center>
                                    </Typography>
                                    <Typography component="div"  className={"short_lig_title"}>
                                        <center>Total Earnings</center>
                                    </Typography>
                                </Grid>
                            </Grid>

                          
                            <Grid container className={"total_stans_child"}>
								<Grid item xs={12} sm={3}>
								  <Typography component="p"  className={"sho_txt"}>This month </Typography>
								</Grid>
                                <Grid item xs={12} sm={3}>
                                   <Typography component="h2" >
                                            < center > {
                                                props.newStanCount
                                            } </center>
                                    </Typography>
                                    <Typography component="div"  className={"short_lig_title"}>
                                            <center>New Stans</center>
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} sm={3}>
                                    <Typography component="h2" >
                                            <center>{props.lostThismonthSTan}</center>
                                    </Typography>
                                    <Typography component="div" className={"short_lig_title"}>
                                            <center>Lost Stans</center>
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                     <Typography component="h2" >
                                            <center>${props.earning}</center>
                                    </Typography>
                                    <Typography component="div"  className={"short_lig_title"}>
                                            <center>Earnings</center>
                                    </Typography>
                                </Grid>
                            </Grid>                           
                        </CardContent>
                    </Box>
                 </Grid>
                 <Grid item xs={6} className={"followers_blk"}>
                    <Box boxShadow={0}>
                        <CardContent className={"CardContent_width"}>
                            {/* <Typography className={classes.title} color="textSecondary" gutterBottom component="h1" variant="h5">
                                Stans
                             </Typography> */}
                            <Typography gutterBottom component="h1"  className={"big_tit30b"}>
                                <center>Followers</center>
                            </Typography>
                            
                            <Grid container className={"total_stans_child"}>
							        <Grid item xs={12} sm={4}>
									<Typography className={classes.pos} component="p"  className={"sho_txt"}>
                                Lifetime
                             </Typography>
									</Grid>
                                    <Grid item xs={12} sm={8}>
                                        <Typography component="h2" >
                                            <center>{props.followersCount}</center>
                                        </Typography>
                                <Typography component="div"  className={"short_lig_title"}>
                                    <center>Total Followers</center>
                                </Typography>
                                    </Grid>
                            </Grid>

                        
                            <Grid container className={"total_stans_child"}>
							 <Grid item xs={12} sm={4}>  
							     <Typography component="p"  className={"sho_txt"}>This month </Typography>
							 </Grid>
                                <Grid item xs={12} sm={4}>            
                                  <Typography component="h2" >
                                    <center>{props.followthismonth}</center>
                                    <center className={"short_lig_title"}>New Followers</center>
                                </Typography>
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                   <Typography component="h2" >
                                    <center>{props.unFollowersCount}</center>
                                    <center className={"short_lig_title"}>Unfollowers</center>
                                </Typography> 
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Box>
                </Grid>
                <Grid item xs={6} className={"shop_sales_blk"}>
                    <Box boxShadow={0}>
                        <CardContent className={"CardContent_width"}>
                            
                            <Typography gutterBottom component="h1"  className={"big_tit30b"}>
                                <center>Shop Sales</center>
                            </Typography>
                            
                             <Grid container className={"total_stans_child"}>
							  <Grid item xs={12} sm={4}>
							  <Typography className={classes.pos} component="p"  className={"sho_txt"}>
                                Lifetime
                             </Typography>
							  </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Typography component="h2" >
                                        <center>{props.countSales}</center>
                                    </Typography>
                                    <Typography component="div"  className={"short_lig_title"}>
                                        <center>Total Product Sold</center>
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Typography component="h2" >
                                        <center>${props.totalproductsales}</center>
                                    </Typography>
                                    <Typography component="div"  className={"short_lig_title"}>
                                        <center>Total Earnings</center>
                                    </Typography>
                                </Grid>
                            </Grid>    
                        
                        
                            <Grid container className={"total_stans_child last_sec_mar0"}>
							  <Grid item xs={12} sm={4}>
							      <Typography component="p" className={"sho_txt"}>This month </Typography>
							  </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Typography component="h2" >
                                            <center>{props.productthismonth}</center>
                                    </Typography>
                                    <Typography component="div"  className={"short_lig_title"}>
                                            <center>New  Product Sold</center>
                                    </Typography>
                                </Grid>
                               
                                <Grid item xs={12} sm={4}>
                                     <Typography component="h2" >
                                            <center>${props.salesthismonth}</center>
                                    </Typography>
                                    <Typography component="div"  className={"short_lig_title"}>
                                            <center>Earnings</center>
                                    </Typography>
                                </Grid>
                            </Grid>
                 
                 </CardContent>
                 </Box>
                  
                </Grid> 
                <Grid item xs={6} className={"tips_blk"}>
                    <Box boxShadow={0}>
                        <CardContent className={"CardContent_width"}>                            
                              {/* <Typography className={classes.title} color="textSecondary" gutterBottom component="h1" variant="h5">
                                Stans
                             </Typography> */}
                            <Typography gutterBottom component="h1"  className={"big_tit30b"}>
                                <center>Tips</center>
                            </Typography>
                          
                             <Grid container className={"total_stans_child"}>
							    <Grid item xs={12} sm={4}>
								  <Typography className={classes.pos} component="p"  className={"sho_txt"}>
                                Lifetime
                             </Typography>
								</Grid>
                             <Grid item xs={12} sm={4}>
                                <Typography component="h2" >
                                    <center>{props.tipcount}</center>
                                </Typography>
                                <Typography component="div"  className={"short_lig_title"}>
                                    <center>Total Tips</center>
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                  <Typography component="h2" >
                                    <center>${props.totaltips}</center>
                                </Typography>
                                <Typography component="div"  className={"short_lig_title"}>
                                    <center>Total Earnings</center>
                                </Typography>

                            </Grid>
                            </Grid>
                            {/* <Grid item xs={3} sm={6}>
                            <Typography>This month </Typography> 
                            <Typography variant="h5" component="h2">
                                    <center>{props.tipthismonth}</center>
                                </Typography>
                            <Typography variant="h5" component="h2">
                                    <center>New Tips</center>
                                </Typography>
                                <Typography variant="h5" component="h2">
                                    <center>${props.thismonthTipEarning}</center>
                                </Typography>
                            <Typography variant="h5" component="h2">
                                    <center>Earnings</center>
                                </Typography>
                        </Grid> */}
                    
                            <Grid container className={"total_stans_child last_sec_mar0"}>
							     <Grid item xs={12} sm={4}>
								     <Typography component="p"  className={"sho_txt"}>This month </Typography>
								 </Grid>
                                <Grid item xs={12} sm={4}>
                              <Typography component="h2" >
                                            <center>{props.tipthismonth}</center>
                                    </Typography>
                                    <Typography className={"short_lig_title"} component="div" >
                                            <center>New Tips</center>
                                    </Typography>
                                </Grid>
                               
                                <Grid item xs={12} sm={4}>
                                    <Typography component="h2" >
                                            <center>${props.thismonthTipEarning}</center>
                                    </Typography>
                                    <Typography className={"short_lig_title"} component="div" >
                                            <center>Earnings</center>
                                    </Typography>
                                </Grid>
                                    {/* <Typography variant="body2" component="p">
                                well meaning and kindly.
                             <br />
                                {'"a benevolent smile"'}
                            </Typography> */}
                            </Grid>
                        </CardContent>    
                   </Box>
                </Grid>
			
            </Grid>
           </Paper>	</Typography></Typography>)
  ;
}