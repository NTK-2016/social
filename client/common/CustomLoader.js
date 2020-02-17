import React from "react"
import Loader from 'react-loader-spinner'

export default class CustomLoader extends React.Component {
   //other logic

   render() {
      return (
         <Loader
            type="TailSpin"
            color="#5A07FF"
            height={this.props.height ? parseInt(this.props.height) : 100}
            width={this.props.width ? parseInt(this.props.width) : 100}
            className={this.props.customclass ? this.props.customclass : "main-loader"}
         />
      );
   }
}