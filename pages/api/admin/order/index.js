import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import Order from '../../../../models/Order'
import { isAuth } from '../../../../utils/auth'
import Product from '../../../../models/Product'

const handler = nc()

handler.use(isAuth)
handler.get(async (req, res) => {
  await dbConnect()
  let query = Order.find({ isDeleted: false })

  const page = parseInt(req.query.page) || 1
  const pageSize = parseInt(req.query.limit) || 50
  const skip = (page - 1) * pageSize
  const total = await Order.countDocuments({ isDeleted: false })

  const pages = Math.ceil(total / pageSize)

  query = query
    .skip(skip)
    .limit(pageSize)
    .sort({ createdAt: -1 })
    .populate('customer', ['name', 'mobile'])
    .populate('orderItems.product', 'picture')

  const result = await query

  res.status(200).json({
    startIndex: skip + 1,
    endIndex: skip + result.length,
    count: result.length,
    page,
    pages,
    total,
    data: result,
  })
})

handler.post(async (req, res) => {
  await dbConnect()

  const {
    customer,
    discount,
    paidAmount,

    cartItems: orderItems,
  } = req.body

  const createdBy = req.user.id

  if (orderItems && orderItems.length < 1) {
    return res.status(400).send('Please add items on the cart')
  }

  const products = await Product.find({
    _id: orderItems.map((o) => o.product),
  })

  const quantityMap = orderItems.reduce(
    (quantities, { product, qty }) => ({
      ...quantities,
      [product]: qty || 0,
    }),
    {}
  )

  const newProducts = products.map((product) => ({
    ...product,
    stock: Number(product.stock) - (quantityMap[product._id] || 0),
  }))

  if (newProducts.length > 0) {
    for (let i = 0; i < newProducts.length; i++) {
      const { _id, picture, price, cost, isActive, name, category, unit } =
        newProducts[i]._doc
      const newObj = {
        _id,
        picture,
        price,
        cost,
        stock: newProducts[i].stock,
        isActive,
        name,
        category,
        unit,
      }
      await Product.findOneAndUpdate(
        { _id: newProducts[i]._doc._id },
        { $set: newObj },
        { useFindAndModify: false }
      )
    }
  }

  const totalPrice =
    orderItems &&
    orderItems.length > 0 &&
    orderItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)

  if (!customer) return res.status(400).send('Please select a customer')
  if (totalPrice < Number(discount) + Number(paidAmount))
    return res
      .status(400)
      .send(`amount + discount should be less than or equal to $${totalPrice}`)

  const createObj = await Order.create({
    isActive: true,
    customer,
    discount,
    paidAmount,
    totalPrice,
    orderItems,
    createdBy,
  })

  if (createObj) {
    res.status(201).json({ status: 'success' })
  } else {
    return res.status(400).send('Invalid data')
  }
})

export default handler
