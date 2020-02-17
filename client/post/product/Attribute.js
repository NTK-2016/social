import React, { Component } from "react";
import Select from "react-select";
import { render } from "react-dom";

export default class Attribute extends Component
{
    constructor(props) {
        super(props);
        this.options=[];
        props.options.map((item,index)=>{
            this.options.push({label:item,value:item});
        });
        this.state= {
            attribute:this.props.attributeValue==""?"":this.props.attributeValue,
            option:this.options,
        }
    }

    handleChangeMulti = value => {
       // console.log(value);
        if(this.props.name=="color"){
            this.props.setAttributeName(value,"color");
        }
        if(this.props.name=="size"){
            this.props.setAttributeName(value,"size");
        }
        
    }
render(){
    // console.log("!!!");
    // console.log(this.props);
    return (        
        <Select
            // style={{ width: 150 }}
            className={"select_blk_section_inner"}
            disableUnderline={true}
            //menuIsOpen={true}
            placeholder={this.props.placeholder}
            TextFieldProps={{
            label: "Creater",
            InputLabelProps: {
            htmlFor: "react-select-multiple",
            shrink: true
          }
        }}
        inputId="react-select-multiple"
            options={this.state.option}
        onChange={this.handleChangeMulti}
        value={this.props.attribute}
        multiple={true}
        isMulti
        autoComplete="off"
        />        
    );
}
}