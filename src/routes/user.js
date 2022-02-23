const { Router } = require('express')
const { signUp, logIn } = require('../controllers/users')

const router = Router()

// http://localhost:5000/user

router.post('/signup', signUp)
router.post('/login', logIn)

module.exports = router