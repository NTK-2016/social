import Orders from "../models/orders.model";
import Post from "../models/post.model";
import _ from "lodash";
import errorHandler from "./../helpers/dbErrorHandler";
import formidable from "formidable";
import fs from "fs";
import Notifications from "../models/notifications.model";
import nodemailer from "nodemailer";
import User from "../models/user.model";
import Transaction from "../models/transaction.model";
import config from "../../config/config";
import handlebars from "handlebars";
var moment = require("moment");

/** Nodemailer SMTP Mail Configuration */
let transporter = nodemailer.createTransport({
  //host: "smtp.gmail.com",
  service: "gmail",
  // port: 587,
  // secure: false, // true for 465, false for other ports
  auth: {
    user: config.smtpmail, // generated gmail user
    pass: config.smptppwd // generated gmail password
  }
});
/** End here SMTP Configuration */

var readHTMLFile = function (path, callback) {
  fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
    if (err) {
      throw err;
      callback(err);
    } else {
      callback(null, html);
    }
  });
};

/** Send Note to customer for purchase */
const sendPurchaseNote = (req, res) => {
  let message = req.body.message;
  let toBuyerEmail = "";
  Orders.findByIdAndUpdate(req.body.order_id, {
    $push: { messages: { message: message } },
    $set: { status: "Completed" }
  }).populate("user_id", "_id name")
    .populate("ordered_by", "_id name email")
    .populate("productid", "_id text")
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }
      toBuyerEmail = result.ordered_by.email;

      readHTMLFile(
        process.cwd() + "/server/controllers/emailer/shippingnote.html",
        function (err, html) {
          var template = handlebars.compile(html);
          var replacements = {
            name: result.ordered_by.name,
            id: result.ordered_by._id,
            creatorname: result.user_id.name,
            message: message,
            orderid: result.orderId,
            created: moment(new Date(result.created)).format(
              "D MMM YYYY HH:mm"
            ),
            servername: config.smtp_mail_server_path,
            profileImage: result.ordered_by.photo ? config.profileImageBucketURL + result.ordered_by.photo : config.profileDefaultPath
          };
          var htmlToSend = template(replacements);
          var mailOptions = {
            from: '"Stan.Me " <mail@stan.me>', // sender address
            to: toBuyerEmail, // list of receivers
            subject: "Note regarding your order", // Subject line
            text: "Note regarding your order", // plain text body
            html: htmlToSend
          };
          transporter.sendMail(mailOptions, function (error, response) {
            if (error) {
              console.log(error);
              callback(error);
            }
            res.json(result);
          });
        }
      );
    })
  // .select("_id created ordered_by");
};

