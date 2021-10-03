import nc from 'next-connect'
import dbConnect from '../../utils/db'
import { isAuth } from '../../utils/auth'
import Transaction from '../../models/Transaction'

const handler = nc()

handler.use(isAuth)
handler.get(async (req, res) => {
  await dbConnect()
  let query = Transaction.find({})

  const page = parseInt(req.query.page) || 1
  const pageSize = parseInt(req.query.limit) || 50
  const skip = (page - 1) * pageSize
  const total = await Transaction.countDocuments({})

  const pages = Math.ceil(total / pageSize)

  query = query
    .skip(skip)
    .limit(pageSize)
    .sort({ createdAt: -1 })
    .populate('customer', ['name', 'mobile'])
    .populate('createdBy', 'name')
    .populate('deletedBy', 'name')
    .populate('orderItems.product', 'picture')
    .populate('orderItems.category', 'name')

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

export default handler
