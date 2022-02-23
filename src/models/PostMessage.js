const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  title: String,
  message: String,
  tags: [String],
  selectedFile: String,
  name: String,
  creator: String,
  likes: {
    type: [String],
    default: []
  },
  comments: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
})

const PostMessage = mongoose.model('PostMessage', postSchema)

module.exports = PostMessage