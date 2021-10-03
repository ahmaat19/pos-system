import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import Order from '../../../../models/Order'
import { isAuth } from '../../../../utils/auth'
import Product from '../../../../models/Product'
import Transaction from '../../../../models/Transaction'

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
  const invoice = await Order.countDocuments({})

  if (orderItems && orderItems.length < 1) {
    return res.status(400).send('Please add items on the cart')
  }

  const products = await Product.find({
    _id: orderItems.map((o) => o.product),
  })

  for (let i = 0; i < products.length; i++) {
    if (
      products[i]._id.toString() === orderItems[i].product.toString() &&
      Number(products[i].stock) < Number(orderItems[i].qty)
    ) {
      return res
        .status(400)
        .send(
          'The quantity you are trying to order is not available in the store'
        )
    }
  }

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

  const due = Number(totalPrice) - Number(paidAmount) - Number(discount)

  if (!customer) return res.status(400).send('Please select a customer')
  if (totalPrice < Number(discount) + Number(paidAmount))
    return res
      .status(400)
      .send(`amount + discount should be less than or equal to $${totalPrice}`)

  const custom = orderItems.map((o) => ({
    product: o.product,
    name: o.name,
    category: o.category,
    qty: o.qty,
    price: o.price,
    cost: o.cost,
    customer: customer,
    createdAt: Date.now(),
    seller: createdBy,
    createdBy: createdBy,
  }))

  const createObj = await Order.create({
    isActive: true,
    invoice: Number(invoice) + 1,
    customer,
    discount,
    paidAmount,
    totalPrice,
    due,
    orderItems: custom,
    createdBy,
  })

  if (createObj) {
    await Transaction.create({
      order: createObj._id,
      isActive: true,
      invoice: Number(invoice) + 1,
      customer,
      type: 'Payment',
      discount,
      paidAmount,
      totalPrice,
      due,
      orderItems: custom,
      createdBy,
    })
    res.status(201).json({ status: 'success' })
  } else {
    return res.status(400).send('Invalid data')
  }
})

export default handler
