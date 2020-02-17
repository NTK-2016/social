import config from './../config/config'
import app from './express'
import mongoose from 'mongoose'

// Connection URL
mongoose.Promise = global.Promise
mongoose.connect(config.mongoUri)
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${mongoUri}`)
})

var server = app.listen(config.port, (err) => {
  if (err) {
    console.log(err)
  }
  server.timeout = 6000000; //10 min
  console.info('Server started on port %s.', config.port)
})
