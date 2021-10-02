import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import Order from '../../../../models/Order'
import { isAuth, isAdmin } from '../../../../utils/auth'

const handler = nc()
handler.use(isAuth, isAdmin)

handler.get(async (req, res) => {
  await dbConnect()

  let orders = await Order.find({
    isDeleted: false,
    due: { $gt: 0 },
  })
    .sort({ createdAt: -1 })
    .populate('orderItems.product', 'name')
    .populate('orderItems.customer', ['name', 'mobile'])
    .populate('customer', ['name', 'mobile'])

  const result = orders && orders.length > 0 && orders.map((d) => d.orderItems)

  let cusArray = []
  result && result.length > 0 && result.map((cus) => cusArray.push(...cus))

  let newResult = []
  orders &&
    orders.length > 0 &&
    orders.forEach((e) => {
      let el = newResult.find(
        (n) => n.customer._id.toString() === e.customer._id.toString()
      )
      if (el) {
        el.due += e.due
        el.totalPrice += e.totalPrice
        el.discount += e.discount
        el.paidAmount += e.paidAmount
      } else newResult.push(e)
    })

  res.status(200).json(newResult)
})

export default handler
