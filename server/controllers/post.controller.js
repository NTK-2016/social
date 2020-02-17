import Post from "../models/post.model";
import User from "../models/user.model";
import Orders from "../models/orders.model";
import Category from "../models/category.model";
import Tag from "../models/tag.model";
import _ from "lodash";
import errorHandler from "./../helpers/dbErrorHandler";
import formidable from "formidable";
import fs from "fs";
import nodemailer from "nodemailer";
import handlebars from "handlebars";
import Notifications from "../models/notifications.model";
const AWS = require("aws-sdk");
const path = require("path");
var ffmpeg = require("ffmpeg");
var moment = require("moment");
import config from "../../config/config";
import Jimp from "jimp";

var readHTMLFile = function(path, callback) {
  fs.readFile(path, { encoding: "utf-8" }, function(err, html) {
    if (err) {
      throw err;
      callback(err);
    } else {
      callback(null, html);
    }
  });
};

//configuring the AWS environment
AWS.config.update({
  accessKeyId: "AKIATW724PWSTKKMJM5S", //AKIATW724PWSTKKMJM5S
  secretAccessKey: "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" //78Cc6RingCyrNYmuXt+3yKjpFw51cZRaxg1hTU8y
});
//AKIAQDQTBJYLTN2W5P72
//kSSK9fVrVy72aj1ujHI2evxPZ3IBcILEMmsN4FzM

import Transaction from "../models/transaction.model";
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

let Vimeo = require("vimeo").Vimeo;
let client = new Vimeo(
  "01f6a113a1551998181131000ca738a2b6e1afa0",
  "WVQmY1jZv41NVLaXJLTcaIBjttDXmvZTiyy6X5CKiwew39bwl0WpSmRubToWAknz9eUUgRiAGrVhcwU6Sq9y36SgLFAIRQJdqaBOr6DseRjVsfV9aldQoehf1vXwOeKC",
  "2b423733c2f014bbca773c8c28029b26"
);

const uploadPhoto = (req, res, next) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded"
      });
    }
    var date = new Date();
    var time = date.getTime();
    if (files.image) {
      time = "editor_" + time;
      var file_ext = files.image.name.split(".").pop();
      fs.rename(
        files.image.path,
        "dist/uploads/editoruploads/" + time + "." + file_ext,
        function(err) {
          awsupload(
            "editoruploads",
            "dist/uploads/editoruploads/" + time + "." + file_ext
          );
          var result = {
            data: {
              width: 240,
              height: 320,
              link: config.editorImageBucketURL + time + "." + file_ext
            }
          };
          setTimeout(() => {
            res.json(result);
          }, 3000);
        }
      );
    }
  });
};

const jimp = async (foldername, imagePath, imageName) => {
  let imgActive = imagePath + imageName;
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      Jimp.read(imgActive)
        .then(image => {
          return image
            .resize(Jimp.AUTO, 450) // resize
            .quality(100) // set JPEG quality
            .write("dist/uploads/" + foldername + "/compress/" + imageName); // save
        })
        .catch(err => {
          console.error(err);
        });
    }, 3000);
  });
  let result = await promise;
  return result;
};

const awsupload = (foldername, filePath) => {
  //console.log(foldername + "" + filePath)
  var time = foldername == "products" ? 3000 : 0;
  setTimeout(() => {
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

      s3.upload(params, function(err, data) {
        //handle error
        if (err) {
          console.log("Error", err);
        }
        //success
        if (data) {
          console.log(data);
          fs.unlink(filePath, err => {
            if (err) {
              console.error(err);
              return;
            }
          });
        }
      });
      /* AWS S3 code ends */
    } else {
      awsupload(foldername, filePath);
    }
  }, time);
};

const awsremove = filePath => {
  /* AWS S3 code starts */
  var s3 = new AWS.S3();
  //configuring parameters
  var params = {
    Bucket: "stanmedata",
    Key: filePath
  };
  s3.headObject(params, function(err, metadata) {
    if (err && err.code === "NotFound") {
      // Handle no object on cloud here
    } else {
      s3.deleteObject(params, function(err, data) {
        if (data) {
          console.log("File deleted successfully");
        } else {
          console.log("Check if you have sufficient permissions : " + err);
        }
      });
    }
  });
  /* AWS S3 code ends */
};

