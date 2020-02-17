import mongoose from "mongoose";
import crypto from "crypto";
const VatSchema = new mongoose.Schema({
  country: { type: String, trim: true },
  vat_per: { type: Number, trim: true },
  code: { type: String, trim: true },
  stripeTaxId: { type: String, trim: true },
  is_deleted: { type: Number, trim: true },
});

export default mongoose.model("Vat", VatSchema);
