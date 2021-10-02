import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import Category from '../../../../models/Category'
import Product from '../../../../models/Product'
import { isAdmin, isAuth } from '../../../../utils/auth'

const handler = nc()
handler.use(isAuth, isAdmin)

handler.put(async (req, res) => {
  await dbConnect()

  const isActive = req.body.isActive
  const name = req.body.name.toLowerCase()
  const _id = req.query.id

  const obj = await Category.findById(_id)

  if (obj) {
    const exist = await Category.find({ _id: { $ne: _id }, name })
    if (exist.length === 0) {
      obj.name = name
      obj.isActive = isActive
      await obj.save()

      res.json({ status: 'success' })
    } else {
      return res.status(400).send(`This ${name} category already exist`)
    }
  } else {
    return res.status(404).send('Category not found')
  }
})

handler.delete(async (req, res) => {
  await dbConnect()

  const _id = req.query.id
  const obj = await Category.findById(_id)
  if (!obj) {
    return res.status(404).send('Category not found')
  } else {
    await Product.deleteMany({ category: obj._id })
    await obj.remove()

    res.json({ status: 'success' })
  }
})

export default handler
