import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import Customer from '../../../../models/Customer'
import { isAdmin, isAuth } from '../../../../utils/auth'

const handler = nc()
handler.use(isAuth)

handler.get(async (req, res) => {
  await dbConnect()

  const obj = await Customer.find({}).sort({ createdAt: -1 })

  res.send(obj)
})

handler.use(isAuth, isAdmin)
handler.post(async (req, res) => {
  await dbConnect()

  const { isActive, mobile, address, name } = req.body

  const exist = await Customer.findOne({ mobile })
  if (exist) {
    return res.status(400).send('Customer already exist')
  }
  const createObj = await Customer.create({
    name,
    isActive,
    mobile,
    address,
  })

  if (createObj) {
    res.status(201).json({ status: 'success' })
  } else {
    return res.status(400).send('Invalid data')
  }
})

export default handler
