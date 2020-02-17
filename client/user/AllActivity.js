import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
// import { withStyles } from "material-ui/styles";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
// import EditProfile from "./EditProfile";
// import Account from "./Account";
// import EmailNotification from "./settings/EmailNotification";
// import Select from "react-select";
import Following from "./Following";
import Followers from "./Followers";
import Liked from "./Liked";
import { read, follow } from "./api-user.js";
import auth from "./../auth/auth-helper";
// import { Link } from "react-router-dom";
import CustomBack from "./../common/CustomBack";
import Fourzerofour from "./../common/404";
import CustomLoader from "./../common/CustomLoader";

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
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,

    display: "flex"
    // height: 224,
  }
}));

export default function SettingsTabs(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(Number(props.match.params.tab));
  const [followers, setFollowers] = React.useState([]);
  const [following, setFollowing] = React.useState([]);
  const [data, setdata] = React.useState(true);
  const [username, setUsername] = React.useState("");
  const [creatorname, setName] = React.useState("");
  const [followingid, setfollowingid] = React.useState([]);
  const [stanning, setStanning] = React.useState([]);
  const [invalid, setInvalid] = React.useState(false);
  const [postdata, setPostdata] = React.useState(true);
  function handleChange(event, newValue) {
    setValue(newValue);
  }

  if (data) {
    //Number(props.match.params.tab) >= 0 && Number(props.match.params.tab) <= 2 ? setInvalid(false) : setInvalid(true)
    if (
      Number(props.match.params.tab) >= 0 &&
      Number(props.match.params.tab) <= 2
    ) {
      const jwt = auth.isAuthenticated();
      read(
        {
          userId: props.match.params.userId
        },
        { t: jwt.token }
      ).then(data => {
        if (data.error) {
          console.log(data.error);
          setInvalid(true);
          this.setState({ error: data.error });
        } else {
          var followers = [];
          var following = []
          var followingid = [];
          var stanningid = []
          setUsername(data.username);
          setName(data.name);
          if (data.following.length > 0) {
            data.following.forEach(element => {
              if (element._id && element.isDeleted == 0) {
                followingid.push(element._id);
                following.push(element)
              }
            });
          }
          if (data.stanning.length > 0) {
            data.stanning.forEach(element => {
              if (element.creatorId && element.status == 1) {
                var dt = new Date(element.stanningDate);
                dt.setMonth(dt.getMonth() + 1);
                stanningid.push({ "creatorId": element.creatorId, "stanRemoved": dt });
              }
            });
          }

          data.followers.forEach(res => {
            if (res.status == 1 && res.followers_id.isDeleted == 0) {
              followers.push(res);
            }
          });
          handleData(followers, following, followingid, stanningid);
          setPostdata(false);
          //this.setState({ id: data._id, followers: data.followers, following: data.following })
        }
      });
    } else {
      setInvalid(true);
      setdata(false);
    }
  }

  function handleData(followers, following, followingid, stanningid) {
    setFollowers(followers);
    setFollowing(following);
    setfollowingid(followingid);
    setStanning(stanningid);
    setdata(false);
  }
  function handleStanStatus(creatorId) {
    console.log("creatorId  " + creatorId)
    // console.log(stanning)
    // stanning.forEach(element => {
    //   if (element.creatorId == creatorId) {
    //     console.log("found")
    //     stanning.splice({ "creatorId": element.creatorId, "stanRemoved": element.stanRemoved });
    //   }
    // });
    // // console.log(stanning)
    // setStanning(stanning);
  }

  function onUnfollowUser(unfollowId) {
    // var index = following.indexOf(unfollowId);
    var prevFollowing = following;
    following.forEach((element, index) => {
      if (element._id) {
        if (element._id == unfollowId) {
          setFollowing(prevFollowing.splice(index, 1));
        }
      }
    });
    setFollowing(prevFollowing);
  }

  function newfollowing(newfollow) {
    var prevFollowing = following;
    prevFollowing.push(newfollow);
    setFollowing(prevFollowing);
  }

  if (invalid) {
    return <Fourzerofour />;
  } else {
    return (
      <section className={"activity-tabcontainer"}>
        <div className={"go-back-activity"}>
          <CustomBack class={"fal fa-chevron-left"} message={"Go back to " + username + " Profile"} backlink={"profile/" + username} />
          {/* <Typography component="div" className={"go-back"}>
            <i className={"fal fa-chevron-left"}></i> Go back to Profile
          </Typography> */}
        </div>
        {postdata && <CustomLoader postdata={postdata} />}
        {!postdata && (
          <div className={"tab-activity"}>
            <div className={"tab-activityleft"}>
              <Tabs
                orientation="vertical"
                TabIndicatorProps={{
                  style: {
                    backgroundColor: "transparent"
                  }
                }}
                value={value}
                onChange={handleChange}
                aria-label="Vertical tabs example"
                className={classes.tabs}
              >
                <Tab label="Following" {...a11yProps(0)} />
                <Tab label="Followers" {...a11yProps(1)} />
                <Tab label="Likes" {...a11yProps(2)} />
              </Tabs>
            </div>
            <TabPanel value={value} index={0} className={"tabpanelcustom"}>
              <Following
                userId={props.match.params.userId}
                following={following}
                onUnfollowUser={data => onUnfollowUser(data)}
                creatorname={creatorname}
                stanning={stanning}
                handleStanStatus={data => handleStanStatus(data)}
              />
            </TabPanel>
            <TabPanel value={value} index={1} className={"tabpanelcustom"}>
              <Followers
                userId={props.match.params.userId}
                followers={followers}
                followingid={followingid}
                newfollowing={data => newfollowing(data)}
                creatorname={creatorname}
              />
            </TabPanel>
            <TabPanel value={value} index={2} className={"tabpanelcustom"}>
              <Liked
                userId={props.match.params.userId}
                creatorname={creatorname}
              />
            </TabPanel>
          </div>
        )}
      </section>
    );
  }
}
