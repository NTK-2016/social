import Post from "../models/post.model";
import User from "../models/user.model";
import Notifications from "../models/notifications.model";
import _ from 'lodash'
import moment from 'moment';
import errorHandler from './../helpers/dbErrorHandler'
import Currency from "../models/currency.modal";
import fs from "fs";
import nodemailer from "nodemailer";
import handlebars from "handlebars";
import config from "../../config/config";
const https = require('https');

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


export const getCurrencyConversion = () => {

    // Currency.find({}).sort({timestamp:-1}).limit(1).exec((err, result)=>{
    //     if (err) {
    //       return res.status(400).json({
    //         error: errorHandler.getErrorMessage(err)
    //       });
    //     }
    //     console.log(result[0].rates.GBP);
    //   })
    // console.log("cron Function");
    https.get('https://openexchangerates.org/api/latest.json?app_id=eca923d958ed4ca7b76b611c266ec242', (resp) => {
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {

            //const data = JSON.parse(data);
            // setTimeout(() => {
            let currency = new Currency();
            currency.disclaimer = JSON.parse(data).disclaimer;
            currency.license = JSON.parse(data).license;
            currency.base = JSON.parse(data).base;
            currency.timestamp = JSON.parse(data).timestamp * 1000;
            currency.rates = JSON.parse(data).rates;
            currency.save((err, result) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler.getErrorMessage(err)
                    });
                }
            })


        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
    // let data = {
    //     disclaimer: "Usage subject to terms: https://openexchangerates.org/terms",
    //    license: "https://openexchangerates.org/license",
    //     timestamp: 1578981600,
    //     base: "USD",
    //     rates: {
    //         "AED": 3.6732,
    //         "AFN": 77.940505,
    //         "ALL": 109.413528,
    //         "AMD": 478.031236,
    //         "ANG": 1.617625,
    //         "AOA": 484.2745,
    //         "ARS": 59.9481,
    //         "AUD": 1.450116,
    //         "AWG": 1.8,
    //         "AZN": 1.7025,
    //         "BAM": 1.758761,
    //         "BBD": 2,
    //         "BDT": 84.767712,
    //         "BGN": 1.755834,
    //         "BHD": 0.377087,
    //         "BIF": 1877.9578,
    //         "BMD": 1,
    //         "BND": 1.345372,
    //         "BOB": 6.904639,
    //         "BRL": 4.1474,
    //         "BSD": 1,
    //     }
    // }


}

export const SchedulePost = () => {
    // const publicIp = require("public-ip");
    // publicIp.v4().then(ip=>{
    // console.log(ip);
    // });
    let utc = moment.utc();
    Post.find(
        {
            $and: [
                { posttype: { $in: "2" } },
                { scheduled_datetime: { $lt: utc } }
            ]
        }).exec((err, posts) => {
            posts.map(element => {
                element.update(
                    {
                        $set: {
                            created: utc,
                            posttype: "1"
                        },
                    },
                ).exec((err, posts) => {

                });
            });
        })

}

const likeuserdata = (value, callBack) => {
    User.find({ "usernotification.pmlikes": value }).exec((err, users) => {
        return callBack(users)
    })
}
const messageuserdata = (value, callBack) => {
    User.find({ "usernotification.pmnewmessage": value }).exec((err, users) => {
        return callBack(users)

    });
}
const followuserdata = (value, callBack) => {
    User.find({ "usernotification.pmfollowers": value }).exec((err, users) => {
        return callBack(users)

    });
}

const notificationdata = (toid, type, utc, callBack) => {
    Notifications.find({ $and: [{ toId: toid }, { type: type }, { created_at: { $gt: utc } }] }).exec((err, notification) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            });
        }
        return callBack(notification)
    })
}

const userdata = (userId, callBack) => {
    User.findOne({ _id: userId }).exec((err, singleuser) => {
        return callBack(singleuser)
    })
}

