import React, { Component, Fragment } from 'react';
import StepWizard from 'react-step-wizard'
import Card, { CardActions, CardContent } from 'material-ui/Card'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import auth from '../auth/auth-helper'
import { becomecreater } from '../user/api-user'
import CardActionArea from '@material-ui/core/CardActionArea'
import Paper from '@material-ui/core/Paper'
import Grid from 'material-ui/Grid'
import Avatar from 'material-ui/Avatar'
import List, { ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText } from 'material-ui/List'
import { read, update, topCreatorCategory, payment, checkCategory, insertcategory } from '../user/api-user.js'
import Select from 'material-ui/Select'
import Checkbox from '@material-ui/core/Checkbox';
import TextField from 'material-ui/TextField'
import Box from '@material-ui/core/Box';
// import Radio from 'material-ui/Radio'
import { Link, withRouter } from 'react-router-dom'
import { required, requiredwith, requiredwithblank, countError, validatelink } from './../common/ValidatePost'
import Snackbar from 'material-ui/Snackbar'
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import config from "../../config/config";
import CustomBack from "./../common/CustomBack";


//import ReactSelect from "react-dropdown-select";  
/* eslint react/prop-types: 0 */

/**
 * A basic demonstration of how to use the step wizard
 */

var selectCategory = false;
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}
export default class Creator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      form: {},
    };
  }

  updateForm = (key, value) => {
    const { form } = this.state;

    form[key] = value;
    this.setState({ form });
  }

  // Do something on step change
  onStepChange = (stats) => {
    // console.log(stats);
  }

  setInstance = SW => this.setState({ SW })
  render() {
    const { SW, demo } = this.state;
    return (
      <Grid container className={"main_container_width"}>
        <Grid item xs={12} className={'jumbotron'}>

          <StepWizard
            onStepChange={this.onStepChange}
            isHashEnabled
            instance={this.setInstance}>
            <First hashKey={'FirstStep'} update={this.updateForm} />
            <Second form={this.state.form} />
            {/* <Progress /> */}
            <Third form={this.state.form} />
            <Last hashKey={'TheEnd!'} />

          </StepWizard>


        </Grid>
        {(demo && SW) && <InstanceDemo SW={SW} />}
      </Grid>
    );
  }
}

/** Demo of using instance */
const InstanceDemo = ({ SW }) => (
  <Fragment>
    <h4>Control from outside component</h4>
    <button className={'btn btn-secondary'} onClick={SW.previousStep}>Previous Step</button>
    &nbsp;
        <button className={'btn btn-secondary'} onClick={SW.nextStep}>Next Step</button>
  </Fragment>
);

/**
 * Stats Component - to illustrate the possible functions
 * Could be used for nav buttons or overview
 */
const Stats = ({
  currentStep,
  firstStep,
  goToStep,
  lastStep,
  nextStep,
  previousStep,
  totalSteps,
  step,
}) => (
    <div>
      {/* <hr /> */}
      {/* { step > 1 &&
            <button className='btn btn-default btn-block' onClick={previousStep}>Go Back</button>
        }
        { step < totalSteps ?
            <button className='btn btn-primary btn-block' onClick={nextStep}>Get Started</button>
            :
            <button className='btn btn-success btn-block' onClick={nextStep}>Continue</button>
        }
        { step > 1 && step < totalSteps ?
            <button className='btn btn-primary btn-block'  onClick={nextStep}>Continue</button>
            :
             step === 1 ? <button className='btn btn-success btn-block' onClick={nextStep}>Get Started</button> : <button className='btn btn-success btn-block' >Visit the creator space</button>
        } */}
    </div>
  );

/** Steps */

class First extends Component {
  update = (e) => {
    this.props.update(e.target.name, e.target.value);
  }

