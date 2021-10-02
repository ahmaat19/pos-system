import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import User from '../../../../models/User'
import { isAuth } from '../../../../utils/auth'

const handler = nc()
handler.use(isAuth)

handler.get(async (req, res) => {
  await dbConnect()
  let users = await User.find({}).sort({ createdAt: -1 }).select('-password')

  res.status(200).json(users)
})

export default handler
