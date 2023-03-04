#!/usr/bin/env node
const http = require('http')
const express = require('express')
const app = express()
const unfurl = require('unfurl.js')
const {Readability} = require('@mozilla/readability')
const {JSDOM} = require('jsdom')

app.use(
  express.urlencoded({
    extended: true
  })
)

app.use(express.json())
app.use(express.static('.'))

const cache = {}
const content_cache = {}

app.post('/scrape', async (req, res) => {
  const url = req.body.url
  console.log(url)
  if (!cache[url]) {
    const result = await unfurl.unfurl(url)
    cache[url] = result
  }
  res.send(cache[url])
})

app.post('/read', async (req, res) => {
  const url = req.body.url
  console.log(url)
  if (!content_cache[url]) {
    const dom = await JSDOM.fromURL(url)
    const readable = new Readability(dom.window.document)
    const result = readable.parse()
    content_cache[url] = result
  }
  res.send(content_cache[url])
})

const port = 8080
app.listen(port, () => {
  console.log(`Listening on ${port}`)
})