const stripe = require("stripe")(config.stripe_test_secret_key);
const placeOrder = (req, res, next) => {
  let fromUserName = "";
  let toUserEmail = "";
  let toBuyerEmail = "";
  let referedId = "";
  let onbehalfof = "";
  let shopAmount = "";
  let toUserId = "";
  let fromUserId = "";
  let downloadfile = [];
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded"
      });
    }
    let order = new Orders(fields);
    var orderId = order._id;
    orderId = orderId.toString().substr(7, 6);
    order.orderId = orderId;
    order.address = {
      shipping_address: {
        name: fields.billname,
        street: fields.billaddressone,
        city: fields.billcity,
        userstate: fields.billstate,
        zipcode: fields.billzip,
        country: fields.billcountry
      },
      billing_address: {
        name: fields.billname,
        street: fields.billaddressone,
        city: fields.billcity,
        userstate: fields.billstate,
        zipcode: fields.billzip,
        country: fields.billcountry
      }
    };
    let orderAmount = fields.price * fields.quantity;
    let finalPaid = orderAmount + parseInt(fields.vat) + parseInt(fields.shippingCharges) - parseInt(fields.discount)
    finalPaid = finalPaid * 100;
    User.findOne({
      _id: fields.user_id
    }).exec((err, users) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }
      referedId = users.refercode ? users.refercode : ''
      onbehalfof = users.payment ? users.payment.stripe_user_id : ''

      /* Start Calculation */
      let paidvalue = finalPaid / 100
      let fee = paidvalue * config.chargePer / 100 //100*2.9/100
      fee = fee + config.extraDollar; // + 0.30 //3.78
      fee = Number(fee.toFixed(2))
      let totalNetAmount = paidvalue;  //116.22
      totalNetAmount = Number(totalNetAmount.toFixed(2));
      let ownerChargePer = referedId == '' ? config.ownerPer : config.ownerReferPer;
      var referAmount = 0
      if (referedId != '') {
        let referChargePer = referedId != '' ? config.referPer : '';
        referAmount = (referChargePer / 100) * (orderAmount); //5
        referAmount = Number(referAmount.toFixed(2))
      }
      let ownerAmt = (ownerChargePer / 100) * (orderAmount);
      ownerAmt = Number(ownerAmt.toFixed(2));
      let userNetAmount = totalNetAmount - ownerAmt - referAmount - fields.vat - fee;
      userNetAmount = Number(userNetAmount.toFixed(2))
      let processFeeAmt = fee
      processFeeAmt = Number(processFeeAmt.toFixed(2));
      /* End Calculation */
      console.log("onbehalfof " + onbehalfof)
      console.log(+userNetAmount + +fields.vat)
      let transfer_data_amount = +userNetAmount + +fields.vat
      console.log("a" + transfer_data_amount + "b")
      transfer_data_amount = Number(transfer_data_amount.toFixed(2))
      transfer_data_amount = transfer_data_amount * 100
      transfer_data_amount = Number(transfer_data_amount.toFixed(2))
      console.log(transfer_data_amount)
      stripe.charges.create(
        {
          amount: finalPaid,
          currency: "usd",
          source: fields.userToken, // obtained with Stripe.js
          description: "For Shop",
          expand: ["balance_transaction"],
          on_behalf_of: onbehalfof,
          transfer_data: {
            destination: onbehalfof,
            amount: transfer_data_amount
          }
        },
        function (err, charge) {
          if (charge) {
            /* Start Add Process Fee and segregate amount */

            order.transaction_id = charge.id;
            order.processFee = processFeeAmt;
            order.ownerAmount = ownerAmt;
            order.save((err, result) => {
              if (err) {
                return res.status(400).json({
                  error: errorHandler.getErrorMessage(err)
                });
              }
              fromUserName = fields.customer_name;
              fromUserId = fields.ordered_by;
              toUserId = fields.user_id;
              shopAmount = finalPaid / 100; //fields.price * fields.quantity;

              User.findOne({
                _id: fromUserId
              }).exec((err, users) => {
                if (err) {
                  return res.status(400).json({
                    error: errorHandler.getErrorMessage(err)
                  });
                }
                toBuyerEmail = users.email;
              })
              if (fields.product_type == "digital") {
                Post.findOne({
                  _id: fields.productid
                }).exec((err, posts) => {
                  if (err) {
                    return res.status(400).json({
                      error: errorHandler.getErrorMessage(err)
                    });
                  }
                  var downloadfilearray = posts.attach.split(',')
                  downloadfilearray.map((items, index) => {
                    downloadfile.push({ "name": items })
                  })
                })
              }
              /* Start Send Email Notification & Save Notification Data */
              /* Start Find User Detail */
              User.findOne({
                _id: fields.user_id
              }).exec((err, users) => {
                if (err) {
                  return res.status(400).json({
                    error: errorHandler.getErrorMessage(err)
                  });
                }
                toUserEmail = users.email;
                referedId = users.refercode ? users.refercode : ''
                /* End Find User Detail */

                var attributes = fields.attributes ? "(" + fields.attributes + ")" : ''
                if (toUserEmail != "") {
                  readHTMLFile(
                    process.cwd() + "/server/controllers/emailer/neworder.html",
                    function (err, html) {
                      var template = handlebars.compile(html);
                      var replacements = {
                        productname: fields.productname + attributes,
                        amount: Number(shopAmount.toFixed(2)),
                        created: moment(new Date(result.created)).format(
                          "D MMM YYYY HH:mm"
                        ),
                        servername: config.smtp_mail_server_path
                      };
                      var htmlToSend = template(replacements);
                      var mailOptions = {
                        from: '"Stan.Me " <mail@stan.me>', // sender address
                        to: toUserEmail, // list of receivers
                        subject: "You have a new order on Stan.Me!", // Subject line
                        text: "You have a new order on Stan.Me!", // plain text body
                        html: htmlToSend
                      };
                      transporter.sendMail(mailOptions, function (error, response) {
                        if (error) {
                          console.log(error);
                          callback(error);
                        }
                      });
                    }
                  );
                }

                if (toBuyerEmail != "") {
                  var mailerfilename = ''
                  var replacements = ''
                  if (fields.product_type == "physical") {
                    mailerfilename = "physical_order"
                    replacements = {
                      creatorname: users.name,
                      productname: fields.productname + attributes,
                      amount: Number(shopAmount.toFixed(2)),
                      created: moment(new Date(result.created)).format(
                        "D MMM YYYY HH:mm"
                      ),
                      servername: config.smtp_mail_server_path
                    };
                  }
                  else {
                    mailerfilename = "digital_order"
                    // var downloadparam = '';
                    // downloadfile.map((items, index) => {
                    //   downloadparam = downloadparam + "downloadfile" + index + ":" + items + ","
                    // })
                    //     console.log("downloadparam   " + downloadparam)
                    replacements = {
                      creatorname: users.name,
                      productname: fields.productname + attributes,
                      amount: Number(shopAmount.toFixed(2)),
                      orderId: orderId,
                      downloadfilecount: downloadfile.length,
                      created: moment(new Date(result.created)).format(
                        "D MMM YYYY HH:mm"
                      ),
                      servername: config.smtp_mail_server_path,
                      downloadfile: downloadfile
                    };
                  }
                  readHTMLFile(
                    process.cwd() + "/server/controllers/emailer/" + mailerfilename + ".html",
                    function (err, html) {
                      var template = handlebars.compile(html);

                      var htmlToSend = template(replacements);
                      var mailOptions = {
                        from: '"Stan.Me " <mail@stan.me>', // sender address
                        to: toBuyerEmail, // list of receivers
                        subject: "Stan.Me order confirmation", // Subject line
                        text: "Stan.Me order confirmation", // plain text body
                        html: htmlToSend
                      };
                      transporter.sendMail(mailOptions, function (error, response) {
                        if (error) {
                          console.log(error);
                          callback(error);
                        }
                      });
                    }
                  );
                }
              });
              // transporter.sendMail({
              //   from: '"Stan Me" <nikaengg@gmail.com>', // sender address
              //   to: toUserEmail, //"magento.web002@gmail.com",//"kamleshk.maurya@rvsolutions.in", // list of receivers
              //   subject: "got New Order", // Subject line
              //   text: fromUserName + " orderd you for $" + shopAmount, // plain text body
              //   html:
              //     "<p>" + fromUserName + " orderd you for $" + shopAmount + "</p>" // html body
              // });
              /* End Send Mail */
              /*Start Insert Data Into Notification  */
              let notification = new Notifications({
                type: "shop",
                fromId: fromUserId,
                toId: toUserId,
                amount: Number(userNetAmount.toFixed(2)),
                productId: fields.productid,
                status: 1
              });
              notification.save((err, result) => {
                if (err) {
                  return res.status(400).json({
                    error: errorHandler.getErrorMessage(err)
                  });
                }
                // res.status(200).json({
                //   message: "Successfully inserted notification!"
                // });
              });
              /* End Send Email Notification & Save Notification Data*/
              /* Start Insert Tip Transaction 2019-10-17 */
              let transaction = new Transaction();
              transaction.amount = Number(userNetAmount.toFixed(2));
              transaction.transactionId = order.transaction_id;
              transaction.processFee = processFeeAmt;
              transaction.vat = fields.vat;
              transaction.fromId = order.ordered_by;
              transaction.toId = order.user_id;
              transaction.tranStatus = 0;
              transaction.type = "order";
              transaction.ownerAmount = ownerAmt;
              transaction.referAmount = referAmount;
              //transaction.created = new Date();
              transaction.save((err, result1) => {
                if (err) {
                  console.log(err)
                  return res.status(400).json({
                    error: errorHandler.getErrorMessage(err)
                  });
                }
                if (referedId != "") {
                  let transaction = new Transaction();
                  transaction.amount = referAmount;
                  transaction.transactionId = order.transaction_id;
                  transaction.fromId = order.user_id;
                  transaction.toId = referedId;
                  transaction.type = "order";
                  transaction.tranStatus = 0;
                  transaction.save((err, result) => {
                    if (err) {
                      return res.status(400).json({
                        error: errorHandler.getErrorMessage(err)
                      });
                    }
                  })
                }
              });
              /* End Insert Tip Transaction */
              res.json(result);
            });
          } else {
            res.json(err);
          }
          // asynchronously called
        }
      );
    });
  });
};
const productsales = (req, res) => {
  let totalproduct = 0,
    totalsalesamt = 0,
    salesthismonth = 0,
    newprouctcount = 0;
  Orders.find({
    $and: [
      {
        user_id: {
          $in: req.params.userId
        }
      }
    ]
  }).exec((err, order) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      });
    }
    totalproduct = order.length;

    order.forEach(orderdata => {
      totalsalesamt += orderdata.price * orderdata.quantity;

      const currentmonth = new Date().getMonth();
      const currentyear = new Date().getFullYear();
      const salesmonth = new Date(orderdata.created).getMonth();
      const salesyears = new Date(orderdata.created).getFullYear();
      if (currentmonth == salesmonth && currentyear == salesyears) {
        salesthismonth += orderdata.price * orderdata.quantity;
        newprouctcount += 1;
      }
    });

    let totalsales = {
      totalproductsales: totalsalesamt,
      countSales: totalproduct,
      productthismonth: newprouctcount,
      salesthismonth: salesthismonth
    };
    res.json(totalsales);
  });
};
export default {
  sendPurchaseNote,
  placeOrder,
  productsales
};
