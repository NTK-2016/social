import Chat from '../models/chat'
import Notification from '../models/notifications.model'
import Room from '../models/room'
import _ from 'lodash'
import errorHandler from './../helpers/dbErrorHandler'
import nodemailer from "nodemailer";
import handlebars from "handlebars";
import config from "../../config/config";
import User from "../models/user.model";
import fs from "fs";
var moment = require("moment");

const express = require("express");
var mongoose = require("mongoose");
var app = express()
const router = express.Router();

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

const listChat = (req, res) => {
	//console.log(req.query);
	let roomId = req.query.room
	let username = req.query.username;
	let tousername = req.query.tousername
	let currentTime = req.query.currentTime
	//room:roomId,msgFrom:username,msgTo:tousername
	//, "msgFrom" : username, "msgTo":tousername
	Chat.find({
		$and: [
			{ room: roomId },
			{ createdOn: { $lt: currentTime } }
		]
	}, (err, chats) => {
		if (err) {
			return res.status(400).json({
				error: errorHandler.getErrorMessage(err)
			})
		}
		chats.forEach(msg => {
			var from = 1;
			var to = 1
			if (msg.msgFrom._id == username) {
				from = 0;
				Chat.update({
					"_id": msg._id
				}, {
					"$set": {
						"msgreadfrom": from,
					}
				}).exec((err, result) => {
					if (err) {
					}
				})
			}
			else if (msg.msgTo == username) {
				to = 0;
				Chat.update({
					"_id": msg._id
				}, {
					"$set": {
						"msgreadto": to,
					}
				}).exec((err, result) => {
					if (err) {
					}
				})
			}
		})
		//console.log(chats)
		res.status(200).json(chats.reverse())
	}).populate("msgFrom", "_id photo")
		.limit(20).sort({ _id: -1 });
}

const listNewChat = (req, res) => {
	//console.log(req.query);
	let roomId = req.query.room
	let username = req.query.username;
	let tousername = req.query.tousername
	let currentTime = req.query.currentTime
	//room:roomId,msgFrom:username,msgTo:tousername
	//, "msgFrom" : username, "msgTo":tousername

	// Chat.findByIdAndUpdate({ room: roomId, status: 1 }, { status: 0 }).exec((err, chats) => {
	// 	if (err) {
	// 		return res.status(400).json({
	// 			error: errorHandler.getErrorMessage(err)
	// 		})
	// 	}
	// 	//console.log(chats)
	// 	res.status(200).json(chats.reverse())
	// }).limit(20).sort({ _id: -1 });



	Chat.find({
		$and: [
			{ room: roomId }
		],
		$or: [
			{
				//{ createdOn: { $lt: currentTime } },
				$and: [
					{ msgreadfrom: 1 },
					{ msgFrom: username }
				]
			},
			{
				$and: [
					{ msgreadto: 1 },
					{ msgTo: username }
				]
			}
		]
	}, (err, chats) => {
		if (err) {
			return res.status(400).json({
				error: errorHandler.getErrorMessage(err)
			})
		}
		chats.forEach(msg => {
			var from = 1;
			var to = 1
			if (msg.msgFrom._id == username) {
				from = 0;
				Chat.update({
					"_id": msg._id
				}, {
					"$set": {
						"msgreadfrom": from,
					}
				}).exec((err, result) => {
					if (err) {
					}
				})
			}
			else if (msg.msgTo == username) {
				to = 0;
				Chat.update({
					"_id": msg._id
				}, {
					"$set": {
						"msgreadto": to,
					}
				}).exec((err, result) => {
					if (err) {
					}
				})
			}
		})
		res.status(200).json(chats.reverse())
	}).populate("msgFrom", "_id photo").limit(20).sort({ _id: -1 });
}

const listMoreChat = (req, res) => {
	let roomId = req.body.room
	let username = req.body.username;
	let tousername = req.body.tousername
	let chatmessagestart = req.body.chatmessagestart
	// room:roomId,msgFrom:username,msgTo:tousername
	// , "msgFrom" : username, "msgTo":tousername
	Chat.find({ "room": roomId }, (err, chats) => {
		if (err) {
			return res.status(400).json({
				error: errorHandler.getErrorMessage(err)
			})
		}
		res.status(200).json(chats)
	}).populate("msgFrom", "_id photo").skip(req.body.skip).limit(20).sort({ _id: -1 });
}

