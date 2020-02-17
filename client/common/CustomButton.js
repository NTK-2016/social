import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

// The `withStyles()` higher-order component is injecting a `classes`
// prop that is used by the `Button` component.
const StyledButton = withStyles({
  root: {
    // background: 'linear-gradient(45deg, #5A07FF 30%, #5A07FF 90%)',
    // fontSize:16,
    // lineHeight:1.75,
    // fontFamily: 'Helvetica',
    // borderRadius: 25,
    // border: 0,
    // color: 'white',
    // height:42,
    // padding: '0 30px',
    
    // boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  },
  label: {
    textTransform: 'capitalize',
  },
})(Button);

export default function ClassesShorthand(props) {
  //console.log(props);
  const { label, onClick, disabled, color, className, buttonloader} = props;
  if (disabled) {
    return <StyledButton className={className} onClick={onClick} disabled={disabled} color={color}>{label}</StyledButton>;
  } else {
    return <StyledButton className={className} onClick={onClick} color={color}>{label} {buttonloader && <div className={"loader-01"}></div>}</StyledButton>;
  }

}