import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import Avatar from "material-ui/Avatar";
import auth from "./../auth/auth-helper";
import { Link } from "react-router-dom";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import config from "../../config/config";
const useStyles = makeStyles({
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
});

export default function Menu_mobile() {
    const classes = useStyles();
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    const toggleDrawer = (side, open) => event => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({ ...state, [side]: open });
    };

    const sideList = side => (
        <div
            className={classes.list}
            role="presentation"
            onClick={toggleDrawer(side, false)}
            onKeyDown={toggleDrawer(side, false)}
        >
		
<MenuList className={"menu-popup mobile-mb-sec"}>
<MenuItem>
 <Avatar
                        className={"menu-avatar"}
                        src={auth.isAuthenticated().user.photo ? config.profileImageBucketURL + auth.isAuthenticated().user.photo : config.profileDefaultPath}
                    />
                    <div className={""}>
                        <span className={"user-menu"}>
                            {auth.isAuthenticated().user.name}
                        </span>{" "}
                        <br />{" "}
                        <span className={"user-submenu"}>
                            @{auth.isAuthenticated().user.username}
                        </span>
                    </div>
            
           
</MenuItem>
         <Divider className={"divide-m"} />
   <MenuItem className={"nav-submenuitem"} >
             
                    <Link
                        to={"/profile/" + auth.isAuthenticated().user.username}

                    >
                        My Profile
                    </Link>
         
				  </MenuItem>
				  
        <MenuItem className={"nav-submenuitem"}>

                    <Link
                        to={"/setting/" + auth.isAuthenticated().user._id}

                    >
                        Settings
                    </Link>
          	  </MenuItem>
                <MenuItem className={"nav-submenuitem"}>
                    <Link
                        to={
                            "/payments_transaction/" +
                            auth.isAuthenticated().user._id
                        }

                    >
                        Payments
                    </Link>
           		  </MenuItem>
				   <MenuItem className={"nav-submenuitem"}>
                    <Link
                        to={
                            "/notifications"
                        }

                    >
                        Notification
                    </Link>
           		  </MenuItem>
   
			<Divider className={"divide-m"} />
			
			
			
			
   
                   <MenuItem className={"nav-submenuitem"}>
                    <Link to={"/creatorspace"} >
                        Creator's Space
                    </Link>
     </MenuItem>
                       <MenuItem className={"nav-submenuitem"}>

                    <Link
                        to={
                            "/wallet_earnings/" +
                            auth.isAuthenticated().user._id
                        }
                        
                    >
                        Earnings
                    </Link>
             	  </MenuItem>
                {auth.isAuthenticated().user.creator > 0 &&
                       <MenuItem className={"nav-submenuitem"}>
                    <Link
                        to={"/refer/" + auth.isAuthenticated().user._id}
                        
                    >
                        Refer a friend
                    </Link>
             </MenuItem>
}
                <MenuItem className={"logoutmenu nav-submenuitem"} onClick={() => {
                    auth.signout();
                }}>

                    
                        Log Out
                   
                </MenuItem>
        
			
			
			
			
			
			
 </MenuList>

        </div>
    );

    return (
        <div className={"menu-mobile-mb"}>
            <Avatar
                className={"menu-avatar"}
                src={auth.isAuthenticated().user.photo ? config.profileImageBucketURL + auth.isAuthenticated().user.photo : config.profileDefaultPath}
                onClick={toggleDrawer('right', true)}
            />
            <Drawer anchor="right" open={state.right} onClose={toggleDrawer('right', false)}>
                {sideList('right')}
            </Drawer>
        </div>
    );
}
