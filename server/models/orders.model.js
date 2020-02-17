import mongoose from "mongoose";
import crypto from "crypto";
const OrderSchema = new mongoose.Schema({
  orderId: { type: String },
  customer_name: {
    type: String,
    trim: true,
    required: "Name is required"
  },
  customer_email: {
    type: String,
    trim: true,
    match: [/.+\@.+\..+/, "Please fill a valid email address"],
    required: "Email is required"
  },
  messages: [{ message: { type: String } }],
  productid: { type: mongoose.Schema.ObjectId, ref: "Post" },
  quantity: { type: Number },
  price: { type: Number },
  shippingCharges: { type: Number },
  discount: { type: Number },
  vat: { type: Number },
  processFee: { type: Number },
  ownerAmount: { type: Number },
  product_type: ["Physical", "Digital"],
  status: ["Processing", "Completed"],
  transaction_id: {},
  address: {
    shipping_address: {
      name: { type: String, required: "Shipper Name is required" },
      street: { type: String, required: "Street is required" },
      city: { type: String, required: "City is required" },
      userstate: { type: String },
      zipcode: { type: String, required: "Zip Code is required" },
      country: { type: String, required: "Country is required" }
    },
    billing_address: {
      name: { type: String, required: "Biller Name is required" },
      street: { type: String, required: "Street is required" },
      city: { type: String, required: "City is required" },
      userstate: { type: String },
      zipcode: { type: String, required: "Zip Code is required" },
      country: { type: String, required: "Country is required" }
    }
  },
  attributes: { type: String },
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  },
  user_id: { type: mongoose.Schema.ObjectId, ref: "User" }, //seller
  ordered_by: { type: mongoose.Schema.ObjectId, ref: "User" } // buyer
});

export default mongoose.model("Order", OrderSchema);
