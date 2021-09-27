import mongoose from 'mongoose'
import Category from './Category'

const productScheme = mongoose.Schema(
  {
    name: { type: String, require: true },
    price: { type: Number, default: 0 },
    cost: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Category,
      required: true,
    },
    picture: {
      pictureName: { type: String },
      picturePath: { type: String },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

const Product =
  mongoose.models.Product || mongoose.model('Product', productScheme)
export default Product
