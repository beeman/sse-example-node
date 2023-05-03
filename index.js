const express = require('express')
const app = express()
const port = 3010
const path = require('path')
const { BehaviorSubject } = require('rxjs')
app.use(express.json())

app.use(express.static('static'))

app.get('/', (req, res) => {
  res.sendFile(path.resolve('pages/index.html'))
})

const subject = new BehaviorSubject(undefined)
let counter = 0

app.post('/input', (req, res) => {
  subject.next(req.body)
  res.send({ ...req.body, status: 'ok' })
})

app.get('/sse', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    Connection: 'keep-alive',
    'Cache-Control': 'no-cache',
  })

  const sub = subject.subscribe((input) => {
    counter++
    const data = `data: ${JSON.stringify({ counter, input: input ?? 'No Input' })}\n\n`
    console.log('data', data)
    res.write(data)
  })

  req.on('close', () => {
    sub.unsubscribe()
    console.log('Closed')
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
