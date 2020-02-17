import User from "../models/user.model";
import Category from "../models/category.model";
import Report from "../models/report.model";
import _ from "lodash";
import errorHandler from "./../helpers/dbErrorHandler";
import formidable from "formidable";
import fs from "fs";
import profileImage from "./../../client/assets/images/profile-pic.png";
import bannerImage from "./../../client/assets/images/user-banner.png";
import nodemailer from "nodemailer";
import handlebars from "handlebars";
import Post from "../models/post.model";
import Orders from "../models/orders.model";
import Countries from "../models/countries.model";
import Transaction from "../models/transaction.model";
import Currency from "../models/currency.modal";
import Notifications from "../models/notifications.model";
import config from "../../config/config";
import dbErrorHandler from "./../helpers/dbErrorHandler";
import { keys } from "material-ui/styles/createBreakpoints";
import Vat from "../models/vat.model";
import crypto from "crypto";
var moment = require("moment");
//var localStorage = require('localStorage')
import Jimp from 'jimp';
const AWS = require("aws-sdk");
const path = require("path");

var mongoose = require("mongoose");
const key = require("./stan-me-644fd42f3a54.json");
const stripe = require("stripe")(config.stripe_test_secret_key);
//configuring the AWS environment
AWS.config.update({
  accessKeyId: "AKIATW724PWSTKKMJM5S", //AKIATW724PWSTKKMJM5S
  secretAccessKey: "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"//78Cc6RingCyrNYmuXt+3yKjpFw51cZRaxg1hTU8y
});

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

const awsupload = (foldername, filePath) => {
  if (fs.existsSync(filePath)) {
    /* AWS S3 code starts */
    var s3 = new AWS.S3();
    //configuring parameters
    var params = {
      Bucket: "stanmedata",
      Body: fs.createReadStream(filePath),
      Key: "uploads/" + foldername + "/" + path.basename(filePath),
      ACL: "public-read"
    };

    s3.upload(params, function (err, data) {
      //handle error
      if (err) {
        console.log("Error", err);
      }
      //success
      if (data) {
        console.log(data)
        fs.unlink(filePath, err => {
          if (err) {
            console.error(err);
            return;
          }
        });
      }
    });
    /* AWS S3 code ends */
  }
  else {
    awsupload(foldername, filePath)
  }
}

const create = (req, res, next) => {
  let valid = [];
  let user = new User(req.body);
  const token =
    Math.floor(Math.random(100) * 1000000000) + new Date().getTime();
  var referralcode = ''
  var referredemail = ''
  var referredusername = ''
  if (req.body.referral) {
    referralcode = req.body.referral
    User.findOne({ _id: referralcode })
      .exec((err, referusers) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
          });
        }
        referredemail = referusers.email
        referredusername = referusers.myreferralcode
      })
  } else {
    referralcode = null
  }
  user = _.extend(user, {
    verification: {
      token: token,
      status: 0
    },
    myreferralcode: req.body.username,
    refercode: referralcode
  });
  /* Start Check this email exist with not deleted user and insert new one if not   */
  User.find({
    $and: [{ email: { $eq: req.body.email } }, { isDeleted: { $ne: 1 } }]
  }).exec((err, users) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      });
    }
    if (users.length > 0) {
      res.status(200).json({
        duplicateEmail: "Email already exist!"
      });
    } else {

      user.save((err, result) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
          });
        }
        readHTMLFile(
          process.cwd() + "/server/controllers/emailer/welcome.html",
          function (err, html) {
            var template = handlebars.compile(html);
            var replacements = {
              name: result.name,
              id: result.id,
              servername: config.smtp_mail_server_path
            };
            var htmlToSend = template(replacements);
            var mailOptions = {
              from: '"Stan.Me " <mail@stan.me>', // sender address
              to: result.email, // list of receivers
              subject: "Verify your email address", // Subject line
              text: "Verify your email address", // plain text body
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
        if (req.body.referral) {
          readHTMLFile(
            process.cwd() + "/server/controllers/emailer/thank_referring_friend.html",
            function (err, html) {
              var template = handlebars.compile(html);
              var replacements = {
                name: result.name,
                referral: referredusername,
                servername: config.smtp_mail_server_path
              };
              var htmlToSend = template(replacements);
              var mailOptions = {
                from: '"Stan.Me " <mail@stan.me>', // sender address
                to: referredemail, // list of receivers
                subject: "Your friend " + result.name + " just joined Stan.Me!", // Subject line
                text: "Your friend " + result.name + " just joined Stan.Me!", // plain text body
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
        res.status(200).json({
          message: "Successfully signed up!"
        });
      });
    }
  });
  /* End Check this email exist with not deleted user and insert new one if not  */
};

/**
 * Load user and append to req.
 */
const userByID = (req, res, next, id) => {
  User.findById(id)
    .populate("following", "_id name username photo isDeleted")
    .populate("followers.followers_id", "_id followers_id name username photo isDeleted following")
    .populate("creatorcategory", "_id name")
    .exec((err, user) => {
      if (err || !user)
        return res.status("400").json({
          error: "This username or email entered doesn't exist. "
        });
      req.profile = user;
      next();
    });
};

const userByName = (req, res, next, username) => {
  //console.log(username)
  User.find({ 'username': username })
    .populate("following", "_id name username photo isDeleted")
    .populate("followers.followers_id", "_id followers_id name username photo isDeleted following")
    .populate("creatorcategory", "_id name")
    .exec((err, user) => {
      if (err || !user)
        return res.status("400").json({
          error: "Username not found"
        });
      req.profile = user;
      next();
    });
};



const userNameById = (req, res) => {
  //console.log("find" + req.body.userId)
  //console.log("req " + req.body.categoryid);
  User.findById(req.body.userId)
    .exec((err, user) => {
      if (err || !user)
        return res.status("400").json({
          error: "This username or email entered doesn't exist."
        });
      return res.json(user);
    });
};

const read = (req, res) => {

  //console.log("read*/*/*/", req)
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

const readName = (req, res) => {

  // console.log("read*/*/*/", req.profile)
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};





const list = (req, res) => {
  User.find({
    role: {
      $ne: "1"
    }
  })
    .exec((err, users) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }
      res.json(users);
    })
    .select("name email username updated created");
};

const update = (req, res, next) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.maxFieldsSize = 30 * 1024 * 1024;
  form.parse(req, (err, fields, files) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        error: "Photo could not be uploaded"
      });
    }
    if (fields.creatorcategory) {
      fields.creatorcategory = fields.creatorcategory.split(",");
    }
    let user = req.profile;
    if (fields.oldpassword) {
      if (!user.authenticate(fields.oldpassword)) {
        return res.status("200").json({
          error: "old password do not match."
        });
      }
      user.hashed_password = user.changePassword(fields.password);
    }
    user = _.extend(user, fields);
    user.updated = Date.now();
    const date = new Date();
    const time = date.getTime();
    if (fields.photo) {
      var base64Data = fields.photo.replace(/^data:image\/png;base64,/, "");
      fields.photo = user._id + ".png";
      user.photo = fields.photo;
      fs.writeFile(
        "dist/uploads/profileimages/" + fields.photo,
        base64Data,
        "base64",
        function (err) {
          if (err) console.log(err);
          let imgActive = "dist/uploads/profileimages/" + fields.photo;
          // setTimeout(() => {
          Jimp.read(imgActive)
            .then(image => {
              return image
                .resize(250, 250) // resize
                .quality(100) // set JPEG quality
                .write("dist/uploads/profileimages/thumbnail/Thumbnail_" + user._id + "." + image.getExtension()); // save
            })
            .catch(err => {
              console.error(err);
            });
          setTimeout(() => {
            awsupload("profileimages", "dist/uploads/profileimages/" + user._id + ".png")
            awsupload("profileimages/thumbnail", "dist/uploads/profileimages/thumbnail/Thumbnail_" + user._id + ".png")
          }, 3000);
          // }, 3000);
        }
      );
      /*user.photo.data = fs.readFileSync(files.photo.path);
      const file_ext = files.photo.name.split(".").pop();
      user.photo.contentType = files.photo.type;
      fs.rename(
        files.photo.path,
        "dist/upload/" + time + "." + file_ext,
        function(err) {}
      );*/
    }
    if (fields.banner) {

      var base64Data = fields.banner.replace(/^data:image\/png;base64,/, "");
      fields.banner = user._id + ".png";
      user.banner = fields.banner;
      fs.writeFile(
        "dist/uploads/bannerimages/" + fields.banner,
        base64Data,
        "base64",
        function (err) {
          console.log(err);

          let imgActive = "dist/uploads/bannerimages/" + fields.banner;
          //setTimeout(() => {
          Jimp.read(imgActive)
            .then(image => {
              return image
                .resize(912, 319) // resize
                .quality(100) // set JPEG quality
                .write("dist/uploads/bannerimages/compressbanners/" + "Thumbnail_" + user._id + "." + image.getExtension()); // save
            })
            .catch(err => {
              console.error(err);
            });
          setTimeout(() => {
            awsupload("bannerimages", "dist/uploads/bannerimages/" + fields.banner)
            awsupload("bannerimages/compressbanners", "dist/uploads/bannerimages/compressbanners/" + "Thumbnail_" + user._id + ".png")
          }, 3000);
          // }, 3000);
        }
      );


    }
    // console.log(files.banner);
    // if (files.banner) {
    //   var file_ext = files.banner.name.split(".").pop();
    //   fields.banner = user._id + "." + file_ext;
    //   user.banner = fields.banner;
    //   fs.rename(
    //     files.banner.path,
    //     "dist/uploads/bannerimages/" + user._id + "." + file_ext,
    //     function (err) { }
    //   );
    //   // var result = {
    //   //   data: {
    //   //     width: 240,
    //   //     height: 320,
    //   //     link: "/dist/uploads/bannerimages/" + user._id + "." + file_ext
    //   //   }
    //   // };
    //   // res.json(result);
    // }
    // if (fields.banner) {
    //   //console.log(" banner " + fields.banner);
    //   var base64Data = fields.banner.replace(/^data:image\/png;base64,/, "");
    //   fields.banner = user._id + ".png";
    //   user.banner = fields.banner;
    //   fs.writeFile(
    //     "dist/uploads/bannerimages/" + fields.banner,
    //     base64Data,
    //     "base64",
    //     function(err) {
    //       console.log(err);
    //     }
    //   );
    //   // user.banner.data = fs.readFileSync(files.banner.path);
    //   // const file_ext = files.banner.name.split(".").pop();
    //   // user.banner.contentType = files.banner.type;
    //   // user.banner.contentType = files.banner.type;
    //   // fs.rename(
    //   //   files.banner.path,
    //   //   "dist/upload/" + time + "." + file_ext,
    //   //   function (err) { }
    //   // );
    // }


    // console.log("hello test");
    user.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }
      user.hashed_password = undefined;
      user.salt = undefined;
      res.json(user);
    });
  });
};