/** End here SMTP Configuration */
const create = (req, res, next) => {
  var timeout = 0;
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded"
      });
    }
    var option3 = "";
    var option4 = "";

    let post = new Post(fields);
    post.tipsEnabled = fields.tipsEnabled;
    if (fields.shippingcountry) {
      fields.shippingcountry = fields.shippingcountry.split(",");
    }
    if (fields.shippingcharges) {
      fields.shippingcharges = fields.shippingcharges.split(",");
    }

    if (fields.shippingcountry) {
      var array = [];
      for (var i = 0; i < fields.shippingcountry.length; i++) {
        array.push({
          country: fields.shippingcountry[i],
          charges: fields.shippingcharges[i]
        });
      }
      post.shippinginfo = array;
    }

    // Attribute Names
    if (fields.attributeNames) {
      fields.attributeNames = fields.attributeNames.split(",");
      fields.attributeValues = fields.attributeValues.split(",");
      var array = [];
      for (var i = 0; i < fields.attributeNames.length; i++) {
        array.push({
          attributeName: fields.attributeNames[i],
          attributeValue: fields.attributeValues[i]
        });
      }
      post.attributeNames = array;
    }

    post.postedBy = req.profile;
    if (fields.option1) {
      option3 = fields.option3 ? fields.option3 : option3;
      option4 = fields.option4 ? fields.option4 : option4;
      post.options = {
        option1: fields.option1,
        option2: fields.option2,
        option3: option3,
        option4: option4
      };
    }
    var date = new Date();
    var time = post._id; //date.getTime();
    if (files.photo) {
      timeout = 3000;
      //time = "photo_" + time;
      var file_ext = files.photo.name.split(".").pop();
      post.photo = "photo_" + time + "." + file_ext;
      fs.rename(
        files.photo.path,
        "dist/uploads/photos/photo_" + time + "." + file_ext,
        function(err) {
          var file_ext = files.photo.name.split(".").pop();
          awsupload(
            "photos",
            "dist/uploads/photos/photo_" + time + "." + file_ext
          );
        }
      );

      //post.photo.data = fs.readFileSync(files.photo.path)
      //post.photo.contentType = files.photo.type
    }
    if (files.photo1) {
      timeout = 3000;
      //time = "photo_" + time;
      var file_ext = files.photo1.name.split(".").pop();
      post.photo = "photo1_" + time + "." + file_ext;
      fs.rename(
        files.photo1.path,
        "dist/uploads/products/photo1_" + time + "." + file_ext,
        function(err) {
          var file_ext = files.photo1.name.split(".").pop();
          let name = "photo1_" + time + "." + file_ext;
          jimp("products", "dist/uploads/products/", name);
          awsupload(
            "products",
            "dist/uploads/products/photo1_" + time + "." + file_ext
          );
          awsupload(
            "products/compress",
            "dist/uploads/products/compress/photo1_" + time + "." + file_ext
          );
        }
      );
      // let name = "photo1_" + time + "." + file_ext;
      // jimp("products", "dist/uploads/products/", name);
      // setTimeout(() => {
      //   awsupload("products", "dist/uploads/products/photo1_" + time + "." + file_ext)
      //   awsupload("products/compress", "dist/uploads/products/compress/photo1_" + time + "." + file_ext)
      // }, 3000);
      //post.photo.data = fs.readFileSync(files.photo.path)
      //post.photo.contentType = files.photo.type
    }
    if (files.photo2) {
      timeout = 10000;
      //time = "photo_" + time;
      var file_ext = files.photo2.name.split(".").pop();
      post.photo = post.photo + ",photo2_" + time + "." + file_ext;
      fs.rename(
        files.photo2.path,
        "dist/uploads/products/photo2_" + time + "." + file_ext,
        function(err) {
          var file_ext = files.photo2.name.split(".").pop();
          let name = "photo2_" + time + "." + file_ext;
          jimp("products", "dist/uploads/products/", name);
          awsupload(
            "products",
            "dist/uploads/products/photo2_" + time + "." + file_ext
          );
          awsupload(
            "products/compress",
            "dist/uploads/products/compress/photo2_" + time + "." + file_ext
          );
        }
      );

      //post.photo.data = fs.readFileSync(files.photo.path)
      //post.photo.contentType = files.photo.type
    }
    if (files.photo3) {
      timeout = 3000;
      //time = "photo_" + time;
      var file_ext = files.photo3.name.split(".").pop();
      post.photo = post.photo + ",photo3_" + time + "." + file_ext;
      fs.rename(
        files.photo3.path,
        "dist/uploads/products/photo3_" + time + "." + file_ext,
        function(err) {
          var file_ext = files.photo3.name.split(".").pop();
          let name = "photo3_" + time + "." + file_ext;
          jimp("products", "dist/uploads/products/", name);
          awsupload(
            "products",
            "dist/uploads/products/photo3_" + time + "." + file_ext
          );
          awsupload(
            "products/compress",
            "dist/uploads/products/compress/photo3_" + time + "." + file_ext
          );
        }
      );
      //post.photo.data = fs.readFileSync(files.photo.path)
      //post.photo.contentType = files.photo.type
    }
    if (files.audio) {
      //time = "audio_" + time;
      var file_ext = files.audio.name.split(".").pop();
      post.audio = "audio_" + time + "." + file_ext;
      fs.rename(
        files.audio.path,
        "dist/uploads/audios/audio_" + time + "." + file_ext,
        function(err) {
          awsupload(
            "audios",
            "dist/uploads/audios/audio_" + time + "." + file_ext
          );
        }
      );
    }

    var attach0 = "";
    var attach1 = "";
    var attach2 = "";
    var attach3 = "";
    var attach4 = "";
    post.attach = "";
    if (fields.attach0) {
      attach0 = fields.attach0;
      post.attach = attach0;
    }
    /**
     * Start Attachment Fix
     */
    if (fields.attach1) {
      attach1 = fields.attach1;
      let comma = post.attach != "" ? "," : "";
      post.attach = post.attach + comma + attach1;
    }
    if (fields.attach2) {
      attach2 = fields.attach2;
      let comma = post.attach != "" ? "," : "";
      post.attach = post.attach + comma + attach2;
    }
    if (fields.attach3) {
      attach3 = fields.attach3;
      let comma = post.attach != "" ? "," : "";
      post.attach = post.attach + comma + attach3;
    }
    if (fields.attach4) {
      attach4 = fields.attach4;
      let comma = post.attach != "" ? "," : "";
      post.attach = post.attach + comma + attach4;
    }
    if (files.attach0) {
      let time = Math.floor(Math.random() * 1000000 + 1);
      var file_ext = files.attach0.name.split(".").pop();
      attach0 = "attachment_1_" + time + "." + file_ext;
      fs.rename(
        files.attach0.path,
        "dist/uploads/attachments/attachment_1_" + time + "." + file_ext,
        function(err) {
          awsupload(
            "attachments",
            "dist/uploads/attachments/attachment_1_" + time + "." + file_ext
          );
        }
      );
      // this for New Post check post.attach is empty or not
      let comma = post.attach != "" ? "," : "";
      post.attach = (post.attach != "" ? post.attach : "") + comma + attach0;
    }
    if (files.attach1) {
      let time = Math.floor(Math.random() * 1000000 + 1);
      var file_ext = files.attach1.name.split(".").pop();
      attach1 = "attachment_2_" + time + "." + file_ext;
      fs.rename(
        files.attach1.path,
        "dist/uploads/attachments/attachment_2_" + time + "." + file_ext,
        function(err) {
          awsupload(
            "attachments",
            "dist/uploads/attachments/attachment_2_" + time + "." + file_ext
          );
        }
      );
      let comma = post.attach != "" ? "," : "";
      post.attach = post.attach + comma + attach1;
    }
    if (files.attach2) {
      let time = Math.floor(Math.random() * 1000000 + 1);
      var file_ext = files.attach2.name.split(".").pop();
      attach2 = "attachment_3_" + time + "." + file_ext;
      fs.rename(
        files.attach2.path,
        "dist/uploads/attachments/attachment_3_" + time + "." + file_ext,
        function(err) {
          awsupload(
            "attachments",
            "dist/uploads/attachments/attachment_3_" + time + "." + file_ext
          );
        }
      );
      let comma = post.attach != "" ? "," : "";
      post.attach = post.attach + comma + attach2;
    }
    if (files.attach3) {
      let time = Math.floor(Math.random() * 1000000 + 1);
      var file_ext = files.attach3.name.split(".").pop();
      attach3 = "attachment_4_" + time + "." + file_ext;
      fs.rename(
        files.attach3.path,
        "dist/uploads/attachments/attachment_4_" + time + "." + file_ext,
        function(err) {
          awsupload(
            "attachments",
            "dist/uploads/attachments/attachment_4_" + time + "." + file_ext
          );
        }
      );
      let comma = post.attach != "" ? "," : "";
      post.attach = post.attach + comma + attach3;
    }
    if (files.attach4) {
      let time = Math.floor(Math.random() * 1000000 + 1);
      var file_ext = files.attach4.name.split(".").pop();
      attach4 = "attachment_5_" + time + "." + file_ext;
      fs.rename(
        files.attach4.path,
        "dist/uploads/attachments/attachment_5_" + time + "." + file_ext,
        function(err) {
          awsupload(
            "attachments",
            "dist/uploads/attachments/attachment_5_" + time + "." + file_ext
          );
        }
      );
      let comma = post.attach != "" ? "," : "";
      post.attach = post.attach + comma + attach4;
    }
    //post.attach = post.attach.trimLeft(",")
    if (files.video) {
      try {
        var process = new ffmpeg(files.video.path);
        process.then(
          function(video) {
            // // Video metadata
            // console.log(video.metadata);
            // // FFmpeg configuration
            // console.log(video.info_configuration);
            video.fnExtractFrameToJPG(
              "dist/uploads/videos/thumbnail",
              {
                frame_rate: 1,
                number: 1,
                file_name: time + ".jpg"
              },
              function(error, imagefiles) {
                if (!error) console.log(error);

                awsupload(
                  "videos/thumbnail",
                  "dist/uploads/videos/thumbnail/" + time + "_1.jpg"
                );
              }
            );

            video
              //.setVideoSize("1280x720", true, false)
              //.setAudioCodec('libfaac')
              //.setAudioChannels(2)
              .setVideoFormat("mp4")
              .save("dist/uploads/videos/video_" + time + ".mp4", function(
                error,
                file
              ) {
                if (!error) {
                  /* AWS S3 code starts */
                  var s3 = new AWS.S3();
                  var filePath = file;

                  //configuring parameters
                  var params = {
                    Bucket: "stanmedata",
                    Body: fs.createReadStream(filePath),
                    Key: "uploads/videos/" + path.basename(filePath),
                    ACL: "public-read"
                  };

                  s3.upload(params, function(err, data) {
                    //handle error
                    if (err) {
                      console.log("Error", err);
                    }
                    //success
                    if (data) {
                      fs.unlink(file, err => {
                        if (err) {
                          console.error(err);
                          return;
                        }

                        //file removed
                      });
                      post.video = "video_" + time + ".mp4";
                      post.url = data.Location;
                      post.save((err, result) => {
                        if (err) {
                          return res.status(400).json({
                            error: errorHandler.getErrorMessage(err)
                          });
                        }
                        res.json(result);
                      });
                    }
                  });
                  /* AWS S3 code ends */
                }
                console.log(error);
              });
          },
          function(err) {
            console.log("Error: " + err);
          }
        );
      } catch (e) {
        console.log(e.code);
        console.log(e.msg);
      }
      /* vimeo code starts */
      // let file_name = files.video.path
      // client.upload(
      //   file_name,
      //   {
      //     'name': fields.text,
      //     'description': fields.text
      //   },
      //   function (uri) {
      //     console.log('Your video URI is: ' + uri);
      //   },
      //   function (bytes_uploaded, bytes_total) {
      //     var percentage = (bytes_uploaded / bytes_total * 100).toFixed(2)
      //     console.log(bytes_uploaded, bytes_total, percentage + '%')
      //   },
      //   function (error) {
      //     console.log('Failed because: ' + error)
      //   }
      // )
      /* vimeo code ends */

      /*var file_ext = files.video.name.split(".").pop();
      post.video = "video_" + time + "." + file_ext;
      fs.rename(
        files.video.path,
        "dist/uploads/videos/video_" + time + "." + file_ext,
        function (err) { }
      ); */
    }
    if (!files.video) {
      post.save((err, result) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
          });
        }
        setTimeout(() => {
          res.json(result);
        }, timeout);
      });
    }
  });

  // form.on('fileBegin', function (name, file){
  //       file.path = __dirname + 'stanme/public/uploads/' + file.name;
  //   });
};

