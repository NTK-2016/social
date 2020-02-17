import React, { Component } from "react";
import Typography from "material-ui/Typography";
import CustomButton from "./../common/CustomButton";
import Icon from "material-ui/Icon";
//import 'cropperjs/dist/cropper.css';
import SideLoader from "./../common/SideLoader";
import Cropper from "react-cropper";

/* global FileReader */

const src = "img/child.jpg";

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

export default class Demo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      src: '',
      cropResult: null,
      inValidFileFormatMsg: "",
      loader: false
    };
    this.cropImage = this.cropImage.bind(this);
    this.onChange = this.onChange.bind(this);
    this.close = this.close.bind(this);
    this.useDefaultImage = this.useDefaultImage.bind(this);
  }

  onChange(e) {
    e.preventDefault();
    this.setState({ src: '' });
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    let mimeType = e.target.files[0].type;
    this.setState({ inValidFileFormatMsg: "" });
    var extension = ["image/png", "image/jpeg", "image/jpg", "image/gif"];
    if (!extension.includes(e.target.files[0].type)) {
      this.setState({ inValidFileFormatMsg: "Invalid file format." });
      document.getElementById("file").value = "";
      //return false;
    }
    else if (e.target.files[0].size > 2100000) {
      console.log(e.target.files[0].size)
      this.setState({ inValidFileFormatMsg: "File is too large. Max size is 2 MB" });
      document.getElementById("file").value = "";
    }
    else {
      const reader = new FileReader();
      reader.onload = () => {
        this.setState({ src: reader.result });
      };
      reader.readAsDataURL(files[0]);
    }
  }

  cropImage() {
    this.setState({ loader: true })

    if (typeof this.cropper.getCroppedCanvas() === "undefined") {
      return;
    }
    // this.setState({
    //   cropResult: this.cropper.getCroppedCanvas().toDataURL(),
    // });
    //console.log(this.cropper.getCroppedCanvas().toDataURL());
    sleep(500).then(() => {
      this.props.onCropped(this.cropper.getCroppedCanvas().toDataURL());
    })
    sleep(1500).then(() => {
      this.setState({ loader: false })
      this.props.HandleModal();
    })
  }

  useDefaultImage() {
    this.setState({ src });
  }

  close() {
    this.props.HandleModal();
  }

  render() {
    return (
      <div>
        <Typography component="div" className={"cropper-head"}>
          <Typography component="h2" className={"cropper-title"}>
            {/* Crop Image and Upload */}
            {this.props.editProfileMsg}
          </Typography>
          <i className="fal fa-times" onClick={this.close}></i>
        </Typography>
        <div className={"cropper-div"}>
          <input type="file" id="file" onChange={this.onChange} accept="image/*" />
          {/*<button onClick={this.useDefaultImage}>Use default img</button>*/}
          {this.state.inValidFileFormatMsg != "" && (
            <Typography component="p" color="error" className={"error-input"}>
              <Icon color="error">error</Icon>
              {this.state.inValidFileFormatMsg}
            </Typography>
          )}
          <Cropper
            aspectRatio={this.props.aspectRatio}
            style={{ height: 300, width: "100%" }}
            preview=".img-preview"
            guides={false}
            src={this.state.src}
            ref={cropper => {
              this.cropper = cropper;
            }}
            viewMode={2}
            modal={true}
          />
        </div>
        <Typography component="div" className="cropper-bottom">
          {/*<div className="box" style={{ width: '50%', float: 'right' }}>
            <h1>Preview</h1>
            <div className="img-preview" style={{ width: '50%', float: 'left'}} />
          </div>*/}
          <div className="cropper-box">
            {/*<span>Crop</span>*/}
            {!this.state.loader &&
              <CustomButton
                label="Apply"
                onClick={this.cropImage}
                className={"Primary_btn_blk"}
                disabled={this.state.inValidFileFormatMsg != "" || this.state.src == ''}
              />}
            {this.state.loader && <SideLoader />}
            {/* <button onClick={this.cropImage} style={{ float: 'right' }}>
                Crop Image and Exit
				   </button>*/}

            {/*<img style={{ width: '100%' }} src={this.state.cropResult} alt="cropped image" />*/}
          </div>
        </Typography>
      </div>
    );
  }
}