const remove = (req, res, next) => {
  let user = req.profile;
  user.isDeleted = 1;
  user.deletedDate = Date.now();
  user.save((err, deletedUser) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      });
    }
    deletedUser.stanning.forEach(function (singlestannning) {
      if (singlestannning.status == 1) {
        stripe.subscriptions.del(singlestannning.subscriptionId, function (
          err,
          confirmation
        ) {
          if (confirmation) {
            User.update(
              {
                _id: req.profile._id,
                "stanning.creatorId": singlestannning.creatorId,
                "stanning.subscriptionId": singlestannning.subscriptionId
              },
              {
                $set: {
                  "stanning.$.status": 0,
                  "stanning.$.stanningRemovedDate": new Date()
                }
                // { $set: { status: 0, creatorId: req.body.creatorId, stanningRemovedDate: new Date } },
              }
            ).exec((err, result) => {
              if (err) {
                return res.status(400).json({
                  error: errorHandler.getErrorMessage(err)
                });
              } else {
                User.update(
                  {
                    _id: singlestannning.creatorId,
                    "stan.ref_id": req.profile._id,
                    "stan.subscriptionId": singlestannning.subscriptionId
                  },
                  {
                    $set: {
                      "stan.$.status": 0,
                      "stan.$.stan_lost_date": new Date()
                    }
                    // { $set: { status: 0, creatorId: req.body.creatorId, stanningRemovedDate: new Date } },
                  }
                ).exec((err, result) => {
                  if (err) {
                    return res.status(400).json({
                      error: errorHandler.getErrorMessage(err)
                    });
                  } else {
                    result.hashed_password = undefined;
                    result.salt = undefined;
                    //res.json(result);
                  }
                });
              }
            });
          } else {
            //res.json(err);
          }
        });
      }
    })

    deletedUser.stan.forEach(function (singlestan) {
      if (singlestan.status == 1) {
        stripe.subscriptions.del(singlestan.subscriptionId, function (
          err,
          confirmation
        ) {
          if (confirmation) {
            User.update(
              {
                _id: singlestan.ref_id,
                "stanning.creatorId": req.profile._id,
                "stanning.subscriptionId": singlestan.subscriptionId
              },
              {
                $set: {
                  "stanning.$.status": 0,
                  "stanning.$.stanningRemovedDate": new Date()
                }
                // { $set: { status: 0, creatorId: req.body.creatorId, stanningRemovedDate: new Date } },
              }
            ).exec((err, result) => {
              if (err) {
                return res.status(400).json({
                  error: errorHandler.getErrorMessage(err)
                });
              } else {
                User.update(
                  {
                    _id: req.profile._id,
                    "stan.ref_id": singlestan.ref_id,
                    "stan.subscriptionId": singlestan.subscriptionId
                  },
                  {
                    $set: {
                      "stan.$.status": 0,
                      "stan.$.stan_lost_date": new Date()
                    }
                    // { $set: { status: 0, creatorId: req.body.creatorId, stanningRemovedDate: new Date } },
                  }
                ).exec((err, result) => {
                  if (err) {
                    return res.status(400).json({
                      error: errorHandler.getErrorMessage(err)
                    });
                  } else {
                    result.hashed_password = undefined;
                    result.salt = undefined;
                    //res.json(result);
                  }
                });
              }
            });
          } else {
            //res.json(err);
          }
        });
      }
    })

    deletedUser.hashed_password = undefined;
    deletedUser.salt = undefined;
    res.json(deletedUser);
  });
  // user.remove((err, deletedUser) => {
  //   if (err) {
  //     return res.status(400).json({
  //       error: errorHandler.getErrorMessage(err)
  //     });
  //   }
  //   deletedUser.hashed_password = undefined;
  //   deletedUser.salt = undefined;
  //   res.json(deletedUser);
  // });
};

const photo = (req, res, next) => {
  if (req.profile._id) {
    // if (
    //   fs.existsSync(
    //     process.cwd() +
    //     "/dist/uploads/profileimages/thumbnail/" +
    //     "Thumbnail_" + req.profile._id +
    //     ".png"
    //   )
    // ) {
    //   console.log("prfile image " + process.cwd() +
    //     "/dist/uploads/profileimages/thumbnail/" +
    //     "Thumbnail_" + req.profile._id +
    //     ".png")
    //   return res.sendFile(
    //     process.cwd() +
    //     "/dist/uploads/profileimages/thumbnail/" +
    //     "Thumbnail_" + req.profile._id +
    //     ".png"
    //   );
    // } else {
    //   return res.sendFile(
    //     process.cwd() + "/client/assets/images/profile-pic.png"
    //   );
    // }

    // curl.get("https://stanmedata.s3.eu-west-2.amazonaws.com/uploads/videos/thumbnail/5e32ce31faefac1c186d50b8_1.jpg",
    //   function (err, response, body) {
    //     console.log(err)
    //     console.log(response)
    //     console.log(body)
    //     res.set("Content-Type", "image/png");
    //     return res.send(
    //       body
    //     );
    //   });
    // request('https://cdn.pixabay.com/photo/2015/12/01/20/28/road-1072823__340.jpg', function (error, response, body) {
    //   console.log('error:', error); // Print the error if one occurred
    //   console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    //   console.log('body:', body); // Print the HTML for the Google homepage.
    //   return res.send(
    //     body
    //   );
    // });
    /* AWS S3 code starts */
    var s3 = new AWS.S3();
    //configuring parameters
    var params = {
      Bucket: "stanmedata",
      Key: config.profileBucketKey + req.profile._id + ".png"
    };
    s3.headObject(params, function (err, metadata) {
      if (err && err.code === "NotFound") {
        // Handle no object on cloud here
        return res.json("/dist/profile-pic.png")
      } else {
        return res.json(config.profileImageBucketURL + req.profile._id + ".png")
      }
    });
    /* AWS S3 code ends */

  }
  /*if (req.profile.photo.data) {
    res.set("Content-Type", req.profile.photo.contentType);
    return res.send(req.profile.photo.data);
  }
  next();*/
};

const defaultPhoto = (req, res) => {
  //console.log("default :"+process.cwd() + profileImage);
  //console.log(process.cwd() + "/client/assets/images/profile-pic.png");
  return res.sendFile(process.cwd() + "/client/assets/images/profile-pic.png");
  //return res.sendFile(process.cwd() + profileImage);
};

const addFollowing = (req, res, next) => {
  let followername = "";
  let followingemail = "";
  let notExist = true
  /* Start Find User Detail */
  User.findOne({
    _id: req.body.userId
  }).exec((err, users) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      });
    }
    followername = users.name;
    notExist = users.following.includes(req.body.followId) ? false : true
    if (notExist) {
      /* End Find User Detail */
      User.findByIdAndUpdate(
        req.body.userId,
        {
          $push: {
            following: req.body.followId
          }
        },
        (err, result) => {
          if (err) {
            return res.status(400).json({
              error: errorHandler.getErrorMessage(err)
            });
          }
          /* Start Find User Detail */
          User.findOne({
            _id: req.body.followId
          }).exec((err, users) => {
            if (err) {
              return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
              });
            }
            followingemail = users.email;
          });
          /* End Find User Detail */
          // transporter.sendMail({
          //   from: '"Stan.Me" <nikaengg@gmail.com>', // sender address
          //   to: followingemail, //"magento.web002@gmail.com",//"kamleshk.maurya@rvsolutions.in", // list of receivers
          //   subject: "Follower Notification", // Subject line
          //   text: followername + " followed you.", // plain text body
          //   html: "<p>" + followername + " followed you.</p>" // html body
          // });
          /* End Send Mail */
          next();
        }
      );
    }
    else {
      res.json([]);
    }
  });
};

const addFollower = (req, res) => {
  let followername = "";
  User.findByIdAndUpdate(
    req.body.followId,
    {
      $push: {
        followers: {
          status: 1,
          followers_id: req.body.userId
        }
      }
    },
    {
      new: true
    }
  )
    .populate("following", "_id name username photo")
    .populate("followers", "followers_id name username photo")
    .populate("creatorcategory", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }
      result.hashed_password = undefined;
      result.salt = undefined;
      /* save notification in db start */
      let notification = new Notifications({
        type: "follower",
        fromId: req.body.userId,
        toId: req.body.followId,
        status: 1
      });
      notification.save((err, result) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
          });
        }
      });
      /* save notification in db end */
      if (result.usernotification.pmfollowers == 1) {
        User.findOne({ _id: req.body.userId }).exec((err, users) => {
          if (err) {
            return res.status(400).json({
              error: errorHandler.getErrorMessage(err)
            });
          }
          followername = users.name;

          readHTMLFile(
            process.cwd() + "/server/controllers/emailer/newfollowers.html",
            function (err, html) {
              var template = handlebars.compile(html);
              var replacements = {
                name: followername,
                id: req.body.userId,
                created: moment(new Date()).local().format(
                  "D MMM YYYY HH:mm"
                ),
                servername: config.smtp_mail_server_path,
                profileImage: users.photo ? config.profileImageBucketURL + users.photo : config.profileDefaultURL
              };
              var htmlToSend = template(replacements);
              var mailOptions = {
                from: '"Stan.Me " <mail@stan.me>', // sender address
                to: result.email, // list of receivers
                subject: "You have new followers on Stan.Me!", // Subject line
                text: "You have new followers on Stan.Me!", // plain text body
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
        });
      }
      res.json(result);
    });

};

const removeFollowing = (req, res, next) => {
  User.findByIdAndUpdate(
    req.body.userId,
    {
      $pull: {
        following: req.body.unfollowId
      }
    },
    (err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }
      next();
    }
  );
};
const removeFollower = (req, res) => {


  // User.findByIdAndUpdate(
  //   req.body.unfollowId,
  //   {
  //     $pull: {
  //       followers: { followers_id: req.body.userId, status: 1 }
  //     },
  //     $push: {
  //       removedfollowers: {
  //         followers_id: req.body.userId
  //       }
  //     }
  //   },
  //   (err, result) => {
  //     if (err) {
  //       return res.status(400).json({
  //         error: errorHandler.getErrorMessage(err)
  //       });
  //     }
  //     res.json(result);
  //   }
  // );


  User.update({
    _id: req.body.unfollowId,
    followers: { $elemMatch: { followers_id: req.body.userId, status: 1 } }
    // followers: { followers_id: req.body.userId, status: 1 }
    //"followers.followers_id": req.body.userId,
    //"followers.status": 1
  },
    {
      $set: {
        "followers.$.status": 0
      }
    })
    .populate("following", "_id name username photo")
    .populate("followers", "followers_id name username photo")
    .populate("creatorcategory", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }
      result.hashed_password = undefined;
      result.salt = undefined;
      res.json(result);
    });
};

const findPeople = (req, res) => {
  let following = req.profile.following;
  following.push(req.profile._id);
  User.find(
    {
      $and: [
        {
          _id: {
            $nin: following
          },
          role: {
            $ne: "1"
          },
          isDeleted: {
            $ne: 1
          },
          is_restrict: {
            $ne: 1
          },
          "verification.status": {
            $ne: 0
          }
        }
      ]
    },
    (err, users) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }
      var currentIndex = users.length, temporaryValue, randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = users[currentIndex];
        users[currentIndex] = users[randomIndex];
        users[randomIndex] = temporaryValue;
      }
      users = users.slice(0, 6);
      res.json(users);
    }
  )
    .select("name username photo isDeleted creater.status photo")
    .sort({ created: -1 })
    .limit(50);
};
/* Find the Stanning Users */
const findStanning = (req, res) => {


  User.findById(req.params.userId)
    .populate("stanning.creatorId", "_id name username photo")
    .exec((err, user) => {
      if (err || !user)
        return res.status("400").json({
          error: "This username or email entered doesn't exist. "
        });
      res.json(user);
    })
    .select("stanning");
};
/* End Find the stanning users */

/** User Link Activation  */
const linkactivation = (req, res, next) => {
  let user = req.profile;
  const status = req.body.verification.status;
  user = _.extend(user, {
    verification: {
      token: req.body.verification.token,
      status: status
    }
  });
  user.save((err, result) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      });
    }
    user.hashed_password = undefined;
    user.salt = undefined;
    res.json(user);
  });
};

/** End Here*/

/** Forget Password API */
const forgetpassword = (req, res) => {
  let form = new formidable.IncomingForm();
  form.parse(req, (err, fields) => {
    if (err) {
      return res.status(400).json({
        error: "Email could not be found"
      });
    }

    user = _.extend(user, fields);
    if (fields.email == "nikaengg@gmail.com") {
    } else {
      transporter.sendMail({
        from: '"Activate Your Account " <nikaengg@gmail.com>', // sender address
        to: result.email, // list of receivers
        subject: "Reset Password", // Subject line
        text: "Reset Your the account Password", // plain text body
        html:
          "<h3>Welcome, STAN ME</h3><br/><br/><p>Please, reset your account password by this link <a href=`${config.smtp_mail_server_path}`/resetpassword/" +
          token +
          "'>`${config.smtp_mail_server_path}`resetpassword/" +
          token +
          "</a></p>" // html body
      });
    }
  });
};

/**End Here */

/** becomes creater */
const becomecreater = (req, res, next) => {
  let user = req.profile;
  user = _.extend(user, {
    creater: {
      status: req.body.creater.status
    }
  });
  user.save((err, result) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      });
    }
    user.hashed_password = undefined;
    user.salt = undefined;
    res.json(user);
  });
};
/** become stan */
const stan = (req, res, next) => {
  let user = req.profile;
  const stripepayment = stripe.charges.create({
    amount: req.body.stan.amount,
    source: "tok_amex",
    currency: "gbp"
  });
  user = _.extend(user, {
    stan: {
      status: req.body.stan.status,
      ref_id: req.body.stan.ref_id,
      amount: req.body.stan.amount
    }
  });
  user.save((err, result) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      });
    }
    user.hashed_password = undefined;
    user.salt = undefined;
    res.json(user);
  });
};

