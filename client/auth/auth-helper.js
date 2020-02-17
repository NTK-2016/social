import {
  signout
} from './api-auth.js'

const auth = {
  isAuthenticated() {
    if (typeof window == "undefined")
      return false

    if (localStorage.getItem('jwt'))
      // check token in database
      return JSON.parse(localStorage.getItem('jwt'))
    else
      return false
  },
  authenticate(jwt, cb) {
    if (typeof window !== "undefined")
      // set data in db
      localStorage.setItem('jwt', JSON.stringify(jwt))
    cb()
  },
  signout() { //cb
    if (typeof window !== "undefined")
      // remove token from db
      localStorage.removeItem('jwt')
    localStorage.removeItem('shipping')
    // localStorage.removeItem('notificationCount')
    // localStorage.removeItem('messageCount')
    //cb()
    //optional
    window.location.href = '/';
    signout().then((data) => {
      document.cookie = "t=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    })
  }
}

export default auth