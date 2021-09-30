import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import Order from '../../../../models/Order'
import { isAuth, isAdmin } from '../../../../utils/auth'
import moment from 'moment'

const handler = nc()
handler.use(isAuth, isAdmin)

handler.post(async (req, res) => {
  await dbConnect()
  const { startDate, endDate, product } = req.body

  const start = moment(startDate).clone().startOf('day').format()
  const end = moment(endDate).clone().endOf('day').format()

  let orders = await Order.find({
    isDeleted: false,
    createdAt: { $gte: start, $lt: end },
    'orderItems.product': product,
  })
    .sort({ createdAt: -1 })
    .populate('orderItems.product', 'name')
    .populate('orderItems.customer', ['name', 'mobile'])

  const filteredOrders =
    orders && orders.length > 0 ? orders.map((o) => o.orderItems) : []

  const finalResult =
    filteredOrders && filteredOrders.length > 0
      ? filteredOrders.map(
          (o) =>
            o &&
            o.filter(
              (pro) =>
                pro.product && pro.product._id.toString() === product.toString()
            )
        )
      : []

  let productList = []
  finalResult &&
    finalResult.length > 0 &&
    finalResult.map((pro) => productList.push(...pro))

  console.log(productList)

  res.status(200).json(productList)
})

export default handler