const repost = (req, res, next) => {
  Post.findById(req.body.postId)
    // .populate("comments.postedBy", "_id name")
    // .populate("likes", "_id name")
    // .populate("postedBy", "_id name shopenable")
    .exec((err, post) => {
      if (err || !post)
        return res.status("400").json({
          error: "Post not found"
        });
      var repostdata = post.toObject();
      delete repostdata._id;
      let repost = new Post(repostdata);
      repost.created = new Date();
      repost.repost = true;
      repost.actualPostId = req.body.postId;
      repost.repostedBy = req.profile._id;
      repost.likes = [];
      repost.comments = [];
      repost.polled = [];
      repost.tips = [];
      repost.save((err, result) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
          });
        }
        Post.findByIdAndUpdate(req.body.postId, {
          $push: { repostBy: req.profile._id }
        }).exec((err, result) => {
          if (err) {
            return res.status(400).json({
              error: errorHandler.getErrorMessage(err)
            });
          }
        });
        res.json(repost);
      });
    });
};

const postByID = (req, res, next, id) => {
  Post.findById(id)
    .populate("postedBy", "_id name username photo")
    .exec((err, post) => {
      if (err || !post)
        return res.status("400").json({
          error: "Post not found"
        });
      req.post = post;
      next();
    });
};

const getDataID = (req, res, next, id) => {
  Post.findById(id)
    .populate("comments.postedBy", "_id name username photo")
    .populate("likes", "_id name username photo")
    .populate(
      "postedBy",
      "_id name username photo shopenable creater.status subscriptionpitch.planInfo stan"
    )
    .populate("repostedBy", "_id name username photo")
    .exec((err, post) => {
      if (err || !post)
        return res.status("400").json({
          error: "Post not found"
        });

      var status = "";
      var found = false;
      var stanvalue = [];
      var newposts = post;

      if (newposts.postedBy.stan.length > 0) {
        newposts.postedBy.stan.forEach(function(res) {
          if (!found) {
            status =
              res.ref_id.toString() == req.body.id.toString() && res.status == 1
                ? null
                : undefined;

            if (res.stan_lost_date) {
              var today = new Date();
              var stan_date = new Date(res.stan_date);
              stan_date.setMonth(stan_date.getMonth() + 1);
              var stan_lost_date = res.stan_lost_date;
              const date1 = today;
              const date2 = new Date(res.periodEnd); //new Date(stan_date);
              const diffTime = Math.abs(date2 - date1);
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              status =
                res.ref_id.toString() == req.body.id.toString() &&
                res.status == 0 &&
                date2 > date1
                  ? null
                  : undefined;
            }
            if (status != null && status != undefined) {
              found = true;
            }
          }
        });
      }
      if (newposts.postedBy.stan.length == 0) {
        stanvalue.push(undefined);
      } else {
        stanvalue.push(status);
      }
      found = false;
      status = "";

      // newposts.forEach(function (singlepost) {
      //   console.log(singlepost.postedBy.stan.length);
      //   console.log(singlepost.postedBy.stan);
      //   if (singlepost.postedBy.stan.length > 0) {
      //     singlepost.postedBy.stan.forEach(function (res) {
      //       if (!found) {
      //         status = res.ref_id.toString() == req.body.id.toString() && res.status == 1
      //           ? null
      //           : undefined;
      //         if (res.stan_lost_date) {
      //           var stan_date = new Date(res.stan_date);
      //           stan_date.setMonth(stan_date.getMonth() + 1);
      //           var stan_lost_date = res.stan_lost_date
      //           const date1 = new Date(stan_lost_date);
      //           const date2 = new Date(stan_date);
      //           const diffTime = Math.abs(date2 - date1);
      //           const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      //           status = res.ref_id.toString() == req.body.id.toString() && res.status == 0 && diffDays > 0
      //             ? null
      //             : undefined;
      //         }
      //         if (status != null && status != undefined) {
      //           found = true;
      //         }
      //       }
      //     });
      //   }
      //   if (singlepost.postedBy.stan.length == 0) {
      //     stanvalue.push(undefined);
      //   } else {
      //     stanvalue.push(status);
      //   }
      //   found = false;
      //   status = "";
      // });
      // var i = 0;
      // newposts.forEach(function (singlepost) {
      //   singlepost.postedBy.stan = stanvalue[i];
      //   i++;
      // });
      var isUploaded = true;
      if (
        newposts.photo &&
        newposts.photo.split(",")[0] &&
        fs.existsSync(
          process.cwd() +
            config.productDefaultPath +
            newposts.photo.split(",")[0]
        )
      ) {
        isUploaded = false;
      }
      if (
        newposts.photo &&
        newposts.photo.split(",")[1] &&
        fs.existsSync(
          process.cwd() +
            config.productDefaultPath +
            newposts.photo.split(",")[1]
        )
      ) {
        isUploaded = false;
      }
      if (
        newposts.photo &&
        newposts.photo.split(",")[2] &&
        fs.existsSync(
          process.cwd() +
            config.productDefaultPath +
            newposts.photo.split(",")[2]
        )
      ) {
        isUploaded = false;
      }
      newposts.isUploaded = isUploaded;
      newposts.postedBy.stan = stanvalue[0];
      post = newposts;
      res.json(post);
    });
};

const readOrder = (req, res) => {
  Orders.find({
    $and: [
      {
        productid: {
          $in: req.body.productId
        }
      },
      { ordered_by: { $in: req.profile._id } }
    ]
  })
    .exec((err, posts) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }
      res.json(posts);
    })
    .select("orderId");
};

const listByUser = (req, res) => {
  // 1 = published

  // if postcount true
  if (req.body.postcount) {
    Post.find({
      $or: [
        { $and: [{ postedBy: { $in: req.profile._id } }, { repost: false }] },
        { repostedBy: { $in: req.profile._id } }
      ],
      $and: [{ posttype: { $in: "1" } }, { postname: { $ne: "product" } }]
    }).count(function(err, count) {
      if (err) throw err;
      res.json(count);
    });
  } else {
    //console.log(req);
    Post.find({
      $or: [
        {
          $and: [{ postedBy: { $in: req.profile._id } }, { repost: false }]
        },
        { repostedBy: { $in: req.profile._id } }
      ],
      $and: [
        // { postedBy: { $in: req.profile.following } },
        // { repostedBy: { $in: req.profile.following } },
        { posttype: { $in: "1" } },
        { postname: { $ne: "product" } }
        // {
        //   $or: [
        //     { postedBy: { $in: req.profile._id } },
        //     { repostedBy: { $in: req.profile._id } }
        //   ]
        // }
        //{ postname: { $ne: "thought" } }
      ]
    }) //{postedBy: req.profile._id}
      .populate("comments.postedBy", "_id name username photo")
      .populate(
        "postedBy",
        "_id name username photo creater.status subscriptionpitch.planInfo stan"
      )
      .populate("repostedBy", "_id name username photo")
      .limit(req.body.limit)
      .skip(req.body.skip)
      .sort("-created")
      .exec((err, posts) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
          });
        }
        var status = "";
        var found = false;
        var stanvalue = [];
        var newposts = posts;
        newposts.forEach(function(singlepost) {
          if (singlepost.postedBy != null) {
            if (singlepost.postedBy.stan.length > 0) {
              singlepost.postedBy.stan.forEach(function(res) {
                if (!found) {
                  status =
                    res.ref_id.toString() == req.body.id.toString() &&
                    res.status == 1
                      ? null
                      : undefined;
                  if (res.stan_lost_date) {
                    var today = new Date();
                    var stan_date = new Date(res.stan_date);
                    stan_date.setMonth(stan_date.getMonth() + 1);
                    var stan_lost_date = res.stan_lost_date;
                    const date1 = today; //new Date(stan_lost_date);
                    const date2 = new Date(res.periodEnd); //new Date(stan_date);
                    const diffTime = Math.abs(date2 - date1);
                    const diffDays = Math.ceil(
                      diffTime / (1000 * 60 * 60 * 24)
                    );
                    status =
                      res.ref_id.toString() == req.body.id.toString() &&
                      res.status == 0 &&
                      date2 > date1
                        ? null
                        : undefined;
                  }
                  if (status != null && status != undefined) {
                    found = true;
                  }
                }
              });
            }
            if (singlepost.postedBy.stan.length == 0) {
              stanvalue.push(undefined);
            } else {
              stanvalue.push(status);
            }
            found = false;
            status = "";
          }
        });
        var i = 0;
        newposts.forEach(function(singlepost) {
          if (singlepost.postedBy != null) {
            singlepost.postedBy.stan = stanvalue[i];
            i++;
          }
        });
        posts = newposts;
        res.json(posts);
      });
  }
};

