import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import Customer from '../../../../models/Customer'
import { isAdmin, isAuth } from '../../../../utils/auth'

const handler = nc()
handler.use(isAuth)

handler.put(async (req, res) => {
  await dbConnect()

  const { isActive, mobile, address, name } = req.body
  const _id = req.query.id

  const obj = await Customer.findById(_id)

  if (obj) {
    const exist = await Customer.find({ _id: { $ne: _id }, mobile })
    if (exist.length === 0) {
      obj.name = name
      obj.address = address
      obj.isActive = isActive
      obj.mobile = mobile
      await obj.save()

      res.json({ status: 'success' })
    } else {
      return res.status(400).send(`This ${mobile} already exist`)
    }
  } else {
    return res.status(404).send('Customer not found')
  }
})

handler.use(isAuth, isAdmin)
handler.delete(async (req, res) => {
  await dbConnect()

  const _id = req.query.id
  const obj = await Customer.findById(_id)
  if (!obj) {
    return res.status(404).send('Customer not found')
  } else {
    await obj.remove()

    res.json({ status: 'success' })
  }
})

export default handler
