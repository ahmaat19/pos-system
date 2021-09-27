import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import Product from '../../../../models/Product'
import { isAdmin, isAuth } from '../../../../utils/auth'
import fileUpload from 'express-fileupload'
import { upload } from '../../../../utils/fileManager'
export const config = { api: { bodyParser: false } }

const handler = nc()
handler.use(fileUpload())

handler.use(isAuth)
handler.get(async (req, res) => {
  await dbConnect()

  const obj = await Product.find({})
    .sort({ createdAt: -1 })
    .populate('category')

  res.send(obj)
})

handler.use(isAdmin)
handler.post(async (req, res) => {
  await dbConnect()
  const { isActive, category, price, unit, stock, cost } = req.body

  const name = req.body.name.toLowerCase()
  const picture = req.files && req.files.picture

  const exist = await Product.findOne({ name })
  if (exist) {
    return res.status(400).send('Product already exist')
  }
  if (picture) {
    const profile = await upload({
      fileName: picture,
      fileType: 'image',
      pathName: 'product',
    })

    if (profile) {
      const createObj = await Product.create({
        isActive,
        category,
        price,
        unit,
        stock,
        cost,
        name,
        picture: {
          pictureName: profile.fullFileName,
          picturePath: profile.filePath,
        },
      })

      if (createObj) {
        res.status(201).json({ status: 'success' })
      } else {
        return res.status(400).send('Invalid data')
      }
    }
  } else {
    const createObj = await Product.create({
      isActive,
      category,
      price,
      stock,
      unit,
      cost,
      name,
    })

    if (createObj) {
      res.status(201).json({ status: 'success' })
    } else {
      return res.status(400).send('Invalid data')
    }
  }
})

export default handler
