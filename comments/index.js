const express = require('express')
const cors = require('cors')
const { randomBytes } = require('crypto')
const axios = require('axios')

const app = express()

app.use(cors())
app.use(express.json())

const commentsByPostId = {}

app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || [])
})

app.post('/posts/:id/comments', async (req, res) => {
  const commentId = randomBytes(4).toString('hex')
  const { content } = req.body
  const postId = req.params.id
  const status = 'pending'

  const comments = commentsByPostId[postId] || []

  comments.push({ id: commentId, content, status })

  commentsByPostId[postId] = comments

  await axios.post('http://event-bus-srv:4005/events', {
    type: 'CommentCreated',
    data: {
      id: commentId,
      content,
      postId,
      status,
    },
  })

  res.status(201).send(comments)
})

app.post('/events', async (req, res) => {
  const { type, data } = req.body

  console.log(`Received event: ${req.body.type}`)

  if (type === 'CommentModerated') {
    const { id, content, postId, status } = data
    const comments = commentsByPostId[postId]
    const comment = comments.find((item) => item.id === id)
    comment.status = status

    await axios.post('http://event-bus-srv:4005/events', {
      type: 'CommentUpdated',
      data: {
        id,
        content,
        postId,
        status,
      },
    })
  }

  res.send()
})

app.listen(4001, () => {
  console.log('Listening on port 4001')
})
