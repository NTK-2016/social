import React from 'react';

class Message extends React.Component {

  constructor(props, context) {
    super(props, context)

    this.state = {
      users: [],
      messages: '',

    }

  }

  render() {
    return (
      <li>{this.props.data.msg}</li>
    );
  }
}
export default Message;