const listScheduleByUser = (req, res) => {
  //2 = scheduled

  // console.log(req);
  Post.find({
    $and: [{ postedBy: { $in: req.profile._id } }, { posttype: { $in: "2" } }]
  }) //{postedBy: req.profile._id}
    .populate("comments", "text created")
    .populate("comments.postedBy", "_id name username photo")
    .populate("postedBy", "_id name username photo")
    .sort("-created")
    .exec((err, posts) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }
      res.json(posts);
    });
};

const listDraftByUser = (req, res) => {
  //3 = draft

  // console.log(req);
  Post.find({
    $and: [{ postedBy: { $in: req.profile._id } }, { posttype: { $in: "3" } }]
  }) //{postedBy: req.profile._id}
    .populate("comments", "text created")
    .populate("comments.postedBy", "_id name username photo")
    .populate("postedBy", "_id name username photo")
    .sort("-created")
    .exec((err, posts) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }
      res.json(posts);
    });
};

const listProductsByUser = (req, res) => {
  //3 = draft

  // console.log(req);
  Post.find({
    $and: [
      { postedBy: { $in: req.profile._id } },
      { postname: { $in: "product" } }
    ]
  }) //{postedBy: req.profile._id}
    .populate("comments", "text created")
    .populate("comments.postedBy", "_id name username photo")
    .populate("postedBy", "_id name username photo")
    .sort("-created")
    .exec((err, posts) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }
      res.json(posts);
    });
};

const listNewsFeed = (req, res) => {
  // client.request({
  //   method: 'GET',
  //   path: '/tutorial'
  // }, function (error, body, status_code, headers) {
  //   if (error) {
  //     console.log(error);
  //   }

  //   console.log(body);
  // })
  // client.request(uri + '?fields=transcode.status', function (error, body, status_code, headers) {
  //   if (body.transcode.status === 'complete') {
  //     console.log('Your video finished transcoding.')
  //   } else if (body.transcode.status === 'in_progress') {
  //     console.log('Your video is still transcoding.')
  //   } else {
  //     console.log('Your video encountered an error during transcoding.')
  //   }
  // })

  let following = req.profile.following;
  following.push(req.profile._id);

  Post.find({
    $or: [
      {
        $and: [{ postedBy: { $in: req.profile.following } }, { repost: false }]
      },
      { repostedBy: { $in: req.profile.following } }
    ],
    $and: [
      // { postedBy: { $in: req.profile.following } },
      // { repostedBy: { $in: req.profile.following } },
      { posttype: { $in: "1" } },
      { postname: { $ne: "product" } }
    ]
  }) //,{viewtype:{$in:"stans"}}
    //Post.find({postedBy: { $in : req.profile.following }})

    .populate("comments.postedBy", "_id name username photo")
    .populate(
      "postedBy",
      "_id name username photo creater.status subscriptionpitch.planInfo stan"
    )
    .populate("repostedBy", "_id name username photo")
    .limit(req.body.limit) //req.body.limit
    .skip(req.body.skip) //req.body.skip
    .sort("-created")
    .exec((err, posts) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }

      // var stanstatus = false;

      // posts.forEach(function (singlepost) { //10 -> 1
      //   console.log("length " + singlepost.postedBy.stan.length)
      //   console.log("length " + singlepost.postedBy.stan)
      //   singlepost.postedBy.stan.forEach(function (res) { //1 -> 2
      //     if (!stanstatus) {
      //       stanstatus = res.ref_id.toString() == req.profile._id.toString() && res.status == 1 ? true : false
      //       console.log(stanstatus)
      //     }
      //   })
      //   console.log(stanstatus)
      //   singlepost.postedBy.stan = stanstatus ? [{ "count": true }] : undefined
      //   console.log(singlepost.postedBy.stan)
      //   stanstatus = false;
      // })
      // console.log(demoposts[0].postedBy.stan)
      // console.log(posts[0].postedBy.stan)
      var status = "";
      var found = false;
      var stanvalue = [];
      var newposts = posts;
      newposts.forEach(function(singlepost) {
        if (singlepost.postedBy != null) {
          //10 -> 1
          // console.log(singlepost.postedBy);
          // console.log(singlepost.postedBy.stan.length);
          // console.log(singlepost.postedBy.stan);
          if (singlepost.postedBy.stan.length > 0) {
            singlepost.postedBy.stan.forEach(function(res) {
              //1 -> 2
              if (!found) {
                status =
                  res.ref_id.toString() == req.profile._id.toString() &&
                  res.status == 1
                    ? null
                    : undefined;

                if (res.stan_lost_date) {
                  var today = new Date();
                  var stan_date = new Date(res.stan_date);
                  stan_date.setMonth(stan_date.getMonth() + 1);
                  var stan_lost_date = res.stan_lost_date;

                  const date1 = today;
                  const date2 = new Date(res.periodEnd); //new Date(stan_date);
                  const diffTime = Math.abs(date2 - date1);
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                  status =
                    res.ref_id.toString() == req.profile._id.toString() &&
                    res.status == 0 &&
                    date2 > date1
                      ? null
                      : undefined;
                }
                if (status != null && status != undefined) {
                  found = true;
                }
              }
            });
          }
          if (singlepost.postedBy.stan.length == 0) {
            stanvalue.push(undefined);
          } else {
            stanvalue.push(status);
          }
          // if (status) {
          //   stanvalue.push(status)
          // }
          // else {
          //   stanvalue.push(status)
          // }
          // singlepost.postedBy.stan = status ? [{ count: true }] : "";
          found = false;
          status = "";
        }
        // console.log(singlepost.postedBy.stan);
      });
      // console.log(demoposts[0].postedBy.stan);
      // console.log(demoposts)
      //res.json(posts);
      var i = 0;
      newposts.forEach(function(singlepost) {
        if (singlepost.postedBy != null) {
          singlepost.postedBy.stan = stanvalue[i];
          i++;
        }
      });
      posts = newposts;
      res.json(posts);
    });
};

const listLikedFeed = (req, res) => {
  Post.find({ likes: { $in: [req.profile._id] } }) //{postedBy: req.profile._id}
    .populate("comments.postedBy", "_id name username photo")
    //.populate("likes", "_id name username photo")
    .populate(
      "postedBy",
      "_id name username photo shopenable creater.status subscriptionpitch.planInfo stan"
    )
    .populate("repostedBy", "_id name username photo")
    .sort("-created")
    // .populate("comments", "text created")
    // .populate("comments.postedBy", "_id name username photo")
    // .populate(
    //   "postedBy",
    //   "_id name username photo creater.status subscriptionpitch.planInfo stan"
    // )
    // .sort("-created")
    .exec((err, posts) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }

      // var stanstatus = false;

      // posts.forEach(function (singlepost) { //10 -> 1
      //   console.log("length " + singlepost.postedBy.stan.length)
      //   console.log("length " + singlepost.postedBy.stan)
      //   singlepost.postedBy.stan.forEach(function (res) { //1 -> 2
      //     if (!stanstatus) {
      //       stanstatus = res.ref_id.toString() == req.profile._id.toString() && res.status == 1 ? true : false
      //       console.log(stanstatus)
      //     }
      //   })
      //   console.log(stanstatus)
      //   singlepost.postedBy.stan = stanstatus ? [{ "count": true }] : undefined
      //   console.log(singlepost.postedBy.stan)
      //   stanstatus = false;
      // })
      // console.log(demoposts[0].postedBy.stan)
      // console.log(posts[0].postedBy.stan)
      var status = "";
      var found = false;
      var stanvalue = [];
      var newposts = posts;
      var index = 0;
      newposts.forEach(function(singlepost) {
        if (singlepost.postedBy != null) {
          //10 -> 1
          // console.log(singlepost.postedBy);
          // console.log(singlepost.postedBy.stan.length);
          // console.log(singlepost.postedBy.stan);
          if (singlepost.postedBy.stan.length > 0) {
            singlepost.postedBy.stan.forEach(function(res) {
              //1 -> 2
              if (!found) {
                status =
                  res.ref_id.toString() == req.profile._id.toString() &&
                  res.status == 1
                    ? null
                    : undefined;

                if (res.stan_lost_date) {
                  var today = new Date();
                  var stan_date = new Date(res.stan_date);
                  stan_date.setMonth(stan_date.getMonth() + 1);
                  var stan_lost_date = res.stan_lost_date;

                  const date1 = today;
                  const date2 = new Date(res.periodEnd); //new Date(stan_date);
                  const diffTime = Math.abs(date2 - date1);
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                  status =
                    res.ref_id.toString() == req.profile._id.toString() &&
                    res.status == 0 &&
                    date2 > date1
                      ? null
                      : undefined;
                }
                if (status != null && status != undefined) {
                  found = true;
                }
              }
            });
          }
          if (singlepost.postedBy.stan.length == 0) {
            stanvalue.push(undefined);
          } else {
            stanvalue.push(status);
          }
          // if (status) {
          //   stanvalue.push(status)
          // }
          // else {
          //   stanvalue.push(status)
          // }
          // singlepost.postedBy.stan = status ? [{ count: true }] : "";
          found = false;
          status = "";

          // console.log(singlepost.postedBy.stan);
        } else {
          newposts.splice(index, 1);
        }
        index++;
      });
      // console.log(demoposts[0].postedBy.stan);
      // console.log(demoposts)
      //res.json(posts);
      var i = 0;
      newposts.forEach(function(singlepost) {
        if (singlepost.postedBy != null) {
          singlepost.postedBy.stan = stanvalue[i];
          i++;
        }
      });
      posts = newposts;
      res.json(posts);
    });
};

