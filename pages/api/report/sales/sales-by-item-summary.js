import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import Order from '../../../../models/Order'
import { isAuth, isAdmin } from '../../../../utils/auth'
import moment from 'moment'

const handler = nc()
handler.use(isAuth, isAdmin)

handler.post(async (req, res) => {
  await dbConnect()
  const { startDate, endDate } = req.body

  const start = moment(startDate).clone().startOf('day').format()
  const end = moment(endDate).clone().endOf('day').format()

  let orders = await Order.find({
    isDeleted: false,
    createdAt: { $gte: start, $lt: end },
  }).sort({ createdAt: -1 })

  const result = orders && orders.length > 0 && orders.map((d) => d.orderItems)

  let salesArray = []
  result.map((sale) => salesArray.push(...sale))

  let newResult = []
  salesArray.forEach((e) => {
    let el = newResult.find((n) => n.name === e.name)
    if (el) el.qty += e.qty
    else newResult.push(e)
  })

  res.status(200).json(newResult)
})

export default handler
