import React from 'react';
//import Dialog from 'material-ui/Dialog';
//import FlatButton from 'material-ui/FlatButton';
import { List, ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
//import Loader from './Loader'

class UserList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      allUsers: null
    }

    this.handleSelection = this.handleSelection.bind(this)
    this.renderUserItems = this.renderUserItems.bind(this)
    
    
    /*
    this.props.users((err, allUsers) => {
      console.log(allUsers);
      this.setState({ allUsers })
    })
    */
  }

  handleSelection(selectedUser) {
    this.props.register(selectedUser.name)
  }

  renderUserItems() {
    return this.props.users.map(user => (
      <ListItem
        onClick={() => this.handleSelection(user)}
        primaryText={user.name}
        secondaryText={user.statusText}
        key={user.name}
        leftAvatar={<Avatar src={user.image} alt="" />}
      />
    ))
  }







  render(props) {

    /*
    const items = []
    if(props.users){
      for (var xx=0; xx< props.users.length; xx++) {
        items.push(`<li key={xx}>{props.users[xx].name}</li>`)
      }
      
    }
    */


    //var users_list_data = props.users;
    //console.log(users_list_data);
    //          { props.users? items: ''}        


    return (<div>
        {
          !this.props.users? '1' : 
          (<List>{ this.renderUserItems() }</List>)
        }
        </div>)
        //}
    }

 }

export default UserList;