const remove = (req, res) => {
  let post = req.post;
  post.remove((err, deletedPost) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      });
    }
    if (deletedPost.repost) {
      Post.findByIdAndUpdate(
        deletedPost.actualPostId,
        { $pull: { repostBy: deletedPost.repostedBy } },
        { new: true }
      ).exec((err, result) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
          });
        }
        res.json(deletedPost);
      });
    }
    if (!deletedPost.repost) {
      var filePath = "";
      var anotherfilePath = "";
      var compressFilePath = "";
      if (deletedPost.postname == "image") {
        filePath = "uploads/photos/" + deletedPost.photo;
        compressFilePath = "uploads/photos/compress/" + deletedPost.photo;
      } else if (deletedPost.postname == "audio") {
        filePath = "uploads/audios/" + deletedPost.audio;
        anotherfilePath = "uploads/photos/" + deletedPost.photo;
      } else if (deletedPost.postname == "video") {
        filePath = "uploads/videos/" + deletedPost.video;
        compressFilePath =
          "uploads/videos/thumbnail/" + deletedPost._id + "_1.jpg";
      } else if (deletedPost.postname == "product") {
        let productimage = [];
        if (deletedPost.photo) productimage = deletedPost.photo.split(",");
        productimage.map((item, i) => {
          awsremove("uploads/products/" + item);
          awsremove("uploads/products/compress/" + item);
        });

        let attachments = [];
        if (deletedPost.attach) attachments = deletedPost.attach.split(",");
        attachments.map((item, i) => {
          awsremove("uploads/attachments/" + item);
        });
      } else if (deletedPost.postname == "article") {
        filePath = "uploads/photos/" + deletedPost.photo;
      }
      if (filePath != "") {
        awsremove(filePath);
      }
      if (anotherfilePath != "") {
        awsremove(anotherfilePath);
      }
      if (compressFilePath != "") {
        awsremove(compressFilePath);
      }
      res.json(deletedPost);
    }
  });
};

const photo = (req, res, next) => {
  res.set("Content-Type", req.post.photo.contentType);
  return res.send(req.post.photo.data);
};

const audio = (req, res, next) => {
  res.set("Content-Type", req.post.audio.contentType);
  return res.send(req.post.audio.data);
};

const like = (req, res) => {
  let fromusername = "";
  let fromprofile = "";
  let touseremail = "";
  /* Start Find User Detail */
  User.findOne({ _id: req.body.userId }).exec((err, users) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      });
    }
    fromusername = users.name;
    fromprofile = users.photo ? users.photo : "";
  });

  /* End Find User Detail */

  Post.findByIdAndUpdate(
    req.body.postId,
    { $push: { likes: req.body.userId } },
    { new: true }
  )
    // .populate('likes', '_id name')
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }
      /* Send Mail to user */
      /* Start Find User Detail */
      if (result) {
        User.findOne({ _id: result.postedBy }).exec((err, users) => {
          if (err) {
            return res.status(400).json({
              error: errorHandler.getErrorMessage(err)
            });
          }
          touseremail = users.email;
          if (req.body.userId != users._id) {
            /* save notification in db start */
            let notification = new Notifications({
              type: "like",
              fromId: req.body.userId,
              toId: users._id,
              postId: req.body.postId,
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
          }

          if (users.usernotification.pmlikes == 1) {
            readHTMLFile(
              process.cwd() + "/server/controllers/emailer/newlike.html",
              function(err, html) {
                var template = handlebars.compile(html);
                var replacements = {
                  name: fromusername,
                  id: req.body.userId,
                  created: moment(new Date()).format("D MMM YYYY HH:mm"),
                  servername: config.smtp_mail_server_path,
                  profileImage:
                    fromprofile != ""
                      ? config.profileImageBucketURL + fromprofile
                      : config.profileDefaultURL
                };
                var htmlToSend = template(replacements);
                var mailOptions = {
                  from: '"Stan.Me " <mail@stan.me>', // sender address
                  to: touseremail, // list of receivers
                  subject: "New Like", // Subject line
                  text: "New Like", // plain text body
                  html: htmlToSend
                };
                transporter.sendMail(mailOptions, function(error, response) {
                  if (error) {
                    console.log(error);
                    callback(error);
                  }
                });
              }
            );
          }
        });
        /* End Find User Detail */

        //console.log(transporter);
        // transporter.sendMail({
        //   from: '"Activate Your Account " <nikaengg@gmail.com>', // sender address
        //   to: touseremail, //"magento.web002@gmail.com",//"kamleshk.maurya@rvsolutions.in", // list of receivers
        //   subject: "Like Notification", // Subject line
        //   text: fromusername + " liked your post.", // plain text body
        //   html: "<p>" + fromusername + " liked your post.</p>" // html body
        // });

        /* End Send Mail */
        res.json(result);
      } else {
        res.json([-1]);
      }
    });
};

const unlike = (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    { $pull: { likes: req.body.userId } },
    { new: true }
  )
    // .populate('likes', '_id name')
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }
      res.json(result);
    });
};

const comment = (req, res) => {
  let comment = req.body.comment;
  comment.postedBy = req.body.userId;
  Post.findByIdAndUpdate(
    req.body.postId,
    { $push: { comments: comment } },
    { new: true }
  )
    .populate("comments.postedBy", "_id name username photo")
    .populate("postedBy", "_id name username photo")
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }
      if (req.body.userId != result.postedBy._id) {
        /* save notification in db start */
        let notification = new Notifications({
          type: "comment",
          fromId: req.body.userId,
          toId: result.postedBy._id,
          postId: req.body.postId,
          status: 1
        });
        notification.save((err, notificationdata) => {
          if (err) {
            return res.status(400).json({
              error: errorHandler.getErrorMessage(err)
            });
          }
        });
        /* save notification in db end */
      }
      res.json(result);
    });
};
const uncomment = (req, res) => {
  let comment = req.body.comment;
  Post.findByIdAndUpdate(
    req.body.postId,
    { $pull: { comments: { _id: comment._id } } },
    { new: true }
  )
    .populate("comments.postedBy", "_id name username photo")
    .populate("postedBy", "_id name username photo")
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }
      res.json(result);
    });
};

const isPoster = (req, res, next) => {
  let isPoster =
    req.post &&
    req.auth &&
    (req.post.postedBy._id == req.auth._id ||
      req.post.repostedBy._id == req.auth._id);
  if (!isPoster) {
    return res.status("403").json({
      error: "User is not authorized"
    });
  }
  next();
};

