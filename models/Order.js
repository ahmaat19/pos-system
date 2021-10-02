import mongoose from 'mongoose'
import Category from './Category'
import Customer from './Customer'
import Product from './Product'
import User from './User'

const orderScheme = mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: User },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: User },
    isDeleted: { type: Boolean, default: false },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Customer,
      required: true,
    },
    totalPrice: {
      type: Number,
      default: 0.0,
    },
    due: {
      type: Number,
      default: 0.0,
    },
    discount: {
      type: Number,
      default: 0.0,
    },
    paidAmount: {
      type: Number,
      default: 0.0,
    },
    invoice: { type: Number, required: true },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: Product,
        },
        name: {
          type: String,
          required: true,
        },
        category: {
          type: mongoose.Schema.Types.ObjectId,
          ref: Category,
          required: true,
        },
        qty: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        cost: {
          type: Number,
          required: true,
        },
        customer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: Customer,
          required: true,
        },
        seller: {
          type: mongoose.Schema.Types.ObjectId,
          ref: User,
          required: true,
        },
        createdAt: { type: Date, default: Date.now() },
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

const Order = mongoose.models.Order || mongoose.model('Order', orderScheme)
export default Order
