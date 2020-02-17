import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import TextField from "material-ui/TextField";
import Button from "material-ui/Button";
import StripeCheckout from "react-stripe-checkout";
import { payTip } from "../../post/api-post";
import auth from "../../auth/auth-helper";
import CheckIcon from "@material-ui/icons/Check";
import CustomLoader from "../../common/CustomLoader";
import { removeStan } from "../../user/api-user";
import Typography from "material-ui/Typography";
import CustomButton from "../../common/CustomButton";
import { withStyles } from "material-ui/styles";
import Moment from "react-moment";

const useStyles = makeStyles(theme => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: "8px 8px 0 0",
    boxShadow: "none",
    position: "relative",
    maxWidth: "414px"
  },

  headtitle: {
    borderBottom: "1px solid #d6d6d6",
    padding: "15px 15px 20px 15px"
  },


  close1: {
    position: "absolute",
    right: "20px",
    top: "10px",
    fontSize: "25px",
    cursor: "pointer"
  }
}));

export default function UnStanModal(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const [value, setValue] = useState("");
  const [stripeKey] = useState("pk_test_3Y8GStXmEoPOic8094YHVFFZ00aEB4CUyJ");
  // const [stripeKey, setStripeValue] = useState('pk_test_3Y8GStXmEoPOic8094YHVFFZ00aEB4CUyJ');
  const [user] = useState(auth.isAuthenticated());
  const [paymentToken, setPaymentToken] = useState("");
  const [paymentSuccess, setPaySuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const jwt = auth.isAuthenticated();

  if (props.closeModal) {
    handleClose();
  }
  // const onAmountChange = ()=>{
  // }
  // if (value == 0) {
  return (
    <div className={"unstanbtn"}>
      {/**<Button onClick={handleOpen} variant="raised" color="secondary">
        Un-stan
		</Button>**/}
      <CustomButton
        label="STANNING"
        onClick={handleOpen}
        className={"Primary_btn can-btn"}
      />
      {/* <span ><i className="fal fa-usd-circle" ></i>Stanned</span> */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={open}>
          <div className={"unstan-modal"}>
            <Typography

              component="h2"
              className={classes.headtitle}
            >
              {" "}
              Are you sure you want to unstan {props.name} and cancel the
              subscription?{" "}
            </Typography>
            <Typography component="div" className={"unstan-close"}>
              {" "}
              <i className={"fal fa-times"} onClick={handleClose}></i>{" "}
            </Typography>
            <Typography component="div" className={"unstan-parasection"}>
              <Typography component="p">
                You will still have access to {props.name} content until <Moment format="MMM D, YYYY">
                  {new Date(props.stanRemoved).toString()}
                </Moment>
              </Typography>
              <Typography component="div" className={"unstanbtn-section"}>
                <CustomButton
                  label="Yes,Cancel"
                  onClick={props.onStanChange}
                  className={"Primary_btn_blk"}
                />
                <CustomButton
                  label="No,Go Back"
                  onClick={handleClose}
                  className={"Secondary_btn "}
                />
              </Typography>
              {/**
						<Button variant="raised" color="secondary" onClick={props.onStanChange}>No,Go Back</Button>
								   <Button variant="raised" color="secondary" onClick={handleClose}>Yes,Cancel</Button>**/}
            </Typography>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
