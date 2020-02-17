import React, { Component } from 'react';
import { withStyles, typography } from 'material-ui/styles'
import Grid from '@material-ui/core/Grid';
import Button from 'material-ui/Button'
import Avatar from 'material-ui/Avatar'
import ListItemAvatar from 'material-ui/List'
import PropTypes from 'prop-types'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Redirect, Link } from 'react-router-dom'
import Moment from "react-moment";
import config from "../../../config/config";

let monthNames = ["Jan", "Feb", "March",
    "April", "May", "June",
    "July", "Aug", "Sept",
    "Oct", "Nov", "Dec"];
const styles = theme => ({

    container: {
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridGap: 5,
    },
    paper: {
        marginTop: "auto",
        width: '100%',
        overflowX: 'auto',
        marginBottom: "auto",
    },
    table: {
        minWidth: 650,
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
})

class ActiveSubscription extends Component {
    constructor({ props }) {
        super(props)
        this.state = {
            userId: '',
        }
        this.props = props
    }
    componentDidMount = () => {
        // console.log(this.props.userId)
    }

    render() {
        const { classes } = this.props
        // const photoUrl = this.props.propStanningData.creatorId._id
        //     ? `/api/users/photo/${this.props.propStanningData.creatorId._id}?${new Date().getTime()}`
        //     : '/api/users/defaultphoto'
        return (
            <Grid>
                {/* <div className={"wallet-header"}>
                    <div className={"wallet-headinner"}>
                        <div className={"from-wdate"}>
                            <Typography variant="h2" component="h2">From: </Typography>
                            <TextField
                                id="datetime-local"

                                type="date"
                                className={"wallet-div"}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{ disableUnderline: true, classes: { input: this.props.classes['input'] }, style: { padding: 0 } }}
                            />
                        </div>
                        <div className={"from-wdate"}>
                            <Typography variant="h2" component="h2">To: </Typography>
                            <TextField
                                id="date"
                                type="date"
                                className={"wallet-div"}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    disableUnderline: true, classes: { input: this.props.classes['input'] }, style: {
                                        padding: 0
                                    }
                                }}
                            />

                        </div>
                        <Button color="primary" variant="raised" >Search </Button>
                    </div> */}
                {/* <div className={"wallet-headinner"}>
                        <div className={"wallet-btn"}>
                            <Typography variant="h2" component="h2">Balance: </Typography>

                            <Typography variant="p" component="p">315 </Typography>
                        </div>
                        <Button color="primary" variant="raised" >Withdraw </Button>

                    </div> */}
                {/* </div> */}
                <Grid container className={"manage-order-container"}>
                    <Grid item xs={12} >
                        <Table className={"table-subscription ts"} size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Subscribed to</TableCell>
                                    <TableCell className={"tab-cencontent"}>Amount</TableCell>
                                    <TableCell >Status</TableCell>

                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    this.props.propStanningData.map((subscribed, i) => {
                                        if (subscribed.status == 1 || ((new Date(subscribed.stanningRemovedDate).getMonth() > (new Date().getMonth())))) {
                                            return (<TableRow key={i}>
                                                <TableCell component="td" scope="column" data-th="Date">
                                                    <Moment format="MMM D, YYYY">

                                                        {new Date(subscribed.stanningDate).toString()}
                                                    </Moment>
                                                    {/* {(monthNames[new Date(subscribed.stanningDate).getMonth()]) + " " + new Date(subscribed.stanningDate).getDay() + ", " + new Date(subscribed.stanningDate).getFullYear()} */}
                                                </TableCell>
                                                <TableCell component="td" scope="column" className={"active-subs-user"} data-th="Subscribed to">
                                                    <div className={"subscription-status"}>
                                                        <Avatar
                                                            src={subscribed.creatorId.photo ? config.profileImageBucketURL + subscribed.creatorId.photo : config.profileDefaultPath}
                                                            //src={'/api/users/photo/' + subscribed.creatorId._id} 
                                                            className={"img-subscribed"} />
                                                        <div className={"creator-idn"}>
                                                            <div className={"td-name"}>
                                                                {subscribed.creatorId.name}

                                                            </div>
                                                            <div className={"td-id"}>
                                                                @{subscribed.creatorId.username}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell component="td" scope="column" className={"td-amt text-bold"} data-th="Amount">
                                                    ${subscribed.amount}
                                                </TableCell>
                                                {(subscribed.stanningRemovedDate != '' && subscribed.status == 0) ? (<td className={"subs-td-rem"}><div>
                                                    <TableCell component="td" scope="column" data-th="Status" className={"expirysubs-status remove-br"}>
                                                        <div className={"renew-subs"}>
                                                            <div>
                                                                Expiring on :
														</div>
                                                            <div>
                                                                {monthNames[(new Date(subscribed.stanningDate).getMonth() < 11 ? new Date(subscribed.stanningDate).getMonth() + 1 : 0)] + " " + new Date(subscribed.stanningDate).getDate() + ", " + new Date(subscribed.stanningDate).getFullYear()}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell component="td" scope="column" data-th="Status" className={"remove-br"}>

                                                    </TableCell>
                                                </div></td>
                                                ) : (<TableCell className={"activesubs-status"}>
                                                    <TableRow>
                                                        <TableCell component="td" scope="column" className={"remove-br act1"} data-th="Status">
                                                            <div className={"renew-subs"}>
                                                                <div>
                                                                    Renewing on :
															</div>
                                                                <div>
                                                                    {monthNames[(new Date(subscribed.stanningDate).getMonth() < 11 ? new Date(subscribed.stanningDate).getMonth() + 1 : 0)] + " " + new Date(subscribed.stanningDate).getDate() + ", " + new Date(subscribed.stanningDate).getFullYear()}
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell component="td" scope="column" className={"remove-br act2"} >
                                                            {/* <Button onClick={this.props.onUnSubscribe}>UnSubscribe</Button> */}
                                                            <Link to={"/profile/" + subscribed.creatorId.username}>UnSubscribe</Link>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableCell>)}

                                            </TableRow>)
                                        }
                                    })

                                }
                                {!this.props.propStanningData.length && (
                                    <TableRow>
                                        <TableCell colSpan={4}>No Record Found</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Grid>
                </Grid>
            </Grid>
        )
    };
}
ActiveSubscription.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(ActiveSubscription)