const update = (req, res, next) => {
  var timeout = 0;
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Photo could not be uploaded"
      });
    }
    let post = req.post;
    post = _.extend(post, fields);

    if (fields.shippingcountry) {
      fields.shippingcountry = fields.shippingcountry.split(",");
    }
    if (fields.shippingcharges) {
      fields.shippingcharges = fields.shippingcharges.split(",");
    }
    var array = [];
    if (fields.shippingcountry) {
      for (var i = 0; i < fields.shippingcountry.length; i++) {
        array.push({
          country: fields.shippingcountry[i],
          charges: fields.shippingcharges[i]
        });
      }
      post.shippinginfo = array;
    }
    // post.shippinginfo = array;

    // Attribute Names
    if (fields.attributeNames) {
      fields.attributeNames = fields.attributeNames.split(",");
      fields.attributeValues = fields.attributeValues.split(",");
      var array = [];
      for (var i = 0; i < fields.attributeNames.length; i++) {
        array.push({
          attributeName: fields.attributeNames[i],
          attributeValue: fields.attributeValues[i]
        });
      }
      post.attributeNames = array;
    }

    if (fields.option1) {
      post.options.option1 = fields.option1;
    }
    if (fields.option2) {
      post.options.option2 = fields.option2;
    }
    if (fields.option3) {
      post.options.option3 = fields.option3;
    }
    if (fields.option4) {
      post.options.option4 = fields.option4;
    }

    /* Start Unlink Image */
    if (fields.removeAttach) {
      fields.removeAttach = fields.removeAttach.split(",");
      fields.removeAttach.forEach(element => {
        // if (fs.existsSync("dist/uploads/attachments/" + element)) {
        //   fs.unlink("dist/uploads/attachments/" + element, function (err) {
        //     if (err) {
        //       throw err;
        //     }
        //   });
        // }
        awsremove("uploads/attachments/" + element);
      });
      fields.removeAttach = undefined;
    }
    /* End Unlink Image*/
    // user.updated = Date.now()
    var date = new Date();
    var time = post._id; //date.getTime();
    var photo1 = "";
    var photo2 = "";
    var photo3 = "";
    // post.photo = "";
    if (files.photo) {
      //time = time + 10;
      var file_ext = files.photo.name.split(".").pop();
      post.photo = "photo_" + time + "." + file_ext;
      fs.rename(
        files.photo.path,
        "dist/uploads/photos/photo_" + time + "." + file_ext,
        function(err) {
          var file_ext = files.photo.name.split(".").pop();
          awsupload(
            "photos",
            "dist/uploads/photos/photo_" + time + "." + file_ext
          );
        }
      );
      //post.photo.data = fs.readFileSync(files.photo.path)
      //post.photo.contentType = files.photo.type
    }

    if (fields.photo1) {
      photo1 = fields.photo1;
      post.photo = photo1;
    }

    if (files.photo1) {
      timeout = 3000;
      //time = "photo_" + time;
      var file_ext = files.photo1.name.split(".").pop();
      post.photo = "photo1_" + time + "." + file_ext;
      fs.rename(
        files.photo1.path,
        "dist/uploads/products/photo1_" + time + "." + file_ext,
        function(err) {
          var file_ext = files.photo1.name.split(".").pop();
          let name = "photo1_" + time + "." + file_ext;
          jimp("products", "dist/uploads/products/", name);
          awsupload(
            "products",
            "dist/uploads/products/photo1_" + time + "." + file_ext
          );
          awsupload(
            "products/compress",
            "dist/uploads/products/compress/photo1_" + time + "." + file_ext
          );
        }
      );
      // let name = "photo1_" + time + "." + file_ext;
      // jimp("photos", "dist/uploads/photos/", name);
      // awsupload("photos/compress", "dist/uploads/photos/compress/photo1_" + time + "." + file_ext)
      //post.photo.data = fs.readFileSync(files.photo.path)
      //post.photo.contentType = files.photo.type
    }
    if (fields.photo2) {
      photo2 = fields.photo2;
      post.photo = post.photo + "," + photo2;
    }
    if (files.photo2) {
      timeout = 3000;
      //time = "photo_" + time;
      var file_ext = files.photo2.name.split(".").pop();
      post.photo = post.photo + ",photo2_" + time + "." + file_ext;
      fs.rename(
        files.photo2.path,
        "dist/uploads/products/photo2_" + time + "." + file_ext,
        function(err) {
          var file_ext = files.photo2.name.split(".").pop();
          let name = "photo2_" + time + "." + file_ext;
          jimp("products", "dist/uploads/products/", name);
          awsupload(
            "products",
            "dist/uploads/products/photo2_" + time + "." + file_ext
          );
          awsupload(
            "products/compress",
            "dist/uploads/products/compress/photo2_" + time + "." + file_ext
          );
        }
      );
      // let name = "photo2_" + time + "." + file_ext;
      // jimp("photos", "dist/uploads/photos/", name);
      //awsupload("photos/compress", "dist/uploads/photos/compress/photo2_" + time + "." + file_ext)
      //post.photo.data = fs.readFileSync(files.photo.path)
      //post.photo.contentType = files.photo.type
    }
    if (fields.photo3) {
      photo3 = fields.photo3;
      post.photo = post.photo + "," + photo3;
    }
    if (files.photo3) {
      timeout = 3000;
      //time = "photo_" + time;
      var file_ext = files.photo3.name.split(".").pop();
      post.photo = post.photo + ",photo3_" + time + "." + file_ext;
      fs.rename(
        files.photo3.path,
        "dist/uploads/products/photo3_" + time + "." + file_ext,
        function(err) {
          var file_ext = files.photo3.name.split(".").pop();
          let name = "photo3_" + time + "." + file_ext;
          jimp("products", "dist/uploads/products/", name);
          awsupload(
            "products",
            "dist/uploads/products/photo3_" + time + "." + file_ext
          );
          awsupload(
            "products/compress",
            "dist/uploads/products/compress/photo3_" + time + "." + file_ext
          );
        }
      );
      // let name = "photo3_" + time + "." + file_ext;
      // jimp("photos", "dist/uploads/photos/", name);
      // awsupload("photos/compress", "dist/uploads/photos/compress/photo3_" + time + "." + file_ext)
      //post.photo.data = fs.readFileSync(files.photo.path)
      //post.photo.contentType = files.photo.type
    }
    console.log(post.photo);
    //console.log(post.attach);
    //post.photo = post.photo.trimLeft(",")

    if (files.audio) {
      //time = time + 10;
      var file_ext = files.audio.name.split(".").pop();
      post.audio = "audio_" + time + "." + file_ext;
      fs.rename(
        files.audio.path,
        "dist/uploads/audios/audio_" + time + "." + file_ext,
        function(err) {
          awsupload(
            "audios",
            "dist/uploads/audios/audio_" + time + "." + file_ext
          );
        }
      );
      //post.audio.data = fs.readFileSync(files.audio.path)
      //post.audio.contentType = files.audio.type
    }
    var attach0 = "";
    var attach1 = "";
    var attach2 = "";
    var attach3 = "";
    var attach4 = "";
    post.attach = "";

    if (fields.attach0) {
      attach0 = fields.attach0;
      post.attach = attach0;
    }
    /**
     * Start Attachment Fix
     */
    if (fields.attach1) {
      attach1 = fields.attach1;
      let comma = post.attach != "" ? "," : "";
      post.attach = post.attach + comma + attach1;
    }
    if (fields.attach2) {
      attach2 = fields.attach2;
      let comma = post.attach != "" ? "," : "";
      post.attach = post.attach + comma + attach2;
    }
    if (fields.attach3) {
      attach3 = fields.attach3;
      let comma = post.attach != "" ? "," : "";
      post.attach = post.attach + comma + attach3;
    }
    if (fields.attach4) {
      attach4 = fields.attach4;
      let comma = post.attach != "" ? "," : "";
      post.attach = post.attach + comma + attach4;
    }
    // console.log(files)
    if (files.attach0) {
      let time = Math.floor(Math.random() * 1000000 + 1);
      var file_ext = files.attach0.name.split(".").pop();
      attach0 = "attachment_1_" + time + "." + file_ext;
      fs.rename(
        files.attach0.path,
        "dist/uploads/attachments/attachment_1_" + time + "." + file_ext,
        function(err) {
          awsupload(
            "attachments",
            "dist/uploads/attachments/attachment_1_" + time + "." + file_ext
          );
        }
      );
      let comma = post.attach != "" ? "," : "";
      post.attach = post.attach + comma + attach0;
    }

    if (files.attach1) {
      let time = Math.floor(Math.random() * 1000000 + 1);
      var file_ext = files.attach1.name.split(".").pop();
      attach1 = "attachment_2_" + time + "." + file_ext;
      fs.rename(
        files.attach1.path,
        "dist/uploads/attachments/attachment_2_" + time + "." + file_ext,
        function(err) {
          awsupload(
            "attachments",
            "dist/uploads/attachments/attachment_2_" + time + "." + file_ext
          );
        }
      );
      let comma = post.attach != "" ? "," : "";
      post.attach = post.attach + comma + attach1;
    }
    if (files.attach2) {
      let time = Math.floor(Math.random() * 1000000 + 1);
      var file_ext = files.attach2.name.split(".").pop();
      attach2 = "attachment_3_" + time + "." + file_ext;
      fs.rename(
        files.attach2.path,
        "dist/uploads/attachments/attachment_3_" + time + "." + file_ext,
        function(err) {
          awsupload(
            "attachments",
            "dist/uploads/attachments/attachment_3_" + time + "." + file_ext
          );
        }
      );
      let comma = post.attach != "" ? "," : "";
      post.attach = post.attach + comma + attach2;
    }
    if (files.attach3) {
      let time = Math.floor(Math.random() * 1000000 + 1);
      var file_ext = files.attach3.name.split(".").pop();
      attach3 = "attachment_4_" + time + "." + file_ext;
      fs.rename(
        files.attach3.path,
        "dist/uploads/attachments/attachment_4_" + time + "." + file_ext,
        function(err) {
          awsupload(
            "attachments",
            "dist/uploads/attachments/attachment_4_" + time + "." + file_ext
          );
        }
      );
      let comma = post.attach != "" ? "," : "";
      post.attach = post.attach + comma + attach3;
    }
    if (files.attach4) {
      let time = Math.floor(Math.random() * 1000000 + 1);
      var file_ext = files.attach4.name.split(".").pop();
      attach4 = "attachment_5_" + time + "." + file_ext;
      fs.rename(
        files.attach4.path,
        "dist/uploads/attachments/attachment_5_" + time + "." + file_ext,
        function(err) {
          awsupload(
            "attachments",
            "dist/uploads/attachments/attachment_5_" + time + "." + file_ext
          );
        }
      );
      let comma = post.attach != "" ? "," : "";
      post.attach = post.attach + comma + attach4;
    }
    //post.attach = post.attach.trimLeft(",")

    if (files.video) {
      try {
        var process = new ffmpeg(files.video.path);
        process.then(
          function(video) {
            // // Video metadata
            // console.log(video.metadata);
            // // FFmpeg configuration
            // console.log(video.info_configuration);
            video.fnExtractFrameToJPG(
              "dist/uploads/videos/thumbnail",
              {
                frame_rate: 1,
                number: 1,
                file_name: time + ".jpg"
              },
              function(error, imagefiles) {
                if (!error) console.log("Frames: " + imagefiles);

                awsupload(
                  "videos/thumbnail",
                  "dist/uploads/videos/thumbnail/" + time + "_1.jpg"
                );
              }
            );
            video
              //.setVideoSize("1280x720", true, false)
              //.setAudioCodec('libfaac')
              //.setAudioChannels(2)
              .setVideoFormat("mp4")
              .save("dist/uploads/videos/video_" + time + ".mp4", function(
                error,
                file
              ) {
                if (!error) {
                  /* AWS S3 code starts */
                  var s3 = new AWS.S3();
                  var filePath = file;

                  //configuring parameters
                  var params = {
                    Bucket: "stanmedata",
                    Body: fs.createReadStream(filePath),
                    Key: "uploads/videos/" + path.basename(filePath),
                    ACL: "public-read"
                  };

                  s3.upload(params, function(err, data) {
                    //handle error
                    if (err) {
                      console.log("Error", err);
                    }
                    //success
                    if (data) {
                      console.log(data);
                      fs.unlink(file, err => {
                        if (err) {
                          console.error(err);
                          return;
                        }

                        //file removed
                      });
                      post.video = "video_" + time + ".mp4";
                      post.url = data.Location;
                      /* save in db */
                      post.save((err, result) => {
                        if (err) {
                          return res.status(400).json({
                            error: errorHandler.getErrorMessage(err)
                          });
                        }
                        res.json(result);
                      });
                      /* save in db */
                    }
                  });
                  /* AWS S3 code ends */
                }
                console.log(error);
              });
          },
          function(err) {
            console.log("Error: " + err);
          }
        );
      } catch (e) {
        console.log(e.code);
        console.log(e.msg);
      }
      /* vimeo code starts */
      // let file_name = files.video.path
      // client.upload(
      //   file_name,
      //   {
      //     'name': fields.text,
      //     'description': fields.text
      //   },
      //   function (uri) {
      //     console.log('Your video URI is: ' + uri);
      //   },
      //   function (bytes_uploaded, bytes_total) {
      //     var percentage = (bytes_uploaded / bytes_total * 100).toFixed(2)
      //     console.log(bytes_uploaded, bytes_total, percentage + '%')
      //   },
      //   function (error) {
      //     console.log('Failed because: ' + error)
      //   }
      // )
      /* vimeo code ends */

      /*var file_ext = files.video.name.split(".").pop();
      post.video = "video_" + time + "." + file_ext;
      fs.rename(
        files.video.path,
        "dist/uploads/videos/video_" + time + "." + file_ext,
        function (err) { }
      ); */
    }
    if (fields.url && post.url) {
      //post.video = ""
      /* AWS S3 code starts */
      var s3 = new AWS.S3();
      //configuring parameters
      var params = {
        Bucket: "stanme",
        Key: "videos/video_" + post._id + ".mp4"
      };
      s3.headObject(params, function(err, metadata) {
        if (err && err.code === "NotFound") {
          // Handle no object on cloud here
        } else {
          s3.deleteObject(params, function(err, data) {
            if (data) {
              console.log("File deleted successfully");
            } else {
              console.log("Check if you have sufficient permissions : " + err);
            }
          });
        }
      });
      /* AWS S3 code ends */
    }
    if (!files.video) {
      post.save((err, result) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
          });
        }
        setTimeout(() => {
          res.json(result);
        }, timeout);
      });
    }
    // post.save((err, result) => {
    //   if (err) {
    //     return res.status(400).json({
    //       error: errorHandler.getErrorMessage(err)
    //     });
    //   }
    //   res.json(post);
    // });
  });
};