/** get stan count and total earnings */
const stanCount = (req, res) => {
  let featured = res.req.profile.featured;
  let data = res.req.profile.stan;
  let totalAmount = 0,
    stanCounter = 0,
    loststan = 0,
    countnewStan = 0,
    thismthEarning = 0;
  stanCounter = data.length;


  data.forEach(function (stanData) {
    totalAmount += stanData.amount;
    if (stanData.status == 1) {
      let dateTimeStamp = new Date(stanData.stan_date).getMonth();
      let stanyear = new Date(stanData.stan_date).getFullYear();
      let currentDayTimestamp = new Date().getMonth();
      let currentyearTimestamp = new Date().getFullYear();
      if (
        currentDayTimestamp == dateTimeStamp &&
        currentyearTimestamp == stanyear
      ) {
        countnewStan += 1;
        thismthEarning += stanData.amount;
      }
    }
    if (stanData.status == 0) {
      let dateTimeStamp = new Date(stanData.stan_lost_date).getMonth();
      let loststanyear = new Date(stanData.stan_lost_date).getFullYear();
      let currentDayTimestamp = new Date().getMonth();
      let currentyearTimestamp = new Date().getFullYear();
      if (
        currentDayTimestamp == dateTimeStamp &&
        loststanyear == currentyearTimestamp
      ) {
        loststan += 1;
        thismthEarning += stanData.amount;
      }
    }

    //  let d = new Date();
    //  const currentmonth = d.getMonth()+1;
    //  const currentyear = d.getFullYear();

    // if((stanyr===currentyear && stanmth==currentmonth) && stanStatus===1)
    //  {
    //   countnewStan +=1;
    //  }

    //  if((stanyr===currentyear && stanmth==currentmonth) && stan_status===1)
    //  {
    //    newstan++;
    //    thismonthearning +=stanData.amount
    //    //this.setState({ stanCount: counter+1,totalEarnings:total, tab: 0  })
    //  }
    // else if((stanyr===currentyear && stanmth==currentmonth) && stan_status===0)
    //  {
    //    loststan ++;
    //    thismonthearning +=stanData.amount
    //  }
  });

  let stanData = {
    totalEarnings: totalAmount,
    thisMonthStan: countnewStan,
    stanCount: stanCounter,
    lostStan: loststan,
    earning: thismthEarning,
    featured: featured
  };

  res.json(stanData);
};
/**  End Here */

/** get stan count and total earnings */
const followerCount = (req, res) => {
  let data = res.req.profile.followers;
  let followersCount = 0,
    unFollowersCount = 0,
    followthismonth = 0;
  followersCount = data.length;
  data.forEach(function (followersData) {
    if (followersData.status == 0) {
      const currentmonth = new Date().getMonth();
      const currentyear = new Date().getFullYear();
      const followersmonth = new Date(followersData.followers_date).getMonth();
      const followeryears = new Date(
        followersData.followers_date
      ).getFullYear();
      if (currentmonth == followersmonth && currentyear == followeryears) {
        unFollowersCount += 1;
        followersCount = data.length - unFollowersCount;
      }
    }
    if (followersData.status == 1) {
      const currentmonth = new Date().getMonth();
      const currentyear = new Date().getFullYear();
      const followersmonth = new Date(followersData.followers_date).getMonth();
      const followeryears = new Date(
        followersData.followers_date
      ).getFullYear();
      if (currentmonth == followersmonth && currentyear == followeryears) {
        followthismonth += 1;
      }
    }
  });

  let followerData = {
    followerCount: followersCount,
    unFollowersCount: unFollowersCount,
    followthismonth: followthismonth
  };

  res.json(followerData);
};

/**  End Here */

/**  User notification */

const notification = (req, res, next) => {
  let usrprivacy = req.body;
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Notification is updated successfully."
      });
    }
    let user = req.profile;
    fields = {
      usernotification: fields
    };
    user = _.extend(user, fields);
    user.updated = Date.now();

    user.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }
      user.hashed_password = undefined;
      user.salt = undefined;
      res.json(user);
    });
  });
};

/** End here */
/** privacy policy for user */
const privacy = (req, res, next) => {
  let usrprivacy = req.body;
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Privacy Policy is updated."
      });
    }
    let user = req.profile;
    fields = {
      privacy: fields
    };
    user = _.extend(user, fields);
    user.updated = Date.now();

    user.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }
      user.hashed_password = undefined;
      user.salt = undefined;
      res.json(user);
    });
  });
};
/** End here */
/**  Payment option    */
const payment = (req, res, next) => {
  let usrprivacy = req.body;
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    let categories = "";
    if (err) {
      return res.status(400).json({
        error: "Payment is not updated successfully."
      });
    }
    let user = req.profile;
    var status = 0
    if (fields.stripe_user_id) {
      status = 1
    }
    if (fields.creatorcategory) {
      categories = fields.creatorcategory.split(",");
      //fields.creatorcategory = fields.creatorcategory.split(",");

      fields = {
        payment: fields,
        creatorcategory: categories,
        creater: {
          status: status
        }
      };
    }
    else {
      fields = {
        payment: fields,
        //creatorcategory: categories,
        creater: {
          status: 1
        }
      };
    }
    user = _.extend(user, fields);
    user.updated = Date.now();

    user.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }
      user.hashed_password = undefined;
      user.salt = undefined;
      res.json(user);
    });
  });
};
/** end Here */
/* Insert New Category and findId */
const insertCategory = (req, res, next) => {

  var category = new Category();
  category.name = req.body.name;
  category.created_at = new Date();
  category.updated_at = new Date();
  category.is_deleted = "0";
  category.save((err, result) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      });
    }

    res.json(category);
  });
};
/* End New category and findId */
/** Count Following Followers */
const countpeople = (req, res) => {
  let following = req.profile.following;
  following.push(req.profile._id);
  User.find(
    {
      _id: {
        $nin: following
      },
      role: {
        $ne: "1"
      }
    },
    (err, users) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }
      res.json(users);
    }
  )
    .count()
    .sort({
      name: 1
    });
};
/**End Here */
/** Banner image upload */
const bannerimg = (req, res, next) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Banner image could not be uploaded"
      });
    }
    let user = req.profile;
    user = _.extend(user, fields);
    user.updated = Date.now();
    if (files.banner) {
      user.banner.data = fs.readFileSync(files.banner.path);
      user.banner.contentType = files.banner.type;
    }
    user.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }
      user.hashed_password = undefined;
      user.salt = undefined;
      res.json(user);
    });
  });
};

const banner = (req, res, next) => {
  if (req.profile._id) {
    if (
      fs.existsSync(
        process.cwd() + "/dist/uploads/bannerimages/compressbanners/Thumbnail_" + req.profile.banner
      )
    ) {
      return res.sendFile(
        process.cwd() + "/dist/uploads/bannerimages/compressbanners/Thumbnail_" + req.profile.banner
      );
    } else {
      return res.sendFile(
        process.cwd() + "/client/assets/images/user-banner.png"
      );
    }
  }
  // if (req.profile.banner.data) {
  //   res.set("Content-Type", req.profile.banner.contentType);
  //   return res.send(req.profile.banner.data);
  // }
  // next();
};

const defaultbanner = (req, res) => {
  return res.sendFile(process.cwd() + bannerImage);
};

/** End here bannner Image */

/** stan API'S  Starts here */
const becomestan = (req, res, next) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Photo could not be uploaded"
      });
    }
    let user = req.profile;
    user = _.extend(user, fields);
    user.updated = Date.now();
    const date = new Date();
    const time = date.getTime();
    if (files.photo) {
      user.photo.data = fs.readFileSync(files.photo.path);
      const file_ext = files.photo.name.split(".").pop();
      user.photo.contentType = files.photo.type;
      fs.rename(
        files.photo.path,
        "dist/upload/" + time + "." + file_ext,
        function (err) { }
      );
    }
    if (files.banner) {
      user.banner.data = fs.readFileSync(files.banner.path);
      const file_ext = files.banner.name.split(".").pop();
      user.banner.contentType = files.banner.type;
      user.banner.contentType = files.banner.type;
      fs.rename(
        files.banner.path,
        "dist/upload/" + time + "." + file_ext,
        function (err) { }
      );
    }
    user.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }

      user.hashed_password = undefined;
      user.salt = undefined;
      res.json(user);
    });
  });
};

const express = require("express");
const router = express.Router();

const chat = (req, res) => {
  // module.exports.controller = function(app) {
  //   app.get("/messages/", function(req, res) {
  //   res.render("chat", {
  //     title: "Chat Home",
  //     user: "as",
  //     chat: "aa"
  //   });
  // });

  //

  // }
  return res.render("chat", {
    title: "Chat Home",
    user: "as",
    chat: "aa"
  });
};

/** Read Creater Category */
const creatorCategory = (req, res) => {
  Category.find() //{ type: { $in: ["creator"] } }
    .exec((err, categories) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }
      res.json(categories);
    })
    .select("_id name")
    .sort({ name: 1 });
};

const topCreatorCategory = (req, res) => {
  Category.find()
    //.limit(12)
    .exec((err, categories) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }
      res.json(categories);
    })
    .select("name");
};

// const categoryuser = (req, res) => {
//   User.find({
//     creatorcategory: {
//       $regex: req.body.categoryName
//     },
//     role: {
//       $ne: '1'
//     }
//   })
//     .skip(req.body.skip)
//     .limit(req.body.limit)
//     .exec((err, users) => {
//       if (err) {
//         return res.status(400).json({
//           error: errorHandler.getErrorMessage(err)
//         });
//       }
//       res.json(users);
//     });
// };
const categoryuser = (req, res) => {
  if (Array.isArray(req.body.categoryid)) {
    req.body.categoryid.push([])
  }
  User.find({
    creatorcategory: {
      $in: req.body.categoryid
    },
    role: {
      $ne: "1"
    },
    isDeleted: {
      $ne: 1
    }
  })
    .populate("creatorcategory", "_id name")
    .skip(req.body.skip)
    .limit(req.body.limit)

    .exec((err, users) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }

      // var currentIndex = users.length, temporaryValue, randomIndex;

      // // While there remain elements to shuffle...
      // while (0 !== currentIndex) {

      //   // Pick a remaining element...
      //   randomIndex = Math.floor(Math.random() * currentIndex);
      //   currentIndex -= 1;

      //   // And swap it with the current element.
      //   temporaryValue = users[currentIndex];
      //   users[currentIndex] = users[randomIndex];
      //   users[randomIndex] = temporaryValue;
      // }



      res.json(users);
    });
};

const searchuser = (req, res) => {
  User.find({
    $or: [
      {
        name: {
          $regex: req.body.value,
          $options: "$i"
        }
      },
      {
        username: {
          $regex: req.body.value,
          $options: "$i"
        }
      }
    ],
    role: {
      $ne: "1"
    },
    isDeleted: {
      $ne: 1
    }
  })
    .populate("creatorcategory", "_id name")
    .exec((err, users) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }
      res.json(users);
    });
};
/* Start Check Username */
const checkusername = (req, res) => {
  User.findOne(
    {
      username: req.body.value
      // username: {
      //   $regex: req.body.value,
      //   $options: "i"
      // }
    },
    { username: 1, _id: 1, name: 1 }
  ).exec((err, users) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      });
    }
    var data = users ? { count: true, _id: users._id, name: users.name } : { count: false };
    res.json(data);
  });
};

/* End Check Username */
/* Start Check Category Name */
const checkcategory = (req, res) => {
  Category.find({
    name: {
      $regex: req.body.value,
      //$options: "$i"
      $options: "i"
    }
  }).exec((err, categories) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      });
    }
    res.json(categories);
  });
};

/* End Check Category Name */

/** Stan Api end here  */