const listRoom = (req, res, next) => {
	//var io = require('socket.io').listen(http);
	res.writeHead(200, { "Content-Type": "text/html" });
	res.write(fs.readFileSync("./public/index.html"));
	res.end()
}


const createRoom = (req, res, next) => {
	var room_name1 = req.body.name1;
	var room_name2 = req.body.name2;
	var count_flag = 0;
	Room.find({
		$or: [
			{ 'name1': room_name1 },
			{ 'name1': room_name2 },
			{ 'name2': room_name1 },
			{ 'name2': room_name2 }
		]
	}, (err, rooms) => {

		if (err) {
			return res.status(400).json({
				error: errorHandler.getErrorMessage(err)
			})
		}

		if (rooms.length > 0) {
			count_flag++;

			res.status(200).json({
				message: "already Exists!",
				data: rooms
			})

		} else {
			const room = new Room(req.body);
			room.save((err, result) => {
				//console.log(result);
				if (err) {
					return res.status(400).json({
						error: errorHandler.getErrorMessage(err)
					})
				}
				res.status(200).json({
					message: "Successfully saved!",
					data: result
				})
			})

		}
	}).limit(1).sort({ _id: -1 });
}

const readroom = (req, res, next) => {
	var room_name1 = req.body.name1;
	var count_flag = 0;
	var chatdata = []
	var roomscount = 0;
	Room.find({
		$or: [
			{ 'name1': { $regex: room_name1 } },
			{ 'name2': { $regex: room_name1 } },
		]
	}, (err, rooms) => {
		if (err) {
			return res.status(400).json({
				error: errorHandler.getErrorMessage(err)
			})
		}
		roomscount = rooms.length
		if (roomscount > 0) {
			rooms.forEach(function (roomdata, index) {
				Chat.find({
					$or: [{
						$and: [
							{ 'room': roomdata._id },
							{ 'msgFrom': room_name1 },
							{ 'msgreadfrom': 1 },
						],
						$and: [
							{ 'room': roomdata._id },
							{ 'msgTo': room_name1 },
							{ 'msgreadto': 1 },
						]
					}]
				}, (err, chat) => {
					if (err) {
						return res.status(400).json({
							error: errorHandler.getErrorMessage(err)
						})
					}
					var chatvalue = chat.length > 0 ? true : false
					chatdata.push(chatvalue)
					if (roomscount - 1 == index) {
						res.status(200).json({
							data: rooms,
							chat: chatdata
						})
					}
				}).populate("msgFrom", "_id photo")
			});
		}
		else {
			res.status(200).json({
				data: rooms,
				chat: chatdata
			})
		}

	}).populate("members", "_id name username photo").sort({ lastActive: -1 })

	// Room.aggregate(
	// 	[
	// 		{
	// 			$match: {
	// 				$or: [
	// 					{ 'name1': { $regex: room_name1 } },
	// 					{ 'name2': { $regex: room_name1 } },
	// 				]
	// 			}
	// 		},
	// 		//{ $sort: { "lastActive": -1 } },
	// 		{
	// 			$lookup: {
	// 				from: "chats",
	// 				localField: "_id",
	// 				foreignField: "room",
	// 				as: "chats"
	// 			}
	// 		},
	// 		{
	// 			$match:
	// 			{
	// 				$or: [
	// 					{ 'chats.msgreadto': 1 },
	// 					{ 'chats.msgreadto': 0 },
	// 				]
	// 			}
	// 		},
	// 		{ $sort: { "chats.createdOn": -1 } },
	// 		{
	// 			$project: {
	// 				members: 1,
	// 				lastActive: 1,
	// 				chats: [{ $arrayElemAt: ["$chats", 0] }]
	// 			}
	// 		}
	// 	]
	// 	// ,
	// 	// function (err, rooms) {
	// 	// 	if (err) {
	// 	// 		res.json(err);
	// 	// 	} else {
	// 	// 		// console.log(data);
	// 	// 		res.status(200).json({
	// 	// 			data: rooms
	// 	// 		})
	// 	// 		//data: rooms
	// 	// 		//res.json(data);
	// 	// 	}
	// 	// }
	// ).exec(function (err, transactions) {
	// 	// Don't forget your error handling
	// 	// The callback with your transactions
	// 	// Assuming you are having a Tag model
	// 	Room.populate(transactions, { path: 'members', select: '_id name username' }, function (err, populatedTransactions) {
	// 		// Your populated translactions are inside populatedTransactions
	// 		res.status(200).json({
	// 			data: populatedTransactions
	// 		})
	// 	});
	// });
	// //.populate("members", "_id name username").sort({ lastActive: -1 });
}

