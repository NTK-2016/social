const create = (chat) => {
  return fetch('/api/chat/', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(chat)
  })
    .then((response) => {
      return response.json()
    }).catch((err) => console.log(err))
}

const createRoom = (chat) => {
  return fetch('/api/room/', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(chat)
  })
    .then((response) => {
      return response.json()
    }).catch((err) => console.log(err))
}
const readRoom = (chat) => {
  return fetch('/api/readroom/', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(chat)
  })
    .then((response) => {
      return response.json()
    }).catch((err) => console.log(err))
}

const listNotification = (params) => {
  var username = params.username;
  //var tousername = localStorage.getItem("tousername")
  return fetch('/api/chat/notification/?username=' + username, {
    method: 'GET',
  }).then(response => {
    return response.json()
  }).catch((err) => console.log(err))
}
const listRoom = () => {
  return fetch('/api/chat/', {
    method: 'GET',
  }).then(response => {
    return response.json()
  }).catch((err) => console.log(err))
}

const listChat = (params) => {
  //console.log(params);
  var username = params.username;
  var room = params.room;
  var tousername = localStorage.getItem("tousername")

  return fetch('/api/chat/?room=' + room + '&username=' + username + '&tousername=' + tousername + '&less=' + params.less + '&currentTime=' + params.currentTime, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
      //'Authorization': 'Bearer ' + credentials.t
    }
  }).then((response) => {
    // console.log(response);
    return response.json()
  }).catch((err) => console.log(err))
}

const listNewChat = (params) => {
  //console.log(params);
  var username = params.username;
  var room = params.room;
  var tousername = localStorage.getItem("tousername")

  return fetch('/api/newchat/?room=' + room + '&username=' + username + '&tousername=' + tousername + '&less=' + params.less + '&currentTime=' + params.currentTime, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
      //'Authorization': 'Bearer ' + credentials.t
    }
  }).then((response) => {
    // console.log(response);
    return response.json()
  }).catch((err) => console.log(err))
}

const listMoreChat = (params) => {
  //console.log(params);
  var username = params.username;
  var room = params.room;
  var tousername = localStorage.getItem("tousername")

  return fetch('/api/morechat/', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
      //'Authorization': 'Bearer ' + credentials.t
    },
    body: JSON.stringify({
      room: room,
      username: username,
      tousername: tousername,
      skip: params.chatmessagestart,
    })
  }).then((response) => {
    // console.log(response);
    return response.json()
  }).catch((err) => console.log(err))
}






const ProductById = (params, credentials) => {
  return fetch('/api/shop/' + params.productId, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + credentials.t
    }
  }).then((response) => {
    return response.json()
  }).catch((err) => console.log(err))
}






export {
  create,
  createRoom,
  listChat,
  listNewChat,
  listNotification,
  listRoom,
  ProductById,
  readRoom,
  listMoreChat
  // ProductList,

}
