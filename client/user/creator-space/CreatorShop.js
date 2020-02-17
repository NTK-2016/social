import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles'
import Paper from '@material-ui/core/Paper';
import Typography from 'material-ui/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Box from '@material-ui/core/Box';
import Switches from 'material-ui/Switch'
import Select from 'material-ui/Select'
import PropTypes from 'prop-types'
import { FormGroup, FormControlLabel, FormControl, FormLabel } from 'material-ui';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import { TextField } from 'material-ui';
import auth from '../../auth/auth-helper';
import { enableShop, fetchenableShopBtnStatus, fetchCountrylist, shippingprice } from '../../user/api-user'
import Snackbar from 'material-ui/Snackbar'
import CustomButton from '../../common/CustomButton'
import CustomSwitch from '../../common/CustomSwitch'
let shopdata = [];
const styles = theme => ({

  container: {
    display: 'grid',
  },
})
let countries = [];
let ctname = '', shippingcharge = 0;
class CreatorShop extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userId: '',
      shopstatus: false,
      standiscount: '',
      errors: '',
      shopenblemsg: '',
      open: false,
      country: [],
      countryname: '',
      charges: '',
      shippinginfo: []
    }
    this.props = props
  }
  componentDidMount = () => {
    this.userData = new FormData();
    const jwt = auth.isAuthenticated();
    fetchenableShopBtnStatus(
      { userId: this.props.userId },
      {
        t: jwt.token
      }).then((data) => {
        if (data.error) {
          console.log(data)
        }
        else {
          if (data.standiscount) {
            this.userData.set("standiscount", data.standiscount)
          }

          this.userData.set("shopstatus", data.shopbtn)
          shopdata = data.shippinginfo;
          shopdata.forEach(dt => {
            ctname = dt.countryname;
            shippingcharge = dt.charges
          })
          this.userData.set("countryname", ctname)
          this.userData.set("charges", shippingcharge)
          this.setState({ standiscount: (data.standiscount == null) ? '' : data.standiscount, shopstatus: data.shopbtn, shippinginfo: shopdata, countryname: ctname, charges: shippingcharge })
        }
      })
    fetchCountrylist({
      userId: this.props.userId
    }, { t: jwt.token }).then((data) => {
      if (data.error) {
        this.setState({ redirectToSignin: true })
      } else {
        data.forEach(element => {
          countries = element.name;
        });

        this.setState({ country: countries })
      }

    });
  }


  // set value of formdata on handlechange
  handleChange = name => event => {
    const value = name === 'shopstatus' ?
      event.target.checked
      : event.target.value;

    this.userData.set(name, value)
    this.setState({ [name]: value })

  }
  clickAddMore = () => {
    const user =
    {
      userId: this.props.userId,
      countryname: this.state.countryname,
      charges: this.state.charges
    }
    shippingprice(user).then((data) => {
      if (data.error) {
        this.setState({ error: data.error })
      } else {
        this.setState({ error: '' })
      }
    })

  }
  clickSubmit = () => {
    const jwt = auth.isAuthenticated()
    enableShop({
      userId: this.props.userId
    }, {
      t: jwt.token
    }, this.userData).then((data) => {
      if (data.error) {
        this.setState({ error: data.error })
      } else {
        let msg = ''
        if (this.state.shopstatus) {
          msg = `Changes have been saved `;
        } else {
          msg = `Changes have been saved `;
        }
        //console.log(" data shopstatus :" + this.state.shopstatus)
        this.setState({ 'redirectToProfile': false, open: true, shopenblemsg: msg })
      }
    })

  }
  // Snackbar closed popup

  checkNumber = (evt) => {

    // var iKeyCode = (event.which) ? event.which : event.keyCode
    // if (iKeyCode != 46 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57))
    //   return false;

    // return true;
    const standiscount = (evt.target.validity.valid) ? evt.target.value : this.state.standiscount;

    this.setState({ standiscount });
    this.userData.set("standiscount", standiscount);
  }

  render() {
    const { classes } = this.props
    return (
      <Grid className={"creatorshop-container"}>
        <Grid container>
          <Grid item xs={12}>
            <Box className={"shop_outer_blk"}>
              <Grid className={"add_shop_blk"}>
                <Typography component="h2" className={"title18"} >
                  Manage your shop
                                </Typography>
                <Typography component="p" >
                  Use the toggle button to activate or deactivate the shop on your profile
               </Typography>
                <Typography className={"button-abled"} component={"div"}>
                  {/**<FormControlLabel className={"shop-switch"} control={<Switches color="primary" onChange={this.handleChange('shopstatus')} value={this.state.shopstatus} checked={this.state.shopstatus} />} />
					**/}
                  <CustomSwitch className={"customswitch"} onChange={this.handleChange('shopstatus')} value={this.state.shopstatus} checked={this.state.shopstatus} />
                  {(!this.state.shopstatus) ? (<Typography component="p">Disabled</Typography>) : ((<Typography component="p">Enabled</Typography>))}</Typography >
              </Grid>
              {
                (!auth.isAuthenticated().user.stanEnabled && this.state.shopstatus) &&
                <Typography component="p" className={"shop-subs-tit"}> Set up a subscription plan to offer Stans-only discounts  </Typography>
              }
              {
                // (auth.isAuthenticated().user.stanEnabled ||
                //   !auth.isAuthenticated().user.stanEnabled ||
                //   (!auth.isAuthenticated().user.stanEnabled && !this.state.shopstatus) ||
                //   ) 

                ((auth.isAuthenticated().user.stanEnabled && this.state.shopstatus) ||
                  (!auth.isAuthenticated().user.stanEnabled && this.state.shopstatus) ||
                  (auth.isAuthenticated().user.stanEnabled && !this.state.shopstatus))


                &&
                <Typography component="div" className={"active_blk"} >
                  <Grid item xs={12} sm={12} >

                    <Typography component="div" className={!this.state.shopstatus || (this.state.shopstatus && !auth.isAuthenticated().user.stanEnabled) ? "discount-disable" : ""}>
                      <Typography component="h2" className={"title19"}>
                        Add a discount
                            </Typography>
                      <Typography component="p" className={"pforteen"}>Offer a discount to your Stans</Typography>
                      <Typography component="div" className={"discount_inp_blk mt-10"}>
                        {/* <TextField placeholder=""
                          className={"discount_box"}
                          onChange={this.handleChange('standiscount')}
                          value={this.state.standiscount} 
                          disabled={!this.state.shopstatus}
                        /> */}
                        <Typography component="div" className={"discount_box"}>
                          <input
                            placeholder=""
                            value={this.state.standiscount}
                            disabled={!this.state.shopstatus}
                            type="text"
                            pattern="^\d*(\.\d{0,2})?$"
                            onInput={this.checkNumber.bind(this)} />
                        </Typography>
                        <Typography component="p" color="error" className={"error-input"}> {this.state.errors["standiscount"]}</Typography>
                      </Typography>
                    </Typography>
                    {/**  <Typography component="p" >Offer a discount to your Stans</Typography>
                    <Typography component="div" className={"discount_inp_blk mt-10"}>
                      <TextField placeholder="" 
					  className={"discount_box"} 
					  onChange={this.handleChange('standiscount')} 
					  value={this.state.standiscount} disabled={!this.state.shopstatus} 
					  />
                      <Typography component="p"  color="error" className={"error-input"}> {this.state.errors["standiscount"]}</Typography>
				  </Typography>**/}
                    {/*
                  <Typography component="div"  className={"shop-table-head"}>
 <div className={"publishtext"}>
                    <Select
                      
					  disableUnderline={true} 
                      onChange={this.handleChange('countryname')}
                      value={this.state.countryname}
                      disabled={!this.state.shopstatus}
					  className={"selectdropdown"}
					   MenuProps=
{{
classes: { paper: "upload-dropdown" },
getContentAnchorEl: null,
anchorOrigin:
{
vertical: "bottom",
horizontal: "left",
},
 transformOrigin: {
            vertical: "top",
            horizontal: "left"
          },
}}
                    >
                      <option value="">Select Country</option>
                      {
                        this.state.country.map((item, i) => {


                          return (

                            <option value={item}>{item}</option>
                          )

                        })}
                    </Select>
					        </div>
                    <TextField placeholder="Shipping Charges" defaultvalue={this.state.charges} className={"discount_box shop-charge"} onChange={this.handleChange('shippingamount')} disabled={!this.state.shopstatus} />
                    {(shopdata.length < 2) ?
                      (<right>
                        {/* <Button className={"save-button"} color="primary" onClick={this.clickAddMore} disabled={!this.state.shopstatus}>Add d</Button> *
                        <CustomButton className={"Primary_btn"} onClick={this.clickAddMore} disabled={!this.state.shopstatus} label="Add" />
                      </right>)
                      : (<right>
                        {/* <Button className={"save-button"} color="primary" onClick={this.clickAddMore} disabled={!this.state.shopstatus}>Add More</Button> *
                        <CustomButton className={"Primary_btn"} onClick={this.clickAddMore} disabled={!this.state.shopstatus} label="Add More" />
                      </right>)
                    }
                  </Typography> */}
                  </Grid>
                  {/* <Grid>
                  <table className={"shop-tab-inner"}>
                    <thead>
                      <tr>
                        <th>Country</th>
                        <th>Shipping Charges</th>
                      
                      </tr>
                    </thead>
                    <tbody>
                      {shopdata.map((item, i) => {

                        return (<tr>
                          <td>{item.countryname}</td>
                          <td>${item.charges}</td>
                          <td>Edit/Delete</td></tr>
                        )
                      })

                      }
                    </tbody>

                  </table>
                </Grid>*/}
                </Typography>
              }
              {/**<Button className={"save-button"} color="primary" onClick={this.clickSubmit} >Save</Button>**/}
              <div className="button_con_blk">
                <CustomButton label="Save" buttonloader={false} onClick={this.clickSubmit} className={"Primary_btn_blk flt-rt"} />
              </div>
              <Snackbar
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                open={this.state.open}
                onClose={this.handleRequestClose}
                autoHideDuration={6000}
                message={<span >{this.state.shopenblemsg}</span>}
              />
            </Box>

          </Grid>
        </Grid>
      </Grid>

    )
  };
}
CreatorShop.propTypes = {
  classes: PropTypes.object.isRequired,
  //CreatorShop: PropTypes.array.isRequired,
}

export default withStyles(styles)(CreatorShop)