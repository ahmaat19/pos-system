import nc from 'next-connect'
import dbConnect from '../../../utils/db'
import Order from '../../../models/Order'
import { isAuth, isAdmin } from '../../../utils/auth'
import Transaction from '../../../models/Transaction'

const handler = nc()
handler.use(isAuth, isAdmin)

handler.post(async (req, res) => {
  await dbConnect()

  const { receipt, order } = req.body

  const orderObj = await Order.findById(order._id)
  if (orderObj) {
    if (orderObj.due > 0 && orderObj.due >= Number(receipt)) {
      orderObj.due = orderObj.due - Number(receipt)
      orderObj.paidAmount = orderObj.paidAmount + Number(receipt)
      const modified = await orderObj.save()
      if (modified) {
        const allDue = await Transaction.findOne({
          customer: orderObj.customer,
        }).sort({ createdAt: -1 })

        await Transaction.create({
          order: orderObj._id,
          isActive: true,
          invoice: orderObj.invoice,
          customer: orderObj.customer,
          type: 'receipt',
          discount: orderObj.discount,
          paidAmount: receipt,
          totalPrice: orderObj.totalPrice,
          due: Number(allDue.due) - Number(receipt),
          createdBy: req.user.id,
        })
        res.status(200).json(modified)
      }
    } else {
      return res.status(400).send('Please check the amount you are receipting')
    }
  }
})

export default handler