  render() {
    return (
      <Typography component="div">
        <Grid container className={"bec_cre_bkl bec_cre_resp"}>
          <Grid item xs={12} lg={12} className={"left_part_bla_bg"}>
            <input type='hidden' className='form-control' name='firstname' placeholder='First Name'
              onChange={this.update} />
            {/* <Box mb={4} fontStyle="normal">
              <Avatar className={"bigAvatar"} src={'/api/users/photo/' + auth.isAuthenticated().user._id} />
            </Box> */}
            <Box fontSize="h6.fontSize" className={"left_text_blk left_text_resp"}>
              <Typography variant="h2" component="h2" className={"title_big"}>Become a creator</Typography>

              {/* <Typography  component="p" className={"big_txt18"}>
              <Typography component="p" className={"big_txt18"}>
                Stan.Me is committed to support your craft and <br />
                your passion. This is a creative space where you <br />
                can show off your talent, post content and <br />
                monetise it.
             </Typography> */}

            </Box>

            <Typography variant="ul" component="ul" className={"line_indicator"}>
              <Typography variant="li" component="li" className={"active_line"}></Typography>
              <Typography variant="li" component="li"></Typography>
              <Typography variant="li" component="li"></Typography>
              <Typography variant="li" component="li"></Typography>
            </Typography>

          </Grid>

          <Grid item xs={12} lg={12} className={"right_part_whi_bg right_prt_res"}>
            <Box mb={4} mt={0} variant="h4" component="h4" className={"title_big20 hide-resbig20"}>Your perks</Box>

            <Typography variant="ul" component="ul" className={"right_con_icon"}>
              <Typography variant="li" component="li" className={"get_Stanned"}>
                <Typography variant="h5" component="h5">Get Stanned</Typography>
                <Typography component="p">
                  Set up a rolling monthly subscription plan so Stans can access your premium content
                    </Typography>
              </Typography>

              <Typography variant="li" component="li" className={"earnings_cre"}>
                <Typography variant="h5" component="h5">Earnings</Typography>
                <Typography component="p">
                  {/** Connect your bank account with Stripe and withdraw your earnings at any time**/}
                  Get paid directly into your bank account, at any time.
                </Typography>
              </Typography>

              <Typography variant="li" component="li" className={"earn_tips_cre"}>
                <Typography variant="h5" component="h5">Earn tips</Typography>
                <Typography component="p">
                  Let followers tip you any amount on your content
                </Typography>
              </Typography>

              <Typography variant="li" component="li" className={"access_creator_space_cre"}>
                <Typography variant="h5" component="h5">Access your Creator Space</Typography>
                <Typography variant="p" component="p">
                  Check your progress, customise your revenue model
                </Typography>
              </Typography>

              <Typography variant="li" component="li" className={"online_store_cre"}>
                <Typography variant="h5" component="h5">Own your online store</Typography>
                <Typography component="p">
                  Use your online store to sell digital and physical products
                </Typography>
              </Typography>


              <Typography variant="li" component="li" className={"get_visibility_cre"}>
                <Typography variant="h5" component="h5">Get visibility</Typography>
                <Typography variant="p" component="p">
                  Get featured on Stan.me discover page and social media channels and enjoy the limelight
                </Typography>
              </Typography>

            </Typography>
            <Button className={"btn_sec_full_black"} onClick={this.props.nextStep}>Get Started</Button>

          </Grid>

        </Grid>
        <Stats step={1} {...this.props} />
      </Typography>
    );
  }
}
let names = [];
var suggestions = '';
let categories = new Array();
let element = '';
var selectedValueGlobal = new Array();
var selectedExistCategories = new Array();
var enteredOptionalCategory = new Array();
var isCategoryNameExist = false;
class Second extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      multi: [],
      selectedButton: '',
      selectedValue: [],
      typeInValue: '',
      isCategoryNameExist: false,
      open: false,
      errormsg: '',
      selectedCategoriesName: [],
      error: "",
      isExistInDatabase: false,
      showmore: false,
      showmoretext: "Show more options"
    }
    this.props = props;
  }
  validate = () => {
    if (confirm('Are you sure you want to go back?')) { // eslint-disable-line
      this.props.previousStep();
    }
  }
  componentDidMount = () => {
    const jwt = auth.isAuthenticated()
    /* Start Fetching Existing categories */
    read(
      {
        userId: jwt.user._id
      },
      { t: jwt.token }
    ).then(data => {
      if (data.error) {
        this.setState({ error: data.error });
      } else {
        selectedExistCategories = data.creatorcategory;
        sleep(200).then(() => {
          data.creatorcategory.forEach(element => {
            this.makeCategorySelect(element._id, element.name)
          });
        })
      }
    });
    /* Fetched exist categories */
    topCreatorCategory({
      userId: jwt.user._id
    }, { t: jwt.token }).then((data) => {
      if (data.error) {
        this.setState({ redirectToSignin: true })
      } else {
        if (data) {

          categories = data;
          data.forEach(element => {
            this.state.selectedCategoriesName.push(element.name.toLowerCase())
          });
        }
      }
    });


    sleep(500).then(() => {
      this.setState({ names: names })
      suggestions =
        categories.map(suggestion => ({
          value: suggestion._id,
          //    label: suggestion.name,
        }));
      sleep(100).then(() => {
        this.setState({
          loader: false
        })
      })
    })
    categories = []
  }
  makeCategorySelect(id, name) {
    if (this.state.selectedValue.length < 3) {
      sleep(100).then(() => {
        if (this.state.selectedValue.indexOf(id) > -1) {
          this.state.selectedValue.splice(this.state.selectedValue.indexOf(id), 1);

          //if(this.state.selectedButton === id) { 
          this.setState({ selectedButton: '' });
          //  } else {
          //     this.setState({selectedButton: id})
          //  } 

          sleep(100).then(() => {
          })
        } else {
          this.state.selectedValue.push(id);
          this.setState({ selectedButton: id })
          // sleep(100).then(() => {
          //   console.log("else  length :" + this.state.selectedValue.length);
          // })
        }
      })
    }
    else if (this.state.selectedValue.length == 3) {
      if (this.state.selectedValue.indexOf(id) > -1) {
        this.state.selectedValue.splice(this.state.selectedValue.indexOf(id), 1);
        this.setState({ selectedButton: id })
        sleep(100).then(() => {
        })
        // if (this.state.selectedCategoriesName.indexOf(name.toLowerCase()) > -1) {
        //   this.state.selectedCategoriesName.splice(this.state.selectedCategoriesName.indexOf(name.toLowerCase()), 1);
        // } else {
        //   this.state.selectedCategoriesName.push(name.toLowerCase())
        // }
      }

    }
    selectedValueGlobal = this.state.selectedValue;
  }
  handleRequestClose = (event, reason) => {
    this.setState({ open: false })
  }
  handleOnChange = name => event => {
    //console.log(" handleOnChange " + event.target.value)
    this.setState({ typeInValue: event.target.value.trim() });
  }
  handleContinue() {
    if (this.state.typeInValue) {
      //console.log(this.state.selectedCategoriesName)
      if (this.state.selectedCategoriesName.indexOf(this.state.typeInValue.toLowerCase()) > -1) {
        // console.log(this.state.selectedCategoriesName)
        this.setState({ isCategoryNameExist: true, errormsg: "Please choose another category which is not in above categories.", open: true });
      } else {
        const jwt = auth.isAuthenticated();
        /* Check category name exists */
        checkCategory({
          value: this.state.typeInValue
        }).then(data => {
          if (data === null || data === "") {
            this.setState({ isCategoryNameExist: false });
          } else {
            data.forEach(element => {
              //  console.log("else element " + element._id + "element.name " + element.name.toLowerCase() + " this.state.typeInValue :" + this.state.typeInValue.toLowerCase());  
              if (element._id !== "" && (element.name.toLowerCase() === this.state.typeInValue.toLowerCase())) {
                this.setState({ isCategoryNameExist: true, isExistInDatabase: true });
                selectedValueGlobal.push(element._id)
                isCategoryNameExist = true;
                enteredOptionalCategory = [];
              }
              else {
                this.setState({ isCategoryNameExist: false });
              }
            });
          }
        });
        if (this.state.isCategoryNameExist === false) {
          enteredOptionalCategory = this.state.typeInValue;
        }
        /* End Check Again Username exist */
      }
    }
    sleep(200).then(() => {
      if (this.state.typeInValue) {
        if (this.state.isCategoryNameExist === false) {
          //console.log(selectedValueGlobal);
          //console.log(enteredOptionalCategory);
          this.props.nextStep();
        } else if (this.state.isCategoryNameExist === true && this.state.isExistInDatabase === true) {
          this.props.nextStep();
        }
      } else {
        this.props.nextStep();
      }

    });
  }
  onback = () => {
    this.props.previousStep();
  }

  showmore = () => {
    var text = this.state.showmore ? "Show more options" : "Show less options"
    this.setState({ showmore: !this.state.showmore, showmoretext: text })
  }

  render() {
    // console.log("selectedButton :" + this.state.selectedButton);
    const { classes } = this.props
    return (
      <Typography component="div">
        <Grid container className={"bec_cre_bkl tell_sec_resp"}>
          {/* { this.props.form.firstname && <h3>Hey {this.props.form.firstname}! 👋</h3> }
                I've added validation to the previous button. */}

          <Grid item xs={12} lg={12} className={"left_part_bla_bg second_left_step_sec"}>

            <input type='hidden' className='form-control' name='firstname' placeholder='First Name'
              onChange={this.update} />

            <Box fontSize="h6.fontSize" className={"left_text_blk second_left_step_height"}>
              <i className="far fa-chevron-left back_btn" onClick={this.onback}></i>
              <Typography variant="h2" component="h2" className={"title_big"}>Tell us what you do</Typography>
            </Box>

            <Typography variant="ul" component="ul" className={"line_indicator"}>
              <Typography variant="li" component="li" className={"active_line"}></Typography>
              <Typography variant="li" component="li" className={"active_line"}></Typography>
              <Typography variant="li" component="li"></Typography>
              <Typography variant="li" component="li"></Typography>
            </Typography>
          </Grid>


          <Grid item xs={12} lg={12} className={"right_part_whi_bg left_txt second_right_step_sec"}>
            <Box mb={2} mt={0} variant="h5" component="h5" className={"title_big20 tit23"}>What best describes you and your content?</Box>
            <Box mb={2} mt={0} variant="h5" component="h5" className="gray_col">Select up to three options</Box>
            <Box mb={4} mt={4} className={"button_outer_blk"}>
              <Box mb={4} mt={4} className={"my_inner_btn"}>
                {
                  categories.slice(0, 12).map((item, i) => {
                    return <Button mb={2} style={{ width: '27%', borderRadius: '8px', border: '2px solid #000', marginTop: '10px', marginBottom: '10px', marginLeft: '14px', marginRight: '14px', textTransform: 'none', }} key={i} className={this.state.selectedValue.indexOf(item._id) > -1 ? "selectedV" : ''} onClick={() => this.makeCategorySelect(item._id, item.name)} id={item._id}>{item.name}</Button>
                  })
                }
              </Box>
              {this.state.showmore &&
                <Box mb={4} mt={4} className={"my_inner_btn"}>
                  {
                    categories.slice(12).map((item, i) => {
                      return <Button mb={2} style={{ width: '27%', borderRadius: '8px', border: '2px solid #000', marginTop: '10px', marginBottom: '10px', marginLeft: '14px', marginRight: '14px', textTransform: 'none', }} key={i} className={this.state.selectedValue.indexOf(item._id) > -1 ? "selectedV" : ''} onClick={() => this.makeCategorySelect(item._id, item.name)} id={item._id}>{item.name}</Button>
                    })
                  }
                </Box>
              }

              <Box mb={4} mt={4} className={"my_inner_btn option_more_btn"}>
                <span onClick={this.showmore}>{this.state.showmoretext}</span>
                {!this.state.showmore &&
                  <i className="fal fa-chevron-down"></i>}
                {this.state.showmore &&
                  <i className="fal fa-chevron-up"></i>}
              </Box>
              {/* <Box mb={2} mt={0} variant="h5" component="h5">List up one more <Typography variant="span" component="span">(optional)</Typography></Box> */}
              {/* <ReactSelect 
                            placeholder="Enter Categories"             
                            create={true}
                            multi={false} 
                            closeOnSelect={true}
                            keepSelectedInList={true}
                            searchable={true}
                            /> */}
              {/* <TextField
                id="standard-full-width"
                // label={<span className={"shrinklabel"}>Title</span>}
                onChange={this.handleOnChange()}
                placeholder="Type in"
                className={"textFieldforms"}
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              /> */}
            </Box>
            <Button className={"btn_sec_full_black"} disabled={this.state.selectedValue.length >= 1 ? false : true} onClick={() => this.handleContinue()}>Continue</Button>
            {/* onClick={this.props.nextStep} */}

          </Grid>

          {/* <Stats step={2} {...this.props} previousStep={this.validate} /> */}

        </Grid>
      </Typography>
    );
  }
}
// class Progress extends Component {
//     state = {
//         isActiveClass: '',
//         timeout: null,
//     }
//     componentDidUpdate() {
//         const { timeout } = this.state;
//         if (this.props.isActive && !timeout) {
//             this.setState({

