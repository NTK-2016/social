import React from "react"
import Loader from 'react-loader-spinner'
import Typography from 'material-ui/Typography'

export default class SideLoader extends React.Component {
   //other logic
   render() {
      return (
         <div className={"side-load-main"}>
            <Loader
               type="TailSpin"
               color="#5A07FF"
               height={this.props.height ? this.props.height : 40}
               width={this.props.width ? this.props.width : 40}
               className={this.props.customclass ? this.props.customclass : "side-loader"}
            />
            {
               this.props.uploadpercent > 0 &&
               <div className={"per-loader"}>{this.props.uploadpercent}%</div>
            }
         </div>
      );
   }
}