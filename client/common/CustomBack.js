import React from "react"
import Loader from 'react-loader-spinner'
import Typography from 'material-ui/Typography'
import { Link } from "react-router-dom";

export default class CustomBack extends React.Component {
    //other logic
    render() {
        return (
            <Link to={"/" + this.props.backlink}>
                <Typography component="div" className={"go-back"}>
                    <i className={this.props.class}></i>
                    {this.props.message}
                </Typography>
            </Link>
        );
    }
}