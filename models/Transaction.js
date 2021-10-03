import mongoose from 'mongoose'
import Customer from './Customer'
import Order from './Order'
import User from './User'

const transactionScheme = mongoose.Schema(
  {
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: User },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: User },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Customer,
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Order,
      required: true,
    },
    type: { type: String, required: true },
    totalPrice: { type: Number, default: 0.0 },
    due: { type: Number, default: 0.0 },
    discount: { type: Number, default: 0.0 },
    paidAmount: { type: Number, default: 0.0 },
    invoice: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

const Transaction =
  mongoose.models.Transaction ||
  mongoose.model('Transaction', transactionScheme)
export default Transaction
