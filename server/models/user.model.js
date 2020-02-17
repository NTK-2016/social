import mongoose from "mongoose";
import crypto from "crypto";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: "Name is required"
  },
  username: {
    type: String,
    trim: true
    //unique: 'Username already exists',
    //required: 'Username is required'
  },
  verification: {
    token: { type: String },
    status: { type: Number, default: 0 }
  },
  forgot: {
    token: { type: String },
    status: { type: Number, default: 0 }
  },
  email: {
    type: String,
    trim: true,
    //unique: "Email already exists",
    match: [/.+\@.+\..+/, "Please fill a valid email address"],
    required: "Email is required"
  },
  myreferralcode: { type: String },
  refercode: { type: mongoose.Schema.ObjectId, ref: "User", trim: true },
  tempEmail: {
    status: { type: Number },
    email: { type: String, trim: true, unique: "Email already exists" }
  },
  creatorcategory: [
    { type: mongoose.Schema.ObjectId, ref: "Category", trim: true }
  ],
  // creatorcategory: {
  //   type: String,
  //   trim: true,
  // },
  hashed_password: {
    type: String,
    required: "Password is required"
  },
  address: {
    billing_address: {
      name: { type: String },
      street: { type: String },
      city: { type: String },
      userstate: { type: String },
      zipcode: { type: String },
      country: { type: String }
    }
  },
  facebook: { type: String, ref: "User" },
  twitter: { type: String, ref: "User" },
  instagram: { type: String, ref: "User" },
  youtube: { type: String, ref: "User" },
  linkedlin: { type: String, ref: "User" },
  salt: String,
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  },
  about: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  stan: [
    {
      status: { type: Number },
      ref_id: { type: mongoose.Schema.ObjectId, ref: "User", trim: true },
      subscriptionId: { type: String },
      periodEnd: { type: Date },
      periodStart: { type: Date },
      amount: { type: Number },
      paymentStatus: { type: String },
      stan_date: { type: Date, default: Date.now },
      stan_lost_date: { type: Date }
    }
  ],
  stanning: [
    {
      creatorId: { type: mongoose.Schema.ObjectId, ref: "User", trim: true },
      subscriptionId: { type: String },
      periodEnd: { type: Date },
      periodStart: { type: Date },
      amount: { type: Number },
      paymentStatus: { type: String },
      status: { type: Number },
      stanningDate: { type: Date },
      stanningRemovedDate: { type: Date }
    }
  ],
  creater: {
    status: { type: Number, default: 0 }
  },
  featured: {
    type: Number,
    default: 0 // value 0- not submit,1- submit featured,2-accept featured,3-reject featured
  },
  banner: {
    type: String
    // data: Buffer,
    // contentType: String
  },
  subscriptionpitch: {
    stanbtn: { type: Boolean, default: false },
    presentyourself: { type: String },
    videourl: { type: String },
    planInfo: [
      {
        amount: { type: Number },
        planId: { type: String },
        planCreated: { type: Date, default: Date.now },
        status: { type: Number }
      }
    ]
  },
  usernotification: {
    snewstan: { type: Boolean, default: false },
    snewtips: { type: Boolean, default: false },
    sneworder: { type: Boolean, default: false },
    snewmessage: { type: Boolean, default: false },
    pmnewstan: { type: Boolean, default: false },
    pmnewtips: { type: Boolean, default: false },
    pmneworder: { type: Boolean, default: false },
    pmnewmessage: { type: String, default: "2" },
    pmlikes: { type: String, default: "3" },
    pmfollowers: { type: String, default: "2" },
    pmcommnents: { type: Boolean, default: false },
    pmreposts: { type: Boolean, default: false }
  },
  shopenable: {
    shopstatus: { type: Boolean, default: false },
    standiscount: { type: Number },
    shippinginfo: [
      {
        countryname: { type: String, trim: true },
        charges: { type: Number }
      }
    ]
  },
  privacy: {
    nofstan: { type: Boolean, default: false },
    income: { type: Boolean, default: false }
  },
  payment: {
    acc_holdername: { type: String, trim: true },
    accountnumber: { type: String, trim: true },
    subscriber: { type: String, trim: true },
    discount: { type: String, trim: true },
    bsb: { type: String, trim: true },
    country: { type: String, trim: true },
    iban: { type: String, trim: true },
    bankcode: { type: String, trim: true },
    branchcode: { type: String, trim: true },
    transitnumber: { type: String, trim: true },
    institutionnumber: { type: String, trim: true },
    clearingcode: { type: String, trim: true },
    bankname: { type: String, trim: true },
    branchname: { type: String, trim: true },
    accountownername: { type: String, trim: true },
    clabe: { type: String, trim: true },
    sortcode: { type: String, trim: true },
    routingnumber: { type: String, trim: true },
    payouttype: { type: String, trim: true }, //1-stripe && 2-bank
    stripe_user_id: { type: String, trim: true }
  },
  photo: {
    type: String
    /* data: Buffer,
     contentType: String*/
  },
  following: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  followers: [
    {
      status: { type: Number },
      followers_id: { type: mongoose.Schema.ObjectId, ref: "User", trim: true },
      followers_date: { type: Date, default: Date.now }
    }
  ],
  // removedfollowers: [
  //   {
  //     status: { type: Number, default: 0 },
  //     followers_id: { type: mongoose.Schema.ObjectId, ref: "User", trim: true },
  //     followers_date: { type: Date, default: Date.now }
  //   }
  // ],
  isDeleted: { type: Number, default: 0 }, //0-not deleted / 1- deleted
  deletedDate: { type: Date },
  report: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  jwt_token: [
    {
      token: { type: String },
      isUpdated: { type: Number, default: 0 }
    }
  ],
  is_restrict: { type: Number, default: 0 } //0-not restricted / 1- restricted
});
UserSchema.virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

UserSchema.path("hashed_password").validate(function (v) {
  if (this._password && this._password.length < 6) {
    this.invalidate("password", "Password must be at least 6 characters.");
  }
  if (this.isNew && !this._password) {
    this.invalidate("password", "Password is required");
  }
}, null);

UserSchema.methods = {
  authenticate: function (plainText) {
    console.log(this.encryptPassword(plainText) + "===" + this.hashed_password);
    return this.encryptPassword(plainText) === this.hashed_password;
  },
  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + "";
  },
  changePassword: function (newPassword) {
    return this.encryptPassword(newPassword);
  },
  createHash: function (string) {
    try {
      return crypto
        .createHmac("sha1", string)
        .update(string)
        .digest("hex");
    } catch (err) {
      return "";
    }
  }
};

export default mongoose.model("User", UserSchema);
