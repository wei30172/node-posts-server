const UserModal = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const secret = 'node secret'

// create json web token
const maxAge = 1 * 24 * 60 * 60 // 1 day
const createToken = (email, id) => {
  return jwt.sign({ email, id }, secret, {
    expiresIn: maxAge
  })
}

const signUp = async (req, res) => {
  const { email, password, confirmPassword, firstName, lastName } = req.body
  try {
    const user = await UserModal.findOne({ email })
    if (user) return res.status(400).json({ message: 'That email is already registered' })
    if (password !== confirmPassword) return res.status(400).json({ message: "Passwords don't match" })
    
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)
    
    const result = await UserModal.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` })
    const token = createToken(result.email, result._id)
    res.status(201).json({ result, token })
  } catch(err) {
    res.status(500).json({ message: "Something went wrong" })
  }
}

const logIn = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await UserModal.findOne({ email })
    if (!user) return res.status(404).json({ message: 'That email is not registered' })
    
    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) return res.status(400).json({ message: 'That password is incorrect' })
    
    const token = createToken(user.email, user._id)
    res.status(200).json({ result: user, token })
  } catch(err) {
    const errors = handleErrors(err)
    res.status(500).json({ message: "Something went wrong" })
  } 
}

module.exports = { signUp, logIn }

// const jwtOption = {
//   maxAge: 1000 * maxAge, // 1 day
//   secure: true, // only be sent when we have HTTPS connection!!!
//   httpOnly: true // only be transformed via HTTP Protocol, not in the front-end JS code.(document.cookie)
// }