import React from 'react'
import MainRouter from './MainRouter'
import { BrowserRouter } from 'react-router-dom'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'
import { teal, orange } from 'material-ui/colors'
import { hot } from 'react-hot-loader'

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#52c7b8',
      main: '#ffffff',
      dark: '#00675b',
      contrastText: '#fff',

    },
    secondary: {
      light: '#d6d6d6',
      main: '#000',
      dark: '#ccc',
      contrastText: '#fff',
    },
    tertiary: {
      light: '#d6d6d6',
      main: 'red',
      dark: '#ccc',
      contrastText: '#fff',
    },
    openTitle: teal['700'],
    protectedTitle: orange['700'],
    type: 'light'
  },

  /*overrides: {
  MuiButton: {
  // Name of the rule
  disabled: {
  backgroundColor: ' #5A07FF !important',
  opacity: '0.55',
  color: '#fff !important',
	 MuiTypography: {
      h1: {
        fontSize: '25px',
        lineHeight: '30px',
        fontFamily: 'Helvetica-Bold',
        fontWeight: 'normal',
        color: 'rgba(0, 0, 0, 0.85)',
      },
      h2: {
        fontSize: '18px',
        lineHeight: '22px',
        fontFamily: 'Helvetica-Bold',
        color: 'rgba(0,0,0,0.85)',
        fontWeight: 'normal',
      },
      h3:
      {
        fontSize: '18px',
        lineHeight: '23px',
        fontFamily: 'Helvetica',
        color: 'rgba(0,0,0,0.85)',
        fontWeight: 'normal',
      },
	   h4:
      {
        fontSize: '14px',
        lineHeight: '18px',
        fontFamily: 'Helvetica-Bold',
        color: 'rgba(0,0,0,0.85)',
        fontWeight: 'normal',
      },
      p:
      {
        fontSize: '14px',
        lineHeight: '19px',
        fontFamily: 'Helvetica',
        fontWeight: 'normal',
      },
      span:
      {
        fontSize: '14px',
        lineHeight: '19px',
        fontFamily: 'Helvetica',
        fontWeight: 'normal',
      },
      body2:
      {
        fontSize: '15px',
        lineHeight: '20px',
        fontFamily: 'Helvetica',
        fontWeight: 'normal',
      },
    },
  },
  },
  MuiTypography: {
  h1: {
  fontSize: '25px',
  lineHeight: '30px',
  fontFamily: 'Helvetica-Bold',
  fontWeight: 'normal',
  color: 'rgba(0, 0, 0, 0.85)',
  },
  h2: {
  fontSize: '18px',
  lineHeight: '22px',
  fontFamily: 'Helvetica-Bold',
  color: 'rgba(0,0,0,0.85)',
  fontWeight: 'normal',
  },
  h3:
  {
  fontSize: '18px',
  lineHeight: '23px',
  fontFamily: 'Helvetica',
  color: 'rgba(0,0,0,0.85)',
  fontWeight: 'normal',
  },
  h4:
  {
  fontSize: '14px',
  lineHeight: '18px',
  fontFamily: 'Helvetica-Bold',
  color: 'rgba(0,0,0,0.85)',
  fontWeight: 'normal',
  },
  p:
  {
  fontSize: '14px',
  lineHeight: '19px',
  fontFamily: 'Helvetica',
  fontWeight: 'normal',
  },
  span:
  {
  fontSize: '14px',
  lineHeight: '19px',
  fontFamily: 'Helvetica',
  fontWeight: 'normal',
  },
  body2:
  {
  fontSize: '15px',
  lineHeight: '20px',
  fontFamily: 'Helvetica',
  fontWeight: 'normal',
  },
  },
  },
  MuiTypography: {
  variantMapping: {
  h1: {
  fontSize: '25px',
  lineHeight: '30px',
  fontFamily: 'Helvetica-Bold',
  fontWeight: 'normal',
  color: 'rgba(0, 0, 0, 0.85)',
  },
  h2: {
  fontSize: '18px',
  lineHeight: '22px',
  fontFamily: 'Helvetica-Bold',
  color: 'rgba(0,0,0,0.85)',
  fontWeight: 'normal',
  },
  variant: {
  fontSize: '18px',
  lineHeight: '22px',
  fontFamily: 'Helvetica-Bold',
  color: 'rgba(0,0,0,0.85)',
  fontWeight: 'normal',
  },
  h3:{
  fontSize: '18px',
  lineHeight: '23px',
  fontFamily: 'Helvetica',
  color: 'rgba(0,0,0,0.85)',
  fontWeight: 'normal',
  },
  h4:{
  fontSize: '14px',
  lineHeight: '18px',
  fontFamily: 'Helvetica-Bold',
  color: 'rgba(0,0,0,0.85)',
  fontWeight: 'normal',
  },
  p:{
  fontSize: '14px',
  lineHeight: '19px',
  fontFamily: 'Helvetica',
  fontWeight: 'normal',
  },
  span:{
  fontSize: '14px',
  lineHeight: '19px',
  fontFamily: 'Helvetica',
  fontWeight: 'normal',
  },
  body2:{
  fontSize: '15px',
  lineHeight: '20px',
  fontFamily: 'Helvetica',
  fontWeight: 'normal',
  },
  },
  },*/

})


const App = () => (
  <BrowserRouter>
    <MuiThemeProvider theme={theme}>
      <MainRouter />
    </MuiThemeProvider>
  </BrowserRouter>
)

export default hot(module)(App)