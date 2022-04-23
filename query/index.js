const express = require('express')
const cors = require('cors')
const axios = require('axios')

const app = express()

app.use(cors())
app.use(express.json())

const posts = {}

const handleEvent = (type, data) => {
  if (type === 'PostCreated') {
    const { id, title } = data

    posts[id] = { id, title, comments: [] }
  }

  if (type === 'CommentCreated') {
    const { id, content, postId, status } = data

    posts[postId].comments.push({ id, content, status })
  }

  if (type === 'CommentUpdated') {
    const { id, content, postId, status } = data

    const post = posts[postId]
    const comment = post.comments.find((item) => item.id === id)

    comment.status = status
    comment.content = content
  }
}

app.get('/posts', (req, res) => {
  res.send(posts)
})

app.post('/events', (req, res) => {
  const { type, data } = req.body

  console.log(`Received event: ${req.body.type}`)

  handleEvent(type, data)

  res.send()
})

app.listen(4002, async () => {
  console.log('Listening on port 4002')

  const res = await axios.get('http://event-bus-srv:4005/events')
  console.log('events: ', res.data)

  for (let event of res.data) {
    const { type, data } = event

    console.log(`Processing event: ${type}`)

    handleEvent(type, data)
  }
})
