import mongoose from 'mongoose'

const customerScheme = mongoose.Schema(
  {
    name: { type: String, require: true },
    mobile: { type: Number, require: true },
    address: { type: String, require: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

const Customer =
  mongoose.models.Customer || mongoose.model('Customer', customerScheme)
export default Customer
