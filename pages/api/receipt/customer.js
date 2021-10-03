import nc from 'next-connect'
import dbConnect from '../../../utils/db'
import Order from '../../../models/Order'
import { isAuth, isAdmin } from '../../../utils/auth'
import Customer from '../../../models/Customer'

const handler = nc()
handler.use(isAuth, isAdmin)

handler.post(async (req, res) => {
  await dbConnect()

  const cus = await Customer.findOne({ mobile: Number(req.body) })
  if (cus) {
    const orders = await Order.find({
      isDeleted: false,
      due: { $gt: 0 },
      customer: cus._id,
    })
      .sort({ createdAt: -1 })
      .populate('orderItems.product', 'name')
      .populate('customer', ['name', 'mobile'])

    res.status(200).json(orders)
  } else {
    return res.status(400).send('Customer mobile number is not found')
  }
})

export default handler
