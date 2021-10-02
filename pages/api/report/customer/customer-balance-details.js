import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import Order from '../../../../models/Order'
import { isAuth, isAdmin } from '../../../../utils/auth'

const handler = nc()
handler.use(isAuth, isAdmin)

handler.post(async (req, res) => {
  await dbConnect()
  const { customer } = req.body

  let orders = await Order.find({
    isDeleted: false,
  })
    .sort({ createdAt: -1 })
    .populate('orderItems.product', 'name')
    .populate('orderItems.customer', ['name', 'mobile'])
    .populate('customer', ['name', 'mobile'])

  const result =
    orders &&
    orders.length > 0 &&
    orders.filter((d) => d.customer._id.toString() === customer.toString())

  res.status(200).json(result)
})

export default handler
