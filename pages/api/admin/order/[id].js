import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import Order from '../../../../models/Order'
import Product from '../../../../models/Product'
import { isAuth } from '../../../../utils/auth'
import Transaction from '../../../../models/Transaction'

const handler = nc()
handler.use(isAuth)

handler.put(async (req, res) => {
  await dbConnect()

  const { paidAmount, discount } = req.body
  const _id = req.query.id
  const updatedBy = req.user.id

  const obj = await Order.findById(_id)

  if (Number(paidAmount) + Number(discount) > Number(obj.totalPrice)) {
    return res
      .status(400)
      .send(
        `amount + discount should be less than or equal to $${obj.totalPrice}`
      )
  }

  if (obj) {
    obj.paidAmount = paidAmount
    obj.updatedBy = updatedBy
    obj.discount = discount
    await obj.save()

    res.json({ status: 'success' })
  } else {
    return res.status(404).send('Order not found')
  }
})

handler.delete(async (req, res) => {
  await dbConnect()

  const _id = req.query.id

  const obj = await Order.findById(_id)
  if (!obj) {
    return res.status(404).send('Order not found')
  } else {
    const orderItems = obj.orderItems

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
      stock: Number(product.stock) + (quantityMap[product._id] || 0),
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

    obj.isDeleted = true
    const trans = await Transaction.findOne({ order: _id })
    trans.isDeleted = true
    trans.deletedBy = req.user.id
    trans.deletedAt = Date.now()
    await trans.save()
    await obj.save()

    res.json({ status: 'success' })
  }
})

export default handler
