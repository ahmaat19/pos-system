import nc from 'next-connect'
import dbConnect from '../../utils/db'
import { isAuth } from '../../utils/auth'
import Transaction from '../../models/Transaction'
import moment from 'moment'

const handler = nc()

handler.use(isAuth)
handler.post(async (req, res) => {
  await dbConnect()
  const { startDate, endDate } = req.body

  const start = moment(startDate).clone().startOf('day').format()
  const end = moment(endDate).clone().endOf('day').format()

  const transactions = await Transaction.find({
    createdAt: { $gte: start, $lt: end },
  })
    .sort({ createdAt: -1 })
    .populate('customer', ['name', 'mobile'])
    .populate('createdBy', 'name')
    .populate('deletedBy', 'name')
    .populate('orderItems.product', 'picture')
    .populate('orderItems.category', 'name')

  res.status(200).json(transactions)
})

export default handler
