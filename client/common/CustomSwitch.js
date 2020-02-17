import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { purple } from '@material-ui/core/colors';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';


const IOSSwitch = withStyles(theme => ({
  root: {
    width: 46,
    height: 24,
    padding: 0,
    margin: theme.spacing(1),
  },
  switchBase: {
    padding: 1,
    '&$checked': {
      transform: 'translateX(22px)',
      color: theme.palette.common.white,
      '& + $track': {

        opacity: 1,
        border: 'none',
      },
    },
    '&$focusVisible $thumb': {

    },
  },
  thumb: {
    width: 22,
    height: 22,
  },
  track: {
    borderRadius: 26 / 2,

    backgroundColor: '#000',
    opacity: 0.38,
    transition: theme.transitions.create(['background-color', 'border']),
  },
  checked: {},
  focusVisible: {},
}))

  (({ classes, ...props }) => {
    return (
      <Switch
        focusVisibleClassName={classes.focusVisible}
        disableRipple
        classes={{
          root: classes.root,
          switchBase: classes.switchBase,
          thumb: classes.thumb,
          track: classes.track,
          checked: classes.checked,
        }}
        {...props}
      />
    );
  });

export default function CustomizedSwitches(props) {
  const { onChange, checked, className, disabled } = props;
  const [state, setState] = React.useState({
    checkedA: true,
  });

  const handleChange = name => event => {
    setState({ ...state, [name]: event.target.checked });
  };


  return (
    <FormGroup className={"custom-switch"}>

      <FormControlLabel
        control={
          <IOSSwitch
            checked={checked}
            onChange={onChange}
            disabled={disabled}
          />
        }


      />

    </FormGroup>
  );
}