const getCategory = (req, res) => {
  Category.find() //{type: { $in : ['post'] }}
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
/* Start Get Tag */
const getTag = (req, res) => {
  Tag.find()
    .exec((err, tags) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }
      res.json(tags);
    })
    .select("name");
};
/* End Get Tag */
const poll = (req, res) => {
  let poll = req.body.poll;
  poll.postedBy = req.body.userId;
  Post.findByIdAndUpdate(
    req.body.postId,
    { $push: { polled: poll } },
    { new: true }
  )
    .populate("polled.postedBy", "_id name username photo")
    .populate("postedBy", "_id name username photo")
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }
      res.json(result);
    });
};

const rating = (req, res) => {
  let rating = req.body.rating;
  rating.postedBy = req.body.userId;
  Post.findByIdAndUpdate(
    req.body.postId,
    { $push: { rated: rating } },
    { new: true }
  )
    .populate("rated.postedBy", "_id name username photo")
    .populate("postedBy", "_id name username photo")
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }
      res.json(result);
    });
};

const LikesByUser = (req, res) => {
  // 1 = published
  Post.find({ likes: { $in: [req.profile._id] } }) //{postedBy: req.profile._id}
    .exec((err, posts) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }
      res.json(posts);
    })
    .select("likes");
};

/** gStripe Payment */
const stripe = require("stripe")(config.stripe_test_secret_key);
const payStripe = (req, res) => {
  /* Code on 2019-09-19 */
  let fromUserName = "";
  let fromPhoto = "";
  let toUserEmail = "";
  let onbehalfof = "";
  let referedId = "";
  let tipAmount = req.body.amount;
  let toUserId = "";
  let fromUserId = req.body.userId;
  /* Start Find From User Name */
  User.findOne({ _id: req.body.userId }).exec((err, users) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      });
    }
    fromUserName = users.name;
    fromPhoto = users.photo ? users.photo : "";
  });
  /* End Find From User Name */
  /* Send Mail to user */
  /* Start Find To User Detail */
  //console.log(" req.body.postId "+req.body.postId);
  Post.findOne({ _id: req.body.postId }).exec((err, posts) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      });
    }
    toUserId = posts.postedBy;
    /* End Find To User Detail */
    /* Start Find User Detail */
    User.findOne({ _id: toUserId }).exec((err, users) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }
      toUserEmail = users.email;
      referedId = users.refercode ? users.refercode : "";
      onbehalfof = users.payment ? users.payment.stripe_user_id : "";

      /* End Find User Detail */
      //console.log(transporter);

      // transporter.sendMail({
      //   from: '"Tip Notification " <nikaengg@gmail.com>', // sender address
      //   to: toUserEmail, //"magento.web002@gmail.com",//"kamleshk.maurya@rvsolutions.in", // list of receivers
      //   subject: "tip Notification", // Subject line
      //   text: fromUserName + " tipped you $" + tipAmount, // plain text body
      //   html: "<p>" + fromUserName + " tipped you $" + tipAmount + "</p>" // html body
      // });
      /* End Send Mail */
      /*Start Insert Data Into Notification  */
      //    console.log("fromUserId :" + fromUserId + " toUserId :" + toUserId);
      // let notification = new Notifications({
      //   type: "tip",
      //   fromId: fromUserId,
      //   toId: toUserId,
      //   amount: tipAmount,
      //  status:1
      // });
      // notification.save((err, result) => {
      //   if (err) {
      //     return res.status(400).json({
      //       error: errorHandler.getErrorMessage(err)
      //     });
      //   }
      // });
      req.body.amount = Number(req.body.amount.toFixed(2));
      let paidvalue = req.body.amount;
      paidvalue = Number(paidvalue.toFixed(2));
      let fee = (paidvalue * config.chargePer) / 100; //100*2.9/100
      fee = fee + config.extraDollar; // + 0.30 //3.78
      fee = Number(fee.toFixed(2));
      let totalNetAmount = paidvalue; //116.22
      totalNetAmount = totalNetAmount - fee - req.body.vat; //96.22
      totalNetAmount = Number(totalNetAmount.toFixed(2));
      let ownerChargePer =
        referedId == "" ? config.ownerPer : config.ownerReferPer;
      let referAmount = 0;
      if (referedId != "") {
        let referChargePer = referedId != "" ? config.referPer : "";
        referAmount = (referChargePer / 100) * (req.body.amount - req.body.vat); //5
        referAmount = Number(referAmount.toFixed(2));
      }

      let ownerAmt = (ownerChargePer / 100) * (req.body.amount - req.body.vat); //5
      ownerAmt = Number(ownerAmt.toFixed(2));
      let userNetAmount = totalNetAmount - ownerAmt - referAmount; //91.22
      let processFeeAmt = fee; //3.78
      let transfer_data_amount = +userNetAmount + +req.body.vat;
      transfer_data_amount = Number(transfer_data_amount.toFixed(2));
      transfer_data_amount = transfer_data_amount * 100;
      transfer_data_amount = Number(transfer_data_amount.toFixed(2));
      stripe.charges.create(
        {
          amount: req.body.amount * 100,
          currency: "usd",
          source: req.body.userToken, // obtained with Stripe.js
          description: "For Tip",
          expand: ["balance_transaction"],
          on_behalf_of: onbehalfof,
          transfer_data: {
            destination: onbehalfof,
            amount: transfer_data_amount
          }
          // application_fee_amount: 10
        },
        function(err, charge) {
          if (charge) {
            /* Start Insert Tip Transaction 2019-10-16 */

            let transaction = new Transaction();
            transaction.amount = userNetAmount;
            transaction.vat = req.body.vat;
            transaction.transactionId = charge.id;
            transaction.processFee = processFeeAmt;
            transaction.fromId = req.body.userId;
            transaction.toId = toUserId;
            transaction.tranStatus = 0;
            transaction.type = "tip";
            transaction.ownerAmount = ownerAmt;
            transaction.referAmount = referAmount;
            //transaction.created = new Date();
            transaction.save((err, result) => {
              if (err) {
                return res.status(400).json({
                  error: errorHandler.getErrorMessage(err)
                });
              }
              if (referedId != "") {
                let transaction = new Transaction();
                transaction.amount = referAmount;
                transaction.transactionId = charge.id;
                transaction.fromId = toUserId;
                transaction.toId = referedId;
                transaction.type = "tip";
                transaction.tranStatus = 0;
                transaction.save((err, result) => {
                  if (err) {
                    return res.status(400).json({
                      error: errorHandler.getErrorMessage(err)
                    });
                  }
                });
              }
              Post.findByIdAndUpdate(
                req.body.postId,
                {
                  $push: {
                    tips: {
                      userId: req.body.userId,
                      amount: userNetAmount,
                      transactionId: charge.id,
                      date: new Date()
                    }
                  }
                },
                { new: true }
              ).exec((err, result1) => {
                if (err) {
                  return res.status(400).json({
                    error: errorHandler.getErrorMessage(err)
                  });
                }
              });
              // if (req.body.name != '') {
              //   User.findByIdAndUpdate(
              //     req.body.userId,
              //     {
              //       $set: {
              //         "address.billing_address.name": req.body.name,
              //         "address.billing_address.street": req.body.street,
              //         "address.billing_address.city": req.body.city,
              //         "address.billing_address.userstate": req.body.userstate,
              //         "address.billing_address.zipcode": req.body.zipcode,
              //         "address.billing_address.country": req.body.country,
              //       }
              //     }
              //   ).exec((err, result1) => {
              //     if (err) {
              //       return res.status(400).json({
              //         error: errorHandler.getErrorMessage(err)
              //       });
              //     }
              //   });
              // }
              /*Start Insert Data Into Notification  */
              // console.log(
              //   "fromUserId :" +
              //     fromUserId +
              //     " toUserId :" +
              //     toUserId
              // );
              let notification = new Notifications({
                type: "tip",
                fromId: req.body.userId,
                toId: toUserId,
                amount: userNetAmount,
                postId: req.body.postId,
                status: 1
              });
              notification.save((err, result) => {
                if (err) {
                  return res.status(400).json({
                    error: errorHandler.getErrorMessage(err)
                  });
                }
              });
              readHTMLFile(
                process.cwd() + "/server/controllers/emailer/newtip.html",
                function(err, html) {
                  var template = handlebars.compile(html);
                  var replacements = {
                    name: fromUserName,
                    amount: Number(userNetAmount.toFixed(2)),
                    id: req.body.userId,
                    created: moment(new Date()).format("D MMM YYYY HH:mm"),
                    servername: config.smtp_mail_server_path,
                    profileImage:
                      fromPhoto != ""
                        ? config.profileImageBucketURL + fromPhoto
                        : config.profileDefaultURL
                  };
                  var htmlToSend = template(replacements);
                  var mailOptions = {
                    from: '"Stan.Me " <mail@stan.me>', // sender address
                    to: toUserEmail, // list of receivers
                    subject: "You have a new tip! ", // Subject line
                    text: "You have a new tip! ", // plain text body
                    html: htmlToSend
                  };
                  transporter.sendMail(mailOptions, function(error, response) {
                    if (error) {
                      console.log(error);
                      callback(error);
                    }
                  });
                }
              );
              /* End Notification entry */
              res.json(result);
            });
            /* End Insert Tip Transaction */
          } else {
            res.json(err);
          }
          // asynchronously called
        }
      );

      // stripe.customers.create({
      //   description: 'Customer for jenny.rosen@example.com',
      //   source: req.body.userToken // obtained with Stripe.js
      // }, function (err, customer) {
      //   if (customer)
      //     res.json(customer);
      //   else
      //     res.json(err);
      //   // asynchronously called
      // });
    });
  });
};