const notification = (req, res) => {
	let username = req.query.username;
	//let tousername = req.query.tousername
	Chat.distinct('msgFrom', { 'msgTo': username }, (err, chats) => {
		if (err) {
			return res.status(400).json({
				error: errorHandler.getErrorMessage(err)
			});
		}
		res.status(200).json(chats)
	}).limit(10).sort({ _id: -1 });
};


const create = (req, res, next) => {

	//req.body.userId = req.body.name
	//req.body.username = req.body.email
	const chat = new Chat(req.body);
	//console.log(chat)
	chat.save((err, result) => {
		if (err) {
			return res.status(400).json({
				error: errorHandler.getErrorMessage(err)
			})
		}
		Room.findByIdAndUpdate(
			req.body.room, {
			lastActive: Date.now()
		},
			(err, result) => {
				if (err) {
					return res.status(400).json({
						error: errorHandler.getErrorMessage(err)
					});
				}
			}
		);
		var touseremail = ''
		User.findOne({ _id: req.body.msgTo }).exec((err, users) => {
			if (err) {
				return res.status(400).json({
					error: errorHandler.getErrorMessage(err)
				});
			}
			touseremail = users.email;
			/* save notification in db start */
			let notification = new Notification({
				type: "message",
				fromId: req.body.msgFrom,
				toId: req.body.msgTo,
				status: 1
			});
			notification.save((err, result) => {
				if (err) {
					return res.status(400).json({
						error: errorHandler.getErrorMessage(err)
					});
				}

				/* save notification in db end */
				if (users.usernotification.pmnewmessage == 1) {
					var fromusername = ''
					User.findOne({ _id: req.body.msgFrom }).exec((err, fromuser) => {
						if (err) {
							return res.status(400).json({
								error: errorHandler.getErrorMessage(err)
							});
						}
						fromusername = fromuser.name

						readHTMLFile(
							process.cwd() + "/server/controllers/emailer/newmessage.html",
							function (err, html) {
								var template = handlebars.compile(html);
								var replacements = {
									name: fromusername,
									id: req.body.msgFrom,
									created: moment(new Date()).format(
										"D MMM YYYY HH:mm"
									),
									servername: config.smtp_mail_server_path,
									profileImage: fromuser.photo ? config.profileImageBucketURL + fromuser.photo : config.profileDefaultURL
								};
								var htmlToSend = template(replacements);
								var mailOptions = {
									from: '"Stan.Me " <mail@stan.me>', // sender address
									to: touseremail, // list of receivers
									subject: "You have new message on Sta.Me!", // Subject line
									text: "You have new message on Sta.Me!", // plain text body
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
					})
				}
				res.status(200).json({
					message: "Successfully saved!",
					data: result
				})
			});
		});

	})
}

const createNotification = (req, res, next) => {
	const notification = new Notification(req.body);
	//console.log(chat)
	Notification.save((err, result) => {
		if (err) {
			return res.status(400).json({
				error: errorHandler.getErrorMessage(err)
			})
		}
		res.status(200).json({
			message: "Successfully saved!",
			data: result
		})
	})
}





export default {
	listChat,
	listMoreChat,
	notification,
	createNotification,
	create,
	createRoom,
	listRoom,
	readroom,
	listNewChat
}