const sendmail = (fromData, toemail, filname, subject) => {
    readHTMLFile(
        process.cwd() + "/server/controllers/emailer/" + filname + ".html",
        function (err, html) {
            var template = handlebars.compile(html);
            var replacements = {
                fromData: fromData,
                servername: config.smtp_mail_server_path,
            };
            var htmlToSend = template(replacements);
            var mailOptions = {
                from: '"Stan.Me " <mail@stan.me>', // sender address
                to: toemail, // list of receivers
                subject: subject, // Subject line
                text: subject, // plain text body
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

export const dailymail = () => {
    let utc = moment.utc().subtract(1, 'days');
    var likefromData = []
    likeuserdata(2, function (users) {
        users.map(element => {
            notificationdata(element._id, "like", utc, function (notification) {
                if (notification != null) {
                    let toemail = ""
                    let fromname = ""
                    let created_at = ""
                    let fromid = ""
                    notification.map((items, index) => {
                        userdata(items.toId, function (singleuser) {
                            toemail = singleuser.email
                            userdata(items.fromId, function (fromsingleuser) {
                                fromname = fromsingleuser.name
                                fromid = fromsingleuser.photo ? config.profileImageBucketURL + fromsingleuser.photo : config.profileDefaultURL
                                created_at = moment(items.created_at).format(
                                    "D MMM YYYY HH:mm"
                                )
                                likefromData.push({
                                    "fromname": fromname, "fromid": fromid, "created_at": created_at
                                })
                                if (notification.length == index + 1) {
                                    sendmail(likefromData, toemail, "newlikes", "New Like(s)")
                                }
                            })
                        })
                    })
                }
            })
        })
    })

    var messagefromData = []
    messageuserdata(2, function (users) {
        users.map(element => {
            notificationdata(element._id, "message", utc, function (notification) {
                if (notification != null) {
                    let toemail = ""
                    let fromname = ""
                    let created_at = ""
                    let fromid = ""
                    notification.map((items, index) => {
                        userdata(notification.toId, function (singleuser) {
                            toemail = singleuser.email
                            userdata(notification.fromId, function (fromsingleuser) {
                                fromname = fromsingleuser.name
                                fromid = fromsingleuser.photo ? config.profileImageBucketURL + fromsingleuser.photo : config.profileDefaultURL
                                created_at = moment(items.created_at).format(
                                    "D MMM YYYY HH:mm"
                                )
                                messagefromData.push({
                                    "fromname": fromname, "fromid": fromid, "created_at": created_at
                                })
                                if (notification.length == index + 1) {
                                    sendmail(messagefromData, toemail, "newmessages", "You have new messages(s) on Sta.Me!")
                                }
                                //sendmail(notification.created_at, toemail, fromname, fromid, "newmessage", "You have new messages on Sta.Me!")
                            })
                        })
                    })
                }
            })
        })
    })

    var followfromData = []
    followuserdata(2, function (users) {
        users.map(element => {
            notificationdata(element._id, "follower", utc, function (notification) {
                if (notification != null) {
                    let toemail = ""
                    let fromname = ""
                    let created_at = ""
                    let fromid = ""
                    notification.map((items, index) => {
                        userdata(notification.toId, function (singleuser) {
                            toemail = singleuser.email
                            userdata(notification.fromId, function (fromsingleuser) {
                                fromname = fromsingleuser.name
                                fromid = fromsingleuser.photo ? config.profileImageBucketURL + fromsingleuser.photo : config.profileDefaultURL
                                created_at = moment(items.created_at).format(
                                    "D MMM YYYY HH:mm"
                                )
                                followfromData.push({
                                    "fromname": fromname, "fromid": fromid, "created_at": created_at
                                })
                                if (notification.length == index + 1) {
                                    sendmail(followfromData, toemail, "newfollowerss", "You have new follower(s) on Stan.Me!")
                                }
                                // sendmail(notification.created_at, toemail, fromname, fromid, "newfollowers", "You have new followers on Stan.Me!")
                            })
                        })
                    })
                }
            })
        })
    })


    // User.find({ "usernotification.pmlikes": 2 }).exec((err, users) => {
    //     users.map(element => {
    //         console.log(element._id)
    //         Notifications.findOne({ $and: [{ toId: element._id }, { type: "like" }, { created_at: { $gt: utc } }] }).exec((err, notification) => {
    //             if (err) {
    //                 return res.status(400).json({
    //                     error: errorHandler.getErrorMessage(err)
    //                 });
    //             }
    //             // console.log(notification)
    //             if (notification != null) {
    //                 console.log("notification found");
    //                 let toemail = ""
    //                 let fromname = ""
    //                 let fromid = ""
    //                 User.findOne({ _id: notification.toId }).exec((err, singleuser) => {
    //                     if (err) {
    //                         return res.status(400).json({
    //                             error: errorHandler.getErrorMessage(err)
    //                         });
    //                     }
    //                     toemail = singleuser.email
    //                     User.findOne({ _id: notification.fromId }).exec((err, singleuser) => {
    //                         if (err) {
    //                             return res.status(400).json({
    //                                 error: errorHandler.getErrorMessage(err)
    //                             });
    //                         }
    //                         fromname = singleuser.name
    //                         fromid = singleuser._id
    //                         console.log("data == " + toemail + "   " + fromname + "   " + fromid + "   ")
    //                     });

    //                 });



    //             }
    //         });
    //     });
    // })

}

export const weeklymail = () => {
    let utc = moment.utc().subtract(7, 'days');
    var likefromData = []
    likeuserdata(3, function (users) {
        users.map(element => {
            notificationdata(element._id, "like", utc, function (notification) {
                if (notification != null) {
                    let toemail = ""
                    let fromname = ""
                    let created_at = ""
                    let fromid = ""
                    notification.map((items, index) => {
                        userdata(items.toId, function (singleuser) {
                            toemail = singleuser.email
                            userdata(items.fromId, function (fromsingleuser) {
                                fromname = fromsingleuser.name
                                fromid = fromsingleuser.photo ? config.profileImageBucketURL + fromsingleuser.photo : config.profileDefaultURL
                                created_at = moment(items.created_at).format(
                                    "D MMM YYYY HH:mm"
                                )
                                likefromData.push({
                                    "fromname": fromname, "fromid": fromid, "created_at": created_at
                                })
                                if (notification.length == index + 1) {
                                    sendmail(likefromData, toemail, "newlikes", "New Like(s)")
                                }
                            })
                        })
                    })
                }
            })
        })
    })

    var messagefromData = []
    messageuserdata(3, function (users) {
        users.map(element => {
            notificationdata(element._id, "message", utc, function (notification) {
                if (notification != null) {
                    let toemail = ""
                    let fromname = ""
                    let created_at = ""
                    let fromid = ""
                    notification.map((items, index) => {
                        userdata(notification.toId, function (singleuser) {
                            toemail = singleuser.email
                            userdata(notification.fromId, function (fromsingleuser) {
                                fromname = fromsingleuser.name
                                fromid = fromsingleuser.photo ? config.profileImageBucketURL + fromsingleuser.photo : config.profileDefaultURL
                                created_at = moment(items.created_at).format(
                                    "D MMM YYYY HH:mm"
                                )
                                messagefromData.push({
                                    "fromname": fromname, "fromid": fromid, "created_at": created_at
                                })
                                if (notification.length == index + 1) {
                                    sendmail(messagefromData, toemail, "newmessages", "You have new messages(s) on Sta.Me!")
                                }
                                //sendmail(notification.created_at, toemail, fromname, fromid, "newmessage", "You have new messages on Sta.Me!")
                            })
                        })
                    })
                }
            })
        })
    })

    var followfromData = []
    followuserdata(3, function (users) {
        users.map(element => {
            notificationdata(element._id, "follower", utc, function (notification) {
                if (notification != null) {
                    let toemail = ""
                    let fromname = ""
                    let created_at = ""
                    let fromid = ""
                    notification.map((items, index) => {
                        userdata(notification.toId, function (singleuser) {
                            toemail = singleuser.email
                            userdata(notification.fromId, function (fromsingleuser) {
                                fromname = fromsingleuser.name
                                fromid = fromsingleuser.photo ? config.profileImageBucketURL + fromsingleuser.photo : config.profileDefaultURL
                                created_at = moment(items.created_at).format(
                                    "D MMM YYYY HH:mm"
                                )
                                followfromData.push({
                                    "fromname": fromname, "fromid": fromid, "created_at": created_at
                                })
                                if (notification.length == index + 1) {
                                    sendmail(followfromData, toemail, "newfollowerss", "You have new follower(s) on Stan.Me!")
                                }
                                // sendmail(notification.created_at, toemail, fromname, fromid, "newfollowers", "You have new followers on Stan.Me!")
                            })
                        })
                    })
                }
            })
        })
    })
}

