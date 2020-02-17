import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import List, {
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText
} from "material-ui/List";
import Avatar from "material-ui/Avatar";
import Button from "material-ui/Button";
import Typography from "material-ui/Typography";
import Edit from "material-ui-icons/Edit";
import { Redirect, Link } from "react-router-dom";
import GridList, { GridListTile } from "material-ui/GridList";
import { ProductList, ProductRemove } from "./api-user.js";
import Shop from "./Shop";
import IconButton from "material-ui/IconButton";
import DeleteIcon from "material-ui-icons/Delete";
import Grid from "material-ui/Grid";
import Card, { CardActions, CardContent } from "material-ui/Card";
import DeleteProduct from "./DeleteProduct";
import auth from "./../auth/auth-helper";
import Product from "./../post/Product";
import CustomButton from "../common/CustomButton";
import { ViewArray } from "material-ui-icons";
const styles = theme => ({
  root: {
    paddingTop: theme.spacing.unit * 2,
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    background: theme.palette.background.paper
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: "auto"
  },
  gridList: {
    width: 500,
    height: 220
  },
  tileText: {
    textAlign: "center",
    marginTop: 10
  }
});
class ShopGrid extends Component {
  constructor() {
    super();
    this.state = {
      shop: []
    };
  }

  // componentDidMount = () => {
  //   ProductList().then((data) => {
  //     if (data.error) {
  //       console.log(data.error)
  //     } else {
  //       this.setState({shop: data})
  //     }
  //   })
  // }

  render() {
    console.log(this.props);
    const { classes } = this.props;
    return (
      <section>
        {(this.props.isCreator && this.props.isShop) && (

          <Typography component="div" className={"profileshop-div"}>
            <Grid container className={"shop-grid-main"}>
              {this.props.shop.map((item, i) => {
                let arr = [];
                if (item.categories) arr = item.categories.split(",");

                let attach = [];
                if (item.attach) attach = item.attach.split(",");

                let productimage = [];
                if (item.photo) productimage = item.photo.split(",");

                return (
                  <Product
                    post={item}
                    key={i}
                    popid={i}
                    onRemove={this.props.removeUpdate}
                    onProductRemove={this.props.removeProductUpdate}
                    categories={arr}
                    attach={attach}
                    productimage={productimage}
                  />
                );
                // <CardContent>
                //             <Grid >
                //                 <IconButton aria-label="Edit" color="primary">
                //                   <List dense style={{ width:"500px",padding:"5px 0px 5px 50px" }}>
                //                     <ListItem>
                //                       <ListItemText primary={item.productname}/>
                //                       <ListItemText primary={item.price}/>
                //                       <ListItemText primary={item.description}/><Link to={"/editproduct/" + item._id} key={i}><Edit/></Link><DeleteProduct productId={item._id}/>
                //                     </ListItem>
                //                   </List>
                //                 </IconButton>
                //                 <ListItemSecondaryAction>
                //                 </ListItemSecondaryAction>
                //             </Grid>
                //  </CardContent>
              })}
            </Grid>
            {this.props.shop.length == 0 &&
              this.props.userId === auth.isAuthenticated().user._id && (
                <div className={"find-creator-btn"}>
                  <div className={"find-become-creator"}>
                    <Typography component="p" className={"shop-creatormsg"}>You are not selling anything yet.</Typography>
                  </div>
                </div>
              )}

            {/* Shop is active But empty */}
            {this.props.shop.length == 0 &&
              this.props.userId != auth.isAuthenticated().user._id && (
                <Typography component="div" className={"find-creator-btn"}>
                  <Typography component="div" className={"find-become-creator"}>
                    <Typography component="p" className={"para-sixteen"}>
                      Shop is empty
                    </Typography>
                  </Typography>
                </Typography>
              )}
          </Typography>
        )}
        {!this.props.isCreator && (
          <div className={"find-creator-btn"}>
            <div className={"find-become-creator"}>
              <Typography component="p" className={"shop-creatormsg"}>Become a creator to set up your online store</Typography>
              <Link to={"/becomecreator/" + auth.isAuthenticated().user._id}>
                <CustomButton
                  label="Become a creator"
                  className={"Primary_btn"}
                />
              </Link>
            </div>
          </div>
        )}
        {(!this.props.isShop && this.props.isCreator) && (
          <div className={"find-creator-btn"}>
            <div className={"find-become-creator"}>
              <Typography component="p" className={"shop-creatormsg"}>To start selling products enable your shop in the
creator space</Typography>
              <Link to={"/creatorspace/1"}>
                Manage your shop
              </Link>
            </div>
          </div>
        )}
      </section>
    );
  }
}

ShopGrid.propTypes = {
  classes: PropTypes.object.isRequired,
  shop: PropTypes.array.isRequired
};

export default withStyles(styles)(ShopGrid);
