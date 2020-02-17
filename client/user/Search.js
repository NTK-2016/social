import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import AppBar from 'material-ui/AppBar'
import Tabs, { Tab } from 'material-ui/Tabs'
import Typography from 'material-ui/Typography'
import Grid from 'material-ui/Grid'
import SearchHomeScreen from './SearchHomeScreen'
const styles = theme => ({
  div: {
    width:"330px",
    margin:"10px 160px"
 
  },
  error: {
    verticalAlign: 'middle'
  },
  title: {
    marginTop: theme.spacing.unit * 2,
    color: theme.palette.openTitle
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 300
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing.unit * 2
  },
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 400,
  },
  input: {
    marginLeft: 8,
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4,
  },
  appbar:{
    width:"800px",
    height:"100%",
    marginTop:"20px",
    marginLeft:"0px",
    marginRight:"0px",
    padding:"0px"

  },
  tabs:
  {
    padding:"2px",      
  },
  grid:
  {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 400,

  }
})

class Search extends Component {
    constructor({props}) {
        super(props)
        this.state = {
            tab: 0,
            search:[]
          }
        this.props = props
      }

    componentWillReceiveProps = (props) => {
    this.setState({tab:0})
    }
    handleTabChange = (event, value) => {
    this.setState({ tab: value })
    }   
  
  render() {
    const {classes} = this.props
    return (<div className={classes.div} style={{ width:"300px" }}>
                <Paper className={classes.root}>
                    <Grid className={classes.grid}>
                    <InputBase
                        className={classes.input}
                        placeholder="Search for Creators and Users"
                        inputProps={{ 'aria-label': 'search google maps' }}
                    />
                <IconButton className={classes.iconButton} aria-label="search">
                    <SearchIcon />
                </IconButton>
                </Grid>
            </Paper>
            <AppBar position="static" color="default" className={classes.appbar} >
                  <Tabs
                    value={this.state.tab}
                    onChange={this.handleTabChange}
                    indicatorColor="secondary"
                    textColor="primary" className={classes.tabs}>
                           <Tab label="Home" />
                            <Tab label="Artist" />  
                            <Tab label="MUsicians" />
                            <Tab label="Bloggers"/>
                            <Tab label="Designer" />
                            <Tab label="TV Meddia"/>
                            <Tab label="Writers"/> 
                            <Tab label="Entertains"/>
                            <Tab label="Podcast"/> 
                  </Tabs> 
            </AppBar>
            {this.state.tab === 0 && <TabContainer><SearchHomeScreen search={this.props.search} userId={this.props.userId} /></TabContainer>}

    </div>)
  }
}

Search.propTypes = {
  classes: PropTypes.object.isRequired,
  //search :PropTypes.array.isRequired
}
const TabContainer = (props) => {
    return (
      <Typography component="div" style={{ padding: 8 * 2 }}>
        {props.children}
      </Typography>
    )
  }
  
  TabContainer.propTypes = {
    children: PropTypes.node.isRequired
  }
  

export default withStyles(styles)(Search)
