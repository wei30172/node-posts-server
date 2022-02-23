const PostMessage = require('../models/PostMessage')
const mongoose = require('mongoose')

// query -> /posts?page=1 -> page = 1
// params -> /posts/123 -> id = 123

const getPostsBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query
  try {
    const searchData = new RegExp(searchQuery, 'i') // Test test TEST -> test
    const posts = await PostMessage.find({ $or: [
      { title: searchData },
      { tags: { $in: searchData } },
      { message: tags.split(',') },
      { tags: { $in: tags.split(',') } }
    ]})
    res.status(200).json({ data: posts })
  } catch (error) {
    res.status(404).json({ message: error.message})
  }
}

const getPosts = async (req, res) => {
  const { page } = req.query
  try {
    const LIMIT = 6 // per page
    const startIndex = (Number(page) - 1) * LIMIT
    const total = await PostMessage.countDocuments({})
    const posts = await PostMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex)
    // sort({ _id: -1 }) -> the newest post first
    res.status(200).json({
      data: posts,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT)
    })
  } catch (error) {
    res.status(404).json({ message: error.message})
  }
}

const getPost = async (req, res) => {
  const { id } = req.params
  try {
    const post = await PostMessage.findById(id)
    res.status(200).json(post)
  } catch (error) {
    res.status(404).json({ message: error.message})
  }
}

const createPosts = async (req, res) => {
  const post = req.body
  const newPost = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString()})
  try {
    await newPost.save()
    res.status(201).json(newPost)
  } catch (error) {
    res.status(409).json({ message: error.message})
  }
}

const updatePost = async (req, res) => {
  const { id: _id } = req.params
  const { creator, title, message, tags, selectedFile } = req.body
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send(`No post with id: ${_id}`)
  }
  const updatedPost = { creator, title, message, tags, selectedFile, _id }
  await PostMessage.findByIdAndUpdate(_id, updatedPost, { new: true })
  res.json(updatedPost)
}

const deletePost = async (req, res) => {
  const { id: _id } = req.params
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send(`No post with id: ${_id}`)
  }
  await PostMessage.findByIdAndRemove(_id)
  
  res.json({ message: 'Post deleted successfully'})
}

const likePost = async (req, res) => {
  const { id: _id } = req.params
  if (!req.userId) {
    return res.json({ message: "Unauthenticated" });
  }
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send(`No post with id: ${_id}`)
  }
  
  const post = await PostMessage.findById(_id)
  const index = post.likes.findIndex((id) => id === String(req.userId))
  if (index === -1) {
    // like the post
    post.likes.push(req.userId);
  } else {
    // dislike a post
    post.likes = post.likes.filter((id) => id !== String(req.userId));
  }
  const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, { new: true }) 
  
  res.status(200).json(updatedPost)
}

const commentPost = async (req, res) => {
  const { id: _id } = req.params
  const { value } = req.body
  if (!req.userId) {
    return res.json({ message: "Unauthenticated" });
  }
  
  const post = await PostMessage.findById(_id)
  post.comments.push(value);
  const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, { new: true }) 
  
  res.status(200).json(updatedPost)
}

module.exports = { getPosts, getPost, getPostsBySearch, createPosts, updatePost, deletePost, likePost, commentPost }