/** Api for Subscription and Pitch */
const subscriptionAndPitch = (req, res, next) => {
  let usrprivacy = req.body;
  let planId = "",
    planCreated = "",
    amount = 0,
    activeplan = 0,
    checkplan = false;
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    let user = req.profile;
    let onbehalfof = req.profile.payment.stripe_user_id
    var stanbtn = fields.stanbtn;
    if (stanbtn == "true") {
      user.subscriptionpitch.planInfo.forEach(planval => {
        if (planval.amount == fields.price) {
          checkplan = true;
          User.update(
            {
              _id: req.params.userId,
              "subscriptionpitch.planInfo.amount": fields.price
            },
            {
              $set: {
                "subscriptionpitch.planInfo.$.status": 1

              }
              // { $set: { status: 0, creatorId: req.body.creatorId, stanningRemovedDate: new Date } },
            }
          ).exec((err, result) => {
            if (err) {
              // return res.status(400).json({
              //   error: errorHandler.getErrorMessage(err)
              // });
            }
          });
          /*User.findByIdAndUpdate(req.params.userId, {
  
            "subscriptionpitch.stanbtn": fields.stanbtn,
            "subscriptionpitch.presentyourself": fields.presentyourself,
            "subscriptionpitch.videourl": fields.videourl,
            "$set": {
            "subscriptionpitch.planInfo.$.status": 1
          }
          }, (err, result) => {
            // if (err) {
            //   return res.status(400).json({
            //     error: errorHandler.getErrorMessage(err)
            //   });
            // }
            // res.status(200).json({
            //   message: "Plan status is updated successfully."
            // });
  
          });  */
          // res.json({
          //   "message": "Plan status is updated successfully."
          // });
        } else {
          User.update(
            {
              _id: req.params.userId,
              "subscriptionpitch.planInfo.amount": planval.amount
            },
            {
              $set: {
                "subscriptionpitch.planInfo.$.status": 0

              }
              // { $set: { status: 0, creatorId: req.body.creatorId, stanningRemovedDate: new Date } },
            }
          ).exec((err, result) => {
            if (err) {
              // return res.status(400).json({
              //   error: errorHandler.getErrorMessage(err)
              // });
            }
          });
          // update stas in db 0
          /* User.findByIdAndUpdate(req.params.userId, {
   
             "subscriptionpitch.stanbtn": fields.stanbtn,
             "subscriptionpitch.presentyourself": fields.presentyourself,
             "subscriptionpitch.videourl": fields.videourl,
            "$set": {
              "subscriptionpitch.planInfo.$.status": 0
            }
           }, (err, result) => {
             // if (err) {
             //   return res.status(400).json({
             //     error: errorHandler.getErrorMessage(err)
             //   });
             // }
             // res.status(200).json({
             //   message: "Plan status is updated to zero successfully."
             // });
   
           }); */
          // res.json({
          //   "message": "Plan status is updated to zero successfully."
          // });
        }
      });
      if (!checkplan) {
        // create plan and insert in db
        stripe.plans.create(
          {
            amount: fields.price * 100,
            interval: "month",
            // "interval": "day",
            // "interval_count": "1",
            product: {
              name: "New Monthly Plan"
            },
            currency: "usd"
          }, {
          stripe_account: onbehalfof,
        },
          function (err, plan) {
            if (plan) {
              planId = plan.id;
              planCreated = plan.created;
              amount = plan.amount / 100;
              activeplan = 1;
              User.findByIdAndUpdate(
                req.params.userId,
                {
                  "subscriptionpitch.stanbtn": fields.stanbtn,
                  "subscriptionpitch.presentyourself": fields.presentyourself,
                  "subscriptionpitch.videourl": fields.videourl,

                  $push: {
                    "subscriptionpitch.planInfo": {
                      amount: amount,
                      planId: planId,
                      planCreated: planCreated,
                      status: activeplan
                    }
                  }
                },
                (err, result) => {
                  // if (err) {
                  //   return res.status(400).json({
                  //     error: errorHandler.getErrorMessage(err)
                  //   });
                  // }
                  // res.status(200).json({
                  //   message: "New plan is created successfully."
                  // });
                }
              );
              User.update(
                {
                  _id: req.params.userId
                },
                {
                  $set: {
                    "subscriptionpitch.stanbtn": fields.stanbtn,
                    "subscriptionpitch.presentyourself": fields.presentyourself,
                    "subscriptionpitch.videourl": fields.videourl
                  }
                }
              ).exec((err, result) => {
                if (err) {
                }
              });
              res.json(plan);
            }
          }
        );
      } else {
        User.updateMany(
          {
            _id: req.params.userId
          },
          {
            $set: {
              "subscriptionpitch.stanbtn": fields.stanbtn,
              "subscriptionpitch.presentyourself": fields.presentyourself,
              "subscriptionpitch.videourl": fields.videourl,
              "jwt_token.$[].isUpdated": 1
            }
          }, { multi: true }
        ).exec((err, result) => {
          if (err) {
          }
        });
        res.json([{ count: true }]);
      }
    } else {
      User.update(
        {
          _id: req.params.userId
        },
        {
          $set: {
            "subscriptionpitch.stanbtn": fields.stanbtn
          }
        }
      ).exec((err, result) => {
        if (err) {
        }
        res.json([{ count: true }]);
      });
    }
  });
};
const enableStanBtn = (req, res) => {
  const data = req.profile.subscriptionpitch;
  let planinfodata = [],
    about = "",
    videolink = "";
  const stanbtnstatus = data.stanbtn;
  planinfodata = data.planInfo;
  about = data.presentyourself;
  videolink = data.videourl;

  let subscriptionAndPitchdata = {
    stanbtn: stanbtnstatus,
    planInfo: planinfodata,
    presentyourself: about,
    videourl: videolink
  };
  res.json(subscriptionAndPitchdata);
};
/**End Here */
/** Shop enable disable by user */

const enableShop = (req, res, next) => {
  let usrprivacy = req.body;
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Shop is not updated successfully."
      });
    }
    let shopdata = {
      shopstatus: fields.shopstatus,
      standiscount: fields.standiscount
    };

    User.findByIdAndUpdate(
      req.params.userId,
      {
        "shopenable.shopstatus": fields.shopstatus,
        "shopenable.standiscount": fields.standiscount
      },
      (err, result) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
          });
        }
        res.status(200).json({
          message: "returns creators shop data ."
        });
      }
    );
  });
};
const enableShopbtn = (req, res) => {
  const data = req.profile.shopenable;
  let shopDiscount = 0,
    shippingdata = [];
  const shopbtnstatus = data.shopstatus;
  shopDiscount = data.standiscount;
  shippingdata = data.shippinginfo;
  let enableDisablShopeData = {
    shopbtn: shopbtnstatus,
    standiscount: shopDiscount,
    shippinginfo: shippingdata
  };
  res.json(enableDisablShopeData);
};
/** Api for Tips by user */
const tipsByUser = (req, res) => {
  let totalposts = 0,
    totaltips = 0,
    counttips = 0,
    thismthcount = 0,
    countthismthcount = 0,
    thismothamount = 0,
    transactionId = "",
    totalproductsales = 0,
    countSales = 0,
    productthismonth = 0,
    salesthismonth = 0,
    tipsdate = "";
  let user = req.profile;

  // let post = new Post();
  // Post.postedBy =
  //Post.find({postedBy:req.params.userId})
  Post.find({
    $and: [
      {
        postedBy: {
          $in: req.params.userId
        }
      }
    ]
  }) //{postedBy: req.profile._id}
    .populate("postedBy", "_id name username photo")
    .populate("tips.userId", "userId name")
    .exec((err, posts) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }
      totalposts = posts.length;
      posts.forEach(function (postdata) {
        counttips += postdata.tips.length;

        postdata.tips.forEach(function (tipsdata) {
          totaltips += tipsdata.amount;
          transactionId = tipsdata.transactionId;

          const currentmonth = new Date().getMonth();
          const currentyear = new Date().getFullYear();
          const tipsmonth = new Date(tipsdata.date).getMonth();
          const tipsyears = new Date(tipsdata.date).getFullYear();
          tipsdate =
            new Date(tipsdata.date).getDay() +
            "-" +
            tipsmonth +
            "-" +
            tipsyears;
          if (currentmonth == tipsmonth && currentyear == tipsyears) {
            thismothamount += tipsdata.amount;
            thismthcount += 1;
          }
        });
      });
      let usertipsamount = {
        totalposts: totalposts,
        tipamount: totaltips,
        tipcount: counttips,
        countthismonthtips: thismthcount,
        thismothamount: thismothamount,
        transactionId: transactionId,
        tipsdate: tipsdate,
        tipsFromUser: posts
      };
      res.json(usertipsamount);
    });
};
const manageOrders = (req, res) => {
  Orders.find({
    $and: [
      {
        user_id: {
          $in: req.params.userId
        }
      }
    ]
  }).populate("productid", "_id text")
    .exec((err, orders) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }
      res.json(orders);
    });
};
/** Send Note to customer for purchase */
const sendPurchaseNote = (req, res) => { };
/** End Here  */

/** Api for become Stan */

const becomeStan = (req, res, next) => {
  // stripe.charges.create(
  //   {
  //     amount: req.body.amount * 100,
  //     currency: "usd",
  //     source: req.body.userToken, // obtained with Stripe.js
  //     description: "For Tip"
  //   },
  //   function (err, charge) {
  //     if (charge) {
  //       Post.findByIdAndUpdate(
  //         req.body.postId,
  //         { $push: { tips: { userId: req.body.userId, amount: charge.amount / 100, transactionId: charge.id, date: new Date().getDate() } } },
  //         { new: true }
  //       )
  //         // .populate('likes', '_id name')
  //         .exec((err, result) => {
  //           if (err) {
  //             return res.status(400).json({
  //               error: errorHandler.getErrorMessage(err)
  //             });
  //           }
  //           res.json(result);
  //         });
  //     } else {
  //       res.json(err);
  //     }
  //     // asynchronously called
  //   }
  // );
  var vat_per_id = 0
  var vat_per = 0
  var referedId = '';
  var onbehalfof = '';
  Vat.find(
    {
      code: req.body.countryCode
    },
    (err, vat) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }
      if (vat) {
        vat_per_id = vat[0].stripeTaxId
        vat_per = vat[0].vat_per
      }
      User.findOne({
        _id: req.body.creatorId
      }).exec((uerr, users) => {
        if (uerr) {
          return res.status(400).json({
            error: errorHandler.getErrorMessage(uerr)
          });
        }
        referedId = users.refercode ? users.refercode : ''
        onbehalfof = users.payment ? users.payment.stripe_user_id : ''

        stripe.customers.create(
          {
            description: req.body.email,
            source: req.body.userToken // obtained with Stripe.js
          }, {
          stripe_account: onbehalfof,
        },
          function (err, customer) {
            if (customer) {
              console.log(customer)
              let ownerChargePer = referedId == '' ? config.ownerPer : config.ownerReferPer;
              let ownerAmount = req.body.amount * ownerChargePer / 100
              let totalPaid = req.body.amount + req.body.vat
              let dynamicOwnerChargePer = (ownerAmount * 100) / totalPaid
              dynamicOwnerChargePer = Number(dynamicOwnerChargePer.toFixed(2))
              console.log(dynamicOwnerChargePer)
              stripe.subscriptions.create(
                {
                  customer: customer.id,
                  tax_percent: vat_per,
                  items: [
                    {
                      //tax_rates: [vat_per_id],
                      plan: req.body.planId
                    }
                  ],
                  application_fee_percent: dynamicOwnerChargePer
                }, {
                stripe_account: onbehalfof,
              },
                function (err, subscription) {
                  console.log(err)
                  if (subscription) {

                    var packagevalue = subscription.items.data[0].plan.amount / 100
                    // res.json(subscription);
                    var dt = new Date();
                    dt.setMonth(dt.getMonth() + 1);
                    User.findByIdAndUpdate(
                      req.body.creatorId,
                      {
                        $push: {
                          stan: {
                            status: 1,
                            ref_id: req.body.userId,
                            subscriptionId: subscription.id,
                            amount: packagevalue,
                            stan_date: new Date(),
                            periodEnd: dt
                          }
                        }
                      },
                      {
                        new: true
                      }
                    ).exec((userr, result) => {
                      if (userr) {
                        return res.status(400).json({
                          error: errorHandler.getErrorMessage(userr)
                        });
                      } else {
                        User.findByIdAndUpdate(
                          req.body.userId,
                          {
                            $push: {
                              stanning: {
                                creatorId: req.body.creatorId,
                                subscriptionId: subscription.id,
                                amount: packagevalue,
                                status: 1,
                                stanningDate: new Date(),
                                periodEnd: dt
                              }
                            }
                          },
                          {
                            new: true
                          }
                        ).exec((usserr, result) => {
                          if (usserr) {
                            return res.status(400).json({
                              error: errorHandler.getErrorMessage(usserr)
                            });
                          }
                          //else res.json(result);
                        });
                      }
                      //res.json(result);
                    });
                    /* Start Insert Tip Transaction 2019-10-17 */


                    var vattax = packagevalue * vat_per / 100
                    var paidvalue = packagevalue + vattax
                    let fee = paidvalue * config.chargePer / 100 //100*2.9/100
                    fee = fee + config.extraDollar; // + 0.30 //3.78
                    let totalNetAmount = paidvalue - fee;  //116.22
                    totalNetAmount = totalNetAmount - vattax //96.22
                    let ownerChargePer = referedId == '' ? config.ownerPer : config.ownerReferPer;
                    var referAmount = 0
                    if (referedId != '') {
                      let referChargePer = config.referPer
                      referAmount = (referChargePer / 100) * (packagevalue); //5
                    }
                    let ownerAmt = (ownerChargePer / 100) * (packagevalue); //5
                    let userNetAmount = totalNetAmount - ownerAmt - referAmount;          // 91.22
                    // let firsttransaction = new Transaction();
                    // firsttransaction.amount = userNetAmount.toFixed(2);
                    // firsttransaction.ownerAmount = ownerAmt.toFixed(2);
                    // firsttransaction.referAmount = referAmount.toFixed(2);
                    // firsttransaction.tranStatus = 0;
                    // firsttransaction.transactionId = subscription.id;
                    // firsttransaction.fromId = req.body.userId;
                    // firsttransaction.toId = req.body.creatorId;
                    // firsttransaction.vat = vattax.toFixed(2);
                    // firsttransaction.processFee = fee.toFixed(2);
                    // firsttransaction.type = "stan";
                    // transaction.created = new Date();
                    /* save notification in db start */
                    let notification = new Notifications({
                      type: "stan",
                      fromId: req.body.userId,
                      toId: req.body.creatorId,
                      status: 1,
                      amount: userNetAmount.toFixed(2)
                    });
                    notification.save((nerr, result) => {
                      if (nerr) {
                        return res.status(400).json({
                          error: errorHandler.getErrorMessage(nerr)
                        });
                      }
                      next();
                    });
                    /* save notification in db end */
                    // firsttransaction.save((err, result) => {
                    //   if (err) {
                    //     return res.status(400).json({
                    //       error: errorHandler.getErrorMessage(err)
                    //     });
                    //   }

                    //   if (referedId != "") {
                    //     let anothertransaction = new Transaction();
                    //     anothertransaction.amount = referAmount.toFixed(2);
                    //     anothertransaction.transactionId = subscription.id;
                    //     anothertransaction.fromId = req.body.creatorId;
                    //     anothertransaction.toId = referedId;
                    //     anothertransaction.type = "stan";
                    //     anothertransaction.tranStatus = 0;
                    //     anothertransaction.save((trerr, result) => {
                    //       if (trerr) {
                    //         return res.status(400).json({
                    //           error: errorHandler.getErrorMessage(trerr)
                    //         });
                    //       }
                    //     })
                    //   }
                    // });
                    /* End Insert Tip Transaction */

                  } //else res.json(err);
                  // asynchronously called
                }
              );
              //res.json(customer);
            }
            // else {
            //   res.json(err);
            // }
            // asynchronously called
          }
        );
        // stripe.plans.create({
        //   amount: 10000,
        //   interval: "month",
        //   product: {
        //     name: "Gold special"
        //   },
        //   currency: "usd",
        // }, function (err, plan) {
        //   if (plan)
        //     res.json(plan);
        //   else
        //     res.json(err);
        //   // asynchronously called
        // });
      })
    });
};

