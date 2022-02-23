const express = require('express')
const mongoose = require('mongoose')
const userRoutes = require('./routes/user')
const postsRoutes = require('./routes/posts')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const app = express()

// middleware
app.use(bodyParser.json({ limit: "30mb", extended: true }))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }))
app.use(express.json())
app.use(cookieParser());
app.use(cors({
  origin: true,
  credentials: true
}))

// database connection
const CONNECTION_URL = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@reactblog.7rub8.mongodb.net/blogDatabase?retryWrites=true&w=majority`

const PORT = process.env.PORT || 5000

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

mongoose
  .connect(CONNECTION_URL, options)
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    )
  )
  .catch(error => {
    console.log(error.message)
  })

// routes
app.get('/', (req, res) => {
  res.send('Hello to Posts API')
})
app.use('/user', userRoutes)
app.use('/posts', postsRoutes)