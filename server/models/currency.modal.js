import mongoose from "mongoose";
import crypto from "crypto";
const CurrencySchema = new mongoose.Schema({
    disclaimer: { type: String, trim: true },
    license: { type: String, trim: true },
    timestamp: { type: Date, trim: true },
    base: { type: String, trim: true },
    rates: { type: Object, trim: true },
});

export default mongoose.model("Currency", CurrencySchema);