/**End here */

/** Api for remove stan */
const removeStan = (req, res, next) => {
  User.findOne({
    _id: req.body.creatorId
  }).exec((err, result) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      });
    }
    console.log(result.payment)
    stripe.subscriptions.del(req.body.subscriptionId, { stripe_account: result.payment.stripe_user_id }, function (
      err,
      confirmation
    ) {
      if (confirmation) {
        console.log(err)
        User.update(
          {
            _id: req.body.userId,
            "stanning.creatorId": req.body.creatorId,
            "stanning.subscriptionId": req.body.subscriptionId
          },
          {
            $set: {
              "stanning.$.status": 0,
              "stanning.$.stanningRemovedDate": new Date()
            }
            // { $set: { status: 0, creatorId: req.body.creatorId, stanningRemovedDate: new Date } },
          }
        ).exec((err, result) => {
          if (err) {
            return res.status(400).json({
              error: errorHandler.getErrorMessage(err)
            });
          } else {
            User.update(
              {
                _id: req.body.creatorId,
                "stan.ref_id": req.body.userId,
                "stan.subscriptionId": req.body.subscriptionId
              },
              {
                $set: {
                  "stan.$.status": 0,
                  "stan.$.stan_lost_date": new Date()
                }
                // { $set: { status: 0, creatorId: req.body.creatorId, stanningRemovedDate: new Date } },
              }
            ).exec((err, result) => {
              if (err) {
                return res.status(400).json({
                  error: errorHandler.getErrorMessage(err)
                });
              } else {
                result.hashed_password = undefined;
                result.salt = undefined;
                res.json(result);
              }
            });
          }
        });
      } else {
        res.json(err);
      }
    });
    //next();
  });
};
// get list of countries
const countriesList = (req, res) => {
  Countries.find()
    .exec((err, countries) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }
      // console.log("display_countries", countries_new);
      res.json(countries);
    });
};
const shippingprice = (req, res) => {
  User.findByIdAndUpdate(
    req.body.userId,
    {
      $push: {
        "shopenable.shippinginfo": {
          countryname: req.body.countryname,
          charges: req.body.charges
        }
      }
    },
    (err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }
      res.status(200).json({
        message: "Shipping details is updated."
      });
    }
  );
};
/* list Notification */

const readnotification = (req, res) => {
  Notifications.find({
    $and: [
      { toId: req.params.userId },
      { status: { $gte: req.params.status } },
      { type: { $in: ["tip", "stan", "shop", "like", "follower", "comment"] } } //, "message"
    ]

  }) //{ toId: req.params.userId }
    .populate("fromId", "_id name username photo")
    .populate("productId", "text photo")
    .populate("postId", "_id text")
    .exec((err, notifications) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }
      if (req.params.status == 0) {
        Notifications.updateMany({}, { $set: { status: 0 } }
        ).exec((err, updateusers) => {
          if (err) {
            return res.status(400).json({
              error: errorHandler.getErrorMessage(err)
            });
          }
        });
      }
      // var myValue = { foo: 'bar', baz: 'quux' }
      // localStorage.setItem('jwt', JSON.stringify(myValue));
      notifications = req.params.status == 1 ? notifications.length : notifications
      res.json(notifications);
    });
  //.select("type");
};
/** api for wallet and earnings */
const paymenttransaction = (req, res) => {
};
const stanningtransaction = (req, res) => {
  User.find({
    _id: req.params.userId
  })
    .populate("stanning.creatorId", "_id name username photo")
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }
      res.json(result);
    });
};
const tippedByMe = (req, res) => {
  Post.find({
    "tips.userId": req.params.userId
  }) //{postedBy: req.profile._id}
    .populate("postedBy", "_id name username photo")
    .exec((err, posts) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }
      let usertips = {
        tips_data: posts
      };
      res.json(usertips);
    });
};
const StantoMe = (req, res) => {
  let user = req.profile.stan;
  User.find(
    {
      _id: req.params.userId
    },
    {
      stan: true,
      creater: true
    }
  )
    .populate("stan.ref_id", "_id name username photo")
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }
      res.json({ stantome: result });
    });
};
const myShopOrder = (req, res) => {
  Orders.find({
    $and: [
      {
        ordered_by: {
          $in: req.params.userId
        }
      }
    ]
  }).populate("productid", "_id text")
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }
      res.json(result);
    });
};
/** End Api */

/* Start Check Email */
const checkemail = (req, res) => {
  User.findOne(
    {
      email: req.body.value
    },
    { email: 1, name: 1 }
  ).exec((err, users) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      });
    }
    var data = users ? { count: true } : { count: false };
    if (data.count) {
      let user = new User();
      var hash = user.createHash(
        "C0nT" +
        users.email +
        Math.round(new Date().valueOf() * Math.random()) +
        "r0L"
      );
      User.update(
        { email: users.email },
        { $set: { "forgot.token": hash, "forgot.status": 0 } }
      ).exec((err, updateusers) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
          });
        }
      });

      readHTMLFile(
        process.cwd() + "/server/controllers/emailer/forgotpwd.html",
        function (err, html) {
          var template = handlebars.compile(html);
          var replacements = {
            name: users.name,
            id: hash,
            servername: config.smtp_mail_server_path
          };
          var htmlToSend = template(replacements);
          var mailOptions = {
            from: '"Stan.Me " <mail@stan.me>', // sender address
            to: users.email, // list of receivers
            subject: "Forgot Password", // Subject line
            text: "Forgot Password", // plain text body
            html: htmlToSend
          };
          transporter.sendMail(mailOptions, function (error, response) {
            if (error) {
              callback(error);
            }
          });
        }
      );
    }
    res.json(data);
  });
};

/* End Check Eamil */
/* Start Check Email by Id  */
const checkEmailById = (req, res) => {
  var data = "";
  User.find({
    $and: [
      {
        _id: { $eq: req.params.userId }
      },
      {
        email: { $eq: req.body.oldEmail }
      }
    ]
  }).exec((err, users) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      });
    }
    data =
      users.length > 0
        ? { count: true, newEmail: "" }
        : { count: false, newEmail: "" };
    if (data.count) {
      var data1 = {};

      /* Start New Email Exist or not */
      User.find({
        $and: [
          {
            email: { $eq: req.body.newEmail }
          },
          {
            isDeleted: { $eq: 0 }
          }
        ]
      }).exec((err, users1) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
          });
        }
        data1 =
          users1.length > 0
            ? { count: true, newEmail: true }
            : { count: false, newEmail: false };
        /*start Update Temp Email & Send Email for Activation */
        if (data1.count == false && data1.newEmail == false) {
          User.update(
            {
              _id: req.params.userId
            },
            {
              $set: {
                "tempEmail.status": 0,
                "tempEmail.email": req.body.newEmail
              }
            }
          ).exec((err, updateusers) => {
            if (err) {
              return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
              });
            }
            data1 =
              updateusers.nModified > 0
                ? { count: true, newEmail: "success" }
                : { count: false, newEmail: "fail" };
            /* Start Email Send */
            readHTMLFile(
              process.cwd() + "/server/controllers/emailer/update-email.html",
              function (err, html) {
                var template = handlebars.compile(html);
                var replacements = {
                  name: users1.name,
                  id: req.params.userId,
                  servername: config.smtp_mail_server_path
                };
                var htmlToSend = template(replacements);
                var mailOptions = {
                  from: '"Stan.Me " <mail@stan.me>', // sender address
                  to: req.body.oldEmail, // list of receivers
                  subject: "Update Email", // Subject line
                  text: "Update Email", // plain text body
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
            /* End Email Send */
            res.json(data1);
          });
        } else {
          //data1 = { count: true, newEmail: true };
          res.json(data1);
        }

        /* End Update Temp Email & Send Email for Activation */
      });
      /* End Check New Email Exist or not */
    } else {
      res.json(data);
    }
  });
};
/* End Check Eamil */

/* End Find the stanning users */

/** Start User Email Activation  */
const emailactivatelink = (req, res, next) => {
  let user = req.profile;
  const status = req.body.tempEmail.status;
  var oldEmail = "";
  var name = "";

  User.find({
    _id: { $eq: req.params.userId }
  }).exec((err, users) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      });
    }
    oldEmail = users[0].email;
    name = users[0].name;
    // /* Email Update */
    User.update(
      {
        _id: req.params.userId
      },
      {
        $set: {
          email: users[0].tempEmail.email,
          "tempEmail.email": "",
          "tempEmail.status": 1
        }
      }
      // ,
      // { $unset: { tempEmail: "" } }
    ).exec((err, updateusers) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }
      var data1 =
        updateusers.nModified > 0 ? { count: true } : { count: false };
      /* Start Email Send */
      readHTMLFile(
        process.cwd() +
        "/server/controllers/emailer/update-email-thankyou.html",
        function (err, html) {
          var template = handlebars.compile(html);
          var replacements = {
            name: name,
            //id: req.params.userId,
            servername: config.smtp_mail_server_path
          };
          var htmlToSend = template(replacements);
          var mailOptions = {
            from: '"Stan.Me" <mail@stan.me>', // sender address
            to: oldEmail, // list of receivers
            subject: "Update Email Thank you", // Subject line
            text: "Update Email Thank you", // plain text body
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
      /* End Email Send */
      res.json(data1);

      /* End Email Update */
    });
  });
};

/** End Email Activate Here*/
/* Start Check Email */
const checkresettoken = (req, res) => {
  User.findOne(
    {
      "forgot.token": req.body.value,
      "forgot.status": 0
    },
    { "forgot.token": 1 }
  ).exec((err, users) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      });
    }
    var data = users ? { count: true } : { count: false };
    res.json(data);
  });
};

