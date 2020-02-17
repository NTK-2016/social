const io = require('socket.io-client')

export default function () {
  const socket = io.connect('http://localhost:3000/chat')


  

  function registerHandler(onMessageReceived) {
    socket.on('message', onMessageReceived)
  }

  function unregisterHandler() {
    socket.off('message')
  }

  socket.on('error', function (err) {
    console.log('received socket error:')
    console.log(err)
  })

  function register(name, cb) {
    socket.emit('register', name, cb)
  }

  function join(chatroomName, cb) {
    socket.emit('join', chatroomName, cb)
  }

  function leave(chatroomName, cb) {
    socket.emit('leave', chatroomName, cb)
  }

  function message(chatroomName, msg, cb) {
    socket.emit('message', { chatroomName, message: msg }, cb)
  }

  function getChatrooms(cb) {
    socket.emit('chatrooms', null, cb)
  }
  function getAllUsers(cb) {
    console.log("start all user list api calling")
    socket.emit('get-all-users-data', null, cb)
  }
  function saveChat(chat_msg,toUser,current_date,cb) {
    console.log("start all user list api calling")
    socket.emit('chat-msg',{msg:chat_msg,msgTo:toUser,date:current_date});
    console.log("start all user list api calling2")
    //socket.emit('get-all-users-data', null, cb)
  }

  function getAvailableUsers(cb) {
    socket.emit('availableUsers', null, cb)
  }

  return {
    register,
    join,
    leave,
    message,
    getChatrooms,
    getAllUsers,
    saveChat,
    getAvailableUsers,
    registerHandler,
    unregisterHandler
  }
}

