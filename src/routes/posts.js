const { Router } = require('express')
const { getPosts, getPost, getPostsBySearch, createPosts, updatePost, deletePost, likePost, commentPost } = require('../controllers/posts')
const { auth } = require('../middleware/auth.js')
const router = Router()

// http://localhost:5000/posts

router.get('/search', getPostsBySearch)
router.get('/', getPosts)
router.get('/:id', getPost)
router.post('/', auth, createPosts)
router.patch('/:id', auth, updatePost)
router.delete('/:id', auth, deletePost)
router.patch('/:id/likePost', auth, likePost)
router.patch('/:id/commentPost', auth, commentPost)

module.exports = router