/* End Check Eamil */

/* Start reset */
const reset = (req, res) => {
  User.findOne(
    {
      "forgot.token": req.body.token,
      "forgot.status": 0
    },
    { "forgot.token": 1, salt: 1, email: 1, name: 1 }
  ).exec((err, users) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      });
    }
    var data = users ? { count: true } : { count: false };
    if (data.count) {
      let user = new User(users);
      var hash = user.changePassword(req.body.newpassword);
      //console.log(hash);
      User.update(
        { "forgot.token": req.body.token },
        { $set: { hashed_password: hash, "forgot.status": 1 } }
      ).exec((err, updateusers) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
          });
        }

        readHTMLFile(
          process.cwd() + "/server/controllers/emailer/stanpwd.html",
          function (err, html) {
            var template = handlebars.compile(html);
            var replacements = {
              name: users.name,
              mail: users.email,
              servername: config.smtp_mail_server_path
            };
            var htmlToSend = template(replacements);
            var mailOptions = {
              from: '"Stan.Me" <mail@stan.me>', // sender address
              to: users.email, // list of receivers
              subject: "Reset Password Successful", // Subject line
              text: "Reset Password Successful", // plain text body
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
      });
    }
    res.json(data);
  });
};

// const withdrawalEarning = (req, res) => {
//   console.log(req.body.amount);
//   let transaction = new Transaction(req.body);
//   transaction.save((err, result) => {
//     if (err) {
//       return res.status(400).json({
//         error: errorHandler.getErrorMessage(err)
//       });
//     }
//     transaction.populate(
//       {
//         path: "userId",
//         select: "_id payment"
//       },
//       function(err, result) {
//         res.json(result);
//       }
//     );
//   });
// };
/* Start Get Total Withdrawal */
const gettotalwithdrawal = (req, res) => {
  //console.log("req.params.userId " + req.params.userId);
  Transaction.find({
    userId: req.params.userId
  }).exec((err, result) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      });
    }
    res.json(result);
  });
};
/* End Get Total Withdrawal */
/* End reset */

/* Start get Earning */
const getEarning = (req, res) => {
  User.aggregate(
    [
      {
        $match: {
          _id: { $in: [mongoose.Types.ObjectId(req.params.userId)] }
        }
      },
      // { $unwind: "$posts" },
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "postedBy",
          as: "posts"
        }
      },
      // { $unwind: "$orders" }
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "user_id",
          as: "orders"
        }
      }
      // ,

      // {
      //   $project: {
      //     _id: 1,
      //     stan: 1,
      //     payment: 1,
      //     posts: [{ $arrayElemAt: ["$posts", 0] }],
      //     orders: [{ $arrayElemAt: ["$orders", 0] }]
      //   }
      // }
    ],
    function (err, data) {
      if (err) {
        res.json(err);
      } else {
        if (data[0].payment && data[0].payment.stripe_user_id) {
          stripe.accounts.createLoginLink(
            data[0].payment.stripe_user_id,
            function (err, link) {
              // asynchronously called
              if (link) {
                data[0].payment.link = link.url
              }

              res.json(data);
            }
          );
        }

      }
    }
  );
};
/* End get Earning */

/* Start reset */
const reviewsubmit = (req, res) => {
  User.findOne(
    {
      _id: req.params.userId
    },
    { featured: 1, name: 1, email: 1 }
  ).exec((err, users) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      });
    }
    var data = users ? { count: true } : { count: false };
    if (data.count) {
      User.update({ _id: req.params.userId }, { $set: { featured: 1 } }).exec(
        (err, updateusers) => {
          if (err) {
            return res.status(400).json({
              error: errorHandler.getErrorMessage(err)
            });
          }

          readHTMLFile(
            process.cwd() + "/server/controllers/emailer/review.html",
            function (err, html) {
              var template = handlebars.compile(html);
              var replacements = {
                name: users.name,
                servername: config.smtp_mail_server_path
              };
              var htmlToSend = template(replacements);
              var mailOptions = {
                from: '"Stan.Me" <mail@stan.me>', // sender address
                to: users.email, // list of receivers
                subject: "Profile Submitted for Review", // Subject line
                text: "Profile Submitted for Review", // plain text body
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
      );
    }
    res.json(data);
  });
};

/* End reset */
/* Start Earning Filteration */
const earningStmtFilter = (req, res) => {
  //console.log(req.body.year);
  var orTypeQuery = "";
  var orYearQuery = "";
  var orMonthQuery = "";

  if (req.body.type != "all") {
    orTypeQuery = { type: { $in: [req.body.type] } };
  } else {
    orTypeQuery = { type: { $in: ["stan", "tip", "order"] } };
  }

  var monthFilter = "";
  if (req.body.month != "" && req.body.month != "-1") {
    monthFilter = req.body.month;
  }

  if (monthFilter != "") {
    orMonthQuery = { month: parseInt(monthFilter) };
  }

  if (req.body.year != "" && req.body.year != "-1") {
    // orYearQuery =  { $expr: {$eq: [{ $year: created }, req.body.year]}};
    orYearQuery = { year: parseInt(req.body.year) };
  }

  // if (monthFilter != "" && req.body.year !== "" && req.body.year > 0) {
  //   let filterDate = req.body.year + "-" + monthFilter;
  //   console.log("filterDate  " + filterDate);
  //   orYearQuery = { created: { $regex: filterDate } };
  // }
  // console.log(orMonthQuery);
  // console.log(orYearQuery);

  var jsonArray1 = new Array();
  if (orYearQuery == "" && orMonthQuery != "") {
    jsonArray1 = [orTypeQuery, orMonthQuery];
  } else if (orYearQuery != "" && orMonthQuery == "") {
    jsonArray1 = [orTypeQuery, orYearQuery];
  } else if (orYearQuery != "" && orMonthQuery != "") {
    jsonArray1 = [orTypeQuery, orYearQuery, orMonthQuery];
  } else if (orYearQuery == "" && orMonthQuery == "") {
    jsonArray1 = [orTypeQuery];
  }
  var ObjectId = require("mongodb").ObjectId;
  // var jsonArray2 = [{ toId: req.params.userId }];
  var jsonArray2 = [
    { toId: { $in: [mongoose.Types.ObjectId(req.params.userId)] } }
  ];
  //console.log("!!!",mongoose.Types.ObjectId(req.params.userId));
  //console.log(jsonArray2);
  jsonArray2 = jsonArray2.concat(jsonArray1);
  //console.log(jsonArray1);


  Transaction.aggregate(
    [
      {
        $project: {
          _id: 1,
          created: 1,
          amount: 1,
          transactionId: 1,
          processFee: 1,
          ownerAmount: 1,
          fromId: 1,
          toId: 1,
          type: 1,
          tranStatus: 1,
          year: { $year: "$created" },
          month: { $month: "$created" }
        }
      },
      {
        $match: { $and: jsonArray2 }
      },
    ]
    //Transaction.aggregate([ {$project: {year:{$year: "$created"}}}, {$match: {year: 2020}} ]
    // ,
    // function(err, data) {
    //   if (err) {
    //     res.json(err);
    //   } else {
    //     // console.log(data);
    //     res.json(data);
    //   }
    // }
  ).exec(function (err, transactions) {
    //console.log(err,transactions)
    Transaction.populate(
      transactions,
      [
        {
          path: "fromId",
          select: { _id: 1, name: 1 }
        }
      ],
      function (err, transactions) {
        if (err) {
          res.json(err);
        } else {
          // console.log(data);
          res.json(transactions);
        }
      }
    );
  });

  // Transaction.find({
  //   $and: jsonArray2
  // })
  //   .populate("fromId", "_id name")
  //   // .limit(req.body.limit)
  //   //.skip(req.body.skip)
  //   // .sort("-created")
  //   .exec((err, transactions) => {
  //     if (err) {
  //       return res.status(400).json({
  //         error: errorHandler.getErrorMessage(err)
  //       });
  //     }
  //     res.json(transactions);
  //   });
};
/* End earning Filteration */

/* Start Get All Transaction By User */
const getTransStatementByUser = (req, res) => {
  //console.log(" getTransStatementByUser toID" + req.params.userId);
  Transaction.find(
    {
      $or: [
        { toId: req.params.userId },
        { userId: req.params.userId }
      ]
      //toId: req.params.userId
    },
    (err, transactions) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }
      res.json(transactions);
    }
  )
    .populate("fromId", "_id name username photo")
    .count()
    .sort({
      created: -1
    });
  //.limit(10);
};
/* End Get All Transaction By User */

/* Start Get All Transaction Debit By User */
const getTransDebitStmtByUser = (req, res) => {
  //console.log(" getTransDebitStmt toID" + req.params.userId);
  Transaction.find(
    {
      fromId: req.params.userId
    },
    (err, transactions) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }
      res.json(transactions);
    }
  )
    .populate("toId", "_id name username photo")
    .count()
    .sort({
      created: -1
    });
  //.limit(10);
};
/* End Get All Transaction Debit By User */
/* Start Get Vat By Country */
// const getVatByCountry = (req, res) => {
//   console.log(" getVatByCountry " + req.body.country);
//     if(req.body.event == "click"){
//       Vat.find(
//         {
//           country: req.body.country
//         },
//         (err, vat) => {
//           if (err) {
//             return res.status(400).json({
//               error: errorHandler.getErrorMessage(err)
//             });
//           }
//           console.log("level1");
//           res.json(vat);
//         }
//       ).select("country vat_per");
//     }else{
//       var geoip = require('geoip-lite');
//       var geo = geoip.lookup(req.body.ip);
//       console.log("level1else");
//       res.json(geo);
//     }
// };

const getVatByCountry = (req, res) => {
  // Set your secret key: remember to change this to your live secret key in production
  // See your keys here: https://dashboard.stripe.com/account/apikeys
  //console.log("stripe");
  const stripe = require('stripe')(config.stripe_test_secret_key);

  stripe.payouts.create({
    amount: 245300,
    currency: 'usd',
    description: 'testRG'
  }, {
    stripe_account: 'acct_1FX0fzGKoDqQgS9W',
  }).then((payout) => {
    // asynchronously called
    //console.log("payout", payout);
    return payout;
  }).then(data => {
    //console.log(data);
  });
  //console.log(" getVatByCountry " + req.body.country);
  //console.log(" getVatByCountry " + req.body.event);
  if (req.body.event == "click") {
    var geoip = require('geoip-lite');
    var geo = geoip.lookup(req.body.ip);
    // setTimeout(() => {
    //console.log(geo.country)
    Vat.find(
      {
        code: geo.country
      },
      (err, vat) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
          });
        }
        res.json(vat);
      }
    ).select("country code vat_per");
    // res.json(geo);
    // }, 2000);
  } else {
    Vat.find(
      {
        code: req.body.code
      },
      (err, vat) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
          });
        }
        res.json(vat);
      }
    ).select("country code vat_per");
  }

};
/* End Get Vat By Country */
/* Start to Store Account Detail after become a creator */
const getAccountIdByCodeId = (req, res) => {
  stripe.oauth
    .token({
      grant_type: "authorization_code",
      code: req.params.codeId
    })
    .then(function (response) {
      // asynchronously called
      var connected_account_id = response.stripe_user_id;
      res.json(response);
    });
};
/* End to Store Account Detail after become a creator */
/*Start To Withdrawal money by given Stripe Acc Id */
/*Start To Withdrawal money by given Stripe Acc Id */
const makeWithDrawalByStripeId = (req, res) => {
  var transactionCheck = 0;
  var start = new Date().getMonth();
  var rates = {}
  let currentRateGbp = 0;
  let currentRateAccountCurreny = 0;
  Currency.find({}).sort({ timestamp: -1 }).limit(1).exec((err, result) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      });
    }
    currentRateGbp = result[0].rates.GBP;
    rates = result[0].rates
    //console.log(result);
  })
  Transaction.find({
    userId: req.body.userId
    //created: { $gte: start, $lt: end }
  }).exec((err, result) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      });
    }

    result.forEach(res => {
      // console.log(
      //   start +
      //   " month :" +
      //   res.created.getMonth() +
      //   " && tranStatus " +
      //   res.tranStatus
      // );
      if (start == res.created.getMonth() && res.tranStatus == 1) {
        transactionCheck = 1;
      }
    });
  });
  var amount = req.body.amount;
  var processFee = 0
  if (req.body.payouttype == 2) {
    if (amount < config.minimumAmountForCond) {
      if (transactionCheck == 0) {
        processFee = 2 + (amount * (config.withdrawalPer / 100)) + config.withdrawalChargeAmt;
      } else {
        processFee = (amount * (config.withdrawalPer / 100)) + config.withdrawalChargeAmt;
      }
    } else {
      processFee = (amount * (config.withdrawalPer / 100)) + config.withdrawalChargeAmt;
    }
  }

  amount = amount - processFee

  amount = Math.round(amount);
  processFee = Math.round(processFee);
  // console.log("transactionCheck " + transactionCheck + " && amount :" + amount);
  var currency = "";
  var bankdestination = "";
  stripe.accounts.retrieve(req.body.t_id, function (err, account) {
    if (err) {
      console.log(err)
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      });
    }
    // asynchronously called
    currency = account.default_currency;
    const currency1 = currency.toUpperCase();
    //console.log("currency" + "xx" + currency1 + "xx")
    //console.log(rates)
    currentRateAccountCurreny = rates[currency1];
    //console.log("currentRateAccountCurreny  " + currentRateAccountCurreny)
    bankdestination = account.external_accounts.data[0].id
    stripe.transfers.create(
      {
        amount: parseInt(amount * currentRateGbp * 100),
        currency: 'gbp',
        destination: req.body.t_id,
        transfer_group: "Payout"
      },
      function (err, transfer) {
        if (err) {
          console.log(err)
          return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
          });
        }
        //console.log(transfer);
        if (req.body.payouttype == 2) {
          stripe.payouts.create({
            amount: parseInt(amount * currentRateAccountCurreny * 100),
            currency: currency,
            destination: bankdestination,
            statement_descriptor: "StanMe payout",
            description: "Manual Payout",
          }, {
            stripe_account: req.body.t_id,
          }).then(function (payout) {
            // asynchronously called
            // console.log(payout)
            /* Start */
            let transaction = new Transaction();
            transaction.amount = req.body.amount;
            transaction.processFee = processFee
            transaction.withdrawId = transfer.id;
            transaction.payoutId = payout.id;
            transaction.userId = req.body.userId;
            transaction.approvalStatus = req.body.approvalStatus;
            transaction.tranStatus = req.body.status;
            transaction.type = "Withdraw";
            transaction.save((err, result) => {
              if (err) {
                return res.status(400).json({
                  error: errorHandler.getErrorMessage(err)
                });
              }
              transaction.populate(
                {
                  path: "userId",
                  select: "_id payment"
                },
                function (err, result) {
                  var response = result._id
                    ? { status: true, amount: result.amount }
                    : { status: false };
                  res.json(response);
                }
              );
            });
            /* End */
            //res.json(payout);
          });
        }
        else {
          /* Start */
          let transaction = new Transaction();
          transaction.amount = req.body.amount;
          transaction.processFee = processFee
          transaction.withdrawId = transfer.id;
          transaction.userId = req.body.userId;
          transaction.approvalStatus = req.body.approvalStatus;
          transaction.tranStatus = req.body.status;
          transaction.type = "Withdraw";
          transaction.save((err, result) => {
            if (err) {
              return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
              });
            }
            transaction.populate(
              {
                path: "userId",
                select: "_id payment"
              },
              function (err, result) {
                var response = result._id
                  ? { status: true, amount: result.amount }
                  : { status: false };
                res.json(response);
              }
            );
          });
          /* End */
        }

      }
    );
  });
};
/*End To Withdrawal money by given Stripe Acc Id */
// const createTransaction = (data) =>
// {

// }
/** Start Calculate Process Fee */
const calculateProcessFee = (req, res) => {
  var transactionCheck = 0;
  // console.log(" req.body.userId " + req.body.userId);
  var start = new Date().getMonth();

  Transaction.find({
    userId: req.body.userId
    //created: { $gte: start, $lt: end }
  }).exec((err, result) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      });
    }
    result.forEach(res => {
      // console.log(
      //   start +
      //   " month :" +
      //   res.created.getMonth() +
      //   " && tranStatus " +
      //   res.tranStatus
      // );
      if (start == res.created.getMonth() && res.tranStatus == 1) {
        transactionCheck = 1;
      }
    });
  });
  var amount = req.body.amount;
  if (config.minAmtWithdraw >= 10) {
    if (amount < config.minimumAmountForCond) {
      if (transactionCheck == 0) {
        amount =
          amount -
          2 -
          amount * (config.withdrawalPer / 100) -
          config.withdrawalChargeAmt;
      } else {
        amount =
          amount -
          amount * (config.withdrawalPer / 100) -
          config.withdrawalChargeAmt;
      }
    } else {
      amount =
        amount -
        amount * (config.withdrawalPer / 100) -
        config.withdrawalChargeAmt;
    }
  } else {
    var response = { retStatus: false };
    res.json(response);
  }

  //console.log("transactionCheck " + transactionCheck + " && amount :" + amount);
  amount = Math.round(amount);
  let actualAmt = req.body.amount;
  let processFee = actualAmt - amount;
  var response = { processFee: processFee, retStatus: true };
  res.json(response);
};
/** End Calculate Process Fee */
/* Aggreate Used 


User.aggregate(
    [
      {
        $match: {
          _id: { $in: [mongoose.Types.ObjectId(req.params.userId)] }
        }
      },
      // { $unwind: "$posts" },
      {
        $lookup: {
          from: "posts",
          //let: { users__id: "$_id", posts_postedBy: "$postedBy" },
          localField: "_id",
          foreignField: "postedBy",
          // pipeline: [
          //   { $match: { "posts.tips.amount": 500 } },
          //   { $project: { _id: 0, amount: 1 } }
          //   //{ $replaceRoot: { newRoot: "$date" } }
          // ],
          as: "posts"
        }
      },
      // {
      //   $match: {
      //     $or: [{ "posts.tips.amount": 500 }, { "posts.tips.amount": 450 }]

      //     // { 'chats.msgreadto': 0 },
      //   }
      // },
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "user_id",
          as: "orders"
        }
      },

      //{ $sort: { "chats.createdOn": -1 } },
      {
        $project: {
          _id: 1,
          stan: 1,
          posts: [{ $arrayElemAt: ["$posts", 0] }],
          orders: [{ $arrayElemAt: ["$orders", 0] }]
        }
      }
      // { $sort: { $posts: -1 } },
      // { $limit: 5 }
    ]
    // ,
    // function(err, data) {
    //   if (err) {
    //     res.json(err);
    //   } else {
    //     // console.log(data);
    //     res.json(data);
    //   }
    // }
  ).exec(function(err, transactions) {
    User.populate(
      transactions,
      [
        {
          path: "stan.ref_id orders.ordered_by posts.tips.userId",
          select: { _id: 1, name: 1 }
        }
      ],
      function(err, transactions) {
        if (err) {
          res.json(err);
        } else {
          // console.log(data);
          res.json(transactions);
        }
      }
    );
  });

  */
/* Start of Report */
const report = (req, res) => {
  //console.log(req.body.fromId);
  var report = new Report(req.body);
  report.save((err, result) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      });
    }
    //console.log(report);
    req.body.type === "Post" || req.body.type === "Product" ?
      Post.findByIdAndUpdate(
        req.body.postId,
        { $push: { report: req.body.fromId } },
        { new: true }
      ).exec((err, result) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
          });
        }
        res.json(report);
      }) :
      User.findByIdAndUpdate(
        req.body.toId,
        { $push: { report: req.body.fromId } },
        { new: true }
      ).exec((err, result) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
          });
        }
        res.json(report);
      })
  });

};
/* End of Report */
/* Start Send Referal Invitatio */
const sendreferinvitation = (req, res) => {
  var name = ''
  User.findOne(
    {
      username: req.body.link,
    },
    { name: 1 }
  ).exec((err, user) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      });
    }
    name = user.name
    readHTMLFile(
      process.cwd() + "/server/controllers/emailer/invite_sent_friend.html",
      function (err, html) {
        var template = handlebars.compile(html);
        var replacements = {
          name: name,
          link: req.body.link,
          servername: config.smtp_mail_server_path
        };
        var htmlToSend = template(replacements);
        var mailOptions = {
          from: '"Stan.Me " <mail@stan.me>', // sender address
          to: req.body.email, // list of receivers
          subject: name + " Invited you to join Stan.Me!", // Subject line
          text: name + " Invited you to join Stan.Me!", // plain text body
          html: htmlToSend
        };
        transporter.sendMail(mailOptions, function (error, response) {
          if (error) {
            console.log(error);
            callback(error);
          }
          res.json(true);
        });
      }
    );
  })
};
/* Start Send Feedback */
const sendfeedback = (req, res) => {
  var name = ''
  User.findOne(
    {
      _id: req.body.userId,
    },
    { name: 1 }
  ).exec((err, user) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      });
    }
    name = user.name
    var email = "mail@stan.me"
    readHTMLFile(
      process.cwd() + "/server/controllers/emailer/feedback.html",
      function (err, html) {
        var template = handlebars.compile(html);
        var replacements = {
          message: req.body.message
        };
        var htmlToSend = template(replacements);
        var mailOptions = {
          from: '"Stan.Me " <mail@stan.me>', // sender address
          to: email, // list of receivers
          subject: name + " submitted feedback on Stan.Me!", // Subject line
          text: name + " submitted feedback on Stan.Me!", // plain text body
          html: htmlToSend
        };
        transporter.sendMail(mailOptions, function (error, response) {
          if (error) {
            console.log(error);
            callback(error);
          }
          res.json(true);
        });
      }
    );
  })
};

/* End Send Feedback */

