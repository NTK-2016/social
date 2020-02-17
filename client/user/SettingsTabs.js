import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import { withStyles } from 'material-ui/styles'
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import EditProfile from './EditProfile';
import Account from './Account';
import EmailNotification from './settings/EmailNotification';
import Select from 'react-select';
import { Link } from "react-router-dom";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,


    display: 'flex',
    // height: 224,
  },

}));

export default function SettingsTabs(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  function handleChange(event, newValue) {
    setValue(newValue);
  }

  return (
    <div className={"setting-tabcontainer"}>
      <div className={"tab-container"} >
        <div className={"tab-left tab_for_all"}>
          <Typography component="h1" variant="h1" className={"setting-m"}> Settings
          <span className={"icon-responsive"}>-</span>
            {value == 0 &&
              <span className={"edit-mb"}>Edit profile</span>}
            {value == 1 &&
              <span className={"account-mb"}>Account</span>}
            {value == 2 &&
              <span className={"email-mb"}>Email notifications</span>}

          </Typography>

          <Tabs

            orientation="vertical"

            TabIndicatorProps={{
              style: {
                backgroundColor: "transparent"
              },

            }}
            value={value}
            onChange={handleChange}
            aria-label="Vertical tabs example"
            className={classes.tabs}
          >
            <Tab label="Edit Profile" {...a11yProps(0)} />
            <Tab label="Account" {...a11yProps(1)} />
            <Tab label="Email Notifications" {...a11yProps(2)} />
            {/* <Tab label="Payout Method" {...a11yProps(3)} /> */}

          </Tabs>
        </div>
        <TabPanel value={value} index={0} className={"tabpanelcustom"}>
          <EditProfile editprofile={props.editprofile} userId={props.userId} />
        </TabPanel>
        <TabPanel value={value} index={1} className={"tabpanelcustom"}>
          <Account account={props.account} userId={props.userId} />
        </TabPanel>
        <TabPanel value={value} index={2} className={"tabpanelcustom"}>
          <EmailNotification account={props.emailnotification} userId={props.userId} usernotification={props.usernotification} />
        </TabPanel>
        <TabPanel value={value} index={3} className={"tabpanelcustom"}>

          <div className={"account-tab"}>
            <Typography component="h2" className={"title-profile"}>Payout Method</Typography>
            <Typography component="p" className={"payout-setting"}> To change your Bank details, name, mobile number  <Link
              to={
                "/"

              }
            >
              Click Here
                </Link></Typography>
          </div>
        </TabPanel>
      </div>
    </div>
  );
}
