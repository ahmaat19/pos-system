import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import Order from '../../../../models/Order'
import { isAuth } from '../../../../utils/auth'

const handler = nc()

handler.get(async (req, res) => {
  await dbConnect()

  const obj = await Order.find({}).sort({ createdAt: -1 }).populate('customer')

  res.send(obj)
})

handler.use(isAuth)
handler.post(async (req, res) => {
  await dbConnect()

  const { isActive, customer, totalPrice, status, orderItems } = req.body

  if (orderItems && orderItems.length < 1) {
    return res.status(400).send('Please add items on the cart')
  }
  const createObj = await Order.create({
    isActive,
    customer,
    totalPrice,
    status,
    orderItems,
  })

  if (createObj) {
    res.status(201).json({ status: 'success' })
  } else {
    return res.status(400).send('Invalid data')
  }
})

export default handler
