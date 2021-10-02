import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import Order from '../../../../models/Order'
import { isAuth, isAdmin } from '../../../../utils/auth'
import moment from 'moment'

const handler = nc()
handler.use(isAuth, isAdmin)

handler.post(async (req, res) => {
  await dbConnect()

  const seller = req.query.id
  const { startDate, endDate } = req.body

  const start = moment(startDate).clone().startOf('day').format()
  const end = moment(endDate).clone().endOf('day').format()

  let orders = await Order.find({
    isDeleted: false,
    'orderItems.seller': seller,
    createdAt: { $gte: start, $lt: end },
  })
    .sort({ createdAt: -1 })
    .populate('orderItems.product', 'name')
    .populate('orderItems.seller', ['name'])

  const result = orders && orders.length > 0 && orders.map((d) => d.orderItems)

  let cusArray = []
  result &&
    result.length > 0 &&
    result.map((cus) => cus !== false && cusArray.push(...cus))

  let newResult = []
  cusArray &&
    cusArray.length > 0 &&
    cusArray.forEach((e) => {
      let el = newResult.find(
        (n) => n.seller.toString() === e.seller.toString()
      )
      if (el) {
        el.qty += e.qty
        el.price += e.price * e.qty
      } else
        newResult.push({
          createdAt: e.createdAt,
          _id: e._id,
          product: e.product,
          name: e.name,
          category: e.category,
          qty: e.qty,
          price: Number(e.price) * Number(e.qty),
          cost: e.cost,
          customer: e.customer,
          seller: e.seller,
        })
    })

  res.status(200).json(newResult)
})

export default handler
