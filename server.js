const http = require('http')
const express = require('express')
const app = express()
const unfurl = require('unfurl.js')

app.use(
  express.urlencoded({
    extended: true
  })
)

app.use(express.json())
app.use(express.static('.'))

const cache = {}

app.post('/scrape', async (req, res) => {
  const url = req.body.url
  console.log(url)
  if (!cache[url]) {
    const result = await unfurl.unfurl(url)
    cache[url] = result
  }
  res.send(cache[url])
})

const port = 8080
app.listen(port, () => {
  console.log(`Listening on ${port}`)
})
