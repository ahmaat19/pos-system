import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import Order from '../../../../models/Order'
import { isAuth } from '../../../../utils/auth'

const handler = nc()
handler.use(isAuth)

handler.put(async (req, res) => {
  await dbConnect()

  const { isActive, customer, totalPrice, status, orderItems } = req.body
  const _id = req.query.id

  const obj = await Order.findById(_id)

  if (obj) {
    if (orderItems && orderItems.length > 0) {
      obj.name = name
      obj.customer = customer
      obj.isActive = isActive
      obj.totalPrice = totalPrice
      obj.status = status
      obj.orderItems = orderItems
      await obj.save()

      res.json({ status: 'success' })
    } else {
      return res.status(400).send(`Please, add items on cart`)
    }
  } else {
    return res.status(404).send('Order not found')
  }
})

handler.delete(async (req, res) => {
  await dbConnect()

  const _id = req.query.id
  const obj = await Order.findById(_id)
  if (!obj) {
    return res.status(404).send('Order not found')
  } else {
    await obj.remove()

    res.json({ status: 'success' })
  }
})

export default handler
