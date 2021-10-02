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
    createdBy: seller,
    createdAt: { $gte: start, $lt: end },
  })
    .sort({ createdAt: -1 })
    .populate('orderItems.product', 'name')
    .populate('orderItems.seller', ['name'])
    .populate('createdBy', ['name'])
    .populate('customer', ['name', 'mobile'])

  const result =
    orders &&
    orders.length > 0 &&
    orders.map((d) => ({
      orderItems: d.orderItems,
      due: d.totalPrice - d.discount - d.paidAmount,
      _id: d._id,
      seller: d.createdBy,
      customer: d.customer,
      invoice: d.invoice,
      discount: d.discount,
      paidAmount: d.paidAmount,
      totalPrice: d.totalPrice,
    }))

  let cusArray = []
  result &&
    result.length > 0 &&
    result.map((cus) => cus !== false && cusArray.push(...cus.orderItems))

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

  res.status(200).json(orders)
})

export default handler
