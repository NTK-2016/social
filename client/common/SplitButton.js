import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Radio from '@material-ui/core/Radio';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import { DatePicker, MuiPickersUtilsProvider, DateTimePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

const options = ['Publish', 'Schedule', 'Save as draft'];

const GreenRadio = withStyles({
  root: {
    color: green[400],
    '&$checked': {
      color: green[600],
    },
  },
  checked: {},
})(props => <Radio color="default" {...props} />);

export default function SplitButton(props) {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const arrowRef = React.useRef(null);
  var v = props.posttype ? props.posttype : 0
  v = v == 0 ? v : v - 1
  var date = props.scheduled_datetime ? props.scheduled_datetime : new Date()
  const [selectedIndex, setSelectedIndex] = React.useState(v);


  const [selectedValue, setSelectedValue] = React.useState('a');

  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedDate, handleDateChange] = React.useState(date);

  const handleClick = () => {
    console.info(`You clicked ${options[selectedIndex]}`);
    props.onClick()
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    if (index == 1) {
      setIsOpen(true);
    } else {
      setOpen(false);
      setIsOpen(false);
    }
    props.onType(index)
  };

  const handleCalendar = (event) => {
    props.onDate(event)
    handleDateChange(event)
  };

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const handleClose = event => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  // For Radio


  const handleChange = event => {
    setSelectedValue(event.target.value);
  };

  const handleArrowRef = node => {
    arrowRef(node);
  };

  return (
    <Grid container direction="column" className={"split-container"}>
      <Grid item xs={12} >
        <ButtonGroup variant="contained" color="primary" ref={anchorRef} aria-label="split button" className={"split-gp"}>
          <Button onClick={handleClick} className={"split-btnleft"}>{options[selectedIndex]}</Button>
          <Button
            color="primary"
            size="small"
            aria-controls={open ? 'split-button-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-label="select merge strategy"
            aria-haspopup="menu"
            onClick={handleToggle}
            className={"split-btnright"}
          >
            <ArrowDropDownIcon />
          </Button>
        </ButtonGroup>
        <Popper open={open} anchorEl={anchorRef.current} placement={"bottom-start"}
          modifiers={{
            flip: {
              enabled: false,
            },
            preventOverflow: {
              enabled: true,
              boundariesElement: 'undefined',
            },
          }}>
          <Paper>
            <ClickAwayListener onClickAway={handleClose}>
              <MenuList id="split-button-menu" className={"split-menu"}>
                {options.map((option, index) => (
                  <MenuItem
                    key={option}
                    //disabled={index === 2}
                    selected={index === selectedIndex}
                    onClick={event => handleMenuItemClick(event, index)}
                  >
                    {option}
                    <Radio
                      checked={index === selectedIndex}
                      onChange={handleChange}
                      value={index}
                      className={"radio-split"}
                      name="radio-button-demo"
                      inputProps={{ 'aria-label': 'A' }}
                    />
                  </MenuItem>
                ))}
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Popper>
      </Grid>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DateTimePicker
          //variant="inline"
          open={isOpen}
          onOpen={() => setIsOpen(true)}
          onClose={() => setIsOpen(false)}
          value={selectedDate}
          onChange={event => handleCalendar(event)}
          //autoOk
          ampm={true}
          disablePast
          // disablePastTime
          style={{ display: 'none' }}
        /></MuiPickersUtilsProvider>
    </Grid>
  );
}