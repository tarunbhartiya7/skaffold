const express = require('express')
const axios = require('axios')

const app = express()

app.use(express.json())

const posts = {}

app.post('/events', async (req, res) => {
  const { type, data } = req.body

  console.log(`Received event: ${req.body.type}`)

  if (type === 'CommentCreated') {
    const { postId, content, id } = data
    const status = content.includes('orange') ? 'rejected' : 'approved'

    await axios.post('http://event-bus-srv:4005/events', {
      type: 'CommentModerated',
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

app.listen(4003, () => {
  console.log('Listening on port 4003')
})