//                 timeout: setTimeout(() => {
//                     this.props.nextStep();
//                 }, 1000),
//             });
//         } else if (!this.props.isActive && timeout) {
//             clearTimeout(timeout);
//             this.setState({
//                 isActiveClass: '',
//                 timeout: null,
//             });
//         }
//     }
//     render() {
//         return (
//             <div >
//                 <p className='text-center'>Automated Progress...</p>
//                 <div >
//                     <div/>
//                 </div>
//             </div>
//         );
//     }
// }
class Third extends Component {
  constructor(props) {
    super(props)
    this.state = {
      options: 'bankaccount',
      isChecked: true,
      selectedCountry: '',
      error: '',          // error from API
      errors: {},        // form validation error.
      open: false,
      bsb: '',
      accountnumber: '',
      iban: '',
      bankcode: '',
      branchcode: '',
      transitnumber: '',
      institutionnumber: '',
      clearingcode: '',
      bankname: '',
      branchname: '',
      accountownername: '',
      clabe: '',
      sortcode: '',
      routingnumber: '',
      isNext: false,
      creatorcategory: '',
      stripe_user_id: ''
    }
    this.props = props;
  }
  componentDidMount = () => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    this.userData = new FormData()
    this.userData.set("payouttype", 2)
    this.categoryData = new FormData()
  }
  handleValidation() {
    let errors = {};
    let res = [];
    let formIsValid = true;
    var ibanArray = ["AT", "BE", "DK", "EE", "FI", "FR", "DE", "GI", "IE", "IT", "LT", "LU", "LV", "NL", "NO", "PL", "PT", "SK", "SI", "ES", "SE", "CH"];
    var transitArray = ["CA"];
    var clearingArray = ["HK"];
    var clabeArray = ["MX"];
    var sortArray = ["GB"];
    var routingArray = ["US"];
    var institutionArray = ["CA"];
    var bankNumberArray = ["JP"];
    var branchNumberArray = ["JP"];
    var accountOwnerNameArray = ["JP"];
    var bankCodeArray = ["JP", "BR", "SG"];
    var branchCodeArray = ["JP", "HK", "SG", "BR"];
    var accountNumberArray = ["US", "GB", "NZ", "JP", "HK", "BR", "SG", "AU"];
    if (this.state.selectedCountry === 'AU') {
      errors["bsb"] = required(this.state.bsb, "BSB is required")
      res.push(required(this.state.bsb, "BSB is required"))
    } else if (ibanArray.indexOf(this.state.selectedCountry) > -1) {
      errors["iban"] = required(this.state.accountnumber, "IBAN Number is required")
      res.push(required(this.state.iban, "IBAN Number is required"))
    }
    else if (transitArray.indexOf(this.state.selectedCountry) > -1) {
      errors["transitnumber"] = required(this.state.transitnumber, "transit number is required")
      res.push(required(this.state.transitnumber, "transit number is required"))
    }
    else if (clearingArray.indexOf(this.state.selectedCountry) > -1) {
      errors["clearingcode"] = required(this.state.clearingcode, "clearing code is required")
      res.push(required(this.state.clearingcode, "clearing code is required"))
    }
    else if (accountNumberArray.indexOf(this.state.selectedCountry) > -1) {
      errors["accountnumber"] = required(this.state.accountnumber, "Account Number is required")
      res.push(required(this.state.accountnumber, "Account Number is required"))
    }
    else if (bankCodeArray.indexOf(this.state.selectedCountry) > -1) {
      errors["bankcode"] = required(this.state.bankcode, "bankcode  is required")
      res.push(required(this.state.bankcode, "bankcode is required"))
    }
    else if (branchCodeArray.indexOf(this.state.selectedCountry) > -1) {
      errors["branchcode"] = required(this.state.branchcode, "branchcode is required")
      res.push(required(this.state.branchcode, "branchcode is required"))
    }
    else if (institutionArray.indexOf(this.state.selectedCountry) > -1) {
      errors["institutionnumber"] = required(this.state.institutionnumber, "institution number is required")
      res.push(required(this.state.institutionnumber, "institution number is required"))
    }
    else if (branchNumberArray.indexOf(this.state.selectedCountry) > -1) {
      errors["branchname"] = required(this.state.branchname, "branch name is required")
      res.push(required(this.state.accountownername, "account owner name is required"))
    }
    else if (accountOwnerNameArray.indexOf(this.state.selectedCountry) > -1) {
      errors["accountownername"] = required(this.state.accountownername, "account owner name is required")
      res.push(required(this.state.branchname, "branch name is required"))
    }
    else if (clabeArray.indexOf(this.state.selectedCountry) > -1) {
      errors["clabe"] = required(this.state.clabe, "clabe is required")
      res.push(required(this.state.clabe, "clabe is required"))
    }
    else if (sortArray.indexOf(this.state.selectedCountry) > -1) {
      errors["sortcode"] = required(this.state.sortcode, "sort code is required")
      res.push(required(this.state.sortcode, "sort code is required"))
    }
    else if (routingArray.indexOf(this.state.selectedCountry) > -1) {
      errors["routingnumber"] = required(this.state.routingnumber, "routing number is required")
      res.push(required(this.state.routingnumber, "routing number is required"))
    }
    else if (bankNumberArray.indexOf(this.state.selectedCountry) > -1) {
      errors["bankname"] = required(this.state.bankname, "bank name is required")
      res.push(required(this.state.bankname, "bank name is required"))
    }
    var count = countError(res)
    if (count > 0) {
      formIsValid = false;
      this.setState({ errors: errors })
    }
    return formIsValid;
  }

  onSiteChanged = name => event => {
    this.setState({ options: event.target.value })
    var payouttypevalue = 1
    if (event.target.value == "bankaccount") {
      payouttypevalue = 2
    }
    this.userData.set("payouttype", payouttypevalue)
    // , isChecked: false, selectedCountry: ''
  }
  handleChange = name => event => {
    this.setState({ selectedCountry: event.target.value, bsb: '', accountnumber: '', iban: '', bankcode: '', branchcode: '', transitnumber: '', institutionnumber: '', clearingcode: '', bankname: '', branchname: '', accountownername: '', clabe: '', sortcode: '', routingnumber: '' })
    this.userData.set(name, event.target.value)
  }

  handleBankAccount = name => event => {
    let errors = {};
    this.setState({ error: "" })
    const value = event.target.value
    this.userData.set(name, value)
    this.setState({ [name]: value })
  }

  submitForm = () => {
    const jwt = auth.isAuthenticated()
    // sleep(100).then(() => {
    //   console.log(" enteredOptionalCategory " + enteredOptionalCategory + " && isCategoryNameExist :" + isCategoryNameExist)
    //   if (enteredOptionalCategory !== "" && isCategoryNameExist === false) {
    //     insertcategory({
    //       name: enteredOptionalCategory
    //     }, {
    //       t: jwt.token
    //     }).then((data) => {
    //       if (data.error) {
    //         this.setState({ error: data.error })
    //       } else {
    //         console.log("insertcategory  data" + data)
    //         selectedValueGlobal.push(data._id)
    //         console.log(" data id " + data._id)
    //       }
    //     })
    //   }
    // })
    console.log("abc")
    sleep(200).then(() => {
      this.userData.set('creatorcategory', selectedValueGlobal)
      localStorage.setItem("creatorcategory", JSON.stringify(selectedValueGlobal));
      this.setState({ error: "" })
      this.setState({ errors: "" })
      window.location.href =
        "https://connect.stripe.com/express/oauth/authorize?response_type=code&client_id=" + config.stripe_connect_test_client_id + "&scope=read_write#/";
      /*** below commented on 24 jan 2020 */
      // payment({
      //   userId: jwt.user._id
      // }, {
      //   t: jwt.token
      // }, this.userData).then((data) => {
      //   if (data.error) {
      //     this.setState({ error: data.error });
      //   } else {
      //     /* Update local storage value */
      //     var jwt = JSON.parse(localStorage.jwt);
      //     jwt.user.name = data.name;
      //     jwt.user.username = data.username;
      //     jwt.user.email = data.email;
      //     jwt.user.creator = data.creater.status;
      //     localStorage.setItem("jwt", JSON.stringify(jwt));
      //     /* End Update local storage value */
      //     sleep(1000).then(() => {
      //       //this.props.nextStep();
      //       if (this.state.options == "bankaccount") {
      //         window.location.href =
      //           "https://connect.stripe.com/express/oauth/authorize?response_type=code&client_id=" + config.stripe_connect_test_client_id + "&scope=read_write#/";
      //       }
      //       else if (this.state.options == "stripe") {
      //         //this.props.nextStep();
      //         window.location.href =
      //           "https://connect.stripe.com/express/oauth/authorize?response_type=code&client_id=" + config.stripe_connect_test_client_id + "&scope=read_write&email=" + this.state.stripe_user_id + "#/";
      //       }
      //     })

      //   }
      // });
      /*** above commented on 24 jan 2020 */
      /*Start Insert Custom Bank Details */
      // if (this.handleValidation()) {
      //   // this.userData.set(status, 1)               
      //   const jwt = auth.isAuthenticated()
      //   const user = {
      //     bsb: this.state.bsb || undefined,
      //     accountnumber: this.state.accountnumber || undefined,
      //     iban: this.state.iban || undefined,
      //     bankcode: this.state.bankcode || undefined,
      //     branchcode: this.state.branchcode || undefined,
      //     transitnumber: this.state.transitnumber || undefined,
      //     institutionnumber: this.state.institutionnumber || undefined,
      //     clearingcode: this.state.clearingcode || undefined,
      //     bankname: this.state.bankname || undefined,
      //     branchname: this.state.branchname || undefined,
      //     accountownername: this.state.accountownername || undefined,
      //     clabe: this.state.clabe || undefined,
      //     sortcode: this.state.sortcode || undefined,
      //     routingnumber: this.state.routingnumber || undefined
      //   }
      //   payment({
      //     userId: jwt.user._id
      //   }, {
      //     t: jwt.token
      //   }, this.userData).then((data) => {
      //     if (data.error) {
      //       this.setState({ error: data.error })
      //     } else {
      //       this.setState({ 'redirectToProfile': false, open: true, paymentmsg: `Your Account Detail is Updated Successfully.`, isNext: true })
      //       /* Update local storage value */
      //       var jwt = JSON.parse(localStorage.jwt);
      //       console.log(" jwt " + jwt.user + " jwt.length " + Object.keys(jwt.user).length)
      //       jwt.user.name = data.name;
      //       jwt.user.username = data.username;
      //       jwt.user.email = data.email;
      //       jwt.user.creator = data.creater.status;
      //       localStorage.setItem("jwt", JSON.stringify(jwt));
      //       /* End Update local storage value */
      //       sleep(1000).then(() => {
      //         this.props.nextStep();
      //       })

      //     }
      //   })
      // }
      /*End Insert Custom Bank Details */
    })

  }
  handleRequestClose = (event, reason) => {
    this.setState({ open: false })
  }
  onback = () => {
    this.props.previousStep();
  }
  render() {
    return (
      <Typography component="div">
        <Grid container className={"bec_cre_bkl creator_wallet_resp"}>
          <Grid item xs={12} lg={12} className={"left_part_bla_bg third_left_step_sec"}>
            <input type='hidden' className='form-control' name='firstname' placeholder='First Name'
              onChange={this.update} />
            <Box fontSize="h6.fontSize" className={"left_text_blk "}>
              <i className="far fa-chevron-left back_btn" onClick={this.onback}></i>
              <Typography variant="h2" component="h2" className={"title_big"}>Your Wallet</Typography>

            </Box>
            <Typography variant="ul" component="ul" className={"line_indicator"}>
              <Typography variant="li" component="li" className={"active_line"}></Typography>
              <Typography variant="li" component="li" className={"active_line"}></Typography>
              <Typography variant="li" component="li" className={"active_line"}></Typography>
              <Typography variant="li" component="li"></Typography>
            </Typography>

          </Grid>

          <Grid item xs={12} lg={12} className={"right_part_whi_bg left_txt third_right_step_sec board-cre-temp"}>
            <Box className={"choose_option_blk"}>
              <Box mb={4} mt={0} variant="h5" component="h5" className={"title_big20"}>Enter your bank account details</Box>
              {/* <Box mb={2} mt={0} variant="h5" component="h5" className="gray_col">Select your option</Box> */}
            </Box>

            <Box mb={4} mt={0} component="div" className={"radio_button_blk"}>
              <RadioGroup className={"radio-bank"} aria-label="stripe" name="stripe" onChange={this.onSiteChanged("bank")} >
                <Typography variant="div" component="div" className={"be-cre-rshow"}><FormControlLabel value="bankaccount" control={<Radio />} checked={this.state.options == "bankaccount"} label="Powered and secured by Stripe" />
                  <Typography variant="div" component="div" className={"sub_title_txt"}>Amount withdrawn will be deposited directly in your bank account. Processing fees applicable as per Stripe policy.</Typography>
                </Typography>
                <Typography variant="div" component="div" className={"be-cre-rhide"}><FormControlLabel value="stripe" control={<Radio />} checked={this.state.options == "stripe"} label="Directly to your Stripe Account" />
                  <Typography variant="div" component="div" className={"sub_title_txt"}>Amount withdrawn will be deposited directly in your Stripe account. There will be no service charges involved.</Typography>
                  <TextField id="standard-full-width" style={{ display: this.state.options === "stripe" ? 'block' : 'none' }} placeholder="Type your stripe Account ID" autoComplete="off" onChange={this.handleBankAccount('stripe_user_id')} className={"textFieldforms_full full_email"} margin="normal" InputLabelProps={{ shrink: true, }} />
                </Typography>

              </RadioGroup>

              {/* <Box mb={2} mt={0}  component="div" className={"input1"}>
                <input type="radio" value="bankaccount" fullWidth checked={this.state.options === "bankaccount"} fullWidth onChange={() => this.onSiteChanged('bankaccount')} />
                Bank Account
                </Box> */}

              {/* <Box mb={2} mt={0}   component="div" className={"input1"} > 
                        <input  type="radio" value="stripe"   fullWidth  checked={this.state.options === "stripe"}  fullWidth onChange={() => this.onSiteChanged("stripe")} /> 
                        Stripe
                </Box> */}

              <Select className={"select_box"}
                style={{ visibility: this.state.options === "bankaccount" ? 'hidden' : 'hidden' }}
                displayEmpty
                value={this.state.selectedCountry}
                onChange={this.handleChange('country')}
              >
                <option value="" disabled>Select Country</option>
                <option value="AU">Australia (AU)</option>
                <option value="AT">Austria (AT)</option>
                <option value="BE">Belgium (BE)</option>
                <option value="BR">BRBrazil (BR)</option>
                <option value="CA">Canada (CA)</option>
                <option value="DK">Denmark (DK)</option>
                <option value="EE">Estonia (EE)</option>
                <option value="FI">Finland (FI)</option>
                <option value="FR">France (FR)</option>
                <option value="DE">Germany (DE)</option>
                <option value="GI">Gibraltar (GI)</option>
                <option value="HK">Hong Kong (HK)</option>
                <option value="IE">Ireland (IE)</option>
                <option value="IT">Italy (IT)</option>
                <option value="JP">Japan (JP)</option>
                <option value="LT">Lithuania (LT)</option>
                <option value="LU">Luxembourg (LU)</option>
                <option value="LV">Latvia (LV)</option>
                <option value="MX">Mexico (MX)</option>
                <option value="NL">Netherlands (NL)</option>
                <option value="NZ">New Zealand (NZ)</option>
                <option value="NO">Norway (NO)</option>
                <option value="PL">Poland (PL)</option>
                <option value="PT">Portugal (PT)</option>
                <option value="SG">Singapore (SG)</option>
                <option value="SK">Slovakia (SK)</option>
                <option value="SI">Slovenia (SI)</option>
                <option value="ES">Spain (ES)</option>
                <option value="SE">Sweden (SE)</option>
                <option value="CH">Switzerland (CH)</option>
                <option value="GB">United Kingdom (GB)</option>
                <option value="US">United States (US)</option>
              </Select>

              <box component="div" className="tabs-content_big">
                <div className="tabs-content">
                  <div className="tabs-tab" id="AU" style={{ display: this.state.selectedCountry === "AU" ? 'block' : 'none' }}>
                    <table className="alternate">

                      <tbody><tr>
                        <td>BSB</td>
                        <td><TextField onChange={this.handleBankAccount('bsb')} id="standard-full-width" placeholder="123456 (6 characters)" className={"textFieldforms_full"} margin="normal" InputLabelProps={{ shrink: true, }} /></td>
                      </tr>
                        <tr>
                          <td>Account Number</td>
                          <td><TextField onChange={this.handleBankAccount('accountnumber')} id="standard-full-width" placeholder="12345678 (6–9 characters)" className={"textFieldforms_full"} margin="normal" InputLabelProps={{ shrink: true, }} /></td>
                        </tr>
                      </tbody></table>
                  </div>
                  <div className="tabs-tab" id="AT" style={{ display: this.state.selectedCountry === "AT" ? 'block' : 'none' }}>    <table className="alternate">

                    <tbody><tr>
                      <td>IBAN</td>
                      <td><TextField onChange={this.handleBankAccount('iban')} id="standard-full-width" placeholder="AT611904300234573201" className={"textFieldforms_full"} margin="normal" InputLabelProps={{ shrink: true, }} /></td>
                    </tr>
                    </tbody></table>
                  </div>
                  <div className="tabs-tab" id="BE" style={{ display: this.state.selectedCountry === "BE" ? 'block' : 'none' }}>    <table className="alternate" >

                    <tbody><tr>
                      <td>IBAN</td>
                      <td><TextField onChange={this.handleBankAccount('iban')} id="standard-full-width" placeholder="BE12345678912345" className={"textFieldforms_full"} margin="normal" InputLabelProps={{ shrink: true, }} /></td>
                    </tr>
                    </tbody></table>
                  </div>
                  <div className="tabs-tab" id="BR" style={{ display: this.state.selectedCountry === "BR" ? 'block' : 'none' }}>    <table className="alternate">

                    <tbody><tr>
                      <td>Bank Code</td>
                      <td><TextField onChange={this.handleBankAccount('bankcode')} id="standard-full-width" placeholder="123 (3 characters)" className={"textFieldforms_full"} margin="normal" InputLabelProps={{ shrink: true, }} /></td>
                    </tr>
                      <tr>
                        <td>Branch Code</td>
                        <td><TextField onChange={this.handleBankAccount('branchcode')} id="standard-full-width" placeholder="4567 (4 characters, with 1 optional check digit)" className={"textFieldforms_full"} margin="normal" InputLabelProps={{ shrink: true, }} /></td>
                      </tr>
                      <tr>
                        <td>Account Number</td>
                        <td><TextField onChange={this.handleBankAccount('accountnumber')} id="standard-full-width" placeholder="Format varies by bank" className={"textFieldforms_full"} margin="normal" InputLabelProps={{ shrink: true, }} /></td>
                      </tr>
                    </tbody></table>
                  </div>
                  <div className="tabs-tab" id="CA" style={{ display: this.state.selectedCountry === "CA" ? 'block' : 'none' }}>    <table className="alternate">

                    <tbody><tr>
                      <td>Transit Number</td>
                      <td><TextField onChange={this.handleBankAccount('transitnumber')} id="standard-full-width" placeholder="12345" className={"textFieldforms_full"} margin="normal" InputLabelProps={{ shrink: true, }} /></td>
                    </tr>
                      <tr>
                        <td>Institution Number</td>
                        <td><TextField onChange={this.handleBankAccount('institutionnumber')} id="standard-full-width" placeholder="678" className={"textFieldforms_full"} margin="normal" InputLabelProps={{ shrink: true, }} /></td>
                      </tr>
                      <tr>
                        <td>Account Number</td>
                        <td><TextField onChange={this.handleBankAccount('accountnumber')} id="standard-full-width" placeholder="Format varies by bank" className={"textFieldforms_full"} margin="normal" InputLabelProps={{ shrink: true, }} /></td>
                      </tr>
                    </tbody></table>
                  </div>
                  <div className="tabs-tab" id="DK" style={{ display: this.state.selectedCountry === "DK" ? 'block' : 'none' }}>    <table className="alternate">

                    <tbody><tr>
                      <td>IBAN</td>
                      <td><TextField onChange={this.handleBankAccount('iban')} id="standard-full-width" placeholder="DK5000400440116243" className={"textFieldforms_full"} margin="normal" InputLabelProps={{ shrink: true, }} /></td>
                    </tr>
                    </tbody></table>
                  </div>
                  <div className="tabs-tab" id="EE" style={{ display: this.state.selectedCountry === "EE" ? 'block' : 'none' }}>    <table className="alternate">

                    <tbody><tr>
                      <td>IBAN</td>
                      <td><TextField onChange={this.handleBankAccount('iban')} id="standard-full-width" placeholder="EE382200221020145685 (20 characters)" className={"textFieldforms_full"} margin="normal" InputLabelProps={{ shrink: true, }} /></td>
                    </tr>
                    </tbody></table>
                  </div>
                  <div className="tabs-tab" id="FI" style={{ display: this.state.selectedCountry === "FI" ? 'block' : 'none' }}>    <table className="alternate">

                    <tbody><tr>
                      <td>IBAN</td>
                      <td><TextField onChange={this.handleBankAccount('iban')} id="standard-full-width" placeholder="FI2112345600000785" className={"textFieldforms_full"} margin="normal" InputLabelProps={{ shrink: true, }} /></td>
                    </tr>
                    </tbody></table>
                  </div>
                  <div className="tabs-tab" id="FR" style={{ display: this.state.selectedCountry === "FR" ? 'block' : 'none' }}>    <table className="alternate">

                    <tbody><tr>
                      <td>IBAN</td>
                      <td><TextField onChange={this.handleBankAccount('iban')} id="standard-full-width" placeholder="FR1420041010050500013M02606 (27 characters)" className={"textFieldforms_full"} margin="normal" InputLabelProps={{ shrink: true, }} /></td>
                    </tr>
                    </tbody></table>
                  </div>
                  <div className="tabs-tab" id="DE" style={{ display: this.state.selectedCountry === "DE" ? 'block' : 'none' }}>    <table className="alternate">

                    <tbody><tr>
                      <td>IBAN</td>
                      <td><TextField onChange={this.handleBankAccount('iban')} id="standard-full-width" placeholder="DE89370400440532013000 (22 characters)" className={"textFieldforms_full"} margin="normal" InputLabelProps={{ shrink: true, }} /></td>
                    </tr>
                    </tbody></table>
                  </div>
                  <div className="tabs-tab" id="GI" style={{ display: this.state.selectedCountry === "GI" ? 'block' : 'none' }}>    <table className="alternate">

                    <tbody><tr>
                      <td>IBAN</td>
                      <td><TextField onChange={this.handleBankAccount('iban')} id="standard-full-width" placeholder="GI75NWBK000000007099453 (23 characters)" className={"textFieldforms_full"} margin="normal" InputLabelProps={{ shrink: true, }} /></td>
                    </tr>
                    </tbody></table>

                  </div>
                  <div className="tabs-tab selected" id="HK" style={{ display: this.state.selectedCountry === "HK" ? 'block' : 'none' }} >    <table className="alternate">

                    <tbody><tr>
                      <td>Clearing Code</td>
                      <td><TextField onChange={this.handleBankAccount('clearingcode')} id="standard-full-width" placeholder="123 (3 characters)" className={"textFieldforms_full"} margin="normal" InputLabelProps={{ shrink: true, }} /></td>
                    </tr>
                      <tr>
                        <td>Branch Code</td>
                        <td><TextField onChange={this.handleBankAccount('branchcode')} id="standard-full-width" placeholder="456 (3 characters)" className={"textFieldforms_full"} margin="normal" InputLabelProps={{ shrink: true, }} /></td>
                      </tr>
                      <tr>
                        <td>Account Number</td>
                        <td><TextField onChange={this.handleBankAccount('accountnumber')} id="standard-full-width" placeholder="123456-789 (6-9 characters)" className={"textFieldforms_full"} margin="normal" InputLabelProps={{ shrink: true, }} /></td>
                      </tr>
                    </tbody></table>
                  </div>
                  <div className="tabs-tab" id="IE" style={{ display: this.state.selectedCountry === "IE" ? 'block' : 'none' }}>    <table className="alternate">

                    <tbody><tr>
                      <td>IBAN</td>
                      <td><TextField onChange={this.handleBankAccount('iban')} id="standard-full-width" placeholder="IE29AIBK93115212345678 (22 characters)" className={"textFieldforms_full"} margin="normal" InputLabelProps={{ shrink: true, }} /></td>
                    </tr>
                    </tbody></table>
                  </div>
                  <div className="tabs-tab" id="IT" style={{ display: this.state.selectedCountry === "IT" ? 'block' : 'none' }}>    <table className="alternate">

                    <tbody><tr>
                      <td>IBAN</td>
                      <td><TextField onChange={this.handleBankAccount('iban')} id="standard-full-width" placeholder="IT60X0542811101000000123456 (27 characters)" className={"textFieldforms_full"} margin="normal" InputLabelProps={{ shrink: true, }} /></td>
                    </tr>
                    </tbody></table>
                  </div>
                  <div className="tabs-tab" id="JP" style={{ display: this.state.selectedCountry === "JP" ? 'block' : 'none' }}>    <table className="alternate">

                    <tbody><tr>
                      <td>Bank Name</td>
                      <td><TextField onChange={this.handleBankAccount('bankname')} id="standard-full-width" placeholder="123 (3 characters)" className={"textFieldforms_full"} margin="normal" InputLabelProps={{ shrink: true, }} /></td>
                    </tr>
                      <tr>
                        <td>Branch Name</td>
                        <td><TextField onChange={this.handleBankAccount('branchname')} id="standard-full-width" placeholder="123 (3 characters)" className={"textFieldforms_full"} margin="normal" InputLabelProps={{ shrink: true, }} /></td>
                      </tr>
                      <tr>
                        <td>Bank Code</td>
                        <td><TextField onChange={this.handleBankAccount('bankcode')} id="standard-full-width" placeholder="0123 (4 characters)" className={"textFieldforms_full"} margin="normal" InputLabelProps={{ shrink: true, }} /></td>
                      </tr>
                      <tr>
                        <td>Branch Code</td>
                        <td><TextField id="standard-full-width" onChange={this.handleBankAccount('branchcode')} placeholder="456 (3 characters)" className={"textFieldforms_full"} margin="normal" InputLabelProps={{ shrink: true, }} /></td>
                      </tr>
                      <tr>
                        <td>Account Number</td>
                        <td><TextField onChange={this.handleBankAccount('accountnumber')} id="standard-full-width" placeholder="1234567 (7-8 characters)" className={"textFieldforms_full"} margin="normal" InputLabelProps={{ shrink: true, }} /></td>
                      </tr>
                      <tr>
                        <td>Account Owner Name</td>
                        <td><TextField onChange={this.handleBankAccount('accountownername')} id="standard-full-width" placeholder="123 (3 characters)" className={"textFieldforms_full"} margin="normal" InputLabelProps={{ shrink: true, }} /></td>
                      </tr>
                    </tbody></table>

                  </div>
                  <div className="tabs-tab" id="LT" style={{ display: this.state.selectedCountry === "LT" ? 'block' : 'none' }}>    <table className="alternate">

                    <tbody><tr>
                      <td>IBAN</td>
                      <td><TextField onChange={this.handleBankAccount('iban')} id="standard-full-width" placeholder="LT121000011101001000 (20 characters)" className={"textFieldforms_full"} margin="normal" InputLabelProps={{ shrink: true, }} /></td>
                    </tr>
                    </tbody></table>
                  </div>
                  <div className="tabs-tab" id="LU" style={{ display: this.state.selectedCountry === "LU" ? 'block' : 'none' }}>    <table className="alternate">

                    <tbody><tr>
                      <td>IBAN</td>
                      <td><TextField onChange={this.handleBankAccount('iban')} id="standard-full-width" placeholder="LU280019400644750000 (20 characters)" className={"textFieldforms_full"} margin="normal" InputLabelProps={{ shrink: true, }} /></td>
                    </tr>
                    </tbody></table>
                  </div>
                  <div className="tabs-tab" id="LV" style={{ display: this.state.selectedCountry === "LV" ? 'block' : 'none' }}>    <table className="alternate">

                    <tbody><tr>
                      <td>IBAN</td>
                      <td><TextField onChange={this.handleBankAccount('iban')} id="standard-full-width" placeholder="LV80BANK0000435195001 (21 characters)" className={"textFieldforms_full"} margin="normal" InputLabelProps={{ shrink: true, }} /></td>
                    </tr>
                    </tbody></table>
                  </div>
                  <div className="tabs-tab" id="MX" style={{ display: this.state.selectedCountry === "MX" ? 'block' : 'none' }}>    <table className="alternate">

                    <tbody><tr>
                      <td>CLABE</td>
                      <td><TextField onChange={this.handleBankAccount('clabe')} id="standard-full-width" placeholder="123456789012345678 (18 characters)" className={"textFieldforms_full"} margin="normal" InputLabelProps={{ shrink: true, }} /></td>
                    </tr>
                    </tbody></table>
                  </div>
                  <div className="tabs-tab" id="NL" style={{ display: this.state.selectedCountry === "NL" ? 'block' : 'none' }}>    <table className="alternate">

                    <tbody><tr>
                      <td>IBAN</td>
                      <td><TextField onChange={this.handleBankAccount('iban')} id="standard-full-width" placeholder="NL39RABO0300065264 (18 characters)" className={"textFieldforms_full"} margin="normal" InputLabelProps={{ shrink: true, }} /></td>
                    </tr>
                    </tbody></table>
                  </div>
                  <div className="tabs-tab" id="NZ" style={{ display: this.state.selectedCountry === "NZ" ? 'block' : 'none' }}>    <table className="alternate">

                    <tbody><tr>
                      <td>Account Number</td>
                      <td><TextField onChange={this.handleBankAccount('accountnumber')} id="standard-full-width" placeholder="AABBBB3456789YZZ (15-16 digits)" className={"textFieldforms_full"} margin="normal" InputLabelProps={{ shrink: true, }} /></td>
                    </tr>
                    </tbody></table>
                  </div>
                  <div className="tabs-tab" id="NO" style={{ display: this.state.selectedCountry === "NO" ? 'block' : 'none' }}>    <table className="alternate">

                    <tbody><tr>
                      <td>IBAN</td>
                      <td><TextField onChange={this.handleBankAccount('iban')} id="standard-full-width" placeholder="NO9386011117947 (15 characters)" className={"textFieldforms_full"} margin="normal" InputLabelProps={{ shrink: true, }} /></td>
                    </tr>
                    </tbody></table>
                  </div>
                  <div className="tabs-tab" id="PL" style={{ display: this.state.selectedCountry === "PL" ? 'block' : 'none' }}>    <table className="alternate">

                    <tbody><tr>
                      <td>IBAN</td>
                      <td><TextField onChange={this.handleBankAccount('iban')} id="standard-full-width" placeholder="PL61109010140000071219812874 (28 characters)" className={"textFieldforms_full"} margin="normal" InputLabelProps={{ shrink: true, }} /></td>
                    </tr>
                    </tbody></table>
                  </div>
                  <div className="tabs-tab" id="PT" style={{ display: this.state.selectedCountry === "PT" ? 'block' : 'none' }}>    <table className="alternate">

                    <tbody><tr>
                      <td>IBAN</td>
                      <td><TextField onChange={this.handleBankAccount('iban')} id="standard-full-width" placeholder="PT50123443211234567890172 (25 characters)" className={"textFieldforms_full"} margin="normal" InputLabelProps={{ shrink: true, }} /></td>
                    </tr>
                    </tbody></table>
                  </div>
                  <div className="tabs-tab" id="SG" style={{ display: this.state.selectedCountry === "SG" ? 'block' : 'none' }}>    <table className="alternate">

                    <tbody><tr>
                      <td>Bank Code</td>
                      <td><TextField onChange={this.handleBankAccount('bankcode')} id="standard-full-width" placeholder="1234" className={"textFieldforms_full"} margin="normal" InputLabelProps={{ shrink: true, }} /></td>
                    </tr>
                      <tr>
                        <td>Branch Code</td>
                        <td><TextField onChange={this.handleBankAccount('branchcode')} id="standard-full-width" placeholder="567" className={"textFieldforms_full"} margin="normal" InputLabelProps={{ shrink: true, }} /></td>
                      </tr>
                      <tr>
                        <td>Account Number</td>
                        <td><TextField onChange={this.handleBankAccount('accountnumber')} id="standard-full-width" placeholder="123456789012 (6-12 characters)" className={"textFieldforms_full"} margin="normal" InputLabelProps={{ shrink: true, }} /></td>
                      </tr>
                    </tbody></table>
                  </div>
                  <div className="tabs-tab" id="SK" style={{ display: this.state.selectedCountry === "SK" ? 'block' : 'none' }}>    <table className="alternate">

                    <tbody><tr>
                      <td>IBAN</td>
                      <td><TextField onChange={this.handleBankAccount('iban')} id="standard-full-width" placeholder="SK3112000000198742637541 (24 characters)" className={"textFieldforms_full"} margin="normal" InputLabelProps={{ shrink: true, }} /></td>
                    </tr>
                    </tbody></table>
                  </div>
                  <div className="tabs-tab" id="SI" style={{ display: this.state.selectedCountry === "SI" ? 'block' : 'none' }}>    <table className="alternate">

                    <tbody><tr>
                      <td>IBAN</td>
                      <td><TextField onChange={this.handleBankAccount('iban')} id="standard-full-width" placeholder="SI56263300012039086 (19 characters)" className={"textFieldforms_full"} margin="normal" InputLabelProps={{ shrink: true, }} /></td>
                    </tr>
                    </tbody></table>
                  </div><div className="tabs-tab absolute" id="ES" style={{ display: this.state.selectedCountry === "ES" ? 'block' : 'none' }}>    <table className="alternate">

                    <tbody><tr>
                      <td>IBAN</td>
                      <td><TextField onChange={this.handleBankAccount('iban')} id="standard-full-width" placeholder="ES9121000418450200051332 (24 characters)" className={"textFieldforms_full"} margin="normal" InputLabelProps={{ shrink: true, }} /></td>
                    </tr>
                    </tbody></table>
                  </div>
                  <div className="tabs-tab" id="SE" style={{ display: this.state.selectedCountry === "SE" ? 'block' : 'none' }}>    <table className="alternate">

                    <tbody><tr>
                      <td>IBAN</td>
                      <td><TextField onChange={this.handleBankAccount('iban')} id="standard-full-width" placeholder="SE3550000000054910000003 (24 characters)" className={"textFieldforms_full"} margin="normal" InputLabelProps={{ shrink: true, }} /></td>
                    </tr>
                    </tbody></table>
                  </div>
                  <div className="tabs-tab" id="CH" style={{ display: this.state.selectedCountry === "CH" ? 'block' : 'none' }}>    <table className="alternate">

                    <tbody><tr>
                      <td>IBAN</td>
                      <td><TextField onChange={this.handleBankAccount('iban')} id="standard-full-width" placeholder="CH9300762011623852957 (21 characters)" className={"textFieldforms_full"} margin="normal" InputLabelProps={{ shrink: true, }} /></td>
                    </tr>
                    </tbody></table>
                  </div>
                  <div className="tabs-tab absolute" id="GB" style={{ display: this.state.selectedCountry === "GB" ? 'block' : 'none' }}>    <table className="alternate">

                    <tbody><tr>
                      <td>Sort Code</td>
                      <td><TextField onChange={this.handleBankAccount('sortcode')} id="standard-full-width" placeholder="12-34-56" className={"textFieldforms_full"} margin="normal" InputLabelProps={{ shrink: true, }} /></td>
                    </tr>
                      <tr>
                        <td>Account Number</td>
                        <td><TextField onChange={this.handleBankAccount('accountnumber')} id="standard-full-width" placeholder="01234567" className={"textFieldforms_full"} margin="normal" InputLabelProps={{ shrink: true, }} /></td>
                      </tr>
                    </tbody></table>
                    <table className="alternate">

                      <tbody><tr>
                        <td>IBAN</td>
                        <td><TextField onChange={this.handleBankAccount('iban')} id="standard-full-width" placeholder="GB82WEST12345698765432 (22 characters)" className={"textFieldforms_full"} margin="normal" InputLabelProps={{ shrink: true, }} /></td>
                      </tr>
                      </tbody></table>
                  </div>
                  <div className="tabs-tab" id="US" style={{ display: this.state.selectedCountry === "US" ? 'block' : 'none' }}>    <table className="alternate">

                    <tbody><tr>
                      <td>Routing Number</td>
                      <td><TextField onChange={this.handleBankAccount('routingnumber')} id="standard-full-width" placeholder="111000000 (9 characters)" className={"textFieldforms_full"} margin="normal" InputLabelProps={{ shrink: true, }} /></td>
                    </tr>
                      <tr>
                        <td>Account Number</td>
                        <td><TextField onChange={this.handleBankAccount('accountnumber')} id="standard-full-width" placeholder="Format varies by bank" className={"textFieldforms_full"} margin="normal" InputLabelProps={{ shrink: true, }} /></td>
                      </tr>
                    </tbody></table>
                  </div>
                </div>
              </box>
            </Box>

            <Button className={"btn_sec_full_black"} onClick={this.submitForm} disabled={(this.state.options == "stripe" && this.state.stripe_user_id) || this.state.options == "bankaccount" ? false : true}>Continue</Button>
            {/* onSubmit={this.submitForm} disabled={this.state.isChecked} */}

          </Grid>

        </Grid>
        <Stats step={4} {...this.props} />
        <CardContent>
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            open={this.state.open}
            onClose={this.handleRequestClose}
            autoHideDuration={6000}
            message={<span >{this.state.paymentmsg}</span>}
          />
        </CardContent>
      </Typography>

      // <div>
      //     <div className={'text-center'}>
      //         <h3>This is the last step in this example!</h3>
      //         <hr />

      //     </div>
      //     <Stats step={4} {...this.props} nextStep={this.submit} />
      // </div>
    );
  }
}
class Last extends Component {
  submit = () => {
    alert('You did it! Yay!') // eslint-disable-line
  }
  render() {
    return (
      <Typography component="div">
        <Grid container className={"bec_cre_bkl creator_set_resp"}>
          <Grid item xs={12} lg={12} className={"left_part_bla_bg fourth_left_step_sec"}>
            <input type='hidden' className='form-control' name='firstname' placeholder='First Name'
              onChange={this.update} />

            <Box fontSize="h6.fontSize" className={"left_text_blk"}>
              <Typography variant="h2" component="h2" className={"title_big"}>You are all set!</Typography>
            </Box>
            <Typography variant="ul" component="ul" className={"line_indicator"}>
              <Typography variant="li" component="li" className={"active_line"}></Typography>
              <Typography variant="li" component="li" className={"active_line"}></Typography>
              <Typography variant="li" component="li" className={"active_line"}></Typography>
              <Typography variant="li" component="li" className={"active_line"}></Typography>
            </Typography>

          </Grid>

          <Grid item xs={12} lg={12} className={"right_part_whi_bg button_link fourth_right_step_sec"}>
            <Box mb={4} mt={0} component="h5" className={"title_big20"}>Browse the creators space </Box>
            <center><Box mb={4} mt={0} component="p">
              Check out how to add Stans subscription and<br />
              open the online store. Setting these up early in<br />
              the process will ensure you are off to a great start.
                </Box></center>
            <Link to={"/creatorspace"} ><Button className={"btn_sec_full_black"} >Visit the Creators Space</Button></Link>
          </Grid>

        </Grid>
        {/* <Stats step={3} {...this.props}  /> */}
        <Stats step={4} {...this.props} nextStep={this.submit} />
      </Typography>
      // <div>
      //     <div className={'text-center'}>
      //         <h3>This is the last step in this example!</h3>
      //         <hr />

      //     </div>
      //     <Stats step={4} {...this.props} nextStep={this.submit} />
      // </div>
    );
  }
}

