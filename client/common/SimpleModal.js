import React, { Component } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
//import Cropper from 'react-cropper';
//import 'cropperjs/dist/cropper.css';
import Button from "material-ui/Button";
import FileUpload from "material-ui-icons/FileUpload";
import Cropper from "./Cropper";

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50; //+ rand();
  const left = 50; // + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
}

const useStyles = makeStyles(theme => ({

}));

export default function SimpleModal(props) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  //props.HandleModal

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCrop = () => {
    const dataUrl = this.refs.cropper.getCroppedCanvas().toDataURL();
  };
  const cropper = React.createRef(null);
  const _crop = () => {
    // image in dataUrl
  };
  return (
    <div>
      {/* <p>Click to get the full Modal experience!</p>*/}
      {/*<button variant="raised" color="default" component="span" >
        Open Modal
      </button>*/}
      <Button
        variant="raised"
        color="default"
        component="span"
        onClick={handleOpen}
      >
        Change Picture
      </Button>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={handleClose}
      >
        <div style={modalStyle} className={"cropontent-div"}>
          <Cropper
            onCropped={props.onCropImage}
            HandleModal={handleClose}
            aspectRatio={props.aspectRatio}
            editProfileMsg={props.editProfileMsg}
          />
        </div>
      </Modal>
    </div>
  );
}
