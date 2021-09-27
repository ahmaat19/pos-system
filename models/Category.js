import mongoose from 'mongoose'

const categoryScheme = mongoose.Schema(
  {
    name: { type: String, require: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

const Category =
  mongoose.models.Category || mongoose.model('Category', categoryScheme)
export default Category
