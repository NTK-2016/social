import User from "../models/user.model";
import jwt from "jsonwebtoken";
import expressJwt from "express-jwt";
import config from "./../../config/config";

const signin = (req, res) => {
  User.findOne(
    {
      $and: [
        {
          $or: [
            { email: req.body.email },
            { username: req.body.email }
          ]
        },
        { isDeleted: { $ne: 1 } }
      ]

    },
    (err, user) => {

      if (err || !user)
        return res.status("401").json({
          error: "This username or email entered doesn't exist."
        });

      if (!user.authenticate(req.body.password)) {
        return res.status("401").send({
          error: "This email address and password do not match."
        });
      }
      if (user.isDeleted == 1)
        return res.status("401").json({
          error: "Account not found or has been deleted."
        });
      if (!user.verification.status)
        return res.status("401").json({
          error: "This account hasn't been activated yet. Please check your emails."
        });



      const token = jwt.sign(
        {
          _id: user._id
        },
        config.jwtSecret
      );

      res.cookie("t", token, {
        expire: new Date() + 9999
      });
      User.findByIdAndUpdate(
        user._id,
        {
          $push: {
            jwt_token: {
              token: token
            }
          }
        },
        (err, result) => {
          if (err) {
            return res.status(400).json({
              error: errorHandler.getErrorMessage(err)
            });
          }
        }
      );
      return res.json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          creator: user.creater.status,
          username: user.username,
          address: user.address.billing_address.name ? true : false,
          stanEnabled: user.subscriptionpitch.stanbtn,
          photo: user.photo,
          banner: user.banner,
        }
      });
    }
  );
};

const signout = (req, res) => {
  res.clearCookie("t");
  return res.status("200").json({
    message: "signed out"
  });
};

const requireSignin = expressJwt({
  secret: config.jwtSecret,
  userProperty: "auth"
});

const hasAuthorization = (req, res, next) => {
  const authorized = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!authorized) {
    return res.status("403").json({
      error: "User is not authorized"
    });
  }
  next();
};

const validateToken = (req, res, next) => {
  console.log(req.cookies.t)
  req.profile.jwt_token.map((token, i) => {
    if (token.token === req.cookies.t && token.isUpdated == 1) {

    }
  })
  // console.log(this.requireSignin())
  next();
}

export default {
  signin,
  signout,
  requireSignin,
  hasAuthorization,
  validateToken
};
