import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import Template from './../template'
import userRoutes from './routes/user.routes'
import authRoutes from './routes/auth.routes'
import postRoutes from './routes/post.routes'
import productRoutes from './routes/product.routes'
import chatRoutes from './routes/chat.routes'
import orderRoutes from './routes/order.routes'
import userCtrl from "./controllers/user.controller";

// modules for server side rendering
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import MainRouter from './../client/MainRouter'
import StaticRouter from 'react-router-dom/StaticRouter'

import { SheetsRegistry } from 'react-jss/lib/jss'
import JssProvider from 'react-jss/lib/JssProvider'
import { MuiThemeProvider, createMuiTheme, createGenerateClassName } from 'material-ui/styles'
import { teal, orange } from 'material-ui/colors'

import { SchedulePost, dailymail, weeklymail, getCurrencyConversion } from './controllers/cron.controller'


var cron = require('node-cron');
setInterval(() => {
  SchedulePost();
}, 60000);

cron.schedule('0 0 * * *', () => {
  console.log('running a task every day' + new Date());
  dailymail();
  // For currency shedule
  getCurrencyConversion();
});

cron.schedule('0 0 * * 0', () => {
  console.log('running a task every week' + new Date());
  weeklymail();
});

// import css from './style.css'
//end
import fs from 'fs'
//comment out before building for production
import devBundle from './devBundle'

const CURRENT_WORKING_DIR = process.cwd()
const app = express()
// app.use(function(req, res, next) {
//       if ((req.get('X-Forwarded-Proto') !== 'https')) {
//         res.redirect('https://' + req.get('Host') + req.url);
//       } else
//         next();
//     });
//comment out before building for production
devBundle.compile(app)

//views folder and setting ejs engine
app.set("views", path.resolve(__dirname, "./views"));
app.set("view engine", "ejs");

app.post('/api/webhook', bodyParser.raw({ type: 'application/json' }), userCtrl.webhook)
// parse body params and attache them to req.body
app.use(bodyParser.json({ limit: '150mb' }))
app.use(bodyParser.urlencoded({ limit: '150mb', extended: true }))
app.use(cookieParser())
app.use(compress())
// secure apps by setting various HTTP headers
app.use(helmet())
// enable CORS - Cross Origin Resource Sharing
app.use(cors())

app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')))




app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')))

// mount routes
app.use('/', userRoutes)
app.use('/', authRoutes)
app.use('/', postRoutes)
app.use('/', productRoutes)
app.use('/', chatRoutes)
app.use('/', orderRoutes)

app.use('*', (req, res) => {
  console.log("*************")
  const sheetsRegistry = new SheetsRegistry()
  const theme = createMuiTheme({
    palette: {
      primary: {
        // light: '#52c7b8',
        // main: '#009688',
        // dark: '#00675b',
        contrastText: '#fff',
      },
      secondary: {
        light: '#ffd95b',
        main: '#ffa726',
        dark: '#c77800',
        contrastText: '#000',
      },
      openTitle: teal['700'],
      protectedTitle: orange['700'],
      type: 'light'
    }
  })
  const generateClassName = createGenerateClassName()
  const context = {}
  const markup = ReactDOMServer.renderToString(
    <StaticRouter location={req.url} context={context}>
      <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
        <MuiThemeProvider theme={theme} sheetsManager={new Map()}>
          <MainRouter />
        </MuiThemeProvider>
      </JssProvider>
    </StaticRouter>
  )
  if (context.url) {
    return res.redirect(303, context.url)
  }
  const css = sheetsRegistry.toString()
  res.status(200).send(Template({
    markup: markup,
    css: css
  }))
})

app.post('/image', function (req, res) {
  var form = new formidable.IncomingForm();

  form.parse(req);

  form.on('fileBegin', function (name, file) {
    file.path = __dirname + '/uploads/' + file.name;
  });

  form.on('file', function (name, file) {
    console.log('Uploaded ' + file.name);
  });

  res.sendFile(__dirname + '/index.html');
});

// Catch unauthorised errors
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ "error": err.name + ": " + err.message })
  }
})

export default app
