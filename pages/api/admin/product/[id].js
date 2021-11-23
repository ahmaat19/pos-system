import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import { isAdmin, isAuth } from '../../../../utils/auth'
import fileUpload from 'express-fileupload'
import { upload, deleteFile } from '../../../../utils/fileManager'
import Product from '../../../../models/Product'
export const config = { api: { bodyParser: false } }

const handler = nc()
handler.use(fileUpload())

handler.use(isAuth, isAdmin)
handler.put(async (req, res) => {
  await dbConnect()

  const { isActive, category, price, unit, stock, cost } = req.body

  const name = req.body.name.toLowerCase()
  const _id = req.query.id
  const picture = req.files && req.files.picture

  const obj = await Product.findById(_id)

  if (obj) {
    const exist = await Product.find({
      _id: { $ne: _id },
      name,
    })
    if (exist.length === 0) {
      if (picture) {
        const profile = await upload({
          fileName: picture,
          fileType: 'image',
          pathName: 'product',
        })
        if (profile) {
          if (obj && obj.picture) {
            deleteFile({
              pathName: obj.picture.pictureName,
            })
          }
        }
        obj.isActive = isActive
        obj.category = category
        obj.price = price
        obj.cost = cost
        obj.unit = unit
        obj.stock = stock
        obj.name = name

        obj.picture = {
          pictureName: profile.fullFileName,
          picturePath: profile.filePath,
        }

        await obj.save()
        res.json({ status: 'success' })
      } else {
        obj.isActive = isActive
        obj.category = category
        obj.price = price
        obj.cost = cost
        obj.unit = unit
        obj.stock = stock
        obj.name = name
        await obj.save()
        res.json({ status: 'success' })
      }
    } else {
      return res.status(400).send(`This ${name} product already exist`)
    }
  } else {
    return res.status(404).send('Product not found')
  }
})

handler.delete(async (req, res) => {
  await dbConnect()

  const _id = req.query.id
  const obj = await Product.findById(_id)
  if (!obj) {
    return res.status(404).send('Product not found')
  } else {
    if (obj.picture) {
      deleteFile({
        pathName: obj.picture.pictureName,
      })
    }

    await obj.remove()

    res.json({ status: 'success' })
  }
})

export default handler
