const mongoose = require('mongoose')
const { isEmail } = require('validator')

const userSchema = new mongoose.Schema({
  name: { type: String, required:  true },
  email: {
    type: String,
    required: true,
    validate: [isEmail, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: [6, 'Minimum password length is 6 characters'],
  }
})

const UserModal = mongoose.model('UserModal', userSchema)

module.exports = UserModal