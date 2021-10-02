import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import Order from '../../../../models/Order'
import { isAuth, isAdmin } from '../../../../utils/auth'

const handler = nc()
handler.use(isAuth, isAdmin)

handler.get(async (req, res) => {
  await dbConnect()

  const seller = req.user.id

  let orders = await Order.find({
    isDeleted: false,
    'orderItems.seller': seller,
  })
    .sort({ createdAt: -1 })
    .populate('orderItems.product', 'name')
    .populate('orderItems.customer', ['name', 'mobile'])

  const result =
    orders &&
    orders.length > 0 &&
    orders.map(
      (d) =>
        Number(d.totalPrice) > Number(d.discount) + Number(d.paidAmount) &&
        d.orderItems &&
        d.orderItems.filter((o) => o.seller.toString() === seller.toString())
    )

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
        })
    })

  res.status(200).json(newResult)
})

export default handler