/**  End Here */

/* list Shipping */

const getShippingCharges = (req, res) => {
  User.find({ _id: req.params.userId }) //{ toId: req.params.userId }
    .exec((err, charges) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }
      res.json(charges);
    })
    .select("shopenable");
};
/** End Api */

/* Start Check Order ID */
const checkorder = (req, res) => {
  //let utc = moment.utc().add(7, 'days');
  let utc = moment.utc();
  Orders.findOne(
    {
      orderId: req.body.value,
      product_type: "digital"
      //created: { $lt: utc }
    },
    { productid: 1, created: 1 }
  )
    .populate("productid", "attach")
    .exec((err, orders) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }
      //console.log(users.forgot.token)
      //var data = users ? { count: true } : { count: false };
      const date1 = new Date(orders.created);
      const date2 = new Date(utc);
      const diffTime = Math.abs(date2 - date1);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 7) {
        return res.json(null);
      }
      res.json(orders);
    });
};

/* End Check Order ID */

export default {
  listByUser,
  listScheduleByUser,
  listNewsFeed,
  listDraftByUser,
  create,
  repost,
  postByID,
  getDataID,
  remove,
  photo,
  audio,
  like,
  unlike,
  comment,
  uncomment,
  isPoster,
  update,
  getCategory,
  getTag,
  poll,
  listProductsByUser,
  rating,
  LikesByUser,
  listLikedFeed,
  payStripe,
  uploadPhoto,
  getShippingCharges,
  readOrder,
  checkorder
};
