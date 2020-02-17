import React from "react"
import Loader from 'react-loader-spinner'
import Typography from 'material-ui/Typography'
import { Link } from "react-router-dom";

export default class CustomMessage extends React.Component {
   //other logic
   render() {
      return (
         <div>
         {/* <Typography  component="div" className={"form-label"}></Typography> */}
            <Typography component="div" className={"form-label"}>
               {this.props.message}
               {
                  this.props.link && <Link to={this.props.linkurl}>{this.props.linkmessage}</Link>
               }
            </Typography>

         </div>
      );
   }
}