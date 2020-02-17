import mongoose from 'mongoose'
import crypto from 'crypto'
const CountriesSchema = new mongoose.Schema(
    {
        country: { type: String, trim: true },
        code: { type: String, trim: true }
    }

)

export default mongoose.model('countries', CountriesSchema)