/* Webhook */
const webhook = (req, res) => {
  // return res.json("Working");
  const sig = req.headers['stripe-signature'];
  // Set your secret key: remember to change this to your live secret key in production
  // See your keys here: https://dashboard.stripe.com/account/apikeys
  const stripe = require('stripe')(config.stripe_test_secret_key);

  // If you are testing your webhook locally with the Stripe CLI you
  // can find the endpoint's secret by running `stripe listen`
  // Otherwise, find your endpoint's secret in your webhook settings in the Developer Dashboard

  const endpointSecret = config.endpointSecret;
  let event;
  /** for security  */
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  }
  catch (err) {
    console.log(err);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
  /** for security end */
  /*event = {
    "id": "evt_1GBckSIN9piBWP3YFa0vf7sf",
    "object": "event",
    "account": "acct_1G99MdIN9piBWP3Y",
    "api_version": "2019-05-16",
    "created": 1581581316,
    "data": {
      "object": {
        "id": "in_1GBckQIN9piBWP3Yg9UvXoxh",
        "object": "invoice",
        "account_country": "AU",
        "account_name": "Jst",
        "amount_due": 2500,
        "amount_paid": 2500,
        "amount_remaining": 0,
        "application_fee_amount": null,
        "attempt_count": 1,
        "attempted": true,
        "auto_advance": false,
        "billing_reason": "subscription_create",
        "charge": "ch_1GBckRIN9piBWP3YWEudH0ZO",
        "collection_method": "charge_automatically",
        "created": 1581581314,
        "currency": "usd",
        "custom_fields": null,
        "customer": "cus_Gj4upGm8G77g1I",
        "customer_address": null,
        "customer_email": null,
        "customer_name": null,
        "customer_phone": null,
        "customer_shipping": null,
        "customer_tax_exempt": "none",
        "customer_tax_ids": [
        ],
        "default_payment_method": null,
        "default_source": null,
        "default_tax_rates": [
          {
            "id": "txr_1GBcAGIN9piBWP3YuL43zAgm",
            "object": "tax_rate",
            "active": true,
            "created": 1581579072,
            "description": null,
            "display_name": "Tax",
            "inclusive": false,
            "jurisdiction": null,
            "livemode": false,
            "metadata": {
            },
            "percentage": 25
          }
        ],
        "description": null,
        "discount": null,
        "due_date": null,
        "ending_balance": 0,
        "footer": null,
        "hosted_invoice_url": "https://pay.stripe.com/invoice/invst_11OAhddrou4Q38yJElfHodHHF5",
        "invoice_pdf": "https://pay.stripe.com/invoice/invst_11OAhddrou4Q38yJElfHodHHF5/pdf",
        "lines": {
          "object": "list",
          "data": [
            {
              "id": "sli_d15ab7b548e15b",
              "object": "line_item",
              "amount": 2000,
              "currency": "usd",
              "description": "1 × New Monthly Plan (at $20.00 / month)",
              "discountable": true,
              "livemode": false,
              "metadata": {
              },
              "period": {
                "end": 1584086914,
                "start": 1581581314
              },
              "plan": {
                "id": "plan_Gj3jjoU0WT7zsS",
                "object": "plan",
                "active": true,
                "aggregate_usage": null,
                "amount": 2000,
                "amount_decimal": "2000",
                "billing_scheme": "per_unit",
                "created": 1581576920,
                "currency": "usd",
                "interval": "month",
                "interval_count": 1,
                "livemode": false,
                "metadata": {
                },
                "nickname": null,
                "product": "prod_Gj3jNj0pVQOFCA",
                "tiers": null,
                "tiers_mode": null,
                "transform_usage": null,
                "trial_period_days": null,
                "usage_type": "licensed"
              },
              "proration": false,
              "quantity": 1,
              "subscription": "sub_Gj4uMsfhDKtwQV",
              "subscription_item": "si_Gj4ucDguONsgLj",
              "tax_amounts": [
                {
                  "amount": 500,
                  "inclusive": false,
                  "tax_rate": "txr_1GBcAGIN9piBWP3YuL43zAgm"
                }
              ],
              "tax_rates": [
              ],
              "type": "subscription",
              "unique_id": "il_1GBckQIN9piBWP3YulHc19CQ"
            }
          ],
          "has_more": false,
          "total_count": 1,
          "url": "/v1/invoices/in_1GBckQIN9piBWP3Yg9UvXoxh/lines"
        },
        "livemode": false,
        "metadata": {
        },
        "next_payment_attempt": null,
        "number": "775E7B11-0001",
        "paid": true,
        "payment_intent": "pi_1GBckRIN9piBWP3YxVOcOi5w",
        "period_end": 1581581314,
        "period_start": 1581581314,
        "post_payment_credit_notes_amount": 0,
        "pre_payment_credit_notes_amount": 0,
        "receipt_number": null,
        "starting_balance": 0,
        "statement_descriptor": null,
        "status": "paid",
        "status_transitions": {
          "finalized_at": 1581581314,
          "marked_uncollectible_at": null,
          "paid_at": 1581581316,
          "voided_at": null
        },
        "subscription": "sub_Gj4uMsfhDKtwQV",
        "subtotal": 2000,
        "tax": 500,
        "tax_percent": 25,
        "total": 2500,
        "total_tax_amounts": [
          {
            "amount": 500,
            "inclusive": false,
            "tax_rate": "txr_1GBcAGIN9piBWP3YuL43zAgm"
          }
        ],
        "webhooks_delivered_at": null,
        "billing": "charge_automatically"
      }
    },
    "livemode": false,
    "pending_webhooks": 1,
    "request": {
      "id": "req_2ig0U8uphE1x5z",
      "idempotency_key": null
    },
    "type": "invoice.created"
  } */

  Transaction.find({
    eventId: event.id
  }).exec((err, result) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      });
    }
    console.log(result)
    if (result.length) {
      return res.status(400).json({ msg: "Duplicate hit", received: true });
    }

    switch (event.type) {
      case 'payment_intent.created': {
        const paymentMethod = event.data.object;
        break;
      }

      case 'payment_method.attached': {
        const paymentMethod = event.data.object;
        break;
      }
      // case 'invoice.created': {
      //   const paymentMethod = event.data.object;
      //   const INVOICE_ID = paymentMethod.id
      //   console.log(INVOICE_ID + "  //  " + event.account)
      //   const ownerAmount = (paymentMethod.subtotal / 100) * config.ownerPer
      //   console.log(ownerAmount)
      //   stripe.invoices.update(
      //     { INVOICE_ID },
      //     { application_fee: ownerAmount },
      //     { stripe_account: event.account }).then(function (invoice) {
      //       // asynchronously called
      //       console.log(invoice)
      //     });
      //   break;
      // }

      case 'invoice.payment_succeeded': {
        const paymentMethod = event.data.object;
        const periodEnd = new Date(paymentMethod.lines.data[0].period.end * 1000);
        const periodStart = new Date(paymentMethod.lines.data[0].period.start * 1000);
        const subscriptionId = paymentMethod.lines.data[0].subscription;
        const paymentStatus = paymentMethod.status;
        User.update(
          {
            "stan.subscriptionId": subscriptionId
          },
          {
            $set: {
              "stan.$.periodEnd": periodEnd,
              "stan.$.periodStart": periodStart,
              "stan.$.paymentStatus": paymentStatus,
            }
          }
        ).exec((err, result) => {
          if (err) {
            // return res.status(400).json({
            //   error: errorHandler.getErrorMessage(err)
            // });
          }
          User.update(
            {
              "stanning.subscriptionId": subscriptionId
            },
            {
              $set: {
                "stanning.$.periodEnd": periodEnd,
                "stanning.$.periodStart": periodStart,
                "stanning.$.paymentStatus": paymentStatus,
              }
            }
          ).exec((err, result) => {
            if (err) {
              // return res.status(400).json({
              //   error: errorHandler.getErrorMessage(err)
              // });
            }
          })
          User.findOne({ "stan.subscriptionId": subscriptionId }, { _id: 1, stan: 1 })
            .exec((err, lastdata) => {
              if (err) {
              }
              var fromId = ''
              var toId = ''
              var referedId = ''

              User.findOne({
                _id: lastdata._id
              }).exec((uerr, users) => {
                if (uerr) {
                  return res.status(400).json({
                    error: errorHandler.getErrorMessage(uerr)
                  });
                }
                referedId = users.refercode ? users.refercode : ''

                lastdata.stan.forEach(function (singlelast) {
                  if (singlelast.subscriptionId == subscriptionId) {
                    fromId = singlelast.ref_id
                    toId = lastdata._id
                  }
                })


                var packagevalue = paymentMethod.subtotal / 100
                var vattax = paymentMethod.tax / 100
                var paidvalue = packagevalue + vattax
                let fee = paidvalue * config.chargePer / 100 //100*2.9/100
                fee = fee + config.extraDollar; // + 0.30 //3.78
                let totalNetAmount = paidvalue - fee;  //116.22
                totalNetAmount = totalNetAmount - vattax //96.22
                let ownerChargePer = referedId == '' ? config.ownerPer : config.ownerReferPer;
                var referAmount = 0
                if (referedId != '') {
                  let referChargePer = config.referPer
                  referAmount = (referChargePer / 100) * (packagevalue); //5
                }
                let ownerAmt = (ownerChargePer / 100) * (packagevalue); //5
                // console.log(totalNetAmount + "===" + ownerAmt)
                let userNetAmount = totalNetAmount - ownerAmt - referAmount;          // 91.22
                let firsttransaction = new Transaction();
                firsttransaction.eventId = event.id
                firsttransaction.amount = userNetAmount.toFixed(2);
                firsttransaction.ownerAmount = ownerAmt.toFixed(2);
                firsttransaction.referAmount = referAmount.toFixed(2);
                firsttransaction.tranStatus = 0;
                firsttransaction.transactionId = subscriptionId;
                firsttransaction.fromId = fromId
                firsttransaction.toId = toId
                firsttransaction.vat = vattax.toFixed(2);
                firsttransaction.processFee = fee.toFixed(2);
                firsttransaction.type = "stan";
                // transaction.created = new Date();
                firsttransaction.save((err, result) => {
                  if (err) {
                    return res.status(400).json({
                      error: errorHandler.getErrorMessage(err)
                    });
                  }
                  // console.log(result);
                  if (referedId != "") {
                    let anothertransaction = new Transaction();
                    anothertransaction.eventId = event.id
                    anothertransaction.amount = referAmount.toFixed(2);
                    anothertransaction.transactionId = subscriptionId;
                    anothertransaction.fromId = toId;
                    anothertransaction.toId = referedId;
                    anothertransaction.type = "stan";
                    anothertransaction.tranStatus = 0;
                    anothertransaction.save((trerr, result) => {
                      if (trerr) {
                        return res.status(400).json({
                          error: errorHandler.getErrorMessage(trerr)
                        });
                      }
                    })
                  }
                });
                /* End Insert Tip Transaction */
              })
            })


        });
        break;
      }
      // paymentMethod.lines.data[0].period.end
      case 'invoice.payment_failed': {
        //console.log(event.data.object);
        const paymentMethod = event.data.object;
        const periodEnd = new Date(paymentMethod.lines.data[0].period.end * 1000);
        const periodStart = new Date(paymentMethod.lines.data[0].period.start * 1000);
        const subscriptionId = paymentMethod.lines.data[0].subscription;
        const paymentStatus = paymentMethod.status;
        User.update(
          {
            "stan.subscriptionId": subscriptionId
          },
          {
            $set: {
              "stan.$.periodEnd": periodEnd,
              "stan.$.periodStart": periodStart,
              "stan.$.paymentStatus": paymentStatus,
              "stan.$.status": 0,
              "stan.$.stan_lost_date": new Date()
            }
          }
        ).exec((err, result) => {
          if (err) {
            // return res.status(400).json({
            //   error: errorHandler.getErrorMessage(err)
            // });
          }
          User.update(
            {
              "stanning.subscriptionId": subscriptionId
            },
            {
              $set: {
                "stanning.$.periodEnd": periodEnd,
                "stanning.$.periodStart": periodStart,
                "stanning.$.paymentStatus": paymentStatus,
                "stanning.$.status": 0,
                "stanning.$.stanningRemovedDate": new Date()
              }
            }
          ).exec((err, result) => {
            if (err) {
              // return res.status(400).json({
              //   error: errorHandler.getErrorMessage(err)
              // });
            }
          });
        });
        break;
      }

      default:
        // Unexpected event type
        return res.status(400).end();
    }

    //Return a response to acknowledge receipt of the event
    res.json({ received: true });
  });

};
/* Webhook */

// const updateplans = (req, res) => {
//   User.find({
//     "creater.status": 1
//     //$and: [{ "creater.status": 1 }, { _id: "5e42b54eda1d203b8497b756" }]
//   }).exec((err, users) => {
//     if (err) {
//       return res.status(400).json({
//         error: errorHandler.getErrorMessage(err)
//       });
//     }
//     users.forEach(function (user) {
//       let accountId = user.payment ? user.payment.stripe_user_id : ''
//       console.log(accountId)
//       if (user.subscriptionpitch.planInfo.length > 0) {
//         console.log(user.subscriptionpitch.planInfo.length)
//         user.subscriptionpitch.planInfo.forEach(function (plan) {
//           if (accountId != '') {
//             stripe.plans.create(
//               {
//                 amount: plan.amount * 100,
//                 interval: "month",
//                 product: {
//                   name: "New Monthly Plan"
//                 },
//                 currency: "usd"
//               }, {
//               stripe_account: accountId,
//             },
//               function (err, newplan) {
//                 if (newplan) {
//                   //console.log(plan)
//                   var planId = newplan.id;
//                   User.update(
//                     {
//                       "subscriptionpitch.planInfo.planId": plan.planId
//                     },
//                     {
//                       $set: {
//                         "subscriptionpitch.planInfo.$.planId": planId,
//                       }
//                     }
//                   ).exec((err, result) => {
//                     if (err) {
//                     }
//                   });
//                 }
//               }
//             );
//           }
//         })
//       }
//     });
//   });
// };


export default {
  create,
  userByID,
  userByName,
  userNameById,
  read,
  readName,
  list,
  remove,
  update,
  photo,
  defaultPhoto,
  addFollowing,
  addFollower,
  removeFollowing,
  removeFollower,
  findPeople,
  bannerimg,
  defaultbanner,
  banner,
  notification,
  privacy,
  payment,
  countpeople,
  linkactivation,
  forgetpassword,
  becomestan,
  chat,
  becomecreater,
  stan,
  creatorCategory,
  topCreatorCategory,
  stanCount,
  followerCount,
  categoryuser,
  searchuser,
  subscriptionAndPitch,
  enableStanBtn,
  checkusername,
  enableShop,
  enableShopbtn,
  tipsByUser,
  manageOrders,
  becomeStan,
  removeStan,
  countriesList,
  shippingprice,
  readnotification,
  paymenttransaction,
  stanningtransaction,
  tippedByMe,
  findStanning,
  checkcategory,
  StantoMe,
  myShopOrder,
  insertCategory,
  checkemail,
  checkresettoken,
  reset,
  getEarning,
  reviewsubmit,
  gettotalwithdrawal,
  earningStmtFilter,
  getTransStatementByUser,
  getTransDebitStmtByUser,
  getVatByCountry,
  checkEmailById,
  emailactivatelink,
  getAccountIdByCodeId,
  makeWithDrawalByStripeId,
  calculateProcessFee,
  report,
  sendreferinvitation,
  webhook,
  sendfeedback,
  